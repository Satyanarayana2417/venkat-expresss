import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Tag, 
  CalendarIcon, 
  Percent, 
  DollarSign,
  Copy,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Activity
} from 'lucide-react';
import { useCoupons } from '@/hooks/useCoupons';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const AdminDiscounts = () => {
  const { coupons, loading, authError, addCoupon, updateCoupon, deleteCoupon } = useCoupons();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState<string | null>(null);
  const [editingCoupon, setEditingCoupon] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    code: '',
    discountType: 'percentage' as 'percentage' | 'fixed',
    discountValue: '',
    expirationDate: undefined as Date | undefined,
    minPurchaseAmount: '',
    maxDiscountAmount: '',
    usageLimit: '',
    isActive: true
  });

  const resetForm = () => {
    setFormData({
      code: '',
      discountType: 'percentage',
      discountValue: '',
      expirationDate: undefined,
      minPurchaseAmount: '',
      maxDiscountAmount: '',
      usageLimit: '',
      isActive: true
    });
    setEditingCoupon(null);
  };

  const handleOpenDialog = (coupon?: any) => {
    if (coupon) {
      setEditingCoupon(coupon);
      setFormData({
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue.toString(),
        expirationDate: new Date(coupon.expirationDate),
        minPurchaseAmount: coupon.minPurchaseAmount?.toString() || '',
        maxDiscountAmount: coupon.maxDiscountAmount?.toString() || '',
        usageLimit: coupon.usageLimit?.toString() || '',
        isActive: coupon.isActive
      });
    } else {
      resetForm();
    }
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.code || !formData.discountValue || !formData.expirationDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const couponData = {
        code: formData.code.toUpperCase(),
        discountType: formData.discountType,
        discountValue: parseFloat(formData.discountValue),
        expirationDate: formData.expirationDate.toISOString(),
        minPurchaseAmount: formData.minPurchaseAmount ? parseFloat(formData.minPurchaseAmount) : undefined,
        maxDiscountAmount: formData.maxDiscountAmount ? parseFloat(formData.maxDiscountAmount) : undefined,
        usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : undefined,
        isActive: formData.isActive
      };

      if (editingCoupon) {
        await updateCoupon(editingCoupon.id, couponData);
        toast.success('Coupon updated successfully');
      } else {
        await addCoupon(couponData as any);
        toast.success('Coupon created successfully');
      }
      
      setDialogOpen(false);
      resetForm();
    } catch (error) {
      toast.error('Failed to save coupon');
    }
  };

  const handleDelete = async () => {
    if (!couponToDelete) return;
    
    try {
      await deleteCoupon(couponToDelete);
      toast.success('Coupon deleted successfully');
    } catch (error) {
      toast.error('Failed to delete coupon');
    } finally {
      setDeleteDialogOpen(false);
      setCouponToDelete(null);
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Code copied to clipboard');
  };

  const toggleCouponStatus = async (coupon: any) => {
    try {
      await updateCoupon(coupon.id, { isActive: !coupon.isActive });
      toast.success(`Coupon ${coupon.isActive ? 'deactivated' : 'activated'}`);
    } catch (error) {
      toast.error('Failed to update coupon status');
    }
  };

  const activeCoupons = coupons.filter(c => c.isActive && new Date(c.expirationDate) > new Date());
  const expiredCoupons = coupons.filter(c => new Date(c.expirationDate) <= new Date());
  const inactiveCoupons = coupons.filter(c => !c.isActive && new Date(c.expirationDate) > new Date());

  // Authentication Error State
  if (authError) {
    return (
      <AdminLayout title="Discounts">
        <div className="flex items-center justify-center h-96">
          <div className="text-center space-y-4">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
            <h3 className="text-lg font-semibold text-gray-900">Authentication Required</h3>
            <p className="text-muted-foreground">Please log in to manage discount coupons</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  // Loading State
  if (loading) {
    return (
      <AdminLayout title="Discounts">
        <div className="flex items-center justify-center h-96">
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-yellow-600 mx-auto" />
            <p className="text-muted-foreground">Loading coupons...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Discounts">
      <div className="space-y-6">
        {/* Header with Real-Time Indicator */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold tracking-tight">Discount & Coupon Management</h2>
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-50 border border-green-200 rounded-full">
                <Activity className="h-3 w-3 text-green-600 animate-pulse" />
                <span className="text-xs font-medium text-green-700">Live</span>
              </div>
            </div>
            <p className="text-muted-foreground mt-1">Create and manage promotional coupon codes (updates automatically)</p>
          </div>
          <Button 
            onClick={() => handleOpenDialog()} 
            className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Coupon
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Coupons</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeCoupons.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inactive</CardTitle>
              <Tag className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inactiveCoupons.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Expired</CardTitle>
              <CalendarIcon className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{expiredCoupons.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Coupons Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Coupons</CardTitle>
            <CardDescription>Manage your promotional discount codes</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="py-12 text-center text-gray-500">Loading coupons...</div>
            ) : coupons.length === 0 ? (
              <div className="py-12 text-center text-gray-500">
                <Tag className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No coupons created yet</p>
                <Button onClick={() => handleOpenDialog()} className="mt-4" variant="outline">
                  Create Your First Coupon
                </Button>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Discount</TableHead>
                      <TableHead>Expiration</TableHead>
                      <TableHead>Usage</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {coupons.map((coupon) => {
                      const isExpired = new Date(coupon.expirationDate) <= new Date();
                      const isLimitReached = coupon.usageLimit && coupon.usedCount >= coupon.usageLimit;
                      
                      return (
                        <TableRow key={coupon.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <code className="relative rounded bg-muted px-[0.5rem] py-[0.2rem] font-mono text-sm font-semibold">
                                {coupon.code}
                              </code>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => copyCode(coupon.code)}
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              {coupon.discountType === 'percentage' ? (
                                <>
                                  <Percent className="h-4 w-4 text-yellow-600" />
                                  <span>{coupon.discountValue}% off</span>
                                </>
                              ) : (
                                <>
                                  <DollarSign className="h-4 w-4 text-yellow-600" />
                                  <span>₹{coupon.discountValue} off</span>
                                </>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className={isExpired ? 'text-red-600 font-medium' : ''}>
                              {format(new Date(coupon.expirationDate), 'MMM dd, yyyy')}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className={isLimitReached ? 'text-red-600 font-medium' : ''}>
                              {coupon.usedCount} {coupon.usageLimit ? `/ ${coupon.usageLimit}` : ''}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {isExpired ? (
                                <Badge variant="destructive">Expired</Badge>
                              ) : isLimitReached ? (
                                <Badge variant="secondary">Limit Reached</Badge>
                              ) : coupon.isActive ? (
                                <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>
                              ) : (
                                <Badge variant="secondary">Inactive</Badge>
                              )}
                              <Switch
                                checked={coupon.isActive}
                                onCheckedChange={() => toggleCouponStatus(coupon)}
                                disabled={isExpired || isLimitReached}
                              />
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleOpenDialog(coupon)}
                                title="Edit"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setCouponToDelete(coupon.id);
                                  setDeleteDialogOpen(true);
                                }}
                                title="Delete"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}</DialogTitle>
            <DialogDescription>
              {editingCoupon ? 'Update the coupon details below' : 'Create a promotional discount code for your customers'}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Coupon Code *</Label>
                  <Input
                    id="code"
                    placeholder="e.g., DIWALI20"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="discountType">Discount Type *</Label>
                  <Select 
                    value={formData.discountType} 
                    onValueChange={(value: 'percentage' | 'fixed') => setFormData({ ...formData, discountType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage Off</SelectItem>
                      <SelectItem value="fixed">Fixed Amount Off</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="discountValue">
                    Discount Value * {formData.discountType === 'percentage' ? '(%)' : '(₹)'}
                  </Label>
                  <Input
                    id="discountValue"
                    type="number"
                    placeholder={formData.discountType === 'percentage' ? '20' : '500'}
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                    required
                    min="0"
                    step={formData.discountType === 'percentage' ? '1' : '10'}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Expiration Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.expirationDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.expirationDate ? format(formData.expirationDate, 'PPP') : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.expirationDate}
                        onSelect={(date) => setFormData({ ...formData, expirationDate: date })}
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Advanced Options (Optional)</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="minPurchase">Minimum Purchase Amount (₹)</Label>
                    <Input
                      id="minPurchase"
                      type="number"
                      placeholder="e.g., 1000"
                      value={formData.minPurchaseAmount}
                      onChange={(e) => setFormData({ ...formData, minPurchaseAmount: e.target.value })}
                      min="0"
                    />
                  </div>

                  {formData.discountType === 'percentage' && (
                    <div className="space-y-2">
                      <Label htmlFor="maxDiscount">Max Discount Amount (₹)</Label>
                      <Input
                        id="maxDiscount"
                        type="number"
                        placeholder="e.g., 500"
                        value={formData.maxDiscountAmount}
                        onChange={(e) => setFormData({ ...formData, maxDiscountAmount: e.target.value })}
                        min="0"
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="usageLimit">Usage Limit</Label>
                    <Input
                      id="usageLimit"
                      type="number"
                      placeholder="e.g., 100"
                      value={formData.usageLimit}
                      onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                      min="1"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                  />
                  <Label htmlFor="isActive">Make coupon active immediately</Label>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => {
                setDialogOpen(false);
                resetForm();
              }}>
                Cancel
              </Button>
              <Button type="submit">
                {editingCoupon ? 'Update Coupon' : 'Create Coupon'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Coupon?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the coupon code.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};
