import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = () => {
  const { auth, authReady } = useAuth();

  if (!authReady) {
    return <div className="page-shell"><p className="muted">Loading session...</p></div>;
  }

  return auth.isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;