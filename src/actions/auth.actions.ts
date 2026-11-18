"use server";
import { LoginSchemaType, RegisterSchemaType } from "@/schemas/auth.schemas";
import { cookies } from "next/headers";

export async function UserRegister(data: RegisterSchemaType) {
  try {
    // Clean the data: remove phone from payload if it's empty
    // so the API doesn't reject it for having an empty string
    // Create payload without phone if it's empty
    const payload = data.phone
      ? { ...data }
      : (() => {
          const { phone, ...rest } = data;
          return rest;
        })();

    const res = await fetch(
      `https://ecommerce.routemisr.com/api/v1/auth/signup`,
      {
        method: "POST",
        body: JSON.stringify(payload),
        headers: { "content-type": "application/json" },
      },
    );
    const response = await res.json();
    console.log("result", response);
    return { ok: res.ok, message: response.message, status: response.status };
  } catch (err) {
    return {
      ok: false,
      message: err instanceof Error ? err.message : "Registration failed",
    };
  }
}

export async function UserLogin(data: LoginSchemaType) {
  // try {
  //   const res = await fetch(
  //     `https://ecommerce.routemisr.com/api/v1/auth/signin`,
  //     {
  //       method: "POST",
  //       body: JSON.stringify(data),
  //       headers: { "content-type": "application/json" },
  //     },
  //   );
  //   const response = await res.json();
  //   console.log("result of login", response);
  //   if (res.ok) {
  //     const cookie = await cookies();
  //     cookie.set("userToken", response.token, {
  //       httpOnly: true, // ican use token only using http request
  //       secure: true,
  //       maxAge: 60 * 60 * 24 * 365,
  //     });
  //   }
  //   // if res.ok? ===> save token ==> cookies
  //   return { ok: res.ok, message: response.message, token: response.token };
  // } catch (err) {
  //   return {
  //     ok: false,
  //     message: err instanceof Error ? err.message : "Login failed",
  //     token: undefined,
  //   };
  //}
}
export async function forgotPassword(email: string) {
  try {
    const res = await fetch(
      `https://ecommerce.routemisr.com/api/v1/auth/forgotPasswords`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email }),
      },
    );
    const body = await res.json().catch(() => ({}));
    return {
      ...body,
      httpStatus: res.status,
      retryAfter: res.headers.get("Retry-After"),
    };
  } catch (err) {
    return {
      status: "fail",
      message: err instanceof Error ? err.message : "network error",
    };
  }
}

export async function verifyResetCode(resetCode: string) {
  try {
    const res = await fetch(
      `https://ecommerce.routemisr.com/api/v1/auth/verifyResetCode`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ resetCode }),
      },
    );
    return await res.json();
  } catch (err) {
    return {
      status: "fail",
      message: err instanceof Error ? err.message : "network error",
    };
  }
}

export async function resetPassword(email: string, newPassword: string) {
  try {
    const res = await fetch(
      `https://ecommerce.routemisr.com/api/v1/auth/resetPassword`,
      {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, newPassword }),
      },
    );
    return await res.json();
  } catch (err) {
    return {
      status: "fail",
      message: err instanceof Error ? err.message : "network error",
    };
  }
}
