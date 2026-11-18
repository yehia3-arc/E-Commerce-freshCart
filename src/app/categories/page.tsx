import Image from "next/image";
import Link from "next/link";
import { LuArrowRight, LuLayers } from "react-icons/lu";

import PageHeader from "@/app/_components/PageHeader/PageHeader";
import { CategoryType } from "@/api/types/product.type";
import { getAllCategory } from "@/api/services/routemisr.service";

export default async function CategoriesPage() {
  const categories = (await getAllCategory()) ?? [];

  return (
    <>
      <PageHeader
        title="All Categories"
        subtitle="Browse our wide range of product categories"
        icon={LuLayers}
      />
      <main className="bg-gray-50 py-10">
        <div className="container mx-auto grid grid-cols-1 gap-6 px-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {categories.map((c) => (
            <Link
              key={c._id}
              href={`/categories/${c._id}`}
              className="group rounded-xl border border-gray-200 bg-white p-4 transition-all duration-300 hover:-translate-y-1 hover:border-green-200 hover:shadow-xl"
            >
              <div className="mb-4 aspect-square overflow-hidden rounded-xl bg-gray-50">
                <Image
                  src={c.image}
                  alt={c.name}
                  width={300}
                  height={300}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <h3 className="text-center font-bold text-gray-900 transition-colors group-hover:text-green-600">
                {c.name}
              </h3>
              <div className="mt-2 flex justify-center opacity-0 transition-opacity group-hover:opacity-100">
                <span className="flex items-center gap-1 text-xs text-green-600">
                  View Subcategories <LuArrowRight className="text-[10px]" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
