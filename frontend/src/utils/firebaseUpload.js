// Firebase upload utility (Alternative to Cloudinary)
// Prerequisites: npm install firebase
// Configuration: Set VITE_FIREBASE_* env vars in .env.local
// See IMAGE_UPLOAD_SETUP.md for setup instructions

import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Only initialize if Firebase env vars are configured
let storage = null;
if (firebaseConfig.projectId) {
  try {
    const app = initializeApp(firebaseConfig);
    storage = getStorage(app);
  } catch (error) {
    console.warn('Firebase not initialized:', error.message);
  }
}

export const uploadImageToFirebase = async (file, placeId = 'temp') => {
  if (!storage) {
    throw new Error('Firebase not configured. Set VITE_FIREBASE_* env vars in .env.local');
  }

  if (!file.type.startsWith('image/')) {
    throw new Error('File must be an image');
  }

  // Max file size: 50MB (Firebase free tier allows this)
  if (file.size > 50 * 1024 * 1024) {
    throw new Error('Image must be smaller than 50MB');
  }

  try {
    const timestamp = Date.now();
    const fileExt = file.name.split('.').pop();
    const fileName = `${timestamp}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
    const storageRef = ref(storage, `places/${placeId}/${fileName}`);

    const snapshot = await uploadBytes(storageRef, file);
    const downloadUrl = await getDownloadURL(snapshot.ref);
    return downloadUrl;
  } catch (error) {
    console.error('Firebase upload error:', error);
    throw new Error(
      error.message ||
      'Failed to upload to Firebase. Check configuration in IMAGE_UPLOAD_SETUP.md'
    );
  }
};

export const uploadMultipleImagesToFirebase = async (files, placeId = 'temp') => {
  const urls = [];
  const errors = [];

  for (const file of files) {
    try {
      const url = await uploadImageToFirebase(file, placeId);
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
