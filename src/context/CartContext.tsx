"use client";
import { getLoggedUserCart } from "@/actions/cart.actions";
import { ProductCart } from "@/api/types/cart.types";
import { guestCartCount } from "@/lib/guestCart";
import { useSession } from "next-auth/react";
import { createContext, useEffect, useState, type ReactNode } from "react";

export const CartContext = createContext({
  numberOfCartItems: 0,
  setnumberOfCartItems: (num: number) => {},
});

export default function CartContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { status } = useSession();
  const [numberOfCartItems, setnumberOfCartItems] = useState(0);

  async function getUserCart() {
    // ✅ logged in → API count
    if (status === "authenticated") {
      try {
        const res = await getLoggedUserCart();
        if (res?.status === "success") {
          const sum = (res.data?.products ?? []).reduce(
            (s: number, item: ProductCart) => s + item.count,
            0,
          );
          setnumberOfCartItems(sum);
        }
      } catch (err: unknown) {
        if (err instanceof Error) console.log(err.message);
      }
    }
    // ✅ guest → localStorage count (no API call, no crash)
    else if (status === "unauthenticated") {
      setnumberOfCartItems(guestCartCount());
    }
  }

  useEffect(() => {
    if (status !== "loading") getUserCart();
  }, [status]);

  return (
    <CartContext.Provider value={{ numberOfCartItems, setnumberOfCartItems }}>
      {children}
    </CartContext.Provider>
  );
}
