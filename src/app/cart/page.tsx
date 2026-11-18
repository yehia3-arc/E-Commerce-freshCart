"use client";
import React, { useContext, useEffect, useState } from "react";
import Link from "next/link";
import {
  addToCart,
  ClearAllCartProducts,
  getLoggedUserCart,
  RemoveProductFromCart,
  updateProductQuantity,
} from "@/actions/cart.actions";
import {
  FaBagShopping,
  FaCartShopping,
  FaCheck,
  FaLock,
  FaMinus,
  FaPlus,
  FaShieldHalved,
  FaTag,
  FaTrash,
  FaTruck,
  FaUser,
  FaBoxOpen,
  FaArrowRight,
} from "react-icons/fa6";
import { useSession } from "next-auth/react";
import { toast } from "@/components/ui/toast";
import { ImSpinner10 } from "react-icons/im";
import { CartData, GuestItem } from "@/api/types/cart.types";
import {
  guestCartCount,
  clearGuestCart,
  getGuestCart,
  removeGuestCartItem,
  updateGuestCartCount,
} from "@/lib/guestCart";
import { getSingleProduct } from "@/api/services/routemisr.service";
import { ProductType } from "@/api/types/product.type";
import { CartContext } from "@/context/CartContext";

export default function Cart() {
  const { status } = useSession();
  const [productsDetails, setproductsDetails] = useState<null | CartData>(null);
  const [disabledUpdate, setdisabledUpdate] = useState(false);
  const [updateLoading, setupdateLoading] = useState(false);
  const [currentId, setcurrentId] = useState<null | string>(null); //clicked id
  const [removeDisabled, setremoveDisabled] = useState(false);
  const [guestLoading, setGuestLoading] = useState(true);
  const [cartId, setcartId] = useState("");

  async function getUserCart() {
    const res = await getLoggedUserCart();
    console.log(res);

    if (res.status === "success") {
      setcartId(res.cartId);
      setproductsDetails(res.data); //set state ==> object data contains  products [{} , {}]
      setnumberOfCartItems(res.numOfCartItems ?? 0);
    }
  }
  async function updateProduct(id: string, newCount: number) {
    setcurrentId(id);
    setdisabledUpdate(true);
    setupdateLoading(true);

    if (newCount == 0) {
      toast.add({
        type: "success",
        description: "product removed from cart successfully 😐",
      });
    }
    const res = await updateProductQuantity(id, newCount);
    console.log(res);
    if (res.status === "success") {
      toast.add({
        type: "success",
        description: "add to cart successfully 🛒☺️",
      });
      setproductsDetails(res.data);
      setnumberOfCartItems(res.numOfCartItems ?? 0);
      setdisabledUpdate(false);
      setupdateLoading(false);
    } else {
      toast.add({
        type: "error",
        description: "failed to add to cart  🤨😥",
      });
      setdisabledUpdate(false);
      setupdateLoading(false);
    }
  }
  async function removeProduct(productId: string) {
    setremoveDisabled(true);
    const res = await RemoveProductFromCart(productId);
    console.log(res);
    if (res.status === "success") {
      toast.add({
        type: "success",
        description: "product removed successfully from cart ",
      });
      setproductsDetails(res.data);
      setremoveDisabled(false);
      setnumberOfCartItems(res.numOfCartItems ?? 0); // ✅ NEW — badge drops instantly
    } else {
      toast.add({
        type: "success",
        description: "product failed to remove  from cart , try again ",
      });
      setremoveDisabled(false);
    }
  }
  async function removeAllProducts() {
    const res = await ClearAllCartProducts();
    console.log(res);
    if (res.status === "success") {
      toast.add({
        type: "success",
        description: " all products successfully removed from cart  ",
      });
      setproductsDetails(res.data);
      setnumberOfCartItems(0);
    } else {
      toast.add({
        type: "success",
        description: " all products failed to remove  from cart , try again ",
      });
    }
  }
  async function loadGuestCart() {
    const cart = getGuestCart();
    const loaded = await Promise.all(
      cart.map(async (i) => {
        const product = await getSingleProduct(i.id); // public endpoint, no token needed

        return product
          ? { product, count: i.count, price: product.price, _id: product._id }
          : null;
      }),
    );
    setGuestItems(loaded.filter(Boolean) as GuestItem[]);
    setGuestLoading(false);
  }
  // ✅ only fetch when logged in (guests would throw otherwise)
  useEffect(() => {
    if (status === "authenticated") getUserCart();
  }, [status]);

  // Loading state (session or cart data)
  // Loading state (session or cart data)

  const isLoggedIn = status === "authenticated";
  const items = productsDetails?.products ?? [];
  const itemCount = items.length;
  const totalPrice = productsDetails?.totalCartPrice ?? 0;
  const [guestItems, setGuestItems] = useState<GuestItem[]>([]);
  const viewItems = isLoggedIn ? items : guestItems;
  const guestTotal = guestItems.reduce(
    (s, i) => s + i.product.price * i.count,
    0,
  );
  const FREE_SHIPPING_THRESHOLD = 500;
  const SHIPPING_FEE = 50;
  const { setnumberOfCartItems } = useContext(CartContext);
  const subtotal = isLoggedIn ? totalPrice : guestTotal;
  const qualifiesFree = subtotal >= FREE_SHIPPING_THRESHOLD;
  const shippingCost = qualifiesFree ? 0 : SHIPPING_FEE;
  const grandTotal = subtotal + shippingCost;
  const remaining = FREE_SHIPPING_THRESHOLD - subtotal;
  const progress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  function changeGuestCount(id: string, count: number) {
    updateGuestCartCount(id, count);
    loadGuestCart();
    setnumberOfCartItems(guestCartCount());
  }
  function guestRemove(id: string) {
    removeGuestCartItem(id);
    loadGuestCart();
    setnumberOfCartItems(guestCartCount());
  }
  function guestClear() {
    clearGuestCart();
    setGuestItems([]);
    setnumberOfCartItems(0);
  }
  useEffect(() => {
    if (status === "unauthenticated") {
      loadGuestCart();
    } else {
      setGuestLoading(false);
    }
  }, [status]);

  // ✅ Merge guest cart into server cart the moment user logs in
  // useEffect(() => {
  //   async function merge() {
  //     const cart = getGuestCart();
  //     if (cart.length) {
  //       for (const item of cart) {
  //         await addToCart(item.id);
  //         if (item.count > 1) await updateProductQuantity(item.id, item.count);
  //       }
  //       clearGuestCart();
  //     }
  //     getUserCart();
  //   }
  //   if (status === "authenticated") merge();
  // }, [status]);

  if (
    status === "loading" ||
    (status === "authenticated" && !productsDetails) ||
    (status === "unauthenticated" && guestLoading)
  ) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <ImSpinner10 className="animate-spin text-green-600 text-4xl" />
      </div>
    );
  }
  return (
    <>
      {viewItems.length > 0 ? (
        <div className="bg-gray-50 min-h-screen py-8">
          <div className="container mx-auto px-4">
            {/* ===== Breadcrumb ===== */}
            <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
              <Link href="/" className="hover:text-green-600 transition">
                Home
              </Link>
              <span>/</span>
              <span className="text-gray-900 font-medium">Shopping Cart</span>
            </nav>

            {/* ===== Header ===== */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <span className="bg-linear-to-r from-green-600 to-green-700 text-white w-12 h-12 rounded-xl flex items-center justify-center">
                  <FaCartShopping />
                </span>
                Shopping Cart
              </h1>
              <p className="text-gray-500 mt-2">
                You have
                <span className="font-semibold text-green-600">
                  {viewItems.length} item{viewItems.length !== 1 ? "s" : ""}
                </span>
                in your cart
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* ===== LEFT: cart items ===== */}
              <div className="lg:col-span-2">
                {viewItems.length > 0 ? (
                  <>
                    <div className="space-y-4">
                      {viewItems.map((product) => {
                        const maxAllowed = Math.min(
                          20,
                          product.product.quantity,
                        ); // ✅ Now it's safely inside the loop

                        return (
                          <div
                            key={product.product.id}
                            className="relative bg-white rounded-2xl shadow-sm hover:shadow-md border border-gray-100 transition-all duration-300"
                          >
                            <div className="p-4 sm:p-5">
                              <div className="flex gap-4 sm:gap-6">
                                {/* Image + In-Stock badge */}
                                <Link
                                  href={`/productdetails/${product.product.id}`}
                                  className="relative shrink-0 group"
                                >
                                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-xl bg-linear-to-br from-gray-50 via-white to-gray-100 p-3 border border-gray-100 overflow-hidden">
                                    <img
                                      src={product.product.imageCover}
                                      alt={product.product.title}
                                      className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
                                    />
                                  </div>
                                  {product.product.quantity === 0 ? (
                                    <div className="absolute -bottom-1 -right-1 bg-red-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                                      Sold Out
                                    </div>
                                  ) : (
                                    <div className="absolute -bottom-1 -right-1 bg-green-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                                      <FaCheck className="text-[8px]" /> In
                                      Stock
                                    </div>
                                  )}
                                </Link>

                                {/* Info */}
                                <div className="flex-1 min-w-0 flex flex-col">
                                  <div className="mb-3">
                                    <Link
                                      href={`/productdetails/${product.product.id}`}
                                      className="group/title"
                                    >
                                      <h3 className="font-semibold text-gray-900 group-hover/title:text-green-600 transition-colors leading-relaxed text-base sm:text-lg">
                                        {product.product.title}
                                      </h3>
                                    </Link>
                                    <div className="flex items-center gap-2 mt-2">
                                      <span className="inline-block px-2.5 py-1 bg-linear-to-r from-green-50 to-emerald-50 text-green-700 text-xs font-medium rounded-full">
                                        {product.product.category?.name}
                                      </span>
                                      <span className="text-xs text-gray-400">
                                        •
                                      </span>
                                      <span className="text-xs text-gray-500">
                                        SKU:{" "}
                                        {product.product.id
                                          .slice(-6)
                                          .toUpperCase()}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="mb-4">
                                    <div className="flex items-baseline gap-2">
                                      <span className="text-green-600 font-bold text-lg">
                                        {product.price} EGP
                                      </span>
                                      <span className="text-xs text-gray-400">
                                        per unit
                                      </span>
                                    </div>
                                  </div>

                                  <div className="mt-auto flex flex-wrap items-center justify-between gap-4">
                                    {/* Quantity stepper (same logic) */}
                                    <div className="flex items-center bg-gray-50 rounded-xl p-1 border border-gray-200">
                                      <button
                                        disabled={
                                          disabledUpdate || product.count <= 1
                                        }
                                        onClick={() =>
                                          isLoggedIn
                                            ? updateProduct(
                                                product.product.id,
                                                product.count - 1,
                                              )
                                            : changeGuestCount(
                                                product.product.id,
                                                product.count - 1,
                                              )
                                        }
                                        aria-label="Decrease quantity"
                                        className="h-8 w-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none transition-all"
                                      >
                                        <FaMinus className="text-xs" />
                                      </button>
                                      <span className="w-12 text-center font-bold text-gray-900">
                                        {updateLoading &&
                                        product.product.id === currentId ? (
                                          <ImSpinner10 className="animate-spin inline" />
                                        ) : (
                                          product.count
                                        )}
                                      </span>
                                      <button
                                        disabled={
                                          disabledUpdate ||
                                          product.count >= maxAllowed
                                        }
                                        onClick={() =>
                                          isLoggedIn
                                            ? updateProduct(
                                                product.product.id,
                                                product.count + 1,
                                              )
                                            : changeGuestCount(
                                                product.product.id,
                                                product.count + 1,
                                              )
                                        }
                                        aria-label="Increase quantity"
                                        className="h-8 w-8 rounded-lg bg-green-600 shadow-sm shadow-green-600/30 flex items-center justify-center text-white hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                                      >
                                        <FaPlus className="text-xs" />
                                      </button>
                                    </div>

                                    {/* Row total + remove */}
                                    <div className="flex items-center gap-4">
                                      <div className="text-right">
                                        <p className="text-xs text-gray-400 mb-0.5">
                                          Total
                                        </p>
                                        <p className="text-xl font-bold text-gray-900">
                                          {product.count * product.price}{" "}
                                          <span className="text-sm font-medium text-gray-400">
                                            EGP
                                          </span>
                                        </p>
                                      </div>
                                      <button
                                        disabled={removeDisabled}
                                        onClick={() =>
                                          isLoggedIn
                                            ? removeProduct(product.product.id)
                                            : guestRemove(product.product.id)
                                        }
                                        title="Remove item"
                                        className="h-10 w-10 rounded-xl border border-red-200 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500 flex items-center justify-center disabled:opacity-40 transition-all duration-200"
                                      >
                                        <FaTrash className="text-sm" />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Continue shopping + Clear all */}
                    <div className="mt-6 pt-6 border-t border-gray-200 flex items-center justify-between">
                      <Link
                        href="/"
                        className="text-green-600 hover:text-green-700 font-medium text-sm flex items-center gap-2"
                      >
                        <span>←</span> Continue Shopping
                      </Link>
                      <button
                        onClick={() =>
                          isLoggedIn ? removeAllProducts() : guestClear()
                        }
                        className="group flex items-center gap-2 text-sm text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                      >
                        <FaTrash className="text-xs group-hover:scale-110 transition-transform" />
                        <span>Clear all items</span>
                      </button>
                    </div>
                  </>
                ) : (
                  /* Empty / guest left column */
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center">
                    <FaCartShopping className="text-6xl text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {isLoggedIn
                        ? "Your cart is empty"
                        : "Your cart is waiting"}
                    </h3>
                    <p className="text-gray-500 mb-6">
                      {isLoggedIn
                        ? "Add some products to get started!"
                        : "Login to see your saved items, or start shopping now."}
                    </p>
                    <div className="flex justify-center gap-3">
                      {!isLoggedIn && (
                        <Link
                          href="/login?redirect=/cart"
                          className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition"
                        >
                          Login
                        </Link>
                      )}
                      <Link
                        href="/"
                        className="border border-gray-200 px-6 py-3 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition"
                      >
                        Browse Products
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* ===== RIGHT: Order Summary ===== */}
              <div className="lg:col-span-1">
                {isLoggedIn ? (
                  /* Logged-in sidebar (Figma #1) */
                  <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden sticky top-24 shadow-sm">
                    <div className="bg-linear-to-r from-green-600 to-green-700 px-6 py-4">
                      <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <FaBagShopping /> Order Summary
                      </h2>
                      <p className="text-green-100 text-sm mt-1">
                        {itemCount} item{itemCount !== 1 ? "s" : ""} in your
                        cart
                      </p>
                    </div>
                    <div className="p-6 space-y-5">
                      {qualifiesFree ? (
                        /* keep the existing green box exactly as-is here */
                        <div className="bg-linear-to-r from-green-50 to-emerald-50 rounded-xl p-4 flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                            <FaTruck className="text-green-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-green-700">
                              Free Shipping!
                            </p>
                            <p className="text-sm text-green-600">
                              You qualify for free delivery
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-linear-to-r from-orange-50 to-amber-50 rounded-xl p-4">
                          <div className="flex items-center gap-3">
                            <FaTruck className="text-orange-500" />
                            <p className="text-sm font-semibold text-gray-800">
                              Add {remaining} EGP for free shipping
                            </p>
                          </div>
                          <div className="mt-2 h-2 rounded-full bg-orange-100 overflow-hidden">
                            <div
                              className="h-full bg-linear-to-r from-orange-500 to-amber-400 transition-all duration-500"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      )}
                      <div className="space-y-3">
                        <div className="flex justify-between text-gray-600">
                          <span>Subtotal</span>
                          <span className="font-medium text-gray-900">
                            {totalPrice} EGP
                          </span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                          <span>Shipping</span>
                          {qualifiesFree ? (
                            <span className="font-medium text-green-600">
                              FREE
                            </span>
                          ) : (
                            <span className="font-medium text-gray-900">
                              {SHIPPING_FEE} EGP
                            </span>
                          )}
                        </div>
                        <div className="border-t border-dashed border-gray-200 pt-3 mt-3">
                          <div className="flex justify-between items-baseline">
                            <span className="text-gray-900 font-semibold">
                              Total
                            </span>
                            <div className="text-right">
                              <span className="text-2xl font-bold text-gray-900">
                                {grandTotal}
                              </span>
                              <span className="text-sm text-gray-500 ml-1">
                                EGP
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="w-full flex items-center justify-center gap-2 py-3 border border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-green-400 hover:text-green-600 hover:bg-green-50/50 transition-all"
                      >
                        <FaTag />
                        <span className="text-sm font-medium">
                          Apply Promo Code
                        </span>
                      </button>

                      <Link
                        href={`/checkout/${cartId}`}
                        className="w-full bg-linear-to-r from-green-600 to-green-700 text-white py-4 px-6 rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all flex items-center justify-center gap-3 shadow-lg shadow-green-600/20 active:scale-[0.98]"
                      >
                        <FaLock />
                        <span>Secure Checkout</span>
                      </Link>

                      <div className="flex items-center justify-center gap-4 py-2">
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <FaShieldHalved className="text-green-500" />
                          <span>Secure Payment</span>
                        </div>
                        <div className="w-px h-4 bg-gray-200"></div>
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <FaTruck className="text-blue-500" />
                          <span>Fast Delivery</span>
                        </div>
                      </div>

                      <Link
                        href="/"
                        className="block text-center text-green-600 hover:text-green-700 text-sm font-medium py-2"
                      >
                        ← Continue Shopping
                      </Link>
                    </div>
                  </div>
                ) : (
                  /* Guest sidebar (Figma #2) */
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
                    <div className="bg-gray-900 p-5">
                      <h2 className="text-white font-bold text-lg">
                        Order Summary
                      </h2>
                    </div>
                    <div className="p-5 space-y-4">
                      <div className="flex justify-between text-gray-600">
                        <span>Subtotal ({guestItems.length} items)</span>
                        <span className="font-semibold">{guestTotal} EGP</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Shipping</span>
                        <span className="text-green-600 font-medium">
                          Calculated at checkout
                        </span>
                      </div>
                      <hr className="border-gray-200" />
                      <div className="flex justify-between text-lg font-bold">
                        <span>Estimated Total</span>
                        <span className="text-green-600">{grandTotal} EGP</span>
                      </div>
                      <div className="pt-4 space-y-3">
                        <Link
                          href="/login?redirect=/cart"
                          className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3.5 rounded-xl font-semibold hover:bg-green-700 transition-all"
                        >
                          <FaUser /> Login to Checkout
                        </Link>
                        <p className="text-xs text-gray-400 text-center">
                          Don&apos;t have an account?{" "}
                          <Link
                            href="/register?redirect=/cart"
                            className="text-green-600 hover:underline"
                          >
                            Sign up
                          </Link>
                        </p>
                      </div>
                      <div className="pt-4 border-t border-gray-100 space-y-2">
                        <p className="text-xs text-gray-500">
                          ✓ Your cart items will be saved
                        </p>
                        <p className="text-xs text-gray-500">
                          ✓ Track your orders easily
                        </p>
                        <p className="text-xs text-gray-500">
                          ✓ Access exclusive member deals
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="min-h-[60vh] flex items-center justify-center px-4">
          <div className="max-w-md text-center">
            <div className="relative mb-8">
              <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center mx-auto">
                <FaBoxOpen className="text-5xl text-gray-300" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Your cart is empty
            </h2>
            <p className="text-gray-500 mb-8 leading-relaxed">
              Looks like you haven&apos;t added anything to your cart yet.
              <br />
              Start exploring our products!
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-green-600 text-white py-3.5 px-8 rounded-xl font-semibold hover:bg-green-700 transition-all shadow-lg active:scale-[0.98]"
            >
              Start Shopping
              <FaArrowRight className="text-sm" />
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
