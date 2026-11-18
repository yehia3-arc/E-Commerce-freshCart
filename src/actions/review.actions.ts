"use server";
import { getMyToken } from "@/utilities";

// GET /api/v1/products/{productId}/reviews  (public)
export async function getProductReviews(productId: string) {
  const res = await fetch(
    `https://ecommerce.routemisr.com/api/v1/products/${productId}/reviews`,
    { cache: "no-store" },
  );
  return await res.json();
}

// POST /api/v1/products/{productId}/reviews  body { review, rating }
export async function createReview(
  productId: string,
  data: { review: string; rating: number },
) {
  const token = await getMyToken();
  if (!token) return { status: "fail", message: "you need to login first ..." };
  const res = await fetch(
    `https://ecommerce.routemisr.com/api/v1/products/${productId}/reviews`,
    {
      method: "POST",
      headers: { token: token as string, "content-type": "application/json" },
      body: JSON.stringify(data),
    },
  );
  return await res.json();
}

// PUT /api/v1/reviews/{reviewId}  body { review, rating }  (owner only)
export async function updateReview(
  reviewId: string,
  data: { review: string; rating: number },
) {
  const token = await getMyToken();
  if (!token) return { status: "fail", message: "you need to login first ..." };
  const res = await fetch(
    `https://ecommerce.routemisr.com/api/v1/reviews/${reviewId}`,
    {
      method: "PUT",
      headers: { token: token as string, "content-type": "application/json" },
      body: JSON.stringify(data),
    },
  );
  return await res.json();
}

// DELETE /api/v1/reviews/{reviewId}  (owner/admin)
export async function deleteReview(reviewId: string) {
  const token = await getMyToken();
  if (!token) return { status: "fail", message: "you need to login first ..." };
  const res = await fetch(
    `https://ecommerce.routemisr.com/api/v1/reviews/${reviewId}`,
    {
      method: "DELETE",
      headers: { token: token as string },
    },
  );
  const text = await res.text(); // ✅ safe for empty body
  return text ? JSON.parse(text) : { status: res.ok ? "success" : "fail" };
}
