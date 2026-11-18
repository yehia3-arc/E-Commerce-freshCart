import Link from "next/link";
import { LuArrowRight } from "react-icons/lu";

export default function DealBanners() {
  return (
    <section className="py-10">
      <div className="container mx-auto grid gap-6 px-4 md:grid-cols-2">
        <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-emerald-500 to-emerald-700 p-8 text-white">
          <div className="absolute right-0 top-0 h-40 w-40 -translate-y-1/2 translate-x-1/2 rounded-full bg-white/10" />
          <div className="absolute bottom-0 left-0 h-32 w-32 -translate-x-1/2 translate-y-1/2 rounded-full bg-white/10" />
          <div className="relative z-10">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-sm">
              🔥 Deal of the Day
            </span>
            <h3 className="mb-2 text-2xl font-bold md:text-3xl">
              Fresh Organic Fruits
            </h3>
            <p className="mb-4 text-white/80">
              Get up to 40% off on selected organic fruits this week.
            </p>
            <div className="mb-6 flex items-center gap-4">
              <span className="text-3xl font-bold">40% OFF</span>
              <span className="text-sm text-white/70">
                Use code:{" "}
                <span className="font-bold text-white">ORGANIC40</span>
              </span>
            </div>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-emerald-600 hover:bg-gray-100"
            >
              Shop Now <LuArrowRight />
            </Link>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-orange-400 to-rose-500 p-8 text-white">
          <div className="absolute right-0 top-0 h-40 w-40 -translate-y-1/2 translate-x-1/2 rounded-full bg-white/10" />
          <div className="absolute bottom-0 left-0 h-32 w-32 -translate-x-1/2 translate-y-1/2 rounded-full bg-white/10" />
          <div className="relative z-10">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-sm">
              ✨ New Arrivals
            </span>
            <h3 className="mb-2 text-2xl font-bold md:text-3xl">
              Exotic Vegetables
            </h3>
            <p className="mb-4 text-white/80">
              Discover our latest collection of premium vegetables.
            </p>
            <div className="mb-6 flex items-center gap-4">
              <span className="text-3xl font-bold">25% OFF</span>
              <span className="text-sm text-white/70">
                Use code: <span className="font-bold text-white">FRESH25</span>
              </span>
            </div>
            <Link
              href="/shop?sort=newest"
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-orange-500 hover:bg-gray-100"
            >
              Explore Now <LuArrowRight />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
