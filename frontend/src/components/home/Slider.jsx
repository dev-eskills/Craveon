import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useBanners } from '../../hooks/useBanners';

const Slider = () => {
  const [swiper, setSwiper] = useState(null);
  const [swiperInitialized, setSwiperInitialized] = useState(false);
  const { allBanners } = useBanners();

  useEffect(() => {
    if (swiper && allBanners && allBanners.length > 0) {
      const timer = setTimeout(() => {
        swiper.update();
        if (!swiperInitialized) {
          if (swiper.autoplay) {
            swiper.autoplay.start();
          }
          setSwiperInitialized(true);
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [swiper, allBanners, swiperInitialized]);

  const handlePrev = () => {
    if (swiper && swiper.initialized) {
      swiper.slidePrev();
    }
  };

  const handleNext = () => {
    if (swiper && swiper.initialized) {
      swiper.slideNext();
    }
  };

  return (
    <div className="w-full bg-white relative">
      <Swiper
        onSwiper={setSwiper}
        modules={[Pagination, Autoplay, Navigation]}
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        pagination={{ clickable: true }}
        autoplay={{ delay: 8000, disableOnInteraction: false }}
        className="w-full "
        observer={true}
        observeParents={true}
        watchOverflow={true}
        updateOnWindowResize={true}
        resizeObserver={true}
      >
        {allBanners && allBanners.length > 0 ? (
          allBanners.map((banner, index) => (
            <SwiperSlide
              key={banner._id || index}
              className="flex justify-center items-center w-full "
            >
              <img
                src={banner.imageUrl}
                alt={`Slide ${index + 1}`}
                className="h-36 w-full sm:h-[60vh] m-auto object-center object-cover"
                onLoad={() => swiper && swiper.update()}
              />
            </SwiperSlide>
          ))
        ) : (
          <SwiperSlide className="flex justify-center items-center w-full">
            <div
              className="w-full aspect-[16/9] sm:aspect-[16/7] md:aspect-[16/5] lg:aspect-[16/4] flex items-center justify-center"
              style={{
                background:
                  'radial-gradient(circle, rgba(179, 179, 179, 1) 0%, rgba(198, 198, 197, 1) 50%, rgba(229, 230, 226, 1) 100%)',
              }}
            >
              <video src="/burgerAnimation.mp4" muted autoPlay className="h-[100%] "></video>
            </div>
          </SwiperSlide>
        )}
      </Swiper>

      {/* Custom Navigation Buttons */}
      <button
        className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-white/70 hover:bg-white/90 text-black p-1 sm:p-2 rounded-full z-20 transition-all duration-200"
        onClick={handlePrev}
        type="button"
        aria-label="Previous slide"
      >
        <ChevronLeft size={20} className="sm:w-5 sm:h-5 w-4 h-4" />
      </button>
      <button
        className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-white/70 hover:bg-white/90 text-black p-1 sm:p-2 rounded-full z-20 transition-all duration-200"
        onClick={handleNext}
        type="button"
        aria-label="Next slide"
      >
        <ChevronRight size={20} className="sm:w-5 sm:h-5 w-4 h-4" />
      </button>

      <style>{`
        .swiper-pagination-bullet {
          background-color: black !important;
          opacity: 0.5;
        }
        .swiper-pagination-bullet-active {
          background-color: white !important;
          opacity: 1;
        }
        .swiper-pagination {
          bottom: 10px !important;
        }
      `}</style>
    </div>
  );
};

export default Slider;
