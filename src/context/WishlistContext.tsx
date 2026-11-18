"use client";
import { getLoggedUserWishlist } from "@/actions/wishlist.actions";
import { ProductType } from "@/api/types/product.type";
import { WishlistContextType } from "@/api/types/user.type";
import { useSession } from "next-auth/react";
import { createContext, useEffect, useState, type ReactNode } from "react";

export const WishlistContext = createContext<WishlistContextType>({
  numberOfWishlistItems: 0,
  items: [],
  loading: true,
  hasWishlist: () => false,
  addWishlistItem: () => {},
  removeWishlistItem: () => {},
});

export default function WishlistContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { status } = useSession();
  const [items, setItems] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);

  async function getUserWishlist() {
    if (status === "authenticated") {
      try {
        const res = await getLoggedUserWishlist(); // GET /wishlist
        if (res?.status === "success" || res?.message === "success") {
          const list = res?.data?.wishlist ?? res?.data ?? [];
          setItems(Array.isArray(list) ? list : []);
        }
      } catch (err: unknown) {
        if (err instanceof Error) console.log(err.message);
      }
    }
    setLoading(false);
  }

  useEffect(() => {
    if (status !== "loading") getUserWishlist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  // ✅ local mutators — components call these AFTER a successful API request
  function addWishlistItem(p: ProductType) {
    setItems((prev) =>
      prev.some((x) => x._id === p._id) ? prev : [...prev, p],
    );
  }
  function removeWishlistItem(id: string) {
    setItems((prev) => prev.filter((x) => x._id !== id));
  }

  const hasWishlist = (id: string) => items.some((p) => p._id === id);

  return (
    <WishlistContext.Provider
      value={{
        numberOfWishlistItems: items.length, // ✅ derived — badge can never drift
        items,
        loading,
        hasWishlist,
        addWishlistItem,
        removeWishlistItem,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}
