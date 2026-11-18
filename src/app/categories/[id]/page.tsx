import Link from "next/link";
import { notFound } from "next/navigation";
import { LuArrowLeft, LuArrowRight, LuFolderOpen } from "react-icons/lu";
import PageHeader from "@/app/_components/PageHeader/PageHeader";
import {
  getProductsByCategory,
  getAllSubCategory,
} from "@/api/services/routemisr.service";
import { CategoryType } from "@/api/types/product.type";
export default async function CategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const category = await getProductsByCategory(id);
  if (!category) return notFound();
  const subs = (await getAllSubCategory(id)) ?? [];

  return (
    <>
      <PageHeader
        title={category.name}
        subtitle="Choose a subcategory to browse products"
        image={category.image}
      />
      <main className="bg-gray-50 py-10">
        <div className="container mx-auto px-4">
          <Link
            href="/categories"
            className="mb-6 flex w-fit items-center gap-2 text-sm text-gray-600 hover:text-green-600"
          >
            <LuArrowLeft /> Back to Categories
          </Link>
          <h2 className="mb-6 text-lg font-bold text-gray-900">
            {subs.length} Subcategories in {category.name}
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {subs.map((s) => (
              <Link
                key={s._id}
                href={`/productdetails?subcategory=${s._id}`}
                className="group rounded-xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
                  <LuFolderOpen className="text-xl text-green-600" />
                </div>
                <h3 className="font-bold text-gray-900 transition-colors group-hover:text-green-600">
                  {s.name}
                </h3>
                <div className="mt-2 flex items-center gap-1 text-sm text-green-600 opacity-0 transition-opacity group-hover:opacity-100">
                  Browse Products <LuArrowRight className="text-xs" />
                </div>
              </Link>
            ))}
          </div>
          {subs.length === 0 && (
            <p className="py-16 text-center text-sm text-gray-400">
              No subcategories in this category.
            </p>
          )}
        </div>
      </main>
    </>
  );
}
