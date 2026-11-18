"use server";
import { getMyToken } from "@/utilities";

export async function addToWishlist(productId: string) {
  const token = await getMyToken();
  if (!token) return { status: "fail", message: "you need to login first ..." };

  const res = await fetch(`https://ecommerce.routemisr.com/api/v1/wishlist`, {
    method: "POST",
    headers: { token: token as string, "content-type": "application/json" },
    body: JSON.stringify({ productId }), // key: productId
  });
  return await res.json();
}

export async function removeFromWishlist(productId: string) {
  const token = await getMyToken();
  if (!token) return { status: "fail", message: "you need to login first ..." };

  const res = await fetch(
    `https://ecommerce.routemisr.com/api/v1/wishlist/${productId}`,
    {
      method: "DELETE",
      headers: { token: token as string, "content-type": "application/json" },
    },
  );
  return await res.json();
}

export async function getLoggedUserWishlist() {
  const token = await getMyToken();
  if (!token) return { status: "fail", message: "you need to login first ..." };

  const res = await fetch(`https://ecommerce.routemisr.com/api/v1/wishlist`, {
    method: "GET",
    headers: { token: token as string, "content-type": "application/json" },
  });
  return await res.json();
}
