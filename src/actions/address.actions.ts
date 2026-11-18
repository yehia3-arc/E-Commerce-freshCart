"use server";
import { getMyToken } from "@/utilities";

export interface AddressPayload {
  name: string;
  details: string;
  phone: string;
  city: string;
}

export async function addAddress(data: AddressPayload) {
  const token = await getMyToken();
  if (!token) return { status: "fail", message: "you need to login first ..." };

  const res = await fetch(`https://ecommerce.routemisr.com/api/v1/addresses`, {
    method: "POST",
    headers: { token: token as string, "content-type": "application/json" },
    body: JSON.stringify(data), // keys: name, details, phone, city
  });
  return await res.json();
}

export async function removeAddress(id: string) {
  const token = await getMyToken();
  if (!token) return { status: "fail", message: "you need to login first ..." };

  const res = await fetch(
    `https://ecommerce.routemisr.com/api/v1/addresses/${id}`,
    {
      method: "DELETE",
      headers: { token: token as string, "content-type": "application/json" },
    },
  );
  return await res.json();
}

export async function getLoggedUserAddresses() {
  const token = await getMyToken();
  if (!token) return { status: "fail", message: "you need to login first ..." };

  const res = await fetch(`https://ecommerce.routemisr.com/api/v1/addresses`, {
    method: "GET",
    headers: { token: token as string, "content-type": "application/json" },
  });
  return await res.json();
}
