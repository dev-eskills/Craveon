import { useState, useEffect } from 'react';
import { useAuthStore } from '../../stores/authStore';
import useRestaurants, { useBussinessHours } from '../../hooks/useRestaurants';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function BusinessHoursForm() {

  const user = useAuthStore((state) => state.user);
  // Default business hours as fallback
  const { updateBusinussHourFn, isUpdatingBusinessHour } = useRestaurants();
  const {businessHoursData} = useBussinessHours(user.id)
  console.log(businessHoursData, 'hour');
  const defaultBusinessHours = [
    { day: 0, open: '10:00', close: '22:00', isClosed: false, displayFormat: '10 AM - 10 PM' },
    { day: 1, open: '10:00', close: '22:00', isClosed: false, displayFormat: '10 AM - 10 PM' },
    { day: 2, open: '10:00', close: '22:00', isClosed: false, displayFormat: '10 AM - 10 PM' },
    { day: 3, open: '10:00', close: '22:00', isClosed: false, displayFormat: '10 AM - 10 PM' },
    { day: 4, open: '10:00', close: '22:00', isClosed: false, displayFormat: '10 AM - 10 PM' },
    {
      day: 5,
      open: '10:01',
      close: '23:00',
      isClosed: false,
      displayFormat: '10:01 AM - 11:00 PM',
    },
    { day: 6, open: '10:00', close: '23:00', isClosed: false, displayFormat: '10 AM - 11 PM' },
  ];

  const [businessHours, setBusinessHours] = useState(defaultBusinessHours);

  const [isLoading, setIsLoading] = useState(false);

  // Convert 12-hour format to 24-hour format for input fields
  const convertTo24HourFormat = (timeStr) => {
    if (!timeStr) return '';

    const trimmed = timeStr.trim().toUpperCase();

    const [time, modifier] = trimmed.split(' ');
    if (!time || !modifier) return ''; // Fail-safe check

    let [hours, minutes] = time.split(':');

    hours = parseInt(hours, 10);
    minutes = parseInt(minutes, 10);

    if (modifier === 'PM' && hours !== 12) {
      hours += 12;
    }
    if (modifier === 'AM' && hours === 12) {
      hours = 0;
    }

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  };
  

  // Fetch business hours data on component mount
  // useEffect(() => {
  //   if (businessHoursData && Array.isArray(businessHoursData.businessHours)) {
  //     const formattedHours = businessHoursData.businessHours.map((hour) => ({
  //       day: hour.day,
  //       open: hour.open ? convertTo24HourFormat(hour.open) : '10:00',
  //       close: hour.close ? convertTo24HourFormat(hour.close) : '22:00',
  //       isClosed: hour.isClosed || false,
  //       displayFormat:
  //         hour.displayFormat || (hour.isClosed ? 'Closed' : `${hour.open} - ${hour.close}`),
  //     }));

  //     setBusinessHours(formattedHours);
  //   }
  // }, [user, businessHoursData]);
  
  useEffect(() => {
    if (
      businessHoursData &&
      Array.isArray(businessHoursData.businessHours) &&
      businessHoursData.businessHours.length > 0
    ) {
      const formattedHours = businessHoursData.businessHours.map((hour) => ({
        day: hour.day,
        open: hour.open ? convertTo24HourFormat(hour.open) : '10:00',
        close: hour.close ? convertTo24HourFormat(hour.close) : '22:00',
        isClosed: hour.isClosed || false,
        displayFormat:
          hour.displayFormat || (hour.isClosed ? 'Closed' : `${hour.open} - ${hour.close}`),
      }));

      setBusinessHours(formattedHours);
    } else {
      // Agar data nahi hai to default data set kar do
      setBusinessHours(defaultBusinessHours);
    }
  }, [businessHoursData]);
  

  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const parsedHours = parseInt(hours);
    const ampm = parsedHours >= 12 ? 'PM' : 'AM';
    const formattedHours = parsedHours % 12 || 12;
    return `${formattedHours}:${minutes} ${ampm}`;
  };

  const handleTimeChange = (index, field, value) => {
    const newBusinessHours = [...businessHours];
    newBusinessHours[index] = {
      ...newBusinessHours[index],
      [field]: value,
      displayFormat: newBusinessHours[index].isClosed
        ? 'Closed'
        : field === 'open'
          ? `${formatTime(value)} - ${formatTime(newBusinessHours[index].close)}`
          : `${formatTime(newBusinessHours[index].open)} - ${formatTime(value)}`,
    };
    setBusinessHours(newBusinessHours);
  };

  const toggleClosed = (index) => {
    const newBusinessHours = [...businessHours];
    newBusinessHours[index] = {
      ...newBusinessHours[index],
      isClosed: !newBusinessHours[index].isClosed,
      displayFormat: !newBusinessHours[index].isClosed
        ? 'Closed'
        : `${formatTime(newBusinessHours[index].open)} - ${formatTime(newBusinessHours[index].close)}`,
    };
    setBusinessHours(newBusinessHours);
  };

  const validateBusinessHours = () => {
    for (const hour of businessHours) {
      if (!hour.isClosed) {
        if (!hour.open || !hour.close) {
          return false; // Open or close time is missing
        }
        if (hour.open >= hour.close) {
          return false; // Open time must be before close time
        }
      }
    }
    return true; // All checks passed
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateBusinessHours()) {
      alert('Invalid business hours format');
      return;
    }

    const formattedBusinessHours = businessHours.map(({ day, open, close, isClosed }) => ({
      day,
      open: isClosed ? null : formatTime(open), // Convert to 12-hour format
      close: isClosed ? null : formatTime(close), // Convert to 12-hour format
      isClosed,
      displayFormat: isClosed ? 'Closed' : `${formatTime(open)} - ${formatTime(close)}`,
    }));
    

    updateBusinussHourFn({ businessHours: formattedBusinessHours, id: user.id });
  };

  if (isLoading) {
    return (
      <div className="p-4 bg-white shadow-lg rounded-xl flex justify-center items-center h-64">
        <div className="text-gray-600">Loading business hours...</div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white shadow-lg rounded-xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Business Hours</h2>

        {businessHours.map((day, index) => (
          <div key={day.day} className="border rounded-lg p-4 flex items-center space-x-4">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">{DAYS[day.day]}</label>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={day.isClosed}
                    onChange={() => toggleClosed(index)}
                    className="form-checkbox h-4 w-4 text-[#ff6900]"
                  />
                  <span className="ml-2 text-sm text-gray-700">Closed</span>
                </label>
              </div>

              {!day.isClosed && (
                <div className="flex space-x-2">
                  <div className="relative flex-1">
                    <input
                      type="time"
                      value={day.open}
                      onChange={(e) => handleTimeChange(index, 'open', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-none focus:ring-2 focus:ring-[#ff6900]"
                    />
                  </div>
                  <div className="relative flex-1">
                    <input
                      type="time"
                      value={day.close}
                      onChange={(e) => handleTimeChange(index, 'close', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-none focus:ring-2 focus:ring-[#ff6900]"
                    />
                  </div>
                </div>
              )}

              {day.isClosed && (
                <div className="text-sm text-gray-500 italic">Closed for the day</div>
              )}
            </div>
          </div>
        ))}

        <div className="mt-6">
          <button
            type="submit"
            className="w-full px-4 py-2 bg-[#ff6900] text-white rounded-lg hover:bg-orange-600 
                       transition-colors disabled:cursor-not-allowed disabled:bg-orange-400 cursor-pointer"
            disabled={isUpdatingBusinessHour}
          >
            Save Business Hours
          </button>
        </div>
      </form>
    </div>
  );
}
