"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { toast } from "@/components/ui/toast";
import { ImSpinner10 } from "react-icons/im";
import {
  FaHeart,
  FaRegHeart,
  FaArrowRight,
  FaCartShopping,
  FaCheck,
  FaTrash,
} from "react-icons/fa6";
import { getLoggedUserCart } from "@/actions/cart.actions";
import { addToCart } from "@/actions/cart.actions";
import { ProductType } from "@/api/types/product.type";

import { WishlistContext } from "@/context/WishlistContext";
import { useContext } from "react";
import { removeFromWishlist } from "@/actions/wishlist.actions";

const ok = (res: any) =>
  res?.status === "success" ||
  res?.success === true ||
  res?.message === "success";

export default function WishlistPage() {
  const { status } = useSession();
  const {
    items,
    loading: wishLoading,
    removeWishlistItem,
  } = useContext(WishlistContext);
  const [cartIds, setCartIds] = useState<Set<string>>(new Set());
  const [busyId, setBusyId] = useState<string | null>(null);

  // only cart ids stay local (for In Cart / In Stock status)
  useEffect(() => {
    if (status !== "authenticated") return;
    getLoggedUserCart().then((res) => {
      const prods = res?.data?.products ?? [];
      setCartIds(
        new Set(
          prods
            .map((i: any) =>
              typeof i.product === "string" ? i.product : i.product?._id,
            )
            .filter(Boolean),
        ),
      );
    });
  }, [status]);

  async function handleAddToCart(p: ProductType) {
    setBusyId(p._id);
    const res = await addToCart(p._id);
    if (ok(res)) {
      setCartIds((prev) => new Set(prev).add(p._id));
      toast.add({ type: "success", description: "added to cart 🛒" });
    } else {
      toast.add({
        type: "error",
        description: res?.message || "failed to add to cart 😥",
      });
    }
    setBusyId(null);
  }

  // ✅ removal now flows through the provider → badge + row update together, no refresh
  async function handleRemove(p: ProductType) {
    setBusyId(p._id);
    const res = await removeFromWishlist(p._id); // DELETE /wishlist/{productId}
    if (ok(res)) {
      removeWishlistItem(p._id); // ✅ items updates → row vanishes + badge −1 (derived count)
      toast.add({ type: "success", description: "removed from wishlist 💔" });
    } else {
      toast.add({
        type: "error",
        description: res?.message || "failed to remove 😥",
      });
    }
    setBusyId(null); // ✅ always runs now — button re-enables
  }

  if (status === "loading" || wishLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <ImSpinner10 className="animate-spin text-4xl text-green-600" />
      </div>
    );
  }

  // ===== EMPTY STATE (Figma #1) =====
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50/50">
        <div className="container mx-auto px-4 py-20">
          <div className="mx-auto max-w-sm text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gray-100">
              <FaRegHeart className="text-3xl text-gray-400" />
            </div>
            <h2 className="mb-2 text-xl font-bold text-gray-900">
              Your wishlist is empty
            </h2>
            <p className="mb-6 text-sm text-gray-500">
              Browse products and save your favorites here.
            </p>
            <div className="flex flex-col gap-3">
              <Link
                href="/productdetails"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-green-700"
              >
                Browse Products <FaArrowRight className="text-sm" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ===== FILLED STATE (Figma #2 / #3) =====
  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header */}
      <div className="border-b border-gray-100 bg-white">
        <div className="container mx-auto px-4 py-8">
          <nav className="mb-4 flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="transition-colors hover:text-green-600">
              Home
            </Link>
            <span>/</span>
            <span className="font-medium text-gray-900">Wishlist</span>
          </nav>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50">
                <FaHeart className="text-xl text-red-500" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  My Wishlist
                </h1>
                <p className="text-sm text-gray-500">
                  {items.length} item{items.length !== 1 ? "s" : ""} saved
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
          {/* Column headers */}
          <div className="hidden grid-cols-12 gap-4 border-b border-gray-100 bg-gray-50 px-6 py-4 text-sm font-medium text-gray-500 md:grid">
            <div className="col-span-6">Product</div>
            <div className="col-span-2 text-center">Price</div>
            <div className="col-span-2 text-center">Status</div>
            <div className="col-span-2 text-center">Actions</div>
          </div>

          <div className="divide-y divide-gray-100">
            {items.map((p) => {
              const inCart = cartIds.has(p._id);
              const busy = busyId === p._id;
              return (
                <div
                  key={p._id}
                  className="grid grid-cols-1 items-center gap-4 p-4 transition-colors hover:bg-gray-50/50 md:grid-cols-12 md:px-6 md:py-5"
                >
                  {/* Product */}
                  <div className="flex items-center gap-4 md:col-span-6">
                    <Link
                      href={`/productdetails/${p._id}`}
                      className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-gray-50"
                    >
                      <img
                        src={p.imageCover}
                        alt={p.title}
                        className="h-full w-full object-contain p-2"
                      />
                    </Link>
                    <div className="min-w-0">
                      <Link
                        href={`/productdetails/${p._id}`}
                        className="line-clamp-2 font-medium text-gray-900 transition-colors hover:text-green-600"
                      >
                        {p.title}
                      </Link>
                      <p className="mt-1 text-sm text-gray-400">
                        {p.category?.name}
                      </p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-2 md:col-span-2 md:justify-center">
                    <span className="text-sm text-gray-500 md:hidden">
                      Price:
                    </span>
                    <div className="text-right font-semibold text-gray-900 md:text-center">
                      {p.price} EGP
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex items-center md:col-span-2 md:justify-center">
                    <span className="mr-2 text-sm text-gray-500 md:hidden">
                      Status:
                    </span>
                    {inCart ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                        <FaCartShopping className="text-[10px]" /> In Cart
                      </span>
                    ) : p.quantity > 0 ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                        In Stock
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-600">
                        <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                        Out of Stock
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 md:col-span-2 md:justify-center">
                    {inCart ? (
                      <Link
                        href="/cart"
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-gray-100 px-4 py-2.5 text-sm font-medium text-gray-700 transition-all hover:bg-gray-200 md:flex-none"
                      >
                        <FaCheck className="text-xs text-green-600" />
                        <span className="md:hidden lg:inline">View Cart</span>
                      </Link>
                    ) : (
                      <button
                        onClick={() => handleAddToCart(p)}
                        disabled={busy || p.quantity === 0}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-green-700 disabled:opacity-50 md:flex-none"
                      >
                        {busy ? (
                          <ImSpinner10 className="animate-spin text-xs" />
                        ) : (
                          <FaCartShopping className="text-xs" />
                        )}
                        <span className="md:hidden lg:inline">Add to Cart</span>
                      </button>
                    )}
                    <button
                      onClick={() => handleRemove(p)}
                      disabled={busy}
                      title="Remove"
                      className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-400 transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
                    >
                      <FaTrash className="text-sm" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between">
          <Link
            href="/productdetails"
            className="text-sm font-medium text-gray-500 transition-colors hover:text-green-600"
          >
            ← Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
