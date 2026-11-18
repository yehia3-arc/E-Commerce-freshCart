import Image from "next/image";
import { notFound } from "next/navigation";
import { LuTags } from "react-icons/lu";

import ProductCard from "@/app/_components/ProductCard/ProductCard";
import PageHeader from "@/app/_components/PageHeader/PageHeader";
import { BrandType, ProductType } from "@/api/types/product.type";
import {
  getAllProducts,
  getSingleBrand,
} from "@/api/services/routemisr.service";
import Link from "next/link";
import { FaFilter, FaXmark } from "react-icons/fa6";
import { LuTag } from "react-icons/lu";

export default async function BrandPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const brand = await getSingleBrand(id);
  if (!brand) return notFound();
  const allProducts = (await getAllProducts()) ?? [];
  const products = allProducts.filter((p) => p.brand?._id === id);

  return (
    <>
      <PageHeader
        title={brand.name}
        subtitle={`Shop ${brand.name} products`}
        image={brand.image}
        gradient="from-violet-700 via-violet-600 to-purple-400"
      />
      <main className="bg-gray-50 py-10">
        <div className="container mx-auto px-4 pb-6">
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="flex items-center gap-1.5 text-gray-500">
              <FaFilter /> Active Filters:
            </span>
            <span className="flex items-center gap-1.5 rounded-full bg-violet-50 px-3 py-1.5 text-xs font-medium text-violet-600">
              <LuTag /> {brand.name}
              <Link href="/brands" aria-label="Remove brand filter">
                <FaXmark />
              </Link>
            </span>
            <Link
              href="/productdetails"
              className="text-gray-500 underline transition-colors hover:text-red-500"
            >
              Clear all
            </Link>
          </div>
          <p className="mt-3 text-sm text-gray-500">
            Showing {products.length} products
          </p>
        </div>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
            {products.length === 0 && (
              <p className="py-16 text-center text-gray-400">
                No products for this brand yet.
              </p>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
