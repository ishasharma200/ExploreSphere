// Cloudinary unsigned upload utility
// Configuration via environment variables (see IMAGE_UPLOAD_SETUP.md)

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dexample';
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'explore_sphere';

export const uploadImageToCloudinary = async (file) => {
  if (!file.type.startsWith('image/')) {
    throw new Error('File must be an image');
  }

  // Max file size: 10MB
  if (file.size > 10 * 1024 * 1024) {
    throw new Error('Image must be smaller than 10MB');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error?.message ||
        `Upload failed with status ${response.status}`
      );
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error(
      error.message ||
      'Failed to upload image. Check your Cloudinary configuration in IMAGE_UPLOAD_SETUP.md'
    );
  }
};

export const uploadMultipleImages = async (files) => {
  const urls = [];
  const errors = [];

  for (const file of files) {
    try {
      const url = await uploadImageToCloudinary(file);
      urls.push(url);
    } catch (error) {
      errors.push(`${file.name}: ${error.message}`);
    }
  }

  if (errors.length > 0 && urls.length === 0) {
    throw new Error(`All uploads failed:\n${errors.join('\n')}`);
  }

  if (errors.length > 0) {
    console.warn('Some uploads failed:', errors);
  }

  return urls;
};
