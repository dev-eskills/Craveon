import p1 from '/p1.png';
import c1 from '/c1.png';
import c2 from '/c2.png';
import c3 from '/c3.png';
import c4 from '/c4.png';
import c5 from '/c5.png';

export const CartTempData = [
  {
    name: 'Margherita Pizza',
    description: 'Classic margherita pizza with fresh basil and mozzarella.',
    restaurant: '60d21b4667d0d8992e610c85',
    category: '60d21b5467d0d8992e610c86',
    price: 299,
    discountedPrice: 249,
    isVeg: true,
    isAvailable: true,
    preparationTime: 20,
    image: 'https://example.com/margherita.jpg',
    attributes: [
      {
        name: 'Size',
        options: [
          { name: 'Small', price: 0 },
          { name: 'Medium', price: 50 },
          { name: 'Large', price: 100 },
        ],
      },
    ],
    addons: [
      { name: 'Extra Cheese', price: 50, isVeg: true },
      { name: 'Olives', price: 30, isVeg: true },
    ],
    tags: ['pizza', 'cheese', 'veg'],
    ratings: { average: 4.5, count: 120 },
    featured: true,
    taxRate: 5,
    packagingCharge: 10,
  },
  {
    name: 'Chicken Burger',
    description: 'Juicy grilled chicken patty with lettuce and mayo.',
    restaurant: '60d21b4667d0d8992e610c85',
    category: '60d21b5467d0d8992e610c87',
    price: 199,
    discountedPrice: 179,
    isVeg: false,
    isAvailable: true,
    preparationTime: 15,
    image: 'https://example.com/chicken-burger.jpg',
    attributes: [
      {
        name: 'Size',
        options: [
          { name: 'Regular', price: 0 },
          { name: 'Double Patty', price: 70 },
        ],
      },
    ],
    addons: [
      { name: 'Extra Cheese', price: 40, isVeg: true },
      { name: 'Bacon', price: 50, isVeg: false },
    ],
    tags: ['burger', 'chicken'],
    ratings: { average: 4.2, count: 90 },
    featured: false,
    taxRate: 5,
    packagingCharge: 5,
  },
];

export const TEMP_PRODUCTS = [
  {
    name: 'Deluxe Pizza',
    price: 15.99,
    imageSrc: p1,
    restaurantName: 'Pizza Palace',
  },
  {
    name: 'Pepperoni Pizza',
    price: 12.99,
    imageSrc: p1,
    restaurantName: 'Pizza Palace',
  },
  {
    name: 'Margarita Pizza',
    price: 10.99,
    imageSrc: p1,
    restaurantName: 'Pizza Palace',
  },
  {
    name: 'Veggie Pizza',
    price: 14.99,
    imageSrc: p1,
    restaurantName: 'Pizza Palace',
  },
  {
    name: 'BBQ Chicken Pizza',
    price: 16.99,
    imageSrc: p1,
    restaurantName: 'Pizza Palace',
  },
  {
    name: 'Hawaiian Pizza',
    price: 13.99,
    imageSrc: p1,
    restaurantName: 'Pizza Palace',
  },
  {
    name: 'Meat Lovers Pizza',
    price: 17.99,
    imageSrc: p1,
    restaurantName: 'Pizza Palace',
  },
  {
    name: 'Supreme Pizza',
    price: 18.99,
    imageSrc: p1,
    restaurantName: 'Pizza Palace',
  },
];

export const restaurants = [
  {
    id: 1,
    name: 'La Bella Italia',
    address: 'Madhumilan Square, Opp. Dawa Bazar, Indore, Madhya Pradesh 452001',
    hours: '1:00 PM - 7:00 PM',
    isVeg: true,
    imageSrc:
      'https://images.unsplash.com/photo-1514933651103-005eec06c04b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1074&q=80',
    isOpen: true,
  },
  {
    id: 2,
    name: 'Spice Garden',
    address: '56 MG Road, Near City Center, Bhopal, Madhya Pradesh 462001',
    hours: '12:00 PM - 10:00 PM',
    isVeg: true,
    imageSrc:
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1170&q=80',
    isOpen: true,
  },
  {
    id: 3,
    name: 'Golden Dragon',
    address: 'Plot 23, AB Road, Vijay Nagar, Indore, Madhya Pradesh 452010',
    hours: '11:30 AM - 11:00 PM',
    isVeg: true,

    imageSrc:
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1170&q=80',
    isOpen: false,
  },
  {
    id: 4,
    name: 'Café Parisienne',
    address: 'Shop 12, New Palasia, Indore, Madhya Pradesh 452001',
    hours: '8:00 AM - 8:00 PM',
    isVeg: true,

    imageSrc:
      'https://images.unsplash.com/photo-1521017432531-fbd92d768814?ixlib=rb-1.2.1&auto=format&fit=crop&w=1170&q=80',
    isOpen: true,
  },
  {
    id: 5,
    name: 'Tandoor House',
    address: '45 Sapna Sangeeta Road, Indore, Madhya Pradesh 452001',
    hours: '11:00 AM - 10:30 PM',
    isVeg: true,

    imageSrc:
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1074&q=80',
    isOpen: true,
  },
  {
    id: 6,
    name: 'Ocean Blue',
    address: '7th Floor, C21 Mall, AB Road, Indore, Madhya Pradesh 452010',
    hours: '12:30 PM - 11:00 PM',
    isVeg: true,

    imageSrc:
      'https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=1170&q=80',
    isOpen: false,
  },
  {
    id: 1,
    name: 'La Bella Italia',
    address: 'Madhumilan Square, Opp. Dawa Bazar, Indore, Madhya Pradesh 452001',
    hours: '1:00 PM - 7:00 PM',
    isVeg: true,

    imageSrc:
      'https://images.unsplash.com/photo-1514933651103-005eec06c04b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1074&q=80',
    isOpen: true,
  },
  {
    id: 2,
    name: 'Spice Garden',
    address: '56 MG Road, Near City Center, Bhopal, Madhya Pradesh 462001',
    hours: '12:00 PM - 10:00 PM',
    isVeg: false,

    imageSrc:
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1170&q=80',
    isOpen: true,
  },
];

