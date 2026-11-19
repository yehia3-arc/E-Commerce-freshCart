import { getAllCategory } from "@/api/services/routemisr.service";
import { CategoryType } from "@/api/types/product.type";
import { proxyImage } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaLongArrowAltRight } from "react-icons/fa";

export default async function HomeCategories() {
  const allCategories = await getAllCategory(); //[object]  ==> all categories

  return (
    <>
      <section className="container mx-auto px-4 py-10">
        <div>
          <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-8">
            <div className="flex  items-center gap-3 my-8">
              <div className="h-8 w-1.5 bg-linear-to-b from-emerald-500 to-emerald-700 rounded-full" />
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                Shop By <span className="text-emerald-600">Category</span>
              </h2>
            </div>
            <Link
              className="text-[#16A34A] self-end sm:self-auto hover:text-green-700 font-medium flex items-center cursor-pointer"
              href="categories"
            >
              View All Categories <FaLongArrowAltRight />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {allCategories?.map((category) => (
              <Link
                href={`/productdetails?category=${category.slug}`} // ✅ slug key from the API
                key={category._id}
                className="bg-white rounded-lg p-4 text-center shadow-sm hover:shadow-md transition group cursor-pointer "
              >
                <div className="h-20 w-20 overflow-hidden bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-primary-200 transition">
                  <Image
                    src={proxyImage(category.image)}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                    alt=""
                  />
                </div>
                <h3 className="font-medium">{category.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
