// import AdminOrders from './AdminOrders';
import Cards from './Cards';
import Revenue from './Revenue';

function AdminDashboard() {


  return (
    <div className="p-6 w-full mx-auto">
      {/* card sec */}
      <Cards />
      {/* revenue sec */}
      <Revenue />


    </div>
  );
}

export default AdminDashboard;
