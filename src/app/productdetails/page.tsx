import Link from "next/link"; // ✅ next/link, NOT lucide-react
import ProductCard from "../_components/ProductCard/ProductCard";
import PageHeader from "../_components/PageHeader/PageHeader";
import { FaBoxOpen, FaXmark } from "react-icons/fa6";
import {
  getAllProducts,
  getSpecificSubCategory,
} from "@/api/services/routemisr.service";
import { LuFolderOpen } from "react-icons/lu";
import { FaFilter } from "react-icons/fa";

export default async function Productdetails(props: {
  searchParams: Promise<{ category?: string; subcategory?: string }>;
}) {
  const searchParams = await props.searchParams;
  const allProducts = (await getAllProducts()) ?? [];
  // ✅ 1. Fetch subcategory details if param exists (uses exact Postman URL: /subcategories/${id})
  const subId = searchParams.subcategory;
  const sub = subId ? await getSpecificSubCategory(subId) : undefined;

  // ✅ 2. Filter logic (Subcategory wins over Category)
  let list = allProducts;
  let activeFilterName = "All Products";

  if (sub) {
    list = allProducts.filter((p) =>
      (p.subcategory ?? []).some((s) => s._id === subId),
    );
    activeFilterName = sub.name;
  } else if (searchParams.category) {
    list = allProducts.filter(
      (p) =>
        p.category?.slug === searchParams.category ||
        p.category?.name?.toLowerCase().replace(/\s+/g, "-") ===
          searchParams.category,
    );
    activeFilterName = list[0]?.category?.name || "Category";
  }

  // Filter when Navbar sends /productdetails?category=slug
  // const filtered = searchParams.category
  //   ? allProducts.filter(
  //       (p) =>
  //         p.category?.slug === searchParams.category ||
  //         p.category?.name?.toLowerCase().replace(/\s+/g, "-") ===
  //           searchParams.category,
  //     )
  //   : allProducts;
  // const list = filtered.length ? filtered : allProducts;

  return (
    <>
      <PageHeader
        title={activeFilterName}
        subtitle="Explore our complete product collection"
        icon={sub ? LuFolderOpen : FaBoxOpen}
      />
      <section className="container mx-auto px-4 py-10">
        {/* ✅ 4. Active Filter Chip (Video Parity) */}
        {(sub || searchParams.category) && (
          <div className="mb-6 flex flex-wrap items-center gap-3 text-sm">
            <span className="flex items-center gap-1.5 text-gray-500">
              <FaFilter /> Active Filters:
            </span>
            <span className="flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700">
              {sub ? <LuFolderOpen /> : <FaBoxOpen />} {activeFilterName}
              <Link href="/productdetails" aria-label="Remove filter">
                <FaXmark />
              </Link>
            </span>
            <Link
              href="/productdetails"
              className="text-gray-500 underline hover:text-red-500"
            >
              Clear all
            </Link>
          </div>
        )}

        <div className="mb-6 text-sm text-gray-500">
          Showing {list.length} products
        </div>

        {/* ✅ 5. Empty State */}
        {list.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              No Products Found
            </h3>
            <p className="text-gray-500 mb-6">
              No products match your current filters.
            </p>
            <Link
              href="/productdetails"
              className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700"
            >
              View All Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {list.map((product) => (
              <Link
                key={product.id}
                href={`/productdetails/${product.id}`}
                className="block"
              >
                <ProductCard product={product} />
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