export const foodItems = [
  {
    id: 1,
    title: 'Queen Margherita Pizza',
    price: '199',
    restaurant: 'Olio - The Wood Fired Pizzeria',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Pizza-3007395.jpg/640px-Pizza-3007395.jpg',
  },
  {
    id: 2,
    title: 'Queen Margherita Pizza',
    price: '199',
    restaurant: 'Olio - The Wood Fired Pizzeria',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Pizza-3007395.jpg/640px-Pizza-3007395.jpg',
  },
  {
    id: 3,
    title: 'Queen Margherita Pizza',
    price: '199',
    restaurant: 'Olio - The Wood Fired Pizzeria',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Pizza-3007395.jpg/640px-Pizza-3007395.jpg',
  },
  {
    id: 4,
    title: 'Queen Margherita Pizza',
    price: '199',
    restaurant: 'Olio - The Wood Fired Pizzeria',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Pizza-3007395.jpg/640px-Pizza-3007395.jpg',
  },
];

export const addressFormData = [
  {
    label: 'Flat/House No/Building Name',
    name: 'addressLine1',
    type: 'text',
    placeholder: 'Enter Flat/House No or Building Name',
  },
  {
    label: 'Nearby Landmark',
    name: 'addressLine2',
    type: 'text',
    placeholder: 'Enter a Nearby Landmark',
  },
  { label: 'City', name: 'city', type: 'text', placeholder: 'Enter city' },
  { label: 'State', name: 'state', type: 'text', placeholder: 'Enter state' },
  { label: 'Zip Code', name: 'zipCode', type: 'text', placeholder: 'Enter zip code' },
  { label: 'Country', name: 'country', type: 'text', placeholder: 'Enter country' },
];

export const riders = [
  {
    id: '#S512345',
    name: 'John Smith',
    status: 'Online',
    vehicle: 'Motorcycle',
    deliveries: 1234,
    rating: 4.8,
  },
  {
    id: '#S512346',
    name: 'Sarah Johnson',
    status: 'On Delivery',
    vehicle: 'Scooter',
    deliveries: 956,
    rating: 4.9,
  },
  {
    id: '#S512347',
    name: 'Michael Chen',
    status: 'Offline',
    vehicle: 'Bicycle',
    deliveries: 789,
    rating: 4.7,
  },
  {
    id: '#S512347',
    name: 'Michael Chen',
    status: 'Offline',
    vehicle: 'Bicycle',
    deliveries: 789,
    rating: 4.7,
  },
  {
    id: '#S512347',
    name: 'Michael Chen',
    status: 'Offline',
    vehicle: 'Bicycle',
    deliveries: 789,
    rating: 4.7,
  },
  {
    id: '#S512347',
    name: 'Michael Chen',
    status: 'Offline',
    vehicle: 'Bicycle',
    deliveries: 789,
    rating: 4.7,
  },
  {
    id: '#S512347',
    name: 'Michael Chen',
    status: 'Offline',
    vehicle: 'Bicycle',
    deliveries: 789,
    rating: 4.7,
  },
  {
    id: '#S512347',
    name: 'Michael Chen',
    status: 'Offline',
    vehicle: 'Bicycle',
    deliveries: 789,
    rating: 4.7,
  },
  {
    id: '#S512347',
    name: 'Michael Chen',
    status: 'Offline',
    vehicle: 'Bicycle',
    deliveries: 789,
    rating: 4.7,
  },
  {
    id: '#S512347',
    name: 'Michael Chen',
    status: 'Offline',
    vehicle: 'Bicycle',
    deliveries: 789,
    rating: 4.7,
  },
  {
    id: '#S512347',
    name: 'Michael Chen',
    status: 'Offline',
    vehicle: 'Bicycle',
    deliveries: 789,
    rating: 4.7,
  },
];

export const products = [
  {
    id: 1,
    name: 'Chicken Biryani',
    category: 'Main Course',
    price: 250,
    stock: 'Available',
    image: c1,
  },
  {
    id: 2,
    name: 'Paneer Butter Masala',
    category: 'Main Course',
    price: 180,
    stock: 'Available',
    image: c2,
  },
  {
    id: 3,
    name: 'Veg Fried Rice',
    category: 'Rice',
    price: 150,
    stock: 'Available',
    image: c3,
  },
  {
    id: 4,
    name: 'Butter Naan',
    category: 'Breads',
    price: 40,
    stock: 'Available',
    image: c4,
  },
  {
    id: 5,
    name: 'Chicken Curry',
    category: 'Main Course',
    price: 220,
    stock: 'Available',
    image: c5,
  },
];
