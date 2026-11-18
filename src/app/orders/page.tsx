"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { ImSpinner10 } from "react-icons/im";
import {
  FaBox,
  FaBagShopping,
  FaHashtag,
  FaTruck,
  FaCircleCheck,
  FaCalendarDays,
  FaLocationDot,
  FaChevronDown,
  FaReceipt,
  FaPhone,
  FaCcVisa,
  FaMoneyBill,
  FaBoxOpen,
} from "react-icons/fa6";
import { getUserOrders } from "@/actions/order.actions";
import { OrderType } from "@/api/types/order.type";

export default function AllOrders() {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    if (status !== "authenticated" || !session?.user?.id) return;
    getUserOrders(session.user.id).then((res) => {
      // API may return a raw array OR { data: [...] }
      const list = Array.isArray(res) ? res : (res?.data ?? []);
      setOrders(list);
      setLoading(false);
    });
  }, [status, session]);

  if (status === "loading" || loading)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <ImSpinner10 className="animate-spin text-green-600 text-4xl" />
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* ===== breadcrumb + header ===== */}
      <div className="mb-8">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-green-600 transition">
            Home
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-900 font-medium">My Orders</span>
        </nav>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/25">
              <FaBox className="text-2xl text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                My Orders
              </h1>
              <p className="text-gray-500 text-sm mt-0.5">
                Track and manage your {orders.length} order
                {orders.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <Link
            href="/"
            className="self-start sm:self-auto text-green-600 hover:text-green-700 font-medium flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-green-50 transition-all text-sm"
          >
            <FaBagShopping className="text-xs" /> Continue Shopping
          </Link>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center shadow-sm">
          <FaBoxOpen className="text-6xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            No orders yet
          </h3>
          <p className="text-gray-500 mb-6">
            Start shopping and your orders will appear here.
          </p>
          <Link
            href="/productdetails"
            className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const open = openId === order._id;
            const itemCount = order.cartItems.reduce((s, i) => s + i.count, 0);
            const extra = order.cartItems.length - 1;
            const subtotal = order.cartItems.reduce(
              (s, i) => s + i.count * i.price,
              0,
            );
            return (
              <div
                key={order._id}
                className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${
                  open
                    ? "border-green-200 shadow-lg shadow-green-100/50"
                    : "border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200"
                }`}
              >
                {/* ===== collapsed header ===== */}
                <div className="p-5 sm:p-6">
                  <div className="flex gap-5">
                    <div className="relative shrink-0">
                      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-linear-to-br from-gray-50 to-white border border-gray-100 p-2.5 overflow-hidden">
                        <img
                          src={order.cartItems[0]?.product?.imageCover}
                          alt=""
                          className="w-full h-full object-contain"
                        />
                      </div>
                      {extra > 0 && (
                        <div className="absolute -top-2 -right-2 w-7 h-7 bg-gray-900 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg">
                          +{extra}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div>
                          {/* ✅ isDelivered=false → "On the way" ; true → "Completed" */}
                          <div
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg mb-2 ${
                              order.isDelivered ? "bg-green-100" : "bg-blue-100"
                            }`}
                          >
                            {order.isDelivered ? (
                              <FaCircleCheck className="text-xs text-green-600" />
                            ) : (
                              <FaTruck className="text-xs text-blue-600" />
                            )}
                            <span
                              className={`text-xs font-semibold ${order.isDelivered ? "text-green-600" : "text-blue-600"}`}
                            >
                              {order.isDelivered ? "Completed" : "On the way"}
                            </span>
                          </div>
                          <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                            <FaHashtag className="text-xs text-gray-400" />{" "}
                            {order.id}
                          </h3>
                        </div>
                        {/* ✅ card → visa icon ; cash → money icon */}
                        <div
                          className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
                            order.paymentMethodType === "card"
                              ? "bg-purple-100"
                              : "bg-green-100"
                          }`}
                        >
                          {order.paymentMethodType === "card" ? (
                            <FaCcVisa className="text-xl text-purple-600" />
                          ) : (
                            <FaMoneyBill className="text-xl text-green-600" />
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-4">
                        <span className="flex items-center gap-1.5">
                          <FaCalendarDays className="text-xs text-gray-400" />
                          {new Date(order.createdAt).toLocaleDateString(
                            "en-US",
                            { month: "short", day: "numeric", year: "numeric" },
                          )}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-gray-300" />
                        <span className="flex items-center gap-1.5">
                          <FaBox className="text-xs text-gray-400" />{" "}
                          {itemCount} items
                        </span>
                        <span className="w-1 h-1 rounded-full bg-gray-300" />
                        <span className="flex items-center gap-1.5">
                          <FaLocationDot className="text-xs text-gray-400" />{" "}
                          {order.shippingAddress?.city}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <span className="text-2xl font-bold text-gray-900">
                            {order.totalOrderPrice}
                          </span>
                          <span className="text-sm font-medium text-gray-400 ml-1">
                            EGP
                          </span>
                        </div>
                        <button
                          onClick={() => setOpenId(open ? null : order._id)}
                          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                            open
                              ? "bg-green-600 text-white shadow-lg shadow-green-600/25"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {open ? "Hide" : "Details"}
                          <FaChevronDown
                            className={`text-xs transition-transform duration-300 ${open ? "rotate-180" : ""}`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ===== expanded details ===== */}
                {open && (
                  <div className="border-t border-gray-100 bg-gray-50/50">
                    <div className="p-5 sm:p-6">
                      <h4 className="font-semibold text-gray-900 text-sm flex items-center gap-2 mb-4">
                        <span className="w-6 h-6 rounded-lg bg-green-100 flex items-center justify-center">
                          <FaReceipt className="text-xs text-green-600" />
                        </span>
                        Order Items
                      </h4>
                      <div className="space-y-3">
                        {order.cartItems.map((item) => (
                          <div
                            key={item._id}
                            className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100"
                          >
                            <div className="w-16 h-16 rounded-xl bg-gray-50 p-2 shrink-0">
                              <img
                                src={item.product?.imageCover}
                                alt={item.product?.title}
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900 truncate">
                                {item.product?.title}
                              </p>
                              <p className="text-sm text-gray-500 mt-1">
                                <span className="font-medium text-gray-700">
                                  {item.count}
                                </span>{" "}
                                × {item.price} EGP
                              </p>
                            </div>
                            <div className="text-right shrink-0">
                              <p className="text-lg font-bold text-gray-900">
                                {item.count * item.price}
                              </p>
                              <p className="text-xs text-gray-400">EGP</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="px-5 sm:px-6 pb-5 sm:pb-6 grid sm:grid-cols-2 gap-4">
                      {/* Delivery address */}
                      <div className="p-4 bg-white rounded-xl border border-gray-100">
                        <h4 className="font-semibold text-gray-900 text-sm flex items-center gap-2 mb-3">
                          <span className="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center">
                            <FaLocationDot className="text-xs text-blue-600" />
                          </span>
                          Delivery Address
                        </h4>
                        <div className="space-y-2">
                          <p className="font-medium text-gray-900">
                            {order.shippingAddress?.city}
                          </p>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {order.shippingAddress?.details}
                          </p>
                          <p className="text-sm text-gray-600 flex items-center gap-2 pt-1">
                            <FaPhone className="text-xs text-gray-400" />{" "}
                            {order.shippingAddress?.phone}
                          </p>
                        </div>
                      </div>
                      {/* Order summary */}
                      <div className="p-4 rounded-xl bg-blue-100 border border-blue-200">
                        <h4 className="font-semibold text-gray-900 text-sm flex items-center gap-2 mb-3">
                          <span className="w-6 h-6 rounded-lg bg-blue-500 flex items-center justify-center">
                            <FaTruck className="text-xs text-white" />
                          </span>
                          Order Summary
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between text-gray-600">
                            <span>Subtotal</span>
                            <span className="font-medium">{subtotal} EGP</span>
                          </div>
                          <div className="flex justify-between text-gray-600">
                            <span>Shipping</span>
                            <span className="font-medium">
                              {order.shippingPrice === 0
                                ? "Free"
                                : `${order.shippingPrice} EGP`}
                            </span>
                          </div>
                          <hr className="border-gray-200/50 my-2" />
                          <div className="flex justify-between pt-1">
                            <span className="font-semibold text-gray-900">
                              Total
                            </span>
                            <span className="font-bold text-lg text-gray-900">
                              {order.totalOrderPrice} EGP
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
