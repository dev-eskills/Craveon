import { createBrowserRouter } from 'react-router-dom';
import { lazy } from 'react';
import { ProtectCart, ProtectPayment, ProtectedRoute } from './ProtectedRoute';
import Root from './Root';

// Layouts
const RestaurantLayout = lazy(() => import('../layouts/RestaurantLayout'));
const AdminLayout = lazy(() => import('../layouts/AdminLayout'));
const UserLayout = lazy(() => import('../layouts/UserLayout'));

// Pages
import HomePage from '../pages/HomePage';
const LoginPage = lazy(() => import('../pages/LoginPage'));
const CategoryDetail = lazy(() => import('../pages/CategoryDetail'));
const CartPage = lazy(() => import('../pages/CartPage'));
const UserProfile = lazy(() => import('../pages/UserProfile'));
const UserAddressManage = lazy(() => import('../pages/UserAddressManage'));
const UserOrderHistory = lazy(() => import('../pages/UserOrderHistory'));
const AdminUserPage = lazy(() => import('../pages/AdminUserPage'));
const AdminBannersPage = lazy(() => import('../pages/AdminBannersPage'));
const AdminAllRidersPage = lazy(() => import('../pages/AdminAllRidersPage'));
const AdminSingleRestaurantPage = lazy(() => import('../pages/AdminSingleRestaurantPage'));
const AdminAddRestaurant = lazy(() => import('../pages/AdminAddRestaurant'));
const UserSupportPage = lazy(() => import('../components/profile/UserSupportPage'));
const AdminSupportPage = lazy(() => import('../components/admin/AdminSupportPage'));

// Components
const BillingForm = lazy(() => import('../components/cart/BillingForm'));
const OrderConfirmation = lazy(() => import('../components/cart/OrderConfirmation'));
const AdminDashboard = lazy(() => import('../components/admin/AdminDashboard'));
const AdminRestrauntPage = lazy(() => import('../components/admin/AdminRestrauntPage'));
const AdminOrders = lazy(() => import('../components/admin/AdminOrders'));
const RestaurantDashboard = lazy(
  () => import('../components/restaurantDashboard/RestaurantDashboard')
);
const RestaurantOrders = lazy(() => import('../components/restaurantDashboard/RestaurantOrder'));
const RestaurantReport = lazy(() => import('../components/restaurantDashboard/RestaurantReport'));
const RestaurantProducts = lazy(
  () => import('../components/restaurantDashboard/RestaurantProducts')
);
const RestaurantAddProduct = lazy(
  () => import('../components/restaurantDashboard/RestaurantAddProduct')
);
const RestaurantProfileForm = lazy(
  () => import('../components/restaurantDashboard/RestaurantProfileForm')
);
const AdminAddCategory = lazy(() => import('../components/admin/AdminAddCategory'));
const SingleRestaurantPage = lazy(() => import('../components/home/SingleRestaurentPage'));

import PrivacyPolicy from '../components/footer/privacy-policy';
import TermsAndConditions from '../components/footer/terms-and-conditions';
import CancellationAndRefund from '../components/footer/cancellation-and-refund';
import ContactUs from '../components/footer/contact-us';
import AdminSettings from '../components/admin/AdminSettings';
import SingleOrder from '../components/restaurantDashboard/SingleOrder';
import AboutUs from '../components/footer/aboutUs';
import Help from '../components/footer/help';
import AdminLogs from '../pages/AdminLogsPage';
// import UserOrders from '../components/admin/UserOrders';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: 'privacy-policy',
    element: <PrivacyPolicy />,
  },
  {
    path: 'terms-and-conditions',
    element: <TermsAndConditions />,
  },
  {
    path: 'cancellation-and-refund',
    element: <CancellationAndRefund />,
  },
  {
    path: 'contact-us',
    element: <ContactUs />,
  },
  {
    path: 'about-us',
    element: <AboutUs />
  },
  {
    path: 'help',
    element: <Help />
  },

  // User Application Routes
  {
    path: '/user',
    element: <UserLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'category/:id',
        element: <CategoryDetail />,
      },
      {
        path: 'restaurant/:id',
        element: <SingleRestaurantPage />,
      },
      {
        path: 'profile',
        element: (
          <ProtectedRoute allowedRoles={['user']}>
            <UserProfile />
          </ProtectedRoute>
        ),
      },
      {
        path: 'profile/address',
        element: (
          <ProtectedRoute allowedRoles={['user']}>
            <UserAddressManage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'profile/order-history/:id',
        element: (
          <ProtectedRoute allowedRoles={['user']}>
            <UserOrderHistory />
          </ProtectedRoute>
        ),
      },
      {
        path: 'profile/support',
        element: (
          <ProtectedRoute allowedRoles={['user']}>
            <UserSupportPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'cart',
        element: (
          <ProtectCart>
            <CartPage />
          </ProtectCart>
        ),
      },
      {
        path: 'cart/payment',
        element: (
          <ProtectPayment>
            <BillingForm />
          </ProtectPayment>
        ),
      },
      {
        path: 'cart/payment/order-placed',
        element: <OrderConfirmation />,
      },
    ],
  },

  // Admin Application Routes
  {
    path: '/admin',
    element: (
      <ProtectedRoute allowedRoles={['admin']}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: 'orders',
        element: <AdminOrders />,
      },
      {
        path: 'restaurants',
        element: <AdminRestrauntPage />,
      },
      {
        path: 'restaurant/:id',
        element: <AdminSingleRestaurantPage />,
      },

      {
        path: 'customers',
        element: <AdminUserPage />,
      },
      {
        path: 'riders',
        element: <AdminAllRidersPage />,
      },
      {
        path: 'settings',
        element: <AdminSettings />,
      },
      {
        path: 'banner',
        element: <AdminBannersPage />,
      },
      {
        path: 'add-restaurant',
        element: <AdminAddRestaurant />,
      },
      {
        path: 'category',
        element: <AdminAddCategory />,
      },
      {
        path: 'support',
        element: <AdminSupportPage />,
      },
      {
        path: 'order-history/:id',
        element: <UserOrderHistory />,
      },
      {
        path: 'logs',
        element: <AdminLogs />
      },
    ],
  },

  // Restaurant Application Routes
  {
    path: '/restaurant',
    element: (
      <ProtectedRoute allowedRoles={['restaurant']}>
        <RestaurantLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute allowedRoles={['restaurant']}>
            <RestaurantDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: ':id',
        element: <AdminSingleRestaurantPage />,
      },
      {
        path: 'orders',
        element: <RestaurantOrders />,
      },
      {
        path: 'orders/:id',
        element: <SingleOrder />,
      },
      {
        path: 'report',
        element: <RestaurantReport />,
      },
      {
        path: 'products',
        element: <RestaurantProducts />,
      },

      {
        path: 'addProduct',
        element: <RestaurantAddProduct />,
      },

      {
        path: 'settings',
        element: <RestaurantProfileForm />,
      },
    ],
  },
]);
