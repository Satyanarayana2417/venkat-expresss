import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { 
  Store, 
  DollarSign, 
  Truck, 
  AlertCircle, 
  Bell, 
  Loader2,
  Activity,
  Save
} from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

export const AdminSettings = () => {
  const { settings, loading, authError, updateSetting } = useSettings();
  const [savingField, setSavingField] = useState<string | null>(null);

  // Authentication error state
  if (authError) {
    return (
      <AdminLayout title="Settings">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
            <h3 className="text-lg font-semibold">Authentication Required</h3>
            <p className="text-muted-foreground">Please log in to manage store settings</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  // Loading state
  if (loading) {
    return (
      <AdminLayout title="Settings">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-yellow-600 mx-auto" />
            <p className="text-muted-foreground">Loading settings...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  // Handle input change with auto-save
  const handleInputChange = async (
    field: keyof typeof settings,
    value: any,
    displayName: string
  ) => {
    setSavingField(field);
    try {
      await updateSetting(field, value);
      toast.success(`${displayName} saved!`, {
        icon: <Save className="h-4 w-4" />,
        duration: 2000
      });
    } catch (error) {
      toast.error(`Failed to save ${displayName}`);
    } finally {
      setSavingField(null);
    }
  };

  // Handle number input change with validation
  const handleNumberChange = async (
    field: keyof typeof settings,
    value: string,
    displayName: string
  ) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue < 0) {
      toast.error('Please enter a valid positive number');
      return;
    }
    await handleInputChange(field, numValue, displayName);
  };

  return (
    <AdminLayout title="Settings">
      <div className="space-y-6">
        {/* Header with Real-time Indicator */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Store Settings</h1>
            <p className="text-muted-foreground mt-2">
              Manage your store configuration. Changes save automatically and update in real-time.
            </p>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-50 border border-green-200 rounded-full">
            <Activity className="h-3 w-3 text-green-600 animate-pulse" />
            <span className="text-xs font-medium text-green-700">Live</span>
          </div>
        </div>

        {/* Store Details Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Store className="h-5 w-5 text-yellow-600" />
              <CardTitle>Store Details</CardTitle>
            </div>
            <CardDescription>Basic information about your store</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Store Name */}
            <div className="space-y-2">
              <Label htmlFor="storeName" className="flex items-center justify-between">
                <span>Store Name</span>
                {savingField === 'storeName' && (
                  <span className="text-xs text-green-600 flex items-center gap-1">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Saving...
                  </span>
                )}
              </Label>
              <Input
                id="storeName"
                value={settings.storeName}
                onChange={(e) => handleInputChange('storeName', e.target.value, 'Store Name')}
                placeholder="Enter store name"
                className="max-w-md"
              />
            </div>

            {/* Store Description */}
            <div className="space-y-2">
              <Label htmlFor="storeDescription" className="flex items-center justify-between">
                <span>Store Description</span>
                {savingField === 'storeDescription' && (
                  <span className="text-xs text-green-600 flex items-center gap-1">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Saving...
                  </span>
                )}
              </Label>
              <Textarea
                id="storeDescription"
                value={settings.storeDescription}
                onChange={(e) => handleInputChange('storeDescription', e.target.value, 'Store Description')}
                placeholder="Enter store description"
                className="max-w-2xl"
                rows={3}
              />
            </div>

            <Separator />

            {/* Contact Email */}
            <div className="space-y-2">
              <Label htmlFor="contactEmail" className="flex items-center justify-between">
                <span>Contact Email</span>
                {savingField === 'contactEmail' && (
                  <span className="text-xs text-green-600 flex items-center gap-1">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Saving...
                  </span>
                )}
              </Label>
              <Input
                id="contactEmail"
                type="email"
                value={settings.contactEmail}
                onChange={(e) => handleInputChange('contactEmail', e.target.value, 'Contact Email')}
                placeholder="contact@example.com"
                className="max-w-md"
              />
            </div>

            {/* Contact Phone */}
            <div className="space-y-2">
              <Label htmlFor="contactPhone" className="flex items-center justify-between">
                <span>Contact Phone</span>
                {savingField === 'contactPhone' && (
                  <span className="text-xs text-green-600 flex items-center gap-1">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Saving...
                  </span>
                )}
              </Label>
              <Input
                id="contactPhone"
                type="tel"
                value={settings.contactPhone}
                onChange={(e) => handleInputChange('contactPhone', e.target.value, 'Contact Phone')}
                placeholder="+91 1234567890"
                className="max-w-md"
              />
            </div>

            {/* Store Address */}
            <div className="space-y-2">
              <Label htmlFor="storeAddress" className="flex items-center justify-between">
                <span>Store Address</span>
                {savingField === 'storeAddress' && (
                  <span className="text-xs text-green-600 flex items-center gap-1">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Saving...
                  </span>
                )}
              </Label>
              <Textarea
                id="storeAddress"
                value={settings.storeAddress}
                onChange={(e) => handleInputChange('storeAddress', e.target.value, 'Store Address')}
                placeholder="Enter store address"
                className="max-w-2xl"
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* Tax & Pricing Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <CardTitle>Tax & Pricing</CardTitle>
            </div>
            <CardDescription>Configure tax rates and currency settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Tax Rate */}
            <div className="space-y-2">
              <Label htmlFor="taxRate" className="flex items-center justify-between">
                <span>Tax Rate (%)</span>
                {savingField === 'taxRate' && (
                  <span className="text-xs text-green-600 flex items-center gap-1">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Saving...
                  </span>
                )}
              </Label>
              <div className="flex items-center gap-2 max-w-md">
                <Input
                  id="taxRate"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={settings.taxRate}
                  onChange={(e) => handleNumberChange('taxRate', e.target.value, 'Tax Rate')}
                  placeholder="18"
                />
                <span className="text-sm text-muted-foreground">%</span>
              </div>
              <p className="text-xs text-muted-foreground">
                GST or tax percentage applied to orders
              </p>
            </div>

            {/* Currency */}
            <div className="space-y-2">
              <Label htmlFor="currency" className="flex items-center justify-between">
                <span>Currency</span>
                {savingField === 'currency' && (
                  <span className="text-xs text-green-600 flex items-center gap-1">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Saving...
                  </span>
                )}
              </Label>
              <Input
                id="currency"
                value={settings.currency}
                onChange={(e) => handleInputChange('currency', e.target.value, 'Currency')}
                placeholder="INR"
                className="max-w-md"
                maxLength={3}
              />
              <p className="text-xs text-muted-foreground">
                Currency code (e.g., INR, USD, EUR)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Shipping Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-blue-600" />
              <CardTitle>Shipping Configuration</CardTitle>
            </div>
            <CardDescription>Manage shipping costs and free shipping threshold</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Shipping Cost */}
            <div className="space-y-2">
              <Label htmlFor="shippingCost" className="flex items-center justify-between">
                <span>Standard Shipping Cost (₹)</span>
                {savingField === 'shippingCost' && (
                  <span className="text-xs text-green-600 flex items-center gap-1">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Saving...
                  </span>
                )}
              </Label>
              <div className="flex items-center gap-2 max-w-md">
                <span className="text-sm text-muted-foreground">₹</span>
                <Input
                  id="shippingCost"
                  type="number"
                  min="0"
                  step="1"
                  value={settings.shippingCost}
                  onChange={(e) => handleNumberChange('shippingCost', e.target.value, 'Shipping Cost')}
                  placeholder="50"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Default shipping charge for orders
              </p>
            </div>

            {/* Free Shipping Threshold */}
            <div className="space-y-2">
              <Label htmlFor="freeShippingThreshold" className="flex items-center justify-between">
                <span>Free Shipping Threshold (₹)</span>
                {savingField === 'freeShippingThreshold' && (
                  <span className="text-xs text-green-600 flex items-center gap-1">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Saving...
                  </span>
                )}
              </Label>
              <div className="flex items-center gap-2 max-w-md">
                <span className="text-sm text-muted-foreground">₹</span>
                <Input
                  id="freeShippingThreshold"
                  type="number"
                  min="0"
                  step="1"
                  value={settings.freeShippingThreshold}
                  onChange={(e) => handleNumberChange('freeShippingThreshold', e.target.value, 'Free Shipping Threshold')}
                  placeholder="500"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Orders above this amount get free shipping
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Site Status Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              <CardTitle>Site Status</CardTitle>
            </div>
            <CardDescription>Control site availability and maintenance mode</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Maintenance Mode */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-0.5">
                <Label htmlFor="maintenanceMode" className="text-base font-medium">
                  Maintenance Mode
                </Label>
                <p className="text-sm text-muted-foreground">
                  Temporarily disable the store for maintenance
                </p>
              </div>
              <Switch
                id="maintenanceMode"
                checked={settings.maintenanceMode}
                onCheckedChange={(checked) => handleInputChange('maintenanceMode', checked, 'Maintenance Mode')}
              />
            </div>

            {/* Maintenance Message */}
            <div className="space-y-2">
              <Label htmlFor="maintenanceMessage" className="flex items-center justify-between">
                <span>Maintenance Message</span>
                {savingField === 'maintenanceMessage' && (
                  <span className="text-xs text-green-600 flex items-center gap-1">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Saving...
                  </span>
                )}
              </Label>
              <Textarea
                id="maintenanceMessage"
                value={settings.maintenanceMessage}
                onChange={(e) => handleInputChange('maintenanceMessage', e.target.value, 'Maintenance Message')}
                placeholder="Enter maintenance message"
                className="max-w-2xl"
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                This message will be displayed when maintenance mode is active
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Notifications Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-purple-600" />
              <CardTitle>Notifications & Alerts</CardTitle>
            </div>
            <CardDescription>Configure notification preferences and thresholds</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Order Notifications */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-0.5">
                <Label htmlFor="orderNotificationsEnabled" className="text-base font-medium">
                  Order Notifications
                </Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications for new orders
                </p>
              </div>
              <Switch
                id="orderNotificationsEnabled"
                checked={settings.orderNotificationsEnabled}
                onCheckedChange={(checked) => handleInputChange('orderNotificationsEnabled', checked, 'Order Notifications')}
              />
            </div>

            {/* Low Stock Threshold */}
            <div className="space-y-2">
              <Label htmlFor="lowStockThreshold" className="flex items-center justify-between">
                <span>Low Stock Alert Threshold</span>
                {savingField === 'lowStockThreshold' && (
                  <span className="text-xs text-green-600 flex items-center gap-1">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Saving...
                  </span>
                )}
              </Label>
              <div className="flex items-center gap-2 max-w-md">
                <Input
                  id="lowStockThreshold"
                  type="number"
                  min="0"
                  step="1"
                  value={settings.lowStockThreshold}
                  onChange={(e) => handleNumberChange('lowStockThreshold', e.target.value, 'Low Stock Threshold')}
                  placeholder="10"
                />
                <span className="text-sm text-muted-foreground">units</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Get alerts when product stock falls below this number
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Last Updated Info */}
        {settings.lastUpdated && (
          <div className="text-sm text-muted-foreground text-center pb-4">
            Last updated: {new Date(settings.lastUpdated).toLocaleString()}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
