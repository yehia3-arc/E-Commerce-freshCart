"use client";

import React from "react";
import { ProductType } from "@/api/types/product.type";
import {
  FaRegHeart,
  FaHeart,
  FaSyncAlt,
  FaRegEye,
  FaStar,
  FaRegStar,
  FaPlus,
} from "react-icons/fa";
import { IoMdStarHalf } from "react-icons/io";
import Image from "next/image";
import { proxyImage } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import AddBtn from "../AddBtn/AddBtn";
// import { useWishlist } from "../WishlistProvider/WishlistProvider";
// import { WishlistContext } from "@/context/WishlistContext";
// import { useContext } from "react";
// import { addToWishlist, removeFromWishlist } from "@/actions/wishlist.actions";

import AddBtnWish from "../AddBtnWish/AddBtnWish";
export default function ProductCard({ product }: { product: ProductType }) {
  // const { hasWishlist, wishlistToggle } = useWishlist();
  // const { hasWishlist, setnumberOfWishlistItems, numberOfWishlistItems } =
  //   useContext(WishlistContext);

  // async function wishlistToggle(id: string) {
  //   const inList = hasWishlist(id);
  //   const res = inList ? await removeFromWishlist(id) : await addToWishlist(id);
  //   if (
  //     res?.status === "success" ||
  //     res?.message === "success" ||
  //     Array.isArray(res?.data?.wishlist)
  //   ) {
  //     setnumberOfWishlistItems(
  //       inList ? numberOfWishlistItems - 1 : numberOfWishlistItems + 1,
  //     );
  //     // Refetch to keep items in sync (the page will re-render)
  //     // or call a refresh function if you add one
  //   }
  // }
  const hasDiscount =
    !!product.priceAfterDiscount && product.priceAfterDiscount < product.price;
  const discountPercent = hasDiscount
    ? Math.round(
        ((product.price - (product.priceAfterDiscount as number)) /
          product.price) *
          100,
      )
    : 0;

  // Stops the wrapping <Link> in FeaturedProducts from navigating when a button is clicked
  const stop = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      {/* Image + badges (demo: div.relative) */}
      <div className="relative">
        <Image
          src={proxyImage(product.imageCover)}
          width={300}
          height={240}
          alt=""
          className="w-full h-60 object-contain bg-white"
        />

        {/* Discount badge (demo: absolute top-3 left-3) */}
        {hasDiscount && (
          <div className="absolute top-3 left-3">
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
              -{discountPercent}%
            </span>
          </div>
        )}

        {/* Action buttons (demo: absolute top-3 right-3 flex-col space-y-2) */}
        <div className="absolute top-3 right-3 flex flex-col space-y-2">
          <AddBtnWish product={product} />{" "}
          {/* ✅ was the 20-line Button + wishlistToggle */}
          <Button
            variant="ghost"
            type="button"
            title="Compare"
            onClick={stop}
            className="bg-white h-8 w-8 rounded-full flex items-center justify-center transition shadow-sm text-gray-600 hover:text-green-600"
          >
            <FaSyncAlt />
          </Button>
          <Button
            variant="ghost"
            type="button"
            title="Quick view"
            onClick={stop}
            className="bg-white h-8 w-8 rounded-full flex items-center justify-center transition shadow-sm text-gray-600 hover:text-green-600"
          >
            <FaRegEye />
          </Button>
        </div>
      </div>

      {/* Content (demo classes verbatim) */}
      <div className="p-4">
        <p className="text-xs text-gray-500 mb-1">{product.category?.name}</p>
        <h3 className="text-base font-medium text-gray-800 line-clamp-2 mb-2">
          {product.title}
        </h3>

        {/* Stars + count (demo: text-yellow-400 + text-gray-500) */}
        <div className="flex items-center gap-1 text-yellow-400 mb-3">
          {[1, 2, 3, 4, 5].map((star) => {
            if (product.ratingsAverage >= star) return <FaStar key={star} />;
            if (product.ratingsAverage >= star - 0.5)
              return <IoMdStarHalf key={star} />;
            return <FaRegStar key={star} />;
          })}
          <span className="text-gray-500 text-sm ml-1">
            {product.ratingsAverage} ({product.ratingsQuantity})
          </span>
        </div>

        {/* Price row + add-to-cart (demo: flex items-center justify-between) */}
        <div className="flex items-center justify-between">
          <div>
            {hasDiscount ? (
              <>
                <span className="text-lg font-bold text-green-600">
                  {product.priceAfterDiscount} EGP
                </span>
                <span className="text-sm text-gray-400 line-through ml-2">
                  {product.price} EGP
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-gray-800">
                {product.price} EGP
              </span>
            )}
          </div>
          <AddBtn
            classes="h-10 w-10 rounded-full flex items-center justify-center transition bg-green-600 text-white hover:bg-green-700"
            word="+"
            id={product.id}
            maxAllowed={Math.min(20, product.quantity)} // <-- ADD THIS
          />
        </div>
      </div>
    </div>
  );
}
