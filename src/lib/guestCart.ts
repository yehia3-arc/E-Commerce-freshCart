export interface GuestCartItem {
  id: string;
  count: number;
}
const KEY = "guest-cart";

export function getGuestCart(): GuestCartItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}
export function addToGuestCart(id: string) {
  const cart = getGuestCart();
  const found = cart.find((i) => i.id === id);
  found ? (found.count += 1) : cart.push({ id, count: 1 });
  localStorage.setItem(KEY, JSON.stringify(cart));
}
export function updateGuestCartCount(id: string, count: number) {
  let cart = getGuestCart();
  cart =
    count <= 0
      ? cart.filter((i) => i.id !== id)
      : cart.map((i) => (i.id === id ? { ...i, count } : i));
  localStorage.setItem(KEY, JSON.stringify(cart));
}
export function removeGuestCartItem(id: string) {
  localStorage.setItem(
    KEY,
    JSON.stringify(getGuestCart().filter((i) => i.id !== id)),
  );
}
export function clearGuestCart() {
  localStorage.removeItem(KEY);
}
export const guestCartCount = () =>
  getGuestCart().reduce((s, i) => s + i.count, 0);
