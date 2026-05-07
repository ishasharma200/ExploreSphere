# Image Upload Setup Guide

This guide walks you through setting up image storage for EXPLORE-SPHERE using **Cloudinary** (recommended) or **Firebase**.

---

## Option 1: Cloudinary Setup (Recommended) ⭐

Cloudinary provides free tier with 25GB/month bandwidth - perfect for development and small deployments.

### Step 1: Create Cloudinary Account
1. Go to [https://cloudinary.com](https://cloudinary.com)
2. Click **"Sign Up For Free"**
3. Complete registration (email, password, or OAuth)
4. Verify your email

### Step 2: Get Your Credentials
1. Navigate to **Dashboard** (shows after login)
2. Find your **Cloud Name** (looks like `abc123def456`)
   - This is under the "Account Details" section
3. Copy this value - you'll need it in the next step

### Step 3: Create Upload Preset
1. Go to **Settings** (gear icon) → **Upload**
2. Scroll to **"Upload presets"** section
3. Click **"Add upload preset"** button
4. Fill in form:
   - **Name**: `explore_sphere`
   - **Signing Mode**: Select **"Unsigned"** (allows client-side uploads without backend)
5. Click **"Save"**

### Step 4: Configure Frontend
1. Create `.env.local` file in `frontend/` directory:
   ```env
   VITE_CLOUDINARY_CLOUD_NAME=YOUR_CLOUD_NAME
   VITE_CLOUDINARY_UPLOAD_PRESET=explore_sphere
   ```

2. Replace `YOUR_CLOUD_NAME` with your actual cloud name from Step 2

3. Example (if your cloud name is `example123`):
   ```env
   VITE_CLOUDINARY_CLOUD_NAME=example123
   VITE_CLOUDINARY_UPLOAD_PRESET=explore_sphere
   ```

### Step 5: Verify Setup
```bash
cd frontend

# Check if .env.local exists and contains your credentials
cat .env.local

# Start dev server
npm run dev
```

Visit `http://localhost:5173` and test:
1. Sign up or login
2. Go to "Add a new venue"
3. Upload 1-2 images
4. Should see preview immediately after selection

---

## Option 2: Firebase Setup (Alternative)

Firebase offers 5GB free storage per month with real-time database integration.

### Step 1: Create Firebase Project
1. Go to [https://console.firebase.google.com](https://console.firebase.google.com)
2. Click **"Add project"**
3. Name: `explore-sphere`
4. Accept terms and create

### Step 2: Enable Storage
1. In left sidebar, go to **"Storage"** under "Build"
2. Click **"Get Started"**
3. Select region closest to you (default: `us-central1`)
4. Click **"Create"**

### Step 3: Set Security Rules
1. Go to **"Rules"** tab in Storage
2. Replace default rules with:
   ```
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       match /places/{allPaths=**} {
         allow read;
         allow create, update, delete: if request.auth != null;
       }
     }
   }
   ```
3. Click **"Publish"**

### Step 4: Get Config
1. Go to **Project Settings** (gear icon) → **"Your apps"**
2. If no apps, click **"</>Web"** to register web app
3. Copy the config object containing:
   - `apiKey`
   - `projectId`
   - `storageBucket`
   - etc.

### Step 5: Configure Frontend
1. Create `.env.local` in `frontend/`:
   ```env
   VITE_FIREBASE_API_KEY=YOUR_API_KEY
   VITE_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
   VITE_FIREBASE_STORAGE_BUCKET=YOUR_BUCKET
   ```

2. Install Firebase package:
   ```bash
   cd frontend
   npm install firebase
   ```

3. Create `src/utils/firebaseUpload.js`:
   ```javascript
   import { initializeApp } from 'firebase/app';
   import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

   const firebaseConfig = {
     apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
     projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
     storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
   };

   const app = initializeApp(firebaseConfig);
   const storage = getStorage(app);

   export const uploadImageToFirebase = async (file, placeId) => {
     const storageRef = ref(storage, `places/${placeId}/${Date.now()}-${file.name}`);
     const snapshot = await uploadBytes(storageRef, file);
     return await getDownloadURL(snapshot.ref);
   };
   ```

---

## Production Checklist

### For Cloudinary:
- [ ] Cloud name configured in `.env.local`
- [ ] Upload preset set to "Unsigned"
- [ ] Tested image upload → appears in Cloudinary dashboard
- [ ] Image URLs are served over HTTPS
- [ ] Set up CDN transformation rules (optional, for optimization)

### For Firebase:
- [ ] Firebase config in `.env.local`
- [ ] Storage rules published (not in test mode)
- [ ] Tested image upload → appears in Firebase Storage
- [ ] Backups enabled (Project Settings → Backup)

### Both Providers:
- [ ] `.env.local` added to `.gitignore` (never commit credentials)
- [ ] Error handling tested (network failure, invalid file, quota exceeded)
- [ ] Images load fast (consider compression/optimization)
- [ ] Cost monitoring set up (enable billing alerts)

---

## Troubleshooting

### Images not uploading
- **Cloudinary**: Check cloud name and upload preset are correct
- **Firebase**: Verify storage bucket name in config
- Check browser DevTools Console for error messages

### "CORS" errors
- **Cloudinary**: Unsigned uploads work from any domain (no CORS issues)
- **Firebase**: If CORS errors, verify rules allow read access

### Images appear broken
- **Cloudinary**: URL format should be `https://res.cloudinary.com/...`
- **Firebase**: URL format should be `https://firebasestorage.googleapis.com/...`
- Check URL is not expired (Cloudinary: permanent, Firebase: may expire)

### Quota exceeded errors
- **Cloudinary**: Free tier = 25GB/month. Upgrade plan for more.
- **Firebase**: Free tier = 5GB/month. Upgrade plan for more.

---

## Environment Variables Reference

### Cloudinary (Vite)
```env
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=explore_sphere
```

Access in code:
```javascript
const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
```

### Firebase (Vite)
```env
VITE_FIREBASE_API_KEY=key_value
VITE_FIREBASE_PROJECT_ID=project_id
VITE_FIREBASE_STORAGE_BUCKET=bucket_name
VITE_FIREBASE_MESSAGING_SENDER_ID=sender_id
VITE_FIREBASE_APP_ID=app_id
```

---

## Testing Upload Flow

### Quick Test (Cloudinary)
```bash
# 1. Start servers
cd backend && npm start        # Terminal 1
cd frontend && npm run dev     # Terminal 2

# 2. Open http://localhost:5173
# 3. Sign up
# 4. Go to "Add a new venue"
# 5. Select 1-5 images
# 6. See preview appear immediately
# 7. Submit form
# 8. Check PlaceDetails page - images should display
# 9. Go to Browse - first image shown as thumbnail
```

### Verify Cloudinary Upload
1. Log in to [https://cloudinary.com/console](https://cloudinary.com/console)
2. Go to **Media Library**
3. Should see your uploaded images there

---

## Next Steps

✅ Image uploads working via Cloudinary/Firebase  
⬜ Add image compression/optimization (ImageOptim)  
⬜ Add image deletion when place is deleted  
⬜ Add bulk image upload from URL  
⬜ Add image reordering/gallery management  

---

## Support

**For Cloudinary Issues**: [Cloudinary Docs](https://cloudinary.com/documentation)  
**For Firebase Issues**: [Firebase Docs](https://firebase.google.com/docs)  
**For EXPLORE-SPHERE Issues**: Check PlaceDetails, AddPlace, ImageUploadInput components
