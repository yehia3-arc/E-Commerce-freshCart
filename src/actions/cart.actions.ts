"use server";

import { getMyToken } from "@/utilities";
import { decode } from "next-auth/jwt";
import { cookies } from "next/headers";

export async function addToCart(productId: string) {
  try {
    const token = await getMyToken();
    if (!token) {
      return {
        status: "fail",
        message: "you need to login first ...",
        needLogin: true,
      };
    }

    const res = await fetch(`https://ecommerce.routemisr.com/api/v2/cart`, {
      method: "POST",
      headers: {
        token: token as string,
        "content-type": "application/json",
      },
      body: JSON.stringify({ productId: productId }),
    });
    const data = await res.json();
    return data;
  } catch (err) {
    return {
      status: "fail",
      message: err instanceof Error ? err.message : "network error",
    };
  }
}

export async function getLoggedUserCart() {
  const token = await getMyToken();
  if (!token) {
    return {
      status: "fail",
      message: "you need to login first ...",
      needLogin: true,
    };
  }

  const res = await fetch(`https://ecommerce.routemisr.com/api/v2/cart`, {
    method: "GET",
    headers: {
      token: token as string,
      "content-type": "application/json",
    },
  });
  const data = await res.json();
  return data;
}
export async function updateProductQuantity(productId: string, count: number) {
  const token = await getMyToken();
  if (!token) {
    return {
      status: "fail",
      message: "you need to login first ...",
      needLogin: true,
    };
  }

  const res = await fetch(
    `https://ecommerce.routemisr.com/api/v2/cart/${productId}`,
    {
      method: "PUT",
      headers: {
        token: token as string,
        "content-type": "application/json",
      },
      body: JSON.stringify({ count: count }),
    },
  );
  const data = await res.json();
  return data;
}
export async function RemoveProductFromCart(productId: string) {
  const token = await getMyToken();
  if (!token) {
    return {
      status: "fail",
      message: "you need to login first ...",
      needLogin: true,
    };
  }

  const res = await fetch(
    `https://ecommerce.routemisr.com/api/v2/cart/${productId}`,
    {
      method: "DELETE",
      headers: {
        token: token as string,
        "content-type": "application/json",
      },
    },
  );
  const data = await res.json();
  return data;
}

export async function ClearAllCartProducts() {
  const token = await getMyToken();
  if (!token) {
    return {
      status: "fail",
      message: "you need to login first ...",
      needLogin: true,
    };
  }

  const res = await fetch(`https://ecommerce.routemisr.com/api/v2/cart`, {
    method: "DELETE",
    headers: {
      token: token as string,
      "content-type": "application/json",
    },
  });
  const data = await res.json();
  return data;
}
