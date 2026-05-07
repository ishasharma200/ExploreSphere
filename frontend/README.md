# Explore Sphere Frontend

This package contains the React/Vite SPA for Explore Sphere.

## Requirements

- Node.js 18+
- `.env` file in `/frontend`

## Environment Variables

Create `/frontend/.env` with:

```bash
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_unsigned_preset
```

### Production settings

For production, set:

```bash
VITE_API_URL=https://api.example.com/api
VITE_SOCKET_URL=https://api.example.com
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_unsigned_preset
```

## Setup

```bash
cd frontend
npm install
```

## Run Locally

```bash
npm run dev
```

The Vite dev server starts on `http://localhost:5173` by default.

## Scripts

- `npm run dev` — start the development server
- `npm run build` — build the production bundle
- `npm run preview` — preview the production build locally
- `npm run test` — run frontend tests with Vitest
- `npm run test:run` — run tests once
- `npm run lint` — run ESLint checks
- `npm run format` — format files with Prettier

## Testing

This package uses Vitest and Testing Library for frontend unit tests.

```bash
npm run test:run
```

## Notes

- The frontend now includes responsive UI updates and mobile-friendly navigation.
- Add the Cloudinary keys before using image upload features.
- Use `npm run build` to create a production bundle and deploy the generated `dist` directory to a static host.
- Verify that `VITE_API_URL` and `VITE_SOCKET_URL` point to the production backend.

## Free hosting recommendation

### Deploy frontend to Vercel
- Use the `frontend` folder as the project root.
- Vercel will automatically run `npm install` and `npm run build`.
- Add these Environment Variables in Vercel:
  - `VITE_API_URL=https://<backend-url>/api`
  - `VITE_SOCKET_URL=https://<backend-url>`
  - `VITE_CLOUDINARY_CLOUD_NAME`
  - `VITE_CLOUDINARY_UPLOAD_PRESET`

### Vercel helper file
- `frontend/vercel.json` is included to enable SPA routing.
