# Explore Sphere

Explore Sphere is a local community app for discovering places, leaving reviews, and sharing recommendations.

## Overview
This repository contains a full-stack application:
- `/backend` — Node/Express API with MongoDB, JWT auth, Socket.IO realtime.
- `/frontend` — React + Vite SPA, Cloudinary image uploads, Socket.IO client.

## Prerequisites
- Node.js 18+ and npm
- MongoDB (local or Atlas)
- (Optional) Cloudinary account for image uploads
- GitHub account for CI (GitHub Actions)

## Environment variables
Create `.env` files for backend and frontend (or set env vars in your host).

Backend (`/backend/.env`):
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/explore_sphere
JWT_SECRET=your_jwt_secret_here
NODE_ENV=development
```

Frontend (`/frontend/.env`):
```
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_unsigned_preset
```
Notes:
- For Cloudinary, create an *unsigned* upload preset (or implement signed upload flow). Set `VITE_CLOUDINARY_CLOUD_NAME` and `VITE_CLOUDINARY_UPLOAD_PRESET` accordingly.

## Local Setup
1. Clone the repo and open it:

```bash
git clone <repo-url>
cd EXPLORE-SPHERE
```

2. Backend

```bash
cd backend
npm install
# create backend/.env with values from above
npm run dev
# or run tests
npm test
```

3. Frontend

```bash
cd frontend
npm install
# create frontend/.env with values from above
npm run dev
# build for production
npm run build
```

Open the frontend app (Vite dev server) at the address shown (default `http://localhost:5173`).

## Linting & Formatting
- Root `.eslintrc.cjs` and `.prettierrc` are present.
- Run lint and format via package scripts in each package.

Backend:
```bash
cd backend
npm run lint
npm run format
```

Frontend:
```bash
cd frontend
npm run lint
npm run format
```

## CI (GitHub Actions)
A workflow is configured at `.github/workflows/ci.yml` that:
- Installs dependencies for both backend and frontend
- Runs backend tests
- Runs linters (best-effort)
- Builds the frontend
- Runs Prettier checks

## Deployment notes
- Set production environment variables (e.g., `MONGO_URI`, `JWT_SECRET`, `VITE_API_URL`, Cloudinary keys) on your host.
- For production Socket.IO, ensure the socket server URL matches and CORS is configured through `CLIENT_URL` in the backend.
- The backend supports comma-separated `CLIENT_URL` values for multiple allowed frontend origins.
- Use a process manager (PM2) or containerization for backend in production.
- Build the frontend with `npm run build` and deploy the `dist` folder to your static host.

## Free hosting suggestion
- Frontend: Vercel free tier
- Backend: Railway free tier or Render free tier
- Use the backend URL in `VITE_API_URL` and `VITE_SOCKET_URL`
- Use `CLIENT_URL=https://<frontend-url>` in backend env

## Deployment checklist
- [ ] `backend/.env` configured with production MongoDB, JWT secret, and client origin
- [ ] `frontend/.env` configured with production API and socket URLs
- [ ] backend `npm run start:prod` or containerized deployment in place
- [ ] frontend production build successfully generated
- [ ] Socket.IO origin and CORS values validated in production

## Troubleshooting
- If frontend uploads fail, verify Cloudinary `cloudName` and `uploadPreset`. Unsigned presets must allow unsigned uploads.
- If auth fails, check `JWT_SECRET` matches backend signing secret.

## Next steps (suggested)
- Add Husky + lint-staged to run format/lint on pre-commit.
- Add refresh-token flow for silent session renewal.
- Add E2E tests for core flows (signup → create place → add review).

If you want, I can:
- Add `backend/README.md` and `frontend/README.md` with package-specific quickstarts.
- Add Husky + lint-staged and run fixes across the codebase.
