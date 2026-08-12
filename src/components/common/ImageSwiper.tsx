"use client";

import Image from "next/image";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function ImageSwiper({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  if (images.length === 0) return null;

  if (images.length === 1) {
    return (
      <div className="relative aspect-video w-full overflow-hidden rounded-3xl shadow-2xl shadow-ink/20">
        <Image
          src={images[0]}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, 1100px"
          className="object-cover"
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />
      </div>
    );
  }

  return (
    <div className="image-gallery relative aspect-video w-full overflow-hidden rounded-3xl shadow-2xl shadow-ink/20">
      <Swiper
        modules={[Autoplay, Navigation, Pagination]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 4500, disableOnInteraction: false }}
        loop
        className="h-full w-full"
      >
        {images.map((src, i) => (
          <SwiperSlide key={`${src}-${i}`}>
            <div className="relative aspect-video w-full">
              <Image
                src={src}
                alt={alt}
                fill
                sizes="(max-width: 768px) 100vw, 1100px"
                className="object-cover"
                priority={i === 0}
                unoptimized
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <style jsx global>{`
        .image-gallery .swiper-button-prev,
        .image-gallery .swiper-button-next {
          color: #ffffff;
          background: rgba(11, 43, 29, 0.45);
          width: 40px;
          height: 40px;
          border-radius: 9999px;
        }
        .image-gallery .swiper-button-prev::after,
        .image-gallery .swiper-button-next::after {
          font-size: 14px;
          font-weight: bold;
        }
        .image-gallery .swiper-button-disabled {
          opacity: 0.35;
        }
        .image-gallery .swiper-pagination-bullet {
          background: #ffffff;
          opacity: 0.5;
        }
        .image-gallery .swiper-pagination-bullet-active {
          opacity: 1;
          background: #ffffff;
        }
      `}</style>
    </div>
  );
}