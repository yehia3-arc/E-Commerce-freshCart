"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Link from "next/link";

export type SlideType = {
  image: string;
  title: string;
  subtitle: string;
  primaryBtn: string;
  secondaryBtn: string;
  primaryHref?: string;
  secondaryHref?: string;
  primaryText?: string;
};

export default function Slider({
  slides,
  heightClass = "h-[400px]",
}: {
  slides: SlideType[];
  heightClass?: string;
}) {
  return (
    <div className="relative">
      <Swiper
        modules={[Pagination, Navigation]}
        slidesPerView={1}
        spaceBetween={0}
        loop
        pagination={{ clickable: true }}
        navigation={{ prevEl: ".custom-prev", nextEl: ".custom-next" }}
        className="h-full w-full
          [&_.swiper-pagination-bullet]:h-3! [&_.swiper-pagination-bullet]:w-3! [&_.swiper-pagination-bullet]:rounded-full! [&_.swiper-pagination-bullet]:bg-white/50! [&_.swiper-pagination-bullet]:opacity-100! [&_.swiper-pagination-bullet]:transition-all [&_.swiper-pagination-bullet]:duration-300   [&_.swiper-pagination-bullet-active]:w-8! [&_.swiper-pagination-bullet-active]:rounded-[6px]! [&_.swiper-pagination-bullet-active]:bg-white! [&_.swiper-slide-active_h2]:opacity-100 [&_.swiper-slide-active_h2]:translate-y-0 [&_.swiper-slide-active_p]:opacity-100 [&_.swiper-slide-active_p]:translate-y-0 [&_.swiper-slide-active_.mt-4]:opacity-100 [&_.swiper-slide-active_.mt-4]:translate-y-0"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            {/* Background image div (demo: background-image + cover/center) */}
            <div
              className={`${heightClass} flex items-center justify-center bg-cover bg-center`}
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              {/* Green overlay (demo classes verbatim) */}
              <div className="py-20 text-white p-4 w-full h-full bg-linear-to-r from-green-500/90 to-green-400/50">
                {/* Container (demo: container h-full content-center) */}
                <div className="mx-auto w-full max-w-330 px-4 h-full flex flex-col justify-center">
                  <h2 className="text-white text-3xl font-bold mb-4 max-w-96 opacity-0 translate-y-6 transition-all duration-700">
                    {slide.title}
                  </h2>
                  <p className="opacity-0 translate-y-20 transition-all duration-700 delay-100">
                    {slide.subtitle}
                  </p>
                  <div className="mt-4 opacity-0 translate-y-6 transition-all duration-700 delay-200">
                    <Link
                      href={slide.primaryHref ?? "#"}
                      className={`bg-white border-2 border-white/50 ${slide.primaryText ?? "text-green-500"} inline-block px-6 py-2 rounded-lg font-semibold hover:scale-105 transition-transform`}
                    >
                      {slide.primaryBtn}
                    </Link>
                    <Link
                      href={slide.secondaryHref ?? "#"}
                      className="bg-transparent border-2 border-white/50 text-white ml-2 inline-block px-6 py-2 rounded-lg font-semibold hover:scale-105 transition-transform"
                    >
                      {slide.secondaryBtn}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom arrows (demo: custom-prev / custom-next, verbatim classes) */}
      <div className="custom-prev absolute left-4 top-1/2 -translate-y-1/2 z-10 cursor-pointer bg-white/90 hover:bg-white text-green-500 hover:text-green-600 rounded-full w-12 h-12 hidden md:flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110">
        <FaChevronLeft className="text-lg" />
      </div>
      <div className="custom-next absolute right-4 top-1/2 -translate-y-1/2 z-10 cursor-pointer bg-white/90 hover:bg-white text-green-500 hover:text-green-600 rounded-full w-12 h-12 hidden md:flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110">
        <FaChevronRight className="text-lg" />
      </div>
    </div>
  );
}
