export const CLOUDINARY_CONFIG = {
  cloudName: 'doxwyrp8n',
  uploadPreset: 'venkat express 2',
};

export const uploadToCloudinary = async (file: File, resourceType: 'image' | 'video' = 'image'): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);

  const endpoint = resourceType === 'video' ? 'video' : 'image';
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/${endpoint}/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to upload ${resourceType}`);
  }

  const data = await response.json();
  return data.secure_url;
};

export const validateMediaUrl = (url: string, type: 'image' | 'video'): boolean => {
  try {
    new URL(url);
    if (type === 'image') {
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.tiff', '.heic', '.heif'];
      return imageExtensions.some(ext => url.toLowerCase().includes(ext));
    } else {
      // Support YouTube, Vimeo, and direct video URLs
      const videoPatterns = [
        /youtube\.com\/watch\?v=/,
        /youtu\.be\//,
        /vimeo\.com\//,
        /\.mp4/i,
        /\.webm/i,
        /\.mov/i,
      ];
      return videoPatterns.some(pattern => pattern.test(url));
    }
  } catch {
    return false;
  }
};

export const normalizeVideoUrl = (url: string): string => {
  // Convert YouTube URLs to embed format
  if (url.includes('youtube.com/watch?v=')) {
    const videoId = url.split('v=')[1]?.split('&')[0];
    return `https://www.youtube.com/embed/${videoId}`;
  }
  if (url.includes('youtu.be/')) {
    const videoId = url.split('youtu.be/')[1]?.split('?')[0];
    return `https://www.youtube.com/embed/${videoId}`;
  }
  // Convert Vimeo URLs to embed format
  if (url.includes('vimeo.com/')) {
    const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
    return `https://player.vimeo.com/video/${videoId}`;
  }
  // Return as-is for direct video URLs
  return url;
};

export const getCloudinaryUrl = (publicId: string, transformations?: string) => {
  const baseUrl = `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloudName}/image/upload`;
  return transformations
    ? `${baseUrl}/${transformations}/${publicId}`
    : `${baseUrl}/${publicId}`;
};
