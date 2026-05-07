# Image Upload Setup - Quick Start ⚡

## TL;DR - 5 Minute Setup

### 1️⃣ Choose Your Provider
- **Cloudinary** (Recommended): Free 25GB/month, no backend code needed
- **Firebase**: Free 5GB/month, integrates with other Firebase services

### 2️⃣ Get Credentials (Choose One)

**Cloudinary Option:**
```
1. Go to https://cloudinary.com and sign up (free)
2. Dashboard → Copy "Cloud Name"
3. Settings → Upload → Add unsigned preset named "explore_sphere"
4. Done! Save your Cloud Name
```

**Firebase Option:**
```
1. Go to https://console.firebase.google.com and create project
2. Build → Storage → Get Started
3. Project Settings → Your apps → Copy config
4. npm install firebase in frontend/
5. Done! Save your config values
```

### 3️⃣ Configure Frontend

Create `frontend/.env.local`:

**For Cloudinary:**
```env
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=explore_sphere
```

**For Firebase:**
```env
VITE_FIREBASE_API_KEY=xxx
VITE_FIREBASE_PROJECT_ID=xxx
VITE_FIREBASE_STORAGE_BUCKET=xxx
VITE_FIREBASE_MESSAGING_SENDER_ID=xxx
VITE_FIREBASE_APP_ID=xxx
```

### 4️⃣ Start and Test

```bash
# Terminal 1: Backend
cd backend && npm start

# Terminal 2: Frontend
cd frontend && npm run dev

# Browser: http://localhost:5173
# → Sign up → "Add a new venue" → Upload image → ✅ Done!
```

---

## What Was Already Implemented ✅

- ✅ ImageUploadInput component (file picker + preview)
- ✅ Cloudinary upload utility (uploadImageToCloudinary)
- ✅ Firebase upload utility (optional alternative)
- ✅ AddPlace page integration (upload on create)
- ✅ PlaceDetails page (gallery + edit images)
- ✅ PlaceCard thumbnails (shows first image)
- ✅ Backend model & controller (saves images array)
- ✅ Error handling & validation (file type, size, max count)

---

## Troubleshooting 🔧

**Images not uploading?**
→ Check browser DevTools Console for error message
→ Make sure .env.local has correct credentials
→ For Cloudinary: Verify upload preset is "Unsigned"

**Getting 403/401 errors?**
→ Firebase: Check Storage security rules are published
→ Cloudinary: Verify cloud name is exact match

**Images showing broken?**
→ Check URL format starts with https://
→ Cloudinary: `https://res.cloudinary.com/...`
→ Firebase: `https://firebasestorage.googleapis.com/...`

---

## Next Steps After Setup

- 🔒 Add image deletion when place is deleted
- 🖼️ Add image compression/optimization
- 📤 Add bulk upload from URLs
- ↕️ Add image reordering in gallery

---

## Full Setup Guide

See `IMAGE_UPLOAD_SETUP.md` for detailed instructions, production checklist, and advanced options.

---

## Quick Link Reference

- Cloudinary Dashboard: https://cloudinary.com/console
- Firebase Console: https://console.firebase.google.com
- This Project Config: frontend/.env.local
- Setup Instructions: IMAGE_UPLOAD_SETUP.md
