# Explore Sphere Backend

This package contains the Express API server for Explore Sphere.

## Requirements

- Node.js 18+
- MongoDB running locally or using Atlas
- `.env` file in `/backend`

## Environment Variables

Create `/backend/.env` with:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/explore_sphere
JWT_SECRET=your_jwt_secret_here
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### Production settings

For production, set:

```
NODE_ENV=production
MONGO_URI=<your-production-mongo-uri>
JWT_SECRET=<strong-secret>
CLIENT_URL=https://your-frontend-domain.com
```

If you need multiple frontend origins, provide them as a comma-separated list:

```
CLIENT_URL=https://app.example.com,https://admin.example.com
```

## Setup

```bash
cd backend
npm install
```

## Run Locally

```bash
npm run dev
```

The API server starts on `http://localhost:5000` by default.

## Scripts

- `npm run dev` — start server with `nodemon`
- `npm start` — start server with `node`
- `npm test` — run backend test suite
- `npm run lint` — run ESLint checks
- `npm run format` — format files with Prettier

## Testing

This package uses Node's built-in test runner for backend tests.

```bash
npm test
```

## Notes

- Socket.IO emits live venue activity to connected frontend clients.
- The backend uses CORS origin validation based on the `CLIENT_URL` value.
- When deploying, make sure `CLIENT_URL` matches the frontend origin and include any additional domains as comma-separated values.
- The backend test suite includes controller and route coverage using mocked dependencies.

## Free hosting recommendations

### Recommended setup
- Frontend: Vercel (free static hosting)
- Backend: Railway or Render free tier (Node + Socket.IO)

### Deployment steps
1. Deploy backend first and copy the generated URL.
2. Set `CLIENT_URL` in backend env to your frontend URL.
3. Deploy frontend with `frontend` as the project root.
4. Set frontend env vars:
   - `VITE_API_URL=https://<backend-url>/api`
   - `VITE_SOCKET_URL=https://<backend-url>`
   - `VITE_CLOUDINARY_CLOUD_NAME`
   - `VITE_CLOUDINARY_UPLOAD_PRESET`

### Helpful files
- `Procfile` for Render/Heroku-style deployments
