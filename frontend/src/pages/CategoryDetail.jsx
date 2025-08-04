import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import ContentWrapper from '../components/ui/ContentWrapper';
import CategoryImage from '../components/categoryDetail/CategoryImage';
import CategoryCardSection from '../components/categoryDetail/CategoryCardSection';
import LocationCanvas from '../components/categoryDetail/LocationCanvas';
import useProduct from '../hooks/useProduct';
import CategoryRestroSkeleton from '../components/skeleton/CategoryRestroSkeleton';
import { Ban } from 'lucide-react';

export default function CategoryDetail() {
  const { id } = useParams();
  const { productsByCategory, productsCategoryLoading } = useProduct(id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.5 }}
    >
      <LocationCanvas />
      <ContentWrapper>
        {productsCategoryLoading ? (
          <CategoryRestroSkeleton /> // Smooth shimmer effect
        ) : !productsByCategory?.category ? (
          <motion.h1
            className="text-center text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            Category not found
          </motion.h1>
        ) : productsByCategory?.products.length === 0 ? (
          <motion.div
            className="flex flex-col items-center justify-center text-center text-gray-500 py-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <Ban className="w-12 h-12 text-red-400 mb-4" />
            <h1 className="text-xl font-semibold">No Products Found</h1>
            <p className="text-sm mt-2">Try adjusting your search or filters.</p>
          </motion.div>
        ) : (
          <>
            <CategoryImage category={productsByCategory?.category} />
            <CategoryCardSection products={productsByCategory?.products} />
          </>
        )}
      </ContentWrapper>
    </motion.div>
  );
}
