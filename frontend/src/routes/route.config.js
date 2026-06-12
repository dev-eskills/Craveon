import {
  Bike,
  BookX,
  Database,
  Gauge,
  MessageSquareWarning,
  Plus,
  Settings,
  ShoppingBag,
  ShoppingBasket,
  Store,
  Tags,
  User,
  UserRoundPlus,
  Users,
} from 'lucide-react';

export const ADMIN_ROUTES = [
  {
    path: '/admin',
    name: 'Dashboard',
    icon: Gauge,
  },
  {
    path: '/admin/orders',
    name: 'Orders',
    icon: ShoppingBag,
  },
  {
    path: '/admin/restaurants',
    name: 'Restaurants',
    icon: Store,
  },
  {
    path: '/admin/customers',
    name: 'Customers',
    icon: Users,
  },
  {
    path: '/admin/riders',
    name: 'Riders',
    icon: Bike,
  },
  {
    path: '/admin/settings',
    name: 'Settings',
    icon: Settings,
  },
  {
    path: '/admin/banner',
    name: 'Banner',
    icon: BookX,
  },
  {
    path: '/admin/category',
    name: 'Category',
    icon: Tags,
  },
  {
    path: '/admin/add-restaurant',
    name: 'Add Restaurant',
    icon: UserRoundPlus,
  },
  {
    path: '/admin/logs',
    name: 'Logs',
    icon: Database,
  },
];

export const Restaurant_ROUTES = [
  {
    path: '/restaurant',
    name: 'Dashboard',
    icon: Gauge,
  },
  {
    path: '/restaurant/:id',
    name: 'Profile',
    icon: User,
  },
  {
    path: '/restaurant/orders',
    name: 'Orders',
    icon: ShoppingBag,
  },

  {
    path: '/restaurant/report',
    name: 'Report',
    icon: MessageSquareWarning,
  },

  {
    path: '/restaurant/products',
    name: 'Products',
    icon: ShoppingBasket,
  },

  {
    path: '/restaurant/addProduct',
    name: 'Add Product',
    icon: Plus,
  },
  {
    path: '/restaurant/settings',
    name: 'Settings',
    icon: Settings,
  },
];
