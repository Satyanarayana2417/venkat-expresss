import { useState, useMemo, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Download, CalendarIcon, TrendingUp, TrendingDown, Package, DollarSign, ShoppingCart, Loader2, Activity, AlertCircle } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, subDays, startOfDay, endOfDay, isWithinInterval, startOfWeek, startOfMonth, eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { collection, query, where, onSnapshot, orderBy as firestoreOrderBy } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

interface OrderItem {
  productId: string;
  productTitle: string;
  title?: string;
  category: string;
  quantity: number;
  price: number;
  priceINR?: number;
}

interface Order {
  id: string;
  customer?: string;
  customerName?: string;
  email?: string;
  customerEmail?: string;
  total?: number;
  totalAmount?: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  orderStatus?: string;
  date?: string;
  orderDate?: string;
  createdAt?: any;
  items?: OrderItem[];
  orderItems?: OrderItem[];
  itemCount?: number;
  country?: string;
  customerCountry?: string;
}


const COLORS = ['#fbbf24', '#f59e0b', '#d97706', '#b45309', '#92400e'];

type ChartViewMode = 'daily' | 'weekly' | 'monthly';

export const AdminAnalytics = () => {
  // State Management
  const [dateRange, setDateRange] = useState<string>('30');
  const [customDateFrom, setCustomDateFrom] = useState<Date>();
  const [customDateTo, setCustomDateTo] = useState<Date>();
  const [showCustomPicker, setShowCustomPicker] = useState(false);
  const [comparisonMode, setComparisonMode] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [countryFilter, setCountryFilter] = useState<string>('all');
  const [chartViewMode, setChartViewMode] = useState<ChartViewMode>('daily');
  
  // Real-time data state
  const [completedOrders, setCompletedOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [authError, setAuthError] = useState(false);

  // Real-time listener for COMPLETED orders only with proper auth check
  useEffect(() => {
    setLoading(true);
    setAuthError(false);
    
    // Wait for authentication to complete before fetching data
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is authenticated - proceed with data fetching
        const ordersRef = collection(db, 'orders');
        // Query only for delivered/completed orders
        // Using 'orderStatus' to match the Firestore composite index
        const q = query(
          ordersRef, 
          where('orderStatus', '==', 'Delivered'),
          firestoreOrderBy('createdAt', 'desc')
        );
        
        // Set up real-time listener with onSnapshot
        const unsubscribeSnapshot = onSnapshot(
          q,
          (snapshot) => {
            const fetchedOrders: Order[] = [];
            
            snapshot.forEach((doc) => {
              const data = doc.data();
              fetchedOrders.push({
                id: doc.id,
                customer: data.customer || data.customerName || 'Unknown',
                customerName: data.customer || data.customerName || 'Unknown',
                email: data.email || data.customerEmail || 'N/A',
                customerEmail: data.email || data.customerEmail || 'N/A',
                total: data.total || data.totalAmount || 0,
                totalAmount: data.total || data.totalAmount || 0,
                status: 'delivered',
                orderStatus: data.status || data.orderStatus || 'delivered',
                date: data.date || data.orderDate || data.createdAt?.toDate().toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
                orderDate: data.date || data.orderDate,
                items: data.items || data.orderItems || [],
                orderItems: data.items || data.orderItems || [],
                itemCount: data.items?.length || data.orderItems?.length || data.itemCount || 0,
                createdAt: data.createdAt,
                country: data.country || data.customerCountry || 'India',
                customerCountry: data.country || data.customerCountry || 'India'
              });
            });
            
            setCompletedOrders(fetchedOrders);
            setLoading(false);
            setIsConnected(true);
            
            // Toast notification when new completed order arrives
            if (!loading && isConnected && snapshot.docChanges().some(change => change.type === 'added')) {
              const newOrders = snapshot.docChanges().filter(change => change.type === 'added');
              if (newOrders.length > 0) {
                toast.success(`${newOrders.length} new completed order${newOrders.length > 1 ? 's' : ''}!`, {
                  description: 'Analytics updated automatically',
                  icon: <TrendingUp className="h-4 w-4" />
                });
              }
            }
          },
          (error) => {
            console.error('Error fetching completed orders:', error);
            toast.error('Failed to connect to analytics data');
            setLoading(false);
            setIsConnected(false);
          }
        );
        
        // Cleanup snapshot listener when auth changes or component unmounts
        return () => {
          unsubscribeSnapshot();
        };
      } else {
        // No user authenticated
        setAuthError(true);
        setLoading(false);
        setIsConnected(false);
        console.warn('User not authenticated - cannot fetch analytics data');
      }
    });
    
    // Cleanup auth listener on unmount
    return () => {
      unsubscribeAuth();
    };
  }, []);

  // Filter orders by date range and additional filters
  const filteredOrders = useMemo(() => {
    const now = new Date();
    let startDate: Date;
    let endDate: Date = endOfDay(now);

    if (dateRange === 'custom' && customDateFrom && customDateTo) {
      startDate = startOfDay(customDateFrom);
      endDate = endOfDay(customDateTo);
    } else {
      const days = parseInt(dateRange);
      startDate = startOfDay(subDays(now, days - 1));
    }

    return completedOrders.filter(order => {
      const orderDate = new Date(order.date || '');
      const dateMatch = isWithinInterval(orderDate, { start: startDate, end: endDate });
      
      // Apply category filter
      const items = order.items || order.orderItems || [];
      const categoryMatch = categoryFilter === 'all' || 
        items.some(item => item.category === categoryFilter);
      
      // Apply country filter
      const country = order.country || order.customerCountry || 'India';
      const countryMatch = countryFilter === 'all' || country === countryFilter;
      
      return dateMatch && categoryMatch && countryMatch;
    });
  }, [completedOrders, dateRange, customDateFrom, customDateTo, categoryFilter, countryFilter]);

  // Calculate comparison period data (for comparison mode)
  const comparisonData = useMemo(() => {
    if (!comparisonMode) return null;
    
    const now = new Date();
    const days = parseInt(dateRange);
    
    // Current period
    const currentStart = startOfDay(subDays(now, days - 1));
    const currentEnd = endOfDay(now);
    
    // Previous period (same duration)
    const previousStart = startOfDay(subDays(currentStart, days));
    const previousEnd = endOfDay(subDays(now, days));
    
    const currentOrders = completedOrders.filter(order => {
      const orderDate = new Date(order.date || '');
      return isWithinInterval(orderDate, { start: currentStart, end: currentEnd });
    });
    
    const previousOrders = completedOrders.filter(order => {
      const orderDate = new Date(order.date || '');
      return isWithinInterval(orderDate, { start: previousStart, end: previousEnd });
    });
    
    const currentRevenue = currentOrders.reduce((sum, order) => sum + (order.total || order.totalAmount || 0), 0);
    const previousRevenue = previousOrders.reduce((sum, order) => sum + (order.total || order.totalAmount || 0), 0);
    
    const revenueChange = previousRevenue > 0 
      ? ((currentRevenue - previousRevenue) / previousRevenue) * 100 
      : 0;
    
    const ordersChange = previousOrders.length > 0
      ? ((currentOrders.length - previousOrders.length) / previousOrders.length) * 100
      : 0;
    
    return {
      currentRevenue,
      previousRevenue,
      revenueChange,
      currentOrderCount: currentOrders.length,
      previousOrderCount: previousOrders.length,
      ordersChange
    };
  }, [completedOrders, comparisonMode, dateRange]);

  // Calculate key metrics (only from completed/delivered orders)
  const metrics = useMemo(() => {
    // Total Revenue from all completed orders
    const totalRevenue = filteredOrders.reduce((sum, order) => 
      sum + (order.total || order.totalAmount || 0), 0
    );
    
    // Total Orders Completed
    const totalOrders = filteredOrders.length;
    
    // Average Order Value (AOV)
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    
    // Total Products Sold (sum of all item quantities)
    const totalProductsSold = filteredOrders.reduce((sum, order) => {
      const items = order.items || order.orderItems || [];
      const orderQuantity = items.reduce((itemSum, item) => itemSum + (item.quantity || 0), 0);
      return sum + orderQuantity;
    }, 0);

    return { totalRevenue, totalOrders, avgOrderValue, totalProductsSold };
  }, [filteredOrders]);

  // Get unique categories and countries for filters
  const availableCategories = useMemo(() => {
    const categories = new Set<string>();
    completedOrders.forEach(order => {
      const items = order.items || order.orderItems || [];
      items.forEach(item => {
        if (item.category) categories.add(item.category);
      });
    });
    return Array.from(categories).sort();
  }, [completedOrders]);

  const availableCountries = useMemo(() => {
    const countries = new Set<string>();
    completedOrders.forEach(order => {
      const country = order.country || order.customerCountry || 'India';
      countries.add(country);
    });
    return Array.from(countries).sort();
  }, [completedOrders]);

  // Revenue over time data with different view modes
  const revenueOverTime = useMemo(() => {
    const dateMap = new Map<string, { revenue: number; orders: number }>();
    
    filteredOrders.forEach(order => {
      const orderDate = new Date(order.date || '');
      let dateKey: string;
      
      // Group by view mode
      if (chartViewMode === 'daily') {
        dateKey = format(orderDate, 'yyyy-MM-dd');
      } else if (chartViewMode === 'weekly') {
        dateKey = format(startOfWeek(orderDate), 'yyyy-MM-dd');
      } else {
        dateKey = format(startOfMonth(orderDate), 'yyyy-MM-dd');
      }
      
      const current = dateMap.get(dateKey) || { revenue: 0, orders: 0 };
      dateMap.set(dateKey, {
        revenue: current.revenue + (order.total || order.totalAmount || 0),
        orders: current.orders + 1
      });
    });

    const sortedData = Array.from(dateMap.entries())
      .map(([date, data]) => ({
        date: chartViewMode === 'daily' 
          ? format(new Date(date), 'MMM dd')
          : chartViewMode === 'weekly'
          ? format(new Date(date), 'MMM dd')
          : format(new Date(date), 'MMM yyyy'),
        fullDate: date,
        revenue: data.revenue,
        orders: data.orders
      }))
      .sort((a, b) => new Date(a.fullDate).getTime() - new Date(b.fullDate).getTime());
    
    // Limit display based on view mode
    const limit = chartViewMode === 'daily' ? 30 : chartViewMode === 'weekly' ? 12 : 12;
    return sortedData.slice(-limit);
  }, [filteredOrders, chartViewMode]);

  // Top selling products (by revenue)
  const topProducts = useMemo(() => {
    const productMap = new Map<string, { title: string; quantity: number; revenue: number }>();
    
    filteredOrders.forEach(order => {
      const items = order.items || order.orderItems || [];
      items.forEach(item => {
        const itemTitle = item.productTitle || item.title || 'Unknown Product';
        const itemPrice = item.price || item.priceINR || 0;
        const current = productMap.get(item.productId) || { title: itemTitle, quantity: 0, revenue: 0 };
        productMap.set(item.productId, {
          title: itemTitle,
          quantity: current.quantity + (item.quantity || 0),
          revenue: current.revenue + (itemPrice * (item.quantity || 0))
        });
      });
    });

    return Array.from(productMap.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10); // Top 10 products for horizontal bar chart
  }, [filteredOrders]);

  // Sales by category
  const categoryData = useMemo(() => {
    const categoryMap = new Map<string, number>();
    
    filteredOrders.forEach(order => {
      const items = order.items || order.orderItems || [];
      items.forEach(item => {
        const itemPrice = item.price || item.priceINR || 0;
        const current = categoryMap.get(item.category) || 0;
        categoryMap.set(item.category, current + (itemPrice * (item.quantity || 0)));
      });
    });

    return Array.from(categoryMap.entries()).map(([name, value]) => ({ name, value }));
  }, [filteredOrders]);

  // Percentage change indicator component
  const PercentageChange = ({ value }: { value: number }) => {
    const isPositive = value >= 0;
    return (
      <div className={cn(
        "flex items-center gap-1 text-xs font-medium",
        isPositive ? "text-green-600" : "text-red-600"
      )}>
        {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
        <span>{isPositive ? '+' : ''}{value.toFixed(1)}%</span>
      </div>
    );
  };

  // Export to CSV
  const handleExport = () => {
    try {
      const headers = ['Order ID', 'Date', 'Customer', 'Email', 'Status', 'Items', 'Total (₹)'];
      const rows = filteredOrders.map(order => [
        order.id,
        order.date || '',
        order.customer || order.customerName || 'Unknown',
        order.email || order.customerEmail || 'N/A',
        'delivered',
        (order.items || order.orderItems || []).length,
        order.total || order.totalAmount || 0
      ]);

      const csv = [
        headers.join(','),
        ...rows.map(row => row.join(','))
      ].join('\n');

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics-report-${format(new Date(), 'yyyy-MM-dd')}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);

      toast.success('Report exported successfully');
    } catch (error) {
      toast.error('Failed to export report');
    }
  };

  // Loading and auth error states
  if (authError) {
    return (
      <AdminLayout title="Analytics">
        <div className="flex items-center justify-center h-96">
          <div className="text-center space-y-4">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
            <h3 className="text-lg font-semibold text-gray-900">Authentication Required</h3>
            <p className="text-muted-foreground">Please log in to view analytics data</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (loading) {
    return (
      <AdminLayout title="Analytics">
        <div className="flex items-center justify-center h-96">
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-yellow-600 mx-auto" />
            <p className="text-muted-foreground">Loading analytics data...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Analytics">
      <div className="space-y-6">
        {/* Header with Real-Time Indicator and Filters */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold tracking-tight">Advanced Analytics</h2>
                {isConnected && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-green-50 border border-green-200 rounded-full">
                    <Activity className="h-3 w-3 text-green-600 animate-pulse" />
                    <span className="text-xs font-medium text-green-700">Live</span>
                  </div>
                )}
              </div>
              <p className="text-muted-foreground">Real-time business intelligence from completed orders</p>
            </div>
            
            <div className="flex gap-2 items-center flex-wrap">
              <Select value={dateRange} onValueChange={(value) => {
                setDateRange(value);
                if (value === 'custom') {
                  setShowCustomPicker(true);
                } else {
                  setShowCustomPicker(false);
                }
              }}>
                <SelectTrigger className="w-[180px]">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Last 7 Days</SelectItem>
                  <SelectItem value="30">Last 30 Days</SelectItem>
                  <SelectItem value="60">Last 60 Days</SelectItem>
                  <SelectItem value="90">Last 90 Days</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>

              {showCustomPicker && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {customDateFrom && customDateTo ? (
                        <>
                          {format(customDateFrom, 'MMM dd')} - {format(customDateTo, 'MMM dd')}
                        </>
                      ) : (
                        <span>Pick a date range</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <div className="grid grid-cols-2 gap-2 p-3">
                      <div>
                        <Label className="text-xs">From</Label>
                        <Calendar
                          mode="single"
                          selected={customDateFrom}
                          onSelect={setCustomDateFrom}
                          disabled={(date) => date > new Date()}
                        />
                      </div>
                      <div>
                        <Label className="text-xs">To</Label>
                        <Calendar
                          mode="single"
                          selected={customDateTo}
                          onSelect={setCustomDateTo}
                          disabled={(date) => date > new Date() || (customDateFrom ? date < customDateFrom : false)}
                        />
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              )}

              <Button onClick={handleExport} variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
            </div>
          </div>

          {/* Advanced Filters and Comparison Mode */}
          <div className="flex flex-wrap gap-3 items-center bg-gray-50 p-4 rounded-lg border">
            <div className="flex items-center gap-2">
              <Label htmlFor="comparison-mode" className="text-sm font-medium">Compare Periods</Label>
              <Switch
                id="comparison-mode"
                checked={comparisonMode}
                onCheckedChange={setComparisonMode}
              />
            </div>

            <div className="h-4 w-px bg-gray-300" />

            <div className="flex items-center gap-2">
              <Label className="text-sm text-muted-foreground">Category:</Label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[140px] h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {availableCategories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Label className="text-sm text-muted-foreground">Country:</Label>
              <Select value={countryFilter} onValueChange={setCountryFilter}>
                <SelectTrigger className="w-[140px] h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Countries</SelectItem>
                  {availableCountries.map(country => (
                    <SelectItem key={country} value={country}>{country}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>


        {/* Key Metrics with Comparison */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Total Revenue Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{metrics.totalRevenue.toLocaleString('en-IN')}</div>
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs text-muted-foreground">
                  From {metrics.totalOrders} completed orders
                </p>
                {comparisonMode && comparisonData && (
                  <PercentageChange value={comparisonData.revenueChange} />
                )}
              </div>
            </CardContent>
          </Card>

          {/* Total Orders Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.totalOrders}</div>
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs text-muted-foreground">Successfully delivered</p>
                {comparisonMode && comparisonData && (
                  <PercentageChange value={comparisonData.ordersChange} />
                )}
              </div>
            </CardContent>
          </Card>

          {/* Average Order Value (AOV) - NEW */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{Math.round(metrics.avgOrderValue).toLocaleString('en-IN')}</div>
              <p className="text-xs text-muted-foreground mt-1">Per completed transaction</p>
            </CardContent>
          </Card>

          {/* Total Products Sold Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Products Sold</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.totalProductsSold.toLocaleString('en-IN')}</div>
              <p className="text-xs text-muted-foreground mt-1">Total units from completed orders</p>
            </CardContent>
          </Card>
        </div>


        {/* Revenue and Orders Over Time with View Mode Selector */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Revenue and Orders Over Time</CardTitle>
                <CardDescription>Track your sales performance and order volume in real-time</CardDescription>
              </div>
              <Select value={chartViewMode} onValueChange={(value: ChartViewMode) => setChartViewMode(value)}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {revenueOverTime.length === 0 ? (
              <div className="h-[350px] flex items-center justify-center text-muted-foreground">
                No data available for the selected period
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={revenueOverTime}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#fbbf24" 
                    strokeWidth={2}
                    name="Revenue (₹)"
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="orders" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    name="Orders"
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Top-Selling Products as Horizontal Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Top-Selling Products</CardTitle>
              <CardDescription>Best performing items by total revenue from completed orders</CardDescription>
            </CardHeader>
            <CardContent>
              {topProducts.length === 0 ? (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  No product data available
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={topProducts} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis 
                      dataKey="title" 
                      type="category" 
                      width={120}
                      tick={{ fontSize: 11 }}
                    />
                    <Tooltip 
                      formatter={(value: number) => `₹${value.toLocaleString('en-IN')}`}
                      labelFormatter={(label) => `Product: ${label}`}
                    />
                    <Bar 
                      dataKey="revenue" 
                      fill="#fbbf24" 
                      name="Revenue (₹)"
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
              <div className="mt-4 space-y-2 max-h-[200px] overflow-y-auto">
                {topProducts.slice(0, 5).map((product, index) => (
                  <div key={index} className="flex items-center justify-between text-sm p-2 hover:bg-gray-50 rounded">
                    <div className="space-y-1 flex-1">
                      <p className="font-medium leading-none truncate">{product.title}</p>
                      <p className="text-xs text-muted-foreground">{product.quantity} units sold</p>
                    </div>
                    <div className="text-sm font-semibold ml-2">₹{product.revenue.toLocaleString('en-IN')}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Sales by Category */}
          <Card>
            <CardHeader>
              <CardTitle>Sales by Category</CardTitle>
              <CardDescription>Revenue distribution across product categories</CardDescription>
            </CardHeader>
            <CardContent>
              {categoryData.length === 0 ? (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  No category data available
                </div>
              ) : (
                <>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => `₹${value.toLocaleString('en-IN')}`} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-4 space-y-2">
                    {categoryData.map((cat, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                          <span>{cat.name}</span>
                        </div>
                        <span className="font-semibold">₹{cat.value.toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};
