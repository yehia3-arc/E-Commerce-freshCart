"use server";
import { getMyToken } from "@/utilities";

import { jwtDecode } from "jwt-decode";
import { UserType } from "@/api/types/user.type";

export interface UpdateUserPayload {
  name: string;
  email: string;
  phone: string;
}

export interface UpdatePasswordPayload {
  currentPassword: string;
  password: string;
  rePassword: string;
}

export async function updateLoggedUserData(data: UpdateUserPayload) {
  const token = await getMyToken();
  if (!token) return { status: "fail", message: "you need to login first ..." };

  const res = await fetch(
    `https://ecommerce.routemisr.com/api/v1/users/updateMe/`,
    {
      method: "PUT",
      headers: { token: token as string, "content-type": "application/json" },
      body: JSON.stringify(data), // keys: name, email, phone
    },
  );
  return await res.json();
}

export async function updateLoggedUserPassword(data: UpdatePasswordPayload) {
  const token = await getMyToken();
  if (!token) return { status: "fail", message: "you need to login first ..." };

  const res = await fetch(
    `https://ecommerce.routemisr.com/api/v1/users/changeMyPassword`,
    {
      method: "PUT",
      headers: { token: token as string, "content-type": "application/json" },
      body: JSON.stringify(data), // keys: currentPassword, newPassword
    },
  );
  return await res.json();
}

// public endpoint (your browser screenshot) → no token guard, guests can call it
export async function getAllUsers(): Promise<UserType[] | undefined> {
  const res = await fetch(
    `https://ecommerce.routemisr.com/api/v1/users?limit=40`,
    {
      cache: "no-store",
    },
  );
  if (!res.ok) return undefined;
  const data = await res.json();
  return (data.users ?? []) as UserType[]; // ✅ users, not data
}

//✅ existence check built from Get All Users (keyword + exact match)
export async function checkEmailExists(email: string): Promise<boolean> {
  try {
    const target = email.trim().toLowerCase();
    const res = await fetch(
      `https://ecommerce.routemisr.com/api/v1/users?keyword=${encodeURIComponent(target)}&limit=40`,
      { cache: "no-store" },
    );
    if (!res.ok) return false;
    const data = await res.json();
    const users: UserType[] = data.users ?? [];
    return users.some((u) => u.email?.toLowerCase() === target);
  } catch {
    return false;
  }
}

export async function decodeLoggedUser() {
  const token = await getMyToken();
  if (!token) return undefined;
  // RouteMisr JWT payload = { id, role, iat, exp }
  return jwtDecode<{ id: string }>(token as string);
}
