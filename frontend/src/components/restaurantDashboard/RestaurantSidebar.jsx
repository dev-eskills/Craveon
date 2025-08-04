// import { NavLink } from 'react-router-dom';
// import { Restaurant_ROUTES } from '../../routes/route.config';

// function RestaurantSidebar({ className  , restaurantId}) {
//   return (
//     <nav
//       className={`space-y-2 shadow sticky top-20 pt-4 h-[calc(100vh-80px)] overflow-y-auto w-56 ${className}`}
//     >
//       {Restaurant_ROUTES.map((route) => (
//         <NavLink
//           to={route.path}
//           key={route.name}
//           end={route.path === '/restaurant'}
//           className={({ isActive, pathname }) =>
//             `flex items-center gap-2 px-4 py-2 w-full rounded-lg transition duration-200 ${
//               isActive || (route.path === '/' && pathname === '/restaurant')
//                 ? 'bg-[#FFF1E6] text-[#ff6900] font-semibold'
//                 : ''
//             }`
//           }
//         >
//           <route.icon className="w-5 h-5" />
//           {route.name}
//         </NavLink>
//       ))}
//     </nav>
//   );
// }

// export default RestaurantSidebar;


import { NavLink } from 'react-router-dom';
import { Restaurant_ROUTES } from '../../routes/route.config';
import { useAuthStore } from '../../stores/authStore';

function RestaurantSidebar({ className }) {
  const user = useAuthStore((state) => state.user);

  return (
    <nav
      className={`space-y-2 shadow sticky top-20 pt-4 h-[calc(100vh-80px)] overflow-y-auto w-56 ${className}`}
    >
      {Restaurant_ROUTES.map((route) => {
        const path = route.path.includes(':id')
          ? route.path.replace(':id', user?.id)
          : route.path;

        return (
          <NavLink
            to={path}
            key={route.name}
            end={route.path === '/restaurant'}
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 w-full rounded-lg transition duration-200 ${
                isActive ? 'bg-[#FFF1E6] text-[#ff6900] font-semibold' : ''
              }`
            }
          >
            <route.icon className="w-5 h-5" />
            {route.name}
          </NavLink>
        );
      })}
    </nav>
  );
}

export default RestaurantSidebar;
