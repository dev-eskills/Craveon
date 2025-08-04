import { LoaderCircle } from 'lucide-react';

function Spinner({ className }) {
  return <LoaderCircle className={`animate-spin ${className}`} />;
}

export default Spinner;
