import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const PublicRoute = () => {
  const { auth, authReady } = useAuth();

  if (!authReady) {
    return <div className="page-shell"><p className="muted">Loading session...</p></div>;
  }

  return auth.isAuthenticated ? <Navigate to="/" replace /> : <Outlet />;
};

export default PublicRoute;