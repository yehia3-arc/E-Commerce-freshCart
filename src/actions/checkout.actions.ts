"use server";
import { checkoutSchemaType } from "@/schemas/checkout.schemas";
import { getMyToken } from "@/utilities";

export async function onlinePayment(
  productId: string,
  url: string = process.env.NEXTAUTH_URL!,
  formValues: checkoutSchemaType,
) {
  const token = await getMyToken();
  if (!token) {
    throw new Error("login first");
  }
  const res = await fetch(
    `https://ecommerce.routemisr.com/api/v1/orders/checkout-session/${productId}?url=${url}`,
    {
      method: "POST",
      headers: { token: token as string, "content-type": "application/json" },
      body: JSON.stringify({ shippingAddress: formValues }),
    },
  );
  const PayData = await res.json();
  return PayData;
}
export async function cashOnDelivery(
  cartId: string,
  formValues: checkoutSchemaType,
) {
  const token = await getMyToken();
  if (!token) throw new Error("login first");
  const res = await fetch(
    `https://ecommerce.routemisr.com/api/v1/orders/${cartId}`,
    {
      method: "POST",
      headers: { token: token as string, "content-type": "application/json" },
      body: JSON.stringify({ shippingAddress: formValues }), // keys: cartId + shippingAddress{details,phone,city}
    },
  );
  return await res.json();
}
