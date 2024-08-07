import { Navigate } from 'react-router-dom'
import { useAuth } from '../Hooks/AuthHook'

interface ProtectedRouteProps {
  element: React.ReactElement
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  const { user, loading } = useAuth();

  if(loading) {
    return <p>Loading...</p>
  }

  return user ? element : <Navigate to="/login" replace />;
}

export default ProtectedRoute;