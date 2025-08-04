import { motion } from 'framer-motion';

const CategoryRestroSkeleton = () => {
  return (
    <motion.div
      className="flex flex-col items-center gap-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full h-40 bg-gray-200 rounded animate-pulse"></div>
      <div className="w-2/3 h-6 bg-gray-300 rounded animate-pulse"></div>
      <div className="w-full h-64 bg-gray-200 rounded animate-pulse"></div>
    </motion.div>
  );
};

export default CategoryRestroSkeleton;
