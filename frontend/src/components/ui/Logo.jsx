import { Suspense, useMemo } from 'react';
import { Link } from 'react-router-dom';
import LogoSkeleton from '../skeleton/LogoSkeleton';
const Logo = ({ className }) => {
  const NavLogo = useMemo(() => '/NavLogo.jpeg', []);
  return (
    <Suspense fallback={<LogoSkeleton />}>
      <Link to={'/user'} className={`p-2 ${className}`}>
        <img src={NavLogo} alt="Logo" className="w-22 md:w-28 drop-shadow-lg " />
      </Link>
    </Suspense>
  );
};

export default Logo;
