import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { useOrder } from '../../hooks/useOrder';
import { useState } from 'react';

const Revenue = () => {
  const [selectedDays, setSelectedDays] = useState(7);
  const { dashRevenue } = useOrder(null, null, 5, '', null, selectedDays);
  return (
    <div className="mb-6 border border-gray-100 rounded-xl">
      <div className="sm:p-6 p-3  ">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl py-2 font-semibold text-orange-400">
            Revenue Overview
          </h3>
          <select
            className="px-4 py-2 border border-gray-200 rounded-lg w-full sm:w-auto text-sm sm:text-base"
            value={selectedDays}
            onChange={(e) => setSelectedDays(Number(e.target.value))}
          >
            <option value={7}>Last 7 days</option>
            <option value={15}>Last 15 days</option>
            <option value={30}>Last 30 days</option>
          </select>
        </div>
        <div className="h-[300px] w-full overflow-x-auto">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dashRevenue?.data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              {/* Line for Total Income */}
              <Line
                type="bumpX"
                dataKey="totalIncome"
                stroke="#ff6b00"
                strokeWidth={1}
                dot={{ stroke: '#ff6b00', strokeWidth: 2, fill: '#fff' }}
                name="Total Income"
              />
              {/* Line for Order Count */}
              <Line
                type="basis"
                dataKey="orderCount"
                stroke="#3366cc"
                strokeWidth={2}
                dot={{ stroke: '#3366cc', strokeWidth: 2, fill: '#fff' }}
                name="Order Count"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Revenue;
