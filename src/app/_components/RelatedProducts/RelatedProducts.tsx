"use client";
import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { ProductType } from "@/api/types/product.type";
import ProductCard from "../ProductCard/ProductCard";

export default function RelatedProducts({
  products,
}: {
  products: ProductType[];
}) {
  const swiperRef = useRef<SwiperType | null>(null);
  if (!products.length) return null;
  return (
    <section className="py-10">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="h-8 w-1.5 bg-linear-to-b from-emerald-500 to-emerald-700 rounded-full" />
            <h2 className="text-2xl font-bold text-gray-800">
              You May Also <span className="text-emerald-600">Like</span>
            </h2>
          </div>
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => swiperRef.current?.slidePrev()}
              className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-green-100 hover:text-green-600 transition"
            >
              <FaChevronLeft />
              <span className="sr-only">Previous</span>
            </button>
            <button
              type="button"
              onClick={() => swiperRef.current?.slideNext()}
              className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-green-100 hover:text-green-600 transition"
            >
              <FaChevronRight />
              <span className="sr-only">Next</span>
            </button>
          </div>
        </div>
        <Swiper
          onSwiper={(s) => (swiperRef.current = s)}
          spaceBetween={16}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
          }}
        >
          {products.map((p) => (
            <SwiperSlide key={p._id}>
              <ProductCard product={p} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
