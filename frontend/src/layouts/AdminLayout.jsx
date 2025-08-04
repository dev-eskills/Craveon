import { motion } from 'framer-motion';
import { Outlet, useLocation } from 'react-router-dom';
import Nav from '../components/navbar/Nav';
import AdminSidebar from '../components/admin/AdminSidebar';
import ErrorBoundary from '../utils/ErrorBoundary';

function AdminLayout() {
  const location = useLocation();
  return (
    <section className="flex flex-col">
      <Nav />
      <section className="flex flex-1">
        {/* Fix Sidebar Position */}
        <AdminSidebar className="lg:block hidden fixed top-20 left-0 h-[calc(100vh-5rem)] w-56" />

        {/* Push Content to Right of Sidebar */}
        <div className="w-full lg:ml-56 flex md:p-4 overflow-auto">
          <motion.div
            key={location.pathname} // Animates on route change
            initial={{ opacity: 0, y: 10 }} // Fade & slide in
            animate={{ opacity: 1, y: 0 }} // Fully visible
            exit={{ opacity: 0, y: -10 }} // Fade & slide out
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="w-full"
          >
            <ErrorBoundary>
              <Outlet />
            </ErrorBoundary>
          </motion.div>
        </div>
      </section>
    </section>
  );
}

export default AdminLayout;
