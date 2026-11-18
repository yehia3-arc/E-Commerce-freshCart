"use client";
import { useContext, useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@base-ui/react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { ImSpinner10 } from "react-icons/im";
import { toast } from "@/components/ui/toast";
import { addToWishlist, removeFromWishlist } from "@/actions/wishlist.actions";
import { WishlistContext } from "@/context/WishlistContext";
import { ProductType } from "@/api/types/product.type";

export default function AddBtnWish({
  product,
  classes = "bg-white h-8 w-8 rounded-full flex items-center justify-center transition shadow-sm",
}: {
  product: ProductType;
  classes?: string;
}) {
  const { status } = useSession();
  const { hasWishlist, addWishlistItem, removeWishlistItem } =
    useContext(WishlistContext);
  const [busy, setBusy] = useState(false);

  const inList = hasWishlist(product._id);

  async function toggleWish() {
    // ✅ wishlist is login-only (proxy guards /wishlist)
    if (status !== "authenticated") {
      toast.add({
        type: "error",
        description: "please login to save favorites 😐",
      });
      return;
    }
    setBusy(true);
    const res = inList
      ? await removeFromWishlist(product._id) // DELETE /wishlist/{productId}
      : await addToWishlist(product._id); // POST /wishlist { productId }
    const ok =
      res?.status === "success" ||
      res?.message === "success" ||
      Array.isArray(res?.data?.wishlist);
    if (ok) {
      // ✅ same idea as AddBtn: update shared state right after the API confirms
      if (inList) removeWishlistItem(product._id);
      else addWishlistItem(product);
      toast.add({
        type: "success",
        description: inList
          ? "removed from wishlist 💔"
          : "added to wishlist ❤️",
      });
    } else {
      toast.add({ type: "error", description: res?.message || "failed 😥" });
    }
    setBusy(false);
  }

  return (
    <button
      type="button"
      title={inList ? "Remove from wishlist" : "Add to wishlist"}
      disabled={busy}
      onClick={(e) => {
        e.preventDefault(); // stop the wrapping <Link> from navigating
        e.stopPropagation();
        toggleWish();
      }}
      className={`${classes} ${
        inList ? "text-red-500" : "text-gray-600 hover:text-red-500"
      }`}
    >
      {busy ? (
        <ImSpinner10 className="animate-spin text-sm" />
      ) : inList ? (
        <FaHeart />
      ) : (
        <FaRegHeart />
      )}
    </button>
  );
}
