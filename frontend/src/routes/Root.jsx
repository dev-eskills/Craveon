import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

const Root = () => {
  const user = useAuthStore((state) => state.user);

  // Handle role-based routing
  switch (user?.role) {
    case 'restaurant':
      return <Navigate to="/restaurant" replace />;
    case 'admin':
      return <Navigate to="/admin" replace />;
    default:
      return <Navigate to="/user" replace />;
  }
};

export default Root;
