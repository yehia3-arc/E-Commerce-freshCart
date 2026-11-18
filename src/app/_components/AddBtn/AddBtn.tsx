"use client";
import { addToCart } from "@/actions/cart.actions";
import { toast } from "@/components/ui/toast";
import { Button } from "@base-ui/react";
import { useContext } from "react";

import { useSession } from "next-auth/react";

import { addToGuestCart } from "@/lib/guestCart";
import { CartContext } from "@/context/CartContext";

export default function AddBtn({
  classes,
  word,
  id,
  maxAllowed,
}: {
  classes: string;
  word: string;
  id: string;
  maxAllowed?: number;
}) {
  const { status } = useSession();
  const { numberOfCartItems, setnumberOfCartItems } = useContext(CartContext);
  async function AddProduct() {
    console.log("add");
    //call api ==>
    // ✅ Guest = local cart like the demo (no API, no throw)
    if (status !== "authenticated") {
      addToGuestCart(id);
      setnumberOfCartItems(numberOfCartItems + 1);
      toast.add({
        type: "success",
        description: "add to cart successfully 😉 (login to checkout)",
      });
      return;
    }

    const res = await addToCart(id);
    //console.log(res);
    if (res.status === "success") {
      setnumberOfCartItems(numberOfCartItems + 1);
      toast.add({
        type: "success",
        description: "add to cart successfully 😉",
      });
    } else {
      toast.add({
        type: "error",
        // description: "failed to add to cart 😐" || res.message,
        description: res.message,
      });
    }
  }

  return (
    <>
      <Button
        disabled={maxAllowed === 0}
        onClick={(e) => {
          e.preventDefault();
          AddProduct();
        }}
        className={classes}
      >
        {word}
      </Button>
    </>
  );
}
