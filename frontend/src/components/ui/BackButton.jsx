import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BackButton = ({text}) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(-1);
  };

  return (
    <h2
      className="text-xl font-semibold mb-4 flex items-center gap-1 cursor-pointer"
      onClick={handleNavigate}
    >
      <ArrowLeft />
      
     {text}
    </h2>
  );
};

export default BackButton;
