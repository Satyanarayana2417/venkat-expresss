import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useProducts } from '@/hooks/useProducts';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Loader2, Upload, X, Link as LinkIcon, VideoIcon } from 'lucide-react';
import { uploadToCloudinary, validateMediaUrl, normalizeVideoUrl } from '@/lib/cloudinary';
import { Product } from '@/components/ProductCard';
import { useEffect } from 'react';

export const AdminProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { products, addProduct, updateProduct } = useProducts();
  
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

  // Load product data if editing
  useEffect(() => {
    if (id && products.length > 0) {
      const product = products.find(p => p.id === id);
      if (product) {
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
      }
    }
  }, [id, products]);

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

    const maxSize = 100 * 1024 * 1024;
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

      if (id) {
        await updateProduct(id, productData);
        toast.success('Product updated successfully');
      } else {
        await addProduct(productData);
        toast.success('Product added successfully');
      }
      
      navigate('/admin/products');
    } catch (error: any) {
      toast.error(error.message || 'Operation failed');
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
    setImageUrl('');
    setVideoUrl('');
  };

  return (
    <AdminLayout title={id ? 'Edit Product' : 'Add New Product'}>
      <Card>
        <CardHeader>
          <CardTitle>{id ? 'Edit Product' : 'Add New Product'}</CardTitle>
          <CardDescription>
            {id ? 'Update product details' : 'Fill in all required product information'}
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
                    max="100000000"
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

            {/* Shipping Details */}
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
                        className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
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
                        className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
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
                onClick={() => navigate('/admin/products')}
              >
                Cancel
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={resetForm}
              >
                Reset Form
              </Button>
              <Button 
                type="submit" 
                className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700"
                disabled={uploading || formData.images.length === 0}
              >
                {id ? 'Update Product' : 'Add Product'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </AdminLayout>
  );
};
