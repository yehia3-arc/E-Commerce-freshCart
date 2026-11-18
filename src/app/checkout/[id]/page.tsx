"use client";
import { useContext, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@base-ui/react";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { toast } from "@/components/ui/toast";
import { ImSpinner10 } from "react-icons/im";
import {
  FaReceipt,
  FaArrowLeft,
  FaHouse,
  FaCircleInfo,
  FaCity,
  FaLocationDot,
  FaPhone,
  FaWallet,
  FaMoneyBill,
  FaCreditCard,
  FaCheck,
  FaShieldHalved,
  FaBagShopping,
  FaTruck,
  FaBox,
  FaCcVisa,
  FaCcMastercard,
  FaCcAmex,
} from "react-icons/fa6";
import {
  CheckoutSchemas,
  checkoutSchemaType,
} from "@/schemas/checkout.schemas";
import { onlinePayment, cashOnDelivery } from "@/actions/checkout.actions";
import { getLoggedUserCart } from "@/actions/cart.actions";
import { CartData } from "@/api/types/cart.types";
import { CartContext } from "@/context/CartContext";

export default function Checkout() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { setnumberOfCartItems } = useContext(CartContext);
  const [cart, setCart] = useState<CartData | null>(null);
  const [method, setMethod] = useState<"cash" | "online">("cash");
  const [placing, setPlacing] = useState(false);

  const form = useForm<checkoutSchemaType>({
    defaultValues: { details: "", phone: "", city: "" },
    resolver: zodResolver(CheckoutSchemas),
  });
  const { handleSubmit, control } = form;

  useEffect(() => {
    getLoggedUserCart().then((res) => {
      if (res?.status === "success") setCart(res.data);
    });
  }, []);

  const items = cart?.products ?? [];
  const subtotal = cart?.totalCartPrice ?? 0;
  const shipping = subtotal >= 500 ? 0 : 50;
  const total = subtotal + shipping;

  async function onSubmit(data: checkoutSchemaType) {
    setPlacing(true);
    if (method === "cash") {
      const res = await cashOnDelivery(id, data);
      if (res?.status === "success") {
        setnumberOfCartItems(0); // cart emptied server-side → badge 0
        toast.add({
          type: "success",
          description: "order placed successfully 🎉",
        });
        router.push("/orders");
      } else {
        toast.add({
          type: "error",
          description: res?.message || "failed to place order 😥",
        });
      }
    } else {
      const res = await onlinePayment(id, window.location.origin, data); // ✅ fixed url
      if (res?.status === "success" && res?.session?.url) {
        window.location.href = res.session.url; // Stripe hosted TEST MODE page
      } else {
        toast.add({
          type: "error",
          description: res?.message || "failed to start payment 😥",
        });
      }
    }
    setPlacing(false);
  }

  const inputCls = (invalid: boolean) =>
    `w-full px-4 py-3.5 pl-14 border-2 rounded-xl focus:outline-none transition-all ${
      invalid
        ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100"
        : "border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-100"
    }`;
  const iconBox =
    "absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center";

  if (!cart)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <ImSpinner10 className="animate-spin text-green-600 text-4xl" />
      </div>
    );

  return (
    <div className="bg-linear-to-b from-gray-50 to-white min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* breadcrumb + header */}
        <div className="mb-8">
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-green-600 transition">
              Home
            </Link>
            <span className="text-gray-300">/</span>
            <Link href="/cart" className="hover:text-green-600 transition">
              Cart
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-gray-900 font-medium">Checkout</span>
          </nav>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <span className="bg-linear-to-br from-green-600 to-green-700 text-white w-12 h-12 rounded-xl flex items-center justify-center shadow-lg shadow-green-600/20">
                  <FaReceipt />
                </span>
                Complete Your Order
              </h1>
              <p className="text-gray-500 mt-2">
                Review your items and complete your purchase
              </p>
            </div>
            <Link
              href="/cart"
              className="text-green-600 hover:text-green-700 font-medium flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-green-50 transition-all"
            >
              <FaArrowLeft /> Back to Cart
            </Link>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* ===== Shipping Address ===== */}
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                <div className="bg-linear-to-r from-green-600 to-green-700 px-6 py-4">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <FaHouse /> Shipping Address
                  </h2>
                  <p className="text-green-100 text-sm mt-1">
                    Where should we deliver your order?
                  </p>
                </div>
                <div className="p-6 space-y-5">
                  <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                      <FaCircleInfo className="text-blue-600 text-sm" />
                    </div>
                    <div>
                      <p className="text-sm text-blue-800 font-medium">
                        Delivery Information
                      </p>
                      <p className="text-xs text-blue-600 mt-0.5">
                        Please ensure your address is accurate for smooth
                        delivery
                      </p>
                    </div>
                  </div>

                  <Controller
                    name="city"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel
                          htmlFor="city"
                          className="block text-sm font-semibold text-gray-700 mb-2"
                        >
                          City <span className="text-red-500">*</span>
                        </FieldLabel>
                        <div className="relative">
                          <div className={iconBox}>
                            <FaCity className="text-gray-500 text-sm" />
                          </div>
                          <Input
                            id="city"
                            type="text"
                            placeholder="e.g. Cairo, Alexandria, Giza"
                            className={inputCls(fieldState.invalid)}
                            {...field}
                          />
                        </div>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />

                  <Controller
                    name="details"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel
                          htmlFor="details"
                          className="block text-sm font-semibold text-gray-700 mb-2"
                        >
                          Street Address <span className="text-red-500">*</span>
                        </FieldLabel>
                        <div className="relative">
                          <div className="absolute left-4 top-4 w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                            <FaLocationDot className="text-gray-500 text-sm" />
                          </div>
                          <textarea
                            id="details"
                            rows={3}
                            placeholder="Street name, building number, floor, apartment..."
                            className={`${inputCls(fieldState.invalid)} resize-none`}
                            {...field}
                          />
                        </div>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />

                  <Controller
                    name="phone"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel
                          htmlFor="phone"
                          className="block text-sm font-semibold text-gray-700 mb-2"
                        >
                          Phone Number <span className="text-red-500">*</span>
                        </FieldLabel>
                        <div className="relative">
                          <div className={iconBox}>
                            <FaPhone className="text-gray-500 text-sm" />
                          </div>
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="01xxxxxxxxx"
                            className={inputCls(fieldState.invalid)}
                            {...field}
                            onChange={(e) =>
                              field.onChange(e.target.value.replace(/\D/g, ""))
                            }
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                            Egyptian numbers only
                          </span>
                        </div>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </div>
              </div>

              {/* ===== Payment Method ===== */}
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                <div className="bg-linear-to-r from-green-600 to-green-700 px-6 py-4">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <FaWallet /> Payment Method
                  </h2>
                  <p className="text-green-100 text-sm mt-1">
                    Choose how you'd like to pay
                  </p>
                </div>
                <div className="p-6 space-y-4">
                  <button
                    type="button"
                    onClick={() => setMethod("cash")}
                    className={`w-full p-5 rounded-xl border-2 transition-all flex items-center gap-4 group ${
                      method === "cash"
                        ? "border-green-500 bg-linear-to-r from-green-50 to-emerald-50 shadow-sm"
                        : "border-gray-200 hover:border-green-200 hover:bg-gray-50"
                    }`}
                  >
                    <div
                      className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all ${
                        method === "cash"
                          ? "bg-linear-to-br from-green-500 to-green-600 text-white shadow-lg shadow-green-500/30"
                          : "bg-gray-100 text-gray-400 group-hover:bg-gray-200"
                      }`}
                    >
                      <FaMoneyBill className="text-xl" />
                    </div>
                    <div className="flex-1 text-left">
                      <h3
                        className={`font-bold ${method === "cash" ? "text-green-700" : "text-gray-900"}`}
                      >
                        Cash on Delivery
                      </h3>
                      <p className="text-sm text-gray-500 mt-0.5">
                        Pay when your order arrives at your doorstep
                      </p>
                    </div>
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                        method === "cash"
                          ? "bg-green-600 text-white"
                          : "border-2 border-gray-200"
                      }`}
                    >
                      {method === "cash" && <FaCheck className="text-xs" />}
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMethod("online")}
                    className={`w-full p-5 rounded-xl border-2 transition-all flex items-center gap-4 group ${
                      method === "online"
                        ? "border-green-500 bg-linear-to-r from-green-50 to-blue-50 shadow-sm"
                        : "border-gray-200 hover:border-green-200 hover:bg-gray-50"
                    }`}
                  >
                    <div
                      className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all ${
                        method === "online"
                          ? "bg-linear-to-br from-green-500 to-blue-600 text-white shadow-lg shadow-green-500/30"
                          : "bg-gray-100 text-gray-400 group-hover:bg-gray-200"
                      }`}
                    >
                      <FaCreditCard className="text-xl" />
                    </div>
                    <div className="flex-1 text-left">
                      <h3
                        className={`font-bold ${method === "online" ? "text-green-700" : "text-gray-900"}`}
                      >
                        Pay Online
                      </h3>
                      <p className="text-sm text-gray-500 mt-0.5">
                        Secure payment with Credit/Debit Card via Stripe
                      </p>
                      <div className="flex items-center gap-2 mt-2 text-2xl">
                        <FaCcVisa className="text-blue-700" />
                        <FaCcMastercard className="text-red-500" />
                        <FaCcAmex className="text-blue-500" />
                      </div>
                    </div>
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                        method === "online"
                          ? "bg-green-600 text-white"
                          : "border-2 border-gray-200"
                      }`}
                    >
                      {method === "online" && <FaCheck className="text-xs" />}
                    </div>
                  </button>

                  <div className="flex items-center gap-3 p-4 bg-linear-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100 mt-4">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                      <FaShieldHalved className="text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-green-800">
                        Secure & Encrypted
                      </p>
                      <p className="text-xs text-green-600 mt-0.5">
                        Your payment info is protected with 256-bit SSL
                        encryption
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ===== Order Summary ===== */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm sticky top-4">
                <div className="bg-linear-to-r from-green-600 to-green-700 px-6 py-4">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <FaBagShopping /> Order Summary
                  </h2>
                  <p className="text-green-100 text-sm mt-1">
                    {items.length} items
                  </p>
                </div>
                <div className="p-5">
                  <div className="space-y-3 max-h-56 overflow-y-auto mb-5 pr-1">
                    {items.map((i) => (
                      <div
                        key={i._id}
                        className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <div className="w-14 h-14 rounded-lg bg-white p-1 border border-gray-100 shrink-0">
                          <img
                            src={i.product.imageCover}
                            alt={i.product.title}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {i.product.title}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {i.count} × {i.price} EGP
                          </p>
                        </div>
                        <p className="text-sm font-bold text-gray-900 shrink-0">
                          {i.count * i.price}
                        </p>
                      </div>
                    ))}
                  </div>
                  <hr className="border-gray-100 my-4" />
                  <div className="space-y-3">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span className="font-medium">{subtotal} EGP</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span className="flex items-center gap-2">
                        <FaTruck className="text-gray-400" /> Shipping
                      </span>
                      {shipping === 0 ? (
                        <span className="text-green-600 font-semibold">
                          FREE
                        </span>
                      ) : (
                        <span className="font-medium">{shipping} EGP</span>
                      )}
                    </div>
                    <hr className="border-gray-100" />
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-900">
                        Total
                      </span>
                      <div className="text-right">
                        <span className="text-2xl font-bold text-green-600">
                          {total}
                        </span>
                        <span className="text-sm text-gray-500 ml-1">EGP</span>
                      </div>
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={placing}
                    className="w-full mt-6 bg-linear-to-r from-green-600 to-green-700 text-white py-4 rounded-xl font-bold hover:from-green-700 hover:to-green-800 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-green-600/20 active:scale-[0.98]"
                  >
                    {placing ? (
                      <ImSpinner10 className="animate-spin" />
                    ) : method === "cash" ? (
                      <FaBox />
                    ) : (
                      <FaShieldHalved />
                    )}
                    {method === "cash" ? "Place Order" : "Proceed to Payment"}
                  </button>
                  <div className="flex items-center justify-center gap-4 mt-4 py-3 border-t border-gray-100">
                    <span className="flex items-center gap-1.5 text-xs text-gray-500">
                      <FaShieldHalved className="text-green-500" /> Secure
                    </span>
                    <div className="w-px h-4 bg-gray-200" />
                    <span className="flex items-center gap-1.5 text-xs text-gray-500">
                      <FaTruck className="text-blue-500" /> Fast Delivery
                    </span>
                    <div className="w-px h-4 bg-gray-200" />
                    <span className="flex items-center gap-1.5 text-xs text-gray-500">
                      <FaBox className="text-orange-500" /> Easy Returns
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
