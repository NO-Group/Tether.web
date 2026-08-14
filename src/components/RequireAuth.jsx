import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function RequireAuth({ children }) {
  const { user, loading, isConfigured } = useAuth();
  if (!isConfigured) return <Navigate to="/setup" replace />;
  if (loading) {
    return (
      <div className="center-box">
        <div className="spinner" />
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  return children;
}
