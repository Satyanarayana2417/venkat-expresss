import { useState, useEffect } from 'react';
import { useUserRole } from '@/hooks/useUserRole';
import { useProducts } from '@/hooks/useProducts';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Loader2, Search, Package, ShoppingCart, Clock, Link as LinkIcon, Upload, X, Shield, Lock, Video as VideoIcon, FileVideo } from 'lucide-react';
import { uploadToCloudinary, validateMediaUrl, normalizeVideoUrl } from '@/lib/cloudinary';
import { Product } from '@/components/ProductCard';

const Admin = () => {
  const { user, signIn, signOut } = useAuth();
  const { isAdmin, role, loading: roleLoading } = useUserRole();
  const { products, loading: productsLoading, addProduct, updateProduct, deleteProduct } = useProducts();
  
  // Admin sign-in state
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [signingIn, setSigningIn] = useState(false);
  const [hasAttemptedAuth, setHasAttemptedAuth] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [imageInputMethod, setImageInputMethod] = useState<'upload' | 'url'>('upload');
  const [imageUrl, setImageUrl] = useState('');
  const [videoInputMethod, setVideoInputMethod] = useState<'upload' | 'url'>('upload');
  const [videoUrl, setVideoUrl] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    category: 'Food' as 'Food' | 'Decorative',
    serviceType: 'purchaseable' as 'purchaseable' | 'parcel-only' | 'both',
    priceINR: '' as number | '',
    weightKg: '' as number | '',
    dimensionsCm: {
      length: '' as number | '',
    },
    stock: '' as number | '',
    inStock: true,
    ingredients: '',
    images: [] as string[],
    thumbnails: [] as string[],
    videos: [] as string[],
    tags: [] as string[],
  });

  const handleAdminSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setSigningIn(true);

    try {
      await signIn(adminEmail, adminPassword);
      setHasAttemptedAuth(true);
      // Don't set signingIn to false here - wait for role to load
    } catch (error: any) {
      console.error('Sign in error:', error);
      toast.error('Invalid credentials. Please try again.');
      setSigningIn(false);
      setHasAttemptedAuth(false);
    }
  };

  // Check admin status after authentication
  useEffect(() => {
    // If user is not logged in, reset states
    if (!user) {
      setSigningIn(false);
      setHasAttemptedAuth(false);
      return;
    }

    // Wait for role to be loaded
    if (roleLoading) {
      return;
    }

    // Role has been loaded, now check admin status
    if (hasAttemptedAuth) {
      if (!isAdmin) {
        console.log('User role:', role, '- Admin access required');
        toast.error('Access denied. Admin privileges required.');
        // Sign out the non-admin user
        signOut().then(() => {
          setHasAttemptedAuth(false);
          setSigningIn(false);
        });
      } else {
        console.log('Admin access granted - Role:', role);
        toast.success('Admin access granted ✓');
        setSigningIn(false);
      }
    }
  }, [user, roleLoading, isAdmin, role, hasAttemptedAuth, signOut]);

  // Dashboard stats
  const totalProducts = products.length;
  const lowStockProducts = products.filter(p => p.stock < 10).length;
  const outOfStockProducts = products.filter(p => p.stock === 0).length;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setUploadProgress(`Uploading ${files.length} image(s)...`);
    try {
      const uploadedUrls: string[] = [];
      
      for (let i = 0; i < files.length; i++) {
        setUploadProgress(`Uploading image ${i + 1} of ${files.length}...`);
        const url = await uploadToCloudinary(files[i], 'image');
        uploadedUrls.push(url);
      }
      
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls],
        thumbnails: [...prev.thumbnails, ...uploadedUrls],
      }));
      
      toast.success(`${uploadedUrls.length} image(s) uploaded successfully`);
    } catch (error: any) {
      toast.error('Failed to upload images');
    } finally {
      setUploading(false);
      setUploadProgress('');
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Validate file size (max 100MB per video)
    const maxSize = 100 * 1024 * 1024; // 100MB
    for (let i = 0; i < files.length; i++) {
      if (files[i].size > maxSize) {
        toast.error(`Video "${files[i].name}" exceeds 100MB limit`);
        return;
      }
    }

    setUploading(true);
    setUploadProgress(`Uploading ${files.length} video(s)...`);
    try {
      const uploadedUrls: string[] = [];
      
      for (let i = 0; i < files.length; i++) {
        setUploadProgress(`Uploading video ${i + 1} of ${files.length}... (this may take a while)`);
        const url = await uploadToCloudinary(files[i], 'video');
        uploadedUrls.push(url);
      }
      
      setFormData(prev => ({
        ...prev,
        videos: [...(prev.videos || []), ...uploadedUrls],
      }));
      
      toast.success(`${uploadedUrls.length} video(s) uploaded successfully`);
    } catch (error: any) {
      toast.error('Failed to upload videos');
    } finally {
      setUploading(false);
      setUploadProgress('');
    }
  };

  const handleAddImageUrl = () => {
    if (!imageUrl.trim()) {
      toast.error('Please enter a valid image URL');
      return;
    }

    if (!validateMediaUrl(imageUrl, 'image')) {
      toast.error('Please enter a valid image URL (jpg, jpeg, png, gif, webp, bmp, tiff, heic, heif)');
      return;
    }

    setFormData(prev => ({
      ...prev,
      images: [...prev.images, imageUrl],
      thumbnails: [...prev.thumbnails, imageUrl],
    }));
    
    setImageUrl('');
    toast.success('Image URL added successfully');
  };

  const handleAddVideoUrl = () => {
    if (!videoUrl.trim()) {
      toast.error('Please enter a valid video URL');
      return;
    }

    if (!validateMediaUrl(videoUrl, 'video')) {
      toast.error('Please enter a valid video URL (YouTube, Vimeo, or direct video link)');
      return;
    }

    const normalizedUrl = normalizeVideoUrl(videoUrl);
    setFormData(prev => ({
      ...prev,
      videos: [...(prev.videos || []), normalizedUrl],
    }));
    
    setVideoUrl('');
    toast.success('Video URL added successfully');
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
      thumbnails: prev.thumbnails.filter((_, i) => i !== index),
    }));
  };

  const removeVideo = (index: number) => {
    setFormData(prev => ({
      ...prev,
      videos: (prev.videos || []).filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.images.length === 0) {
      toast.error('Please add at least one product image');
      return;
    }

    // Validate required fields for Food category
    if (formData.category === 'Food' && !formData.ingredients?.trim()) {
      toast.error('Ingredients are required for food products');
      return;
    }

    try {
      const productData = {
        ...formData,
        priceINR: Number(formData.priceINR),
        stock: Number(formData.stock),
        weightKg: formData.weightKg ? Number(formData.weightKg) : undefined,
        dimensionsCm: formData.dimensionsCm.length ? { length: Number(formData.dimensionsCm.length) } : undefined,
        createdBy: user?.uid,
      };

      if (editingProduct) {
        await updateProduct(editingProduct.id, productData);
        toast.success('Product updated successfully');
      } else {
        await addProduct(productData);
        toast.success('Product added successfully');
      }
      
      resetForm();
    } catch (error: any) {
      toast.error(error.message || 'Operation failed');
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      slug: product.slug,
      description: product.description,
      category: product.category,
      serviceType: product.serviceType || 'purchaseable',
      priceINR: product.priceINR,
      weightKg: product.weightKg || '',
      dimensionsCm: { length: product.dimensionsCm?.length || '' },
      stock: product.stock,
      inStock: product.inStock ?? true,
      ingredients: product.ingredients || '',
      images: product.images,
      thumbnails: product.thumbnails,
      videos: product.videos || [],
      tags: product.tags || [],
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) return;
    
    try {
      await deleteProduct(id);
      toast.success('Product deleted successfully');
    } catch (error: any) {
      toast.error('Failed to delete product');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      description: '',
      category: 'Food',
      serviceType: 'purchaseable',
      priceINR: '',
      weightKg: '',
      dimensionsCm: { length: '' },
      stock: '',
      inStock: true,
      ingredients: '',
      images: [],
      thumbnails: [],
      videos: [],
      tags: [],
    });
    setEditingProduct(null);
    setImageUrl('');
    setVideoUrl('');
  };

  const filteredProducts = products.filter(p =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Show loading state while checking authentication
  if (signingIn || (user && roleLoading)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-muted/30">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
              <div>
                <p className="font-semibold text-lg">
                  {signingIn ? 'Verifying Credentials' : 'Loading Admin Panel'}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {signingIn ? 'Checking admin privileges...' : 'Please wait...'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show admin sign-in form if user is not authenticated or not an admin
  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
        <Card className="w-full max-w-md shadow-premium-lg">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center ring-2 ring-primary/20">
                <Shield className="h-8 w-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">Admin Access Required</CardTitle>
            <CardDescription>
              Sign in with your admin credentials to access the admin panel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAdminSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-email">Admin Email</Label>
                <Input
                  id="admin-email"
                  type="email"
                  placeholder="admin@venkatexpress.com"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  required
                  disabled={signingIn}
                  autoComplete="email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-password">Password</Label>
                <Input
                  id="admin-password"
                  type="password"
                  placeholder="Enter your password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  required
                  disabled={signingIn}
                  autoComplete="current-password"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full gradient-gold" 
                disabled={signingIn}
              >
                {signingIn ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4 mr-2" />
                    Sign In as Admin
                  </>
                )}
              </Button>
            </form>
            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground text-center">
                ⚠️ This area is restricted to admin users only. Regular customer accounts will be denied access.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 lg:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-heading text-3xl md:text-4xl font-bold mb-2">Admin Panel</h1>
        <p className="text-muted-foreground">Manage products, inventory, and store settings</p>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="add-product">Add Product</TabsTrigger>
          <TabsTrigger value="manage-products">Manage Products</TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="hover:shadow-premium transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalProducts}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Active products in catalog
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-premium transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
                <Clock className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{lowStockProducts}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Products with less than 10 units
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-premium transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
                <ShoppingCart className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{outOfStockProducts}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Products needing restock
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common administrative tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                className="w-full gradient-gold justify-start"
                onClick={() => document.querySelector<HTMLButtonElement>('[value="add-product"]')?.click()}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New Product
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => document.querySelector<HTMLButtonElement>('[value="manage-products"]')?.click()}
              >
                <Package className="h-4 w-4 mr-2" />
                Manage Inventory
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Add Product Tab */}
        <TabsContent value="add-product">
          <Card>
            <CardHeader>
              <CardTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</CardTitle>
              <CardDescription>
                {editingProduct ? 'Update product details' : 'Fill in all required product information'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Product Title *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => {
                          const title = e.target.value;
                          setFormData({
                            ...formData,
                            title,
                            slug: title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, ''),
                          });
                        }}
                        placeholder="e.g., Premium Basmati Rice"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="slug">URL Slug *</Label>
                      <Input
                        id="slug"
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        placeholder="premium-basmati-rice"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={4}
                      placeholder="Detailed product description..."
                      required
                    />
                  </div>
                </div>

                {/* Category & Service Type */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Category & Service</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category *</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value: 'Food' | 'Decorative') => 
                          setFormData({ ...formData, category: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Food">Food</SelectItem>
                          <SelectItem value="Decorative">Decorative</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="serviceType">Service Type *</Label>
                      <Select
                        value={formData.serviceType}
                        onValueChange={(value: 'purchaseable' | 'parcel-only' | 'both') => 
                          setFormData({ ...formData, serviceType: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="purchaseable">Purchaseable Only</SelectItem>
                          <SelectItem value="parcel-only">Parcel Service Only</SelectItem>
                          <SelectItem value="both">Both Services</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Pricing & Inventory */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Pricing & Inventory</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">Price (INR) *</Label>
                      <Input
                        id="price"
                        type="number"
                        value={formData.priceINR}
                        onChange={(e) => setFormData({ ...formData, priceINR: e.target.value === '' ? '' : Number(e.target.value) })}
                        min="0"
                        step="0.01"
                        placeholder="Enter price"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="stock">Stock Quantity *</Label>
                      <Input
                        id="stock"
                        type="number"
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: e.target.value === '' ? '' : Number(e.target.value) })}
                        min="0"
                        placeholder="Enter quantity"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="inStock">Product Availability</Label>
                    <Select
                      value={formData.inStock ? 'yes' : 'no'}
                      onValueChange={(value) => setFormData({ ...formData, inStock: value === 'yes' })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">In Stock</SelectItem>
                        <SelectItem value="no">Out of Stock</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Shipping Details & Ingredients */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Shipping Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="weight">Weight (kg)</Label>
                      <Input
                        id="weight"
                        type="number"
                        value={formData.weightKg}
                        onChange={(e) => setFormData({ ...formData, weightKg: e.target.value === '' ? '' : Number(e.target.value) })}
                        min="0"
                        step="0.01"
                        placeholder="Enter weight"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="length">Length (cm)</Label>
                      <Input
                        id="length"
                        type="number"
                        value={formData.dimensionsCm.length}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          dimensionsCm: { length: e.target.value === '' ? '' : Number(e.target.value) }
                        })}
                        min="0"
                        placeholder="Enter length"
                      />
                    </div>
                  </div>
                </div>

                {/* Ingredients */}
                {formData.category === 'Food' && (
                  <div className="space-y-2">
                    <Label htmlFor="ingredients">Ingredients *</Label>
                    <Textarea
                      id="ingredients"
                      value={formData.ingredients}
                      onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
                      rows={4}
                      placeholder="List all ingredients..."
                      required
                    />
                  </div>
                )}

                {/* Product Images */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Product Images *</h3>
                  
                  <Tabs value={imageInputMethod} onValueChange={(v) => setImageInputMethod(v as 'upload' | 'url')}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="upload">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Files
                      </TabsTrigger>
                      <TabsTrigger value="url">
                        <LinkIcon className="h-4 w-4 mr-2" />
                        Paste URL
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="upload" className="space-y-2">
                      <Input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        disabled={uploading}
                      />
                      {uploading && (
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          {uploadProgress}
                        </p>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="url" className="space-y-2">
                      <div className="flex gap-2">
                        <Input
                          placeholder="https://example.com/image.jpg"
                          value={imageUrl}
                          onChange={(e) => setImageUrl(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddImageUrl();
                            }
                          }}
                        />
                        <Button type="button" onClick={handleAddImageUrl}>
                          Add
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Supported: JPG, JPEG, PNG, GIF, WebP, BMP, TIFF, HEIC, HEIF
                      </p>
                    </TabsContent>
                  </Tabs>

                  {formData.images.length > 0 && (
                    <div className="grid grid-cols-3 md:grid-cols-5 gap-4 mt-4">
                      {formData.images.map((img, idx) => (
                        <div key={idx} className="relative group">
                          <img
                            src={img}
                            alt={`Product ${idx + 1}`}
                            className="h-24 w-full object-cover rounded border"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Product Videos */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">
                    <div className="flex items-center gap-2">
                      <VideoIcon className="h-5 w-5" />
                      Product Videos (Optional)
                    </div>
                  </h3>
                  
                  <Tabs value={videoInputMethod} onValueChange={(v) => setVideoInputMethod(v as 'upload' | 'url')}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="upload">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Files
                      </TabsTrigger>
                      <TabsTrigger value="url">
                        <LinkIcon className="h-4 w-4 mr-2" />
                        Paste URL
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="upload" className="space-y-2">
                      <Input
                        type="file"
                        accept="video/mp4,video/webm,video/quicktime"
                        multiple
                        onChange={handleVideoUpload}
                        disabled={uploading}
                      />
                      <p className="text-xs text-muted-foreground">
                        Supported: MP4, WebM, MOV • Max size: 100MB per video
                      </p>
                      {uploading && uploadProgress.includes('video') && (
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          {uploadProgress}
                        </p>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="url" className="space-y-2">
                      <div className="flex gap-2">
                        <Input
                          placeholder="https://youtube.com/... or direct video URL"
                          value={videoUrl}
                          onChange={(e) => setVideoUrl(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddVideoUrl();
                            }
                          }}
                        />
                        <Button type="button" onClick={handleAddVideoUrl}>
                          Add
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Supported: YouTube, Vimeo, or direct video links (MP4, WebM, MOV)
                      </p>
                    </TabsContent>
                  </Tabs>

                  {formData.videos && formData.videos.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      {formData.videos.map((video, idx) => (
                        <div key={idx} className="relative group">
                          {video.includes('youtube.com') || video.includes('vimeo.com') ? (
                            <div className="aspect-video rounded border overflow-hidden bg-muted">
                              <iframe
                                src={video}
                                className="w-full h-full"
                                allowFullScreen
                                title={`Product video ${idx + 1}`}
                              />
                            </div>
                          ) : (
                            <div className="aspect-video rounded border overflow-hidden bg-muted">
                              <video
                                src={video}
                                className="w-full h-full object-cover"
                                controls
                              />
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={() => removeVideo(idx)}
                            className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (optional)</Label>
                  <Input
                    id="tags"
                    placeholder="new, featured, bestseller (comma-separated)"
                    value={formData.tags.join(', ')}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      tags: e.target.value.split(',').map(t => t.trim()).filter(t => t) 
                    })}
                  />
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-2 justify-end pt-4 border-t">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={resetForm}
                  >
                    Reset Form
                  </Button>
                  <Button 
                    type="submit" 
                    className="gradient-gold" 
                    disabled={uploading || formData.images.length === 0}
                  >
                    {editingProduct ? 'Update Product' : 'Add Product'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Manage Products Tab */}
        <TabsContent value="manage-products">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle>Product Inventory</CardTitle>
                  <CardDescription>
                    {products.length} total products
                  </CardDescription>
                </div>
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {productsLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : filteredProducts.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">No products found</p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Image</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Service</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProducts.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>
                            <img
                              src={product.images[0]}
                              alt={product.title}
                              className="h-12 w-12 object-cover rounded"
                            />
                          </TableCell>
                          <TableCell className="font-medium">{product.title}</TableCell>
                          <TableCell>{product.category}</TableCell>
                          <TableCell className="text-xs">
                            {product.serviceType === 'purchaseable' && 'Purchase'}
                            {product.serviceType === 'parcel-only' && 'Parcel'}
                            {product.serviceType === 'both' && 'Both'}
                          </TableCell>
                          <TableCell>₹{product.priceINR.toLocaleString()}</TableCell>
                          <TableCell>
                            <span className={product.stock === 0 ? 'text-destructive font-medium' : product.stock < 10 ? 'text-orange-500' : ''}>
                              {product.stock}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  handleEdit(product);
                                  document.querySelector<HTMLButtonElement>('[value="add-product"]')?.click();
                                }}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDelete(product.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
