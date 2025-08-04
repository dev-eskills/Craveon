import { ChevronDown } from 'lucide-react';

function ShowMore({ onClick }) {
  return (
    <div
      onClick={onClick}
      className="w-full text-center my-10 flex justify-center cursor-pointer hover:bg-gray-50 py-4"
    >
      Show More <ChevronDown />
    </div>
  );
}

export default ShowMore;
