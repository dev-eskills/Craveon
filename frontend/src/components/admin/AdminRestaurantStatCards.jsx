import { Percent, ShieldCheck, ShoppingBasket } from 'lucide-react';
import { StatCard } from '../ui/StatCard';

const AdminRestaurantStatCards = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6 mt-5">
      <StatCard
        icon={<ShoppingBasket className="w-6 h-6 text-blue-500" />}
        title="Total Products"
        value="100+"
      />
      <StatCard
        icon={<Percent className="w-6 h-6 text-yellow-500" />}
        title="Total Sale"
        value="100+"
      />
      <StatCard
        icon={<ShieldCheck className="w-6 h-6 text-yellow-400" />}
        title="Total Revenue"
        value="120000$"
      />
    </div>
  );
};

export default AdminRestaurantStatCards;
