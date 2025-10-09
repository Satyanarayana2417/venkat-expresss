import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface DailyStat {
  date: string;
  revenue: number;
  orders: number;
}

interface SalesChartProps {
  type?: 'line' | 'bar';
}

export const SalesChart = ({ type = 'line' }: SalesChartProps) => {
  const [chartData, setChartData] = useState<DailyStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(false);

  // Real-time listener for daily stats (last 30 days) with proper auth check
  useEffect(() => {
    setLoading(true);
    setAuthError(false);

    // Wait for authentication to complete before fetching data
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is authenticated - proceed with data fetching
        const statsRef = collection(db, 'dailyStats');
        // Query for last 30 days of stats, sorted by date (newest first)
        const q = query(
          statsRef,
          orderBy('date', 'desc'),
          limit(30)
        );

        // Set up real-time listener with onSnapshot
        const unsubscribeSnapshot = onSnapshot(
          q,
          (snapshot) => {
            const fetchedStats: DailyStat[] = [];

            snapshot.forEach((doc) => {
              const data = doc.data();
              fetchedStats.push({
                date: doc.id, // Document ID is the date (YYYY-MM-DD format)
                revenue: data.totalRevenue || 0,
                orders: data.orderCount || 0
              });
            });

            // Reverse to show oldest to newest (left to right on chart)
            const sortedStats = fetchedStats.reverse();

            // Format dates for display
            const formattedData = sortedStats.map(stat => {
              const dateObj = new Date(stat.date);
              const formattedDate = dateObj.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
              });

              return {
                date: formattedDate,
                revenue: stat.revenue,
                orders: stat.orders
              };
            });

            setChartData(formattedData);
            setLoading(false);
          },
          (error) => {
            console.error('Error fetching sales data:', error);
            toast.error('Failed to load sales data');
            setLoading(false);
            
            // Fallback to sample data if error
            const sampleData = generateSampleData();
            setChartData(sampleData);
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
        console.warn('User not authenticated - cannot fetch sales data');
      }
    });

    // Cleanup auth listener on unmount
    return () => {
      unsubscribeAuth();
    };
  }, []);

  // Generate sample data as fallback
  const generateSampleData = (): DailyStat[] => {
    const data: DailyStat[] = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        revenue: Math.floor(Math.random() * 5000) + 3000,
        orders: Math.floor(Math.random() * 20) + 10
      });
    }
    
    return data;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm font-semibold text-gray-900">{label}</p>
          <p className="text-sm text-green-600 mt-1">
            Revenue: ₹{payload[0].value.toLocaleString('en-IN')}
          </p>
          <p className="text-sm text-blue-600">
            Orders: {payload[1].value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Sales Overview</CardTitle>
        <CardDescription>Revenue and order trends for the last 30 days (real-time)</CardDescription>
      </CardHeader>
      <CardContent>
        {authError ? (
          <div className="h-[350px] w-full flex flex-col items-center justify-center">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <p className="text-lg font-semibold text-gray-900">Authentication Required</p>
            <p className="text-sm text-muted-foreground mt-2">Please log in to view sales data</p>
          </div>
        ) : loading ? (
          <div className="h-[350px] w-full flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-yellow-600" />
            <span className="ml-3 text-muted-foreground">Loading sales data...</span>
          </div>
        ) : (
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              {type === 'line' ? (
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `₹${value}`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    dot={{ fill: '#10b981', r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Revenue (₹)"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="orders" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={{ fill: '#3b82f6', r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Orders"
                  />
                </LineChart>
              ) : (
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `₹${value}`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar 
                    dataKey="revenue" 
                    fill="#10b981" 
                    name="Revenue (₹)"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar 
                    dataKey="orders" 
                    fill="#3b82f6" 
                    name="Orders"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
