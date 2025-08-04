import React, { Suspense } from 'react';
const AdminBannersPageList = React.lazy(() => import('../components/admin/AdminBannersPageList'));
import { useBanners } from '../hooks/useBanners';
import ImageUploader from '../components/admin/ImageUploader';
import ImageSkeleton from '../components/skeleton/ImageSkeleton';

const AdminBannerPage = () => {
  const { addBannerFn, allBanners, removeBannerFn, isAddBannerPending } = useBanners();

  return (
    <section className="flex flex-col items-center p-6 w-full  mx-auto  shadow">
      <ImageUploader onUpload={addBannerFn} isUploading={isAddBannerPending} />
      <h3 className="text-lg font-medium text-gray-700  border-b border-gray-300 pb-2 w-full my-10">
        Current Banners
      </h3>
      <Suspense fallback={<ImageSkeleton />}>
        <AdminBannersPageList allBanners={allBanners} handleDeleteBanner={removeBannerFn} />
      </Suspense>
    </section>
  );
};

export default AdminBannerPage;
