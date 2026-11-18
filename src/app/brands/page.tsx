import Image from "next/image";
import Link from "next/link";
import { LuArrowRight, LuTags } from "react-icons/lu";

import PageHeader from "@/app/_components/PageHeader/PageHeader";
import { BrandType } from "./../../api/types/product.type";
import { getAllBrands } from "@/api/services/routemisr.service";

export default async function BrandsPage() {
  const brands = (await getAllBrands()) ?? [];
  return (
    <>
      <PageHeader
        title="Top Brands"
        subtitle="Shop from your favorite brands"
        icon={LuTags}
        gradient="from-violet-700 via-violet-600 to-purple-400"
      />
      <main className="bg-gray-50 py-10">
        <div className="container mx-auto grid grid-cols-2 gap-4 px-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {brands.map((b) => (
            <Link
              key={b._id}
              href={`/brands/${b._id}`}
              className="group rounded-xl border border-gray-200 bg-white p-3 transition-all duration-300 hover:-translate-y-1 hover:border-violet-200 hover:shadow-xl"
            >
              <div className="mb-3 flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-gray-50 p-4">
                <Image
                  src={b.image}
                  alt={b.name}
                  width={200}
                  height={200}
                  className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <h3 className="truncate text-center text-sm font-semibold text-gray-900 transition-colors group-hover:text-violet-600">
                {b.name}
              </h3>
              <div className="mt-1.5 flex justify-center opacity-0 transition-opacity group-hover:opacity-100">
                <span className="flex items-center gap-1 text-xs text-violet-600">
                  View Products <LuArrowRight className="text-[10px]" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
