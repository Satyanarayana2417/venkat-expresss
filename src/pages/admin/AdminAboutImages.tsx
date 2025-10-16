import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { toast } from 'sonner';
import { ImagePlus, Loader2, Image as ImageIcon } from 'lucide-react';

interface ImageData {
  storyImageUrl1: string;
  storyImageUrl2: string;
  storyImageUrl3: string;
}

export const AdminAboutImages = () => {
  const [images, setImages] = useState<ImageData>({
    storyImageUrl1: '',
    storyImageUrl2: '',
    storyImageUrl3: ''
  });
  const [uploading, setUploading] = useState<{ [key: string]: boolean }>({
    storyImageUrl1: false,
    storyImageUrl2: false,
    storyImageUrl3: false
  });
  const [loading, setLoading] = useState(true);

  // Fetch current images from Firestore
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const docRef = doc(db, 'pageContent', 'aboutUs');
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data() as ImageData;
          setImages({
            storyImageUrl1: data.storyImageUrl1 || '',
            storyImageUrl2: data.storyImageUrl2 || '',
            storyImageUrl3: data.storyImageUrl3 || ''
          });
        } else {
          // Initialize with default images if document doesn't exist
          const defaultImages: ImageData = {
            storyImageUrl1: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&h=600&fit=crop',
            storyImageUrl2: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&h=600&fit=crop',
            storyImageUrl3: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&h=600&fit=crop'
          };
          await setDoc(docRef, defaultImages);
          setImages(defaultImages);
          toast.success('Initialized About Us images document');
        }
      } catch (error) {
        console.error('Error fetching images:', error);
        toast.error('Failed to load images');
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  // Handle image upload
  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    imageKey: keyof ImageData
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setUploading(prev => ({ ...prev, [imageKey]: true }));

    try {
      // Upload to Cloudinary
      const imageUrl = await uploadToCloudinary(file, 'image');

      // Update Firestore immediately
      const docRef = doc(db, 'pageContent', 'aboutUs');
      await updateDoc(docRef, {
        [imageKey]: imageUrl
      });

      // Update local state
      setImages(prev => ({
        ...prev,
        [imageKey]: imageUrl
      }));

      toast.success('Image updated successfully! Changes are live.');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image. Please try again.');
    } finally {
      setUploading(prev => ({ ...prev, [imageKey]: false }));
    }
  };

  const imageFields = [
    {
      key: 'storyImageUrl1' as keyof ImageData,
      title: 'First Story Image',
      description: 'Image for "Founded in 2014" section (Hyderabad cityscape)'
    },
    {
      key: 'storyImageUrl2' as keyof ImageData,
      title: 'Second Story Image',
      description: 'Image for "Mastering the Art" section (Package delivery)'
    },
    {
      key: 'storyImageUrl3' as keyof ImageData,
      title: 'Third Story Image',
      description: 'Image for "Delivering More Than Packages" section (Indian products)'
    }
  ];

  if (loading) {
    return (
      <AdminLayout title="About Us - Images">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-yellow-600" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="About Us - Images">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit 'Our Story' Images</h1>
          <p className="mt-2 text-gray-600">
            Manage the three images displayed in the "Our Story" section of the About Us page.
            Changes appear instantly on the website without refresh.
          </p>
        </div>

        {/* Image Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {imageFields.map((field) => (
            <Card key={field.key} className="overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5 text-yellow-600" />
                  {field.title}
                </CardTitle>
                <CardDescription>{field.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Current Image Preview */}
                <div className="relative aspect-video w-full bg-gray-100 rounded-lg overflow-hidden">
                  {images[field.key] ? (
                    <img
                      src={images[field.key]}
                      alt={field.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <ImageIcon className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Upload Button */}
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, field.key)}
                    className="hidden"
                    id={`upload-${field.key}`}
                    disabled={uploading[field.key]}
                  />
                  <label htmlFor={`upload-${field.key}`}>
                    <Button
                      type="button"
                      className="w-full"
                      disabled={uploading[field.key]}
                      onClick={() => document.getElementById(`upload-${field.key}`)?.click()}
                      asChild
                    >
                      <span>
                        {uploading[field.key] ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <ImagePlus className="mr-2 h-4 w-4" />
                            Change Image
                          </>
                        )}
                      </span>
                    </Button>
                  </label>
                </div>

                {/* Info */}
                <p className="text-xs text-gray-500 text-center">
                  Max size: 5MB • Formats: JPG, PNG, WebP
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Instructions Card */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">How It Works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-blue-800">
            <p>✅ <strong>Real-Time Updates:</strong> When you upload a new image, it saves automatically and appears on the live website instantly.</p>
            <p>✅ <strong>No Save Button:</strong> Each image uploads independently when you select a new file.</p>
            <p>✅ <strong>Order Matters:</strong> Image 1, 2, and 3 correspond to the three paragraphs in the "Our Story" section from top to bottom.</p>
            <p>✅ <strong>Responsive:</strong> Images are automatically optimized and will display correctly on all devices.</p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};
