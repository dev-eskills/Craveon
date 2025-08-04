import { NavLink } from 'react-router-dom';
import { ADMIN_ROUTES } from '../../routes/route.config';

function AdminSidebar({ className }) {
  return (
    <nav
      className={`space-y-2 shadow pt-2 fixed top-20 left-0 h-[calc(100vh-5rem)] overflow-y-auto w-56 ${className} transition ease-in-out`}
    >
      {ADMIN_ROUTES.map((route) => (
        <NavLink
          to={route.path}
          key={route.name}
          end={route.path === '/admin'}
          className={({ isActive }) =>
            `flex items-center gap-2 px-4 h-10 w-full rounded-lg transition duration-300 ease-in-out ${
              isActive ? 'bg-[#FFF1E6] text-[#ff6900] font-semibold' : ''
            }`
          }
        >
          <route.icon className="w-5 h-5" />
          {route.name}
        </NavLink>
      ))}
    </nav>
  );
}

export default AdminSidebar;
