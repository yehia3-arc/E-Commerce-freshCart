"use client";
import { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { toast } from "@/components/ui/toast";
import { ImSpinner10 } from "react-icons/im";
import {
  FaStar,
  FaRegStar,
  FaMinus,
  FaPlus,
  FaCartShopping,
  FaBolt,
  FaHeart,
  FaRegHeart,
  FaShareNodes,
  FaTruckFast,
  FaRotateLeft,
  FaShieldHalved,
} from "react-icons/fa6";
import { IoMdStarHalf } from "react-icons/io";
import { ProductType } from "@/api/types/product.type";

import { addToWishlist, removeFromWishlist } from "@/actions/wishlist.actions";
import { addToGuestCart } from "@/lib/guestCart";
import { CartContext } from "@/context/CartContext";
import { WishlistContext } from "@/context/WishlistContext";
import { addToCart, getLoggedUserCart } from "@/actions/cart.actions";
export default function ProductBuyBox({ product }: { product: ProductType }) {
  const router = useRouter();
  const { status } = useSession();
  const { numberOfCartItems, setnumberOfCartItems } = useContext(CartContext);
  const { hasWishlist, addWishlistItem, removeWishlistItem } =
    useContext(WishlistContext);
  const [qty, setQty] = useState(1);
  const [busy, setBusy] = useState(false);

  const unit = product.priceAfterDiscount ?? product.price;
  const max = product.quantity;
  const inList = hasWishlist(product._id);

  async function addQty(thenCart = false) {
    setBusy(true);
    if (status !== "authenticated") {
      for (let i = 0; i < qty; i++) addToGuestCart(product._id);
      setnumberOfCartItems(numberOfCartItems + qty);
      toast.add({
        type: "success",
        description: "added to cart 😉 (login to checkout)",
      });
    } else {
      let ok = true;
      for (let i = 0; i < qty; i++) {
        const r = await addToCart(product._id);
        if (r?.status !== "success") {
          ok = false;
          break;
        }
      }
      if (ok) {
        setnumberOfCartItems(numberOfCartItems + qty);
        toast.add({
          type: "success",
          description: "added to cart successfully 😉",
        });
      } else
        toast.add({ type: "error", description: "failed to add to cart 😥" });
    }
    setBusy(false);
    if (thenCart) {
      if (status !== "authenticated") {
        router.push("/login?redirect=/cart"); // checkout is protected → login first
        return;
      }
      const cartRes = await getLoggedUserCart();
      router.push(cartRes?.cartId ? `/checkout/${cartRes.cartId}` : "/cart");
    }
  }

  async function toggleWish() {
    if (status !== "authenticated") {
      toast.add({
        type: "error",
        description: "please login to save favorites 😐",
      });
      return;
    }
    const res = inList
      ? await removeFromWishlist(product._id)
      : await addToWishlist(product._id);
    if (res?.status === "success" || res?.message === "success") {
      inList ? removeWishlistItem(product._id) : addWishlistItem(product);
      toast.add({
        type: "success",
        description: inList
          ? "removed from wishlist 💔"
          : "added to wishlist ❤️",
      });
    } else
      toast.add({ type: "error", description: res?.message || "failed 😥" });
  }

  async function share() {
    await navigator.clipboard.writeText(window.location.href);
    toast.add({ type: "success", description: "product link copied 🔗" });
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex flex-wrap gap-2 mb-4">
        <Link
          href={`/categories/${product.category?._id}`}
          className="bg-green-50 text-green-700 text-xs px-3 py-1.5 rounded-full hover:bg-green-100 transition"
        >
          {product.category?.name}
        </Link>
        <span className="bg-gray-100 text-gray-700 text-xs px-3 py-1.5 rounded-full">
          {product.brand?.name}
        </span>
      </div>
      <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
        {product.title}
      </h1>
      <div className="flex items-center gap-3 mb-4">
        <div className="text-yellow-400 flex">
          {[1, 2, 3, 4, 5].map((s) =>
            product.ratingsAverage >= s ? (
              <FaStar key={s} />
            ) : product.ratingsAverage >= s - 0.5 ? (
              <IoMdStarHalf key={s} />
            ) : (
              <FaRegStar key={s} />
            ),
          )}
        </div>
        <span className="text-sm text-gray-600">
          {product.ratingsAverage} ({product.ratingsQuantity} reviews)
        </span>
      </div>
      <div className="flex items-center flex-wrap gap-3 mb-6">
        <span className="text-3xl font-bold text-gray-900">{unit} EGP</span>
        {product.priceAfterDiscount && (
          <span className="text-lg text-gray-400 line-through">
            {product.price} EGP
          </span>
        )}
      </div>
      <div className="flex items-center gap-2 mb-6">
        {product.quantity > 0 ? (
          <span className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full bg-green-50 text-green-700">
            <span className="w-2 h-2 rounded-full bg-green-500" /> In Stock
          </span>
        ) : (
          <span className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full bg-red-50 text-red-600">
            <span className="w-2 h-2 rounded-full bg-red-500" /> Out of Stock
          </span>
        )}
      </div>
      <div className="border-t border-gray-100 pt-5 mb-6">
        <p className="text-gray-600 leading-relaxed whitespace-pre-line">
          {product.description}
        </p>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Quantity
        </label>
        <div className="flex items-center gap-4">
          <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden">
            <button
              type="button"
              disabled={qty <= 1}
              onClick={() => setQty(qty - 1)}
              className="px-4 py-3 text-gray-600 hover:bg-gray-100 hover:text-green-600 transition disabled:opacity-50"
            >
              <FaMinus />
            </button>
            <input
              type="number"
              min={1}
              max={max}
              value={qty}
              readOnly
              className="w-16 text-center border-0 focus:ring-0 focus:outline-none text-lg font-medium"
            />
            <button
              type="button"
              disabled={qty >= max}
              onClick={() => setQty(qty + 1)}
              className="px-4 py-3 text-gray-600 hover:bg-gray-100 hover:text-green-600 transition disabled:opacity-50"
            >
              <FaPlus />
            </button>
          </div>
          <span className="text-sm text-gray-500">{max} available</span>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Total Price:</span>
          <span className="text-2xl font-bold text-green-600">
            {(unit * qty).toFixed(2)} EGP
          </span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <button
          type="button"
          disabled={busy || max === 0}
          onClick={() => addQty(false)}
          className="flex-1 text-white py-3.5 px-6 rounded-xl font-medium hover:bg-green-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-600/25 bg-green-600 disabled:opacity-60"
        >
          {busy ? <ImSpinner10 className="animate-spin" /> : <FaCartShopping />}{" "}
          Add to Cart
        </button>

        <button
          type="button"
          disabled={busy || max === 0}
          onClick={() => addQty(true)}
          className="flex-1 bg-gray-900 text-white py-3.5 px-6 rounded-xl font-medium hover:bg-gray-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60"
        >
          <FaBolt /> Buy Now
        </button>
      </div>

      <div className="flex gap-3 mb-6">
        <button
          type="button"
          onClick={toggleWish}
          className={`flex-1 border-2 py-3 px-4 rounded-xl font-medium transition flex items-center justify-center gap-2 ${
            inList
              ? "border-red-200 text-red-500 bg-red-50"
              : "border-gray-200 text-gray-700 hover:border-green-300 hover:text-green-600"
          }`}
        >
          {inList ? <FaHeart /> : <FaRegHeart />}{" "}
          {inList ? "In Wishlist" : "Add to Wishlist"}
        </button>
        <button
          type="button"
          onClick={share}
          className="border-2 border-gray-200 text-gray-700 py-3 px-4 rounded-xl hover:border-green-300 hover:text-green-600 transition"
        >
          <FaShareNodes />
        </button>
      </div>

      <div className="border-t border-gray-100 pt-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: FaTruckFast, t: "Free Delivery", s: "Orders over 500 EGP" },
            { icon: FaRotateLeft, t: "30 Days Return", s: "Money back" },
            { icon: FaShieldHalved, t: "Secure Payment", s: "100% Protected" },
          ].map(({ icon: Icon, t, s }) => (
            <div key={t} className="flex items-center gap-3">
              <div className="h-10 w-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center shrink-0">
                <Icon />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 text-sm">{t}</h4>
                <p className="text-xs text-gray-500">{s}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
