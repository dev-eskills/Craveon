
 import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import useRestaurantDashboard from '../../hooks/useRestaurantDashboard';
 
 const RestaurantRevenue = () => {
      const { dashRevenue } = useRestaurantDashboard();
      const revenue = dashRevenue?.data 
   return (
     <div className="bg-white p-5 rounded-lg shadow">
              <h3 className="font-semibold text-lg mb-3">Revenue Overview</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={revenue}>
                  <XAxis dataKey="day" stroke="#888" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#888" tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="totalRevenue" stroke="#4F46E5" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
   )
 }
 
 export default RestaurantRevenue
 