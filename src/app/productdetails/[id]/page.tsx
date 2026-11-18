import Link from "next/link";
import { notFound } from "next/navigation";
import { FaHouse, FaChevronRight } from "react-icons/fa6";
import {
  getAllProducts,
  getSingleProduct,
} from "@/api/services/routemisr.service";

import RelatedProducts from "@/app/_components/RelatedProducts/RelatedProducts";
import ProductTabs from "@/app/_components/ProductTabs/ProductTabs";
import ProductBuyBox from "@/app/_components/ProductBuyBox/ProductBuyBox";
import ProductGallery from "@/app/_components/ProductGallery/ProductGallery";

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getSingleProduct(id);
  if (!product) return notFound();

  const all = (await getAllProducts()) ?? [];
  const related = all
    .filter(
      (p) => p.category?._id === product.category?._id && p._id !== product._id,
    )
    .slice(0, 10);
  const sub = product.subcategory?.[0];

  return (
    <>
      {/* breadcrumb */}
      <nav aria-label="Breadcrumb" className="py-4">
        <div className="container mx-auto px-4">
          <ol className="flex items-center flex-wrap gap-1 text-sm">
            <li className="flex items-center">
              <Link
                href="/"
                className="text-gray-500 hover:text-green-600 transition flex items-center gap-1.5"
              >
                <FaHouse className="text-xs" /> Home
              </Link>
              <FaChevronRight className="text-gray-400 text-xs mx-2" />
            </li>
            <li className="flex items-center">
              <Link
                href={`/categories/${product.category?._id}`}
                className="text-gray-500 hover:text-green-600 transition"
              >
                {product.category?.name}
              </Link>
              <FaChevronRight className="text-gray-400 text-xs mx-2" />
            </li>
            {sub && (
              <li className="flex items-center">
                <Link
                  href={`/productdetails?subcategory=${sub._id}`}
                  className="text-gray-500 hover:text-green-600 transition"
                >
                  {sub.name}
                </Link>
                <FaChevronRight className="text-gray-400 text-xs mx-2" />
              </li>
            )}
            <li className="text-gray-900 font-medium truncate max-w-xs">
              {product.title}
            </li>
          </ol>
        </div>
      </nav>

      <section className="py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-1/4">
              <ProductGallery
                images={
                  product.images?.length ? product.images : [product.imageCover]
                }
                title={product.title}
              />
            </div>
            <div className="lg:w-3/4">
              <ProductBuyBox product={product} />
            </div>
          </div>
        </div>
      </section>

      <ProductTabs product={product} />
      <RelatedProducts products={related} />
    </>
  );
}
