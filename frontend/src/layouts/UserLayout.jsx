import { Outlet, useNavigate } from 'react-router-dom';
import Nav from '../components/navbar/Nav';
import ErrorBoundary from '../utils/ErrorBoundary';
import { Suspense, useEffect } from 'react';
import Preloader from '../components/ui/Preloader';
import { useAuthStore } from '../stores/authStore';

function UserLayout() {

  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate(`/${user?.role}`);
    }
  }, [user]);

  return (
    <div>
      <Nav />
      <ErrorBoundary>
        <Suspense fallback={<Preloader />}>
          <Outlet />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}

export default UserLayout;
