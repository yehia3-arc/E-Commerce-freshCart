"use server";
import { getMyToken } from "@/utilities";

// GET /api/v1/orders/user/{userId}  (Postman: getUserOrders)
export async function getUserOrders(userId: string) {
  const token = await getMyToken();
  const res = await fetch(
    `https://ecommerce.routemisr.com/api/v1/orders/user/${userId}`,
    {
      headers: {
        ...(token ? { token: token as string } : {}),
        "content-type": "application/json",
      },
      cache: "no-store",
    },
  );
  return await res.json();
}
