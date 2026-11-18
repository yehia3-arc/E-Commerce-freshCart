"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "@/components/ui/toast";
import { ImSpinner10 } from "react-icons/im";
import {
  FaBox,
  FaStar,
  FaRegStar,
  FaTruck,
  FaCheck,
  FaRotateLeft,
  FaShieldHalved,
  FaPen,
  FaTrash,
} from "react-icons/fa6";
import { ProductType } from "@/api/types/product.type";
import { ReviewType } from "@/api/types/review.type";
import {
  getProductReviews,
  createReview,
  updateReview,
  deleteReview,
} from "@/actions/review.actions";
import { useRouter } from "next/navigation";

export default function ProductTabs({ product }: { product: ProductType }) {
  const { data: session, status } = useSession();
  const [tab, setTab] = useState<"details" | "reviews" | "shipping">("details");
  const [reviews, setReviews] = useState<ReviewType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function load() {
    const res = await getProductReviews(product._id);
    setReviews(Array.isArray(res) ? res : (res?.data ?? []));
    setLoading(false);
  }
  useEffect(() => {
    load();
  }, [product._id]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (status !== "authenticated") {
      toast.add({
        type: "error",
        description: "please login to write a review 😐",
      });
      return;
    }
    setBusy(true);
    const mine = reviews.find((r) => r.user?._id === session?.user?.id);
    const res = editingId
      ? await updateReview(editingId, { review: text, rating })
      : mine
        ? await updateReview(mine._id, { review: text, rating }) // ✅ already reviewed → edit
        : await createReview(product._id, { review: text, rating });
    console.log("review response", res);
    if (
      res?.status === "success" ||
      res?.message === "success" ||
      res?.data?._id
    ) {
      toast.add({
        type: "success",
        description: editingId ? "review updated ✏️" : "review added ⭐",
      });
      setShowForm(false);
      setEditingId(null);
      setText("");
      setRating(5);
      await load();
      router.refresh();
    } else
      toast.add({
        type: "error",
        description: res?.errors?.msg || res?.message || "failed 😥",
      });
    setBusy(false);
  }

  async function remove(id: string) {
    const res = await deleteReview(id);
    if (res?.status === "success" || res?.message === "success") {
      toast.add({ type: "success", description: "review deleted 🗑️" });
      await load();
      router.refresh();
    } else
      toast.add({
        type: "error",
        description: res?.errors?.msg || res?.message || "failed 😥",
      });
  }

  const total = reviews.length;
  const dist = [5, 4, 3, 2, 1].map((s) => {
    const c = reviews.filter((r) => Math.round(r.rating) === s).length;
    return { s, pct: total ? Math.round((c / total) * 100) : 0 };
  });

  const tabBtn = (key: typeof tab, icon: React.ReactNode, label: string) => (
    <button
      type="button"
      onClick={() => setTab(key)}
      className={`flex items-center gap-2 px-6 py-4 font-medium whitespace-nowrap transition-all duration-200 ${
        tab === key
          ? "text-green-600 border-b-2 border-green-600 bg-green-50/50"
          : "text-gray-600 hover:text-green-600 hover:bg-gray-50"
      }`}
    >
      {icon} {label}
    </button>
  );

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="flex overflow-x-auto">
              {tabBtn(
                "details",
                <FaBox className="text-sm" />,
                "Product Details",
              )}
              {tabBtn(
                "reviews",
                <FaStar className="text-sm" />,
                `Reviews (${product.ratingsQuantity})`,
              )}
              {tabBtn(
                "shipping",
                <FaTruck className="text-sm" />,
                "Shipping & Returns",
              )}
            </div>
          </div>

          <div className="p-6">
            {tab === "details" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    About this Product
                  </h3>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                    {product.description}
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">
                      Product Information
                    </h4>
                    <ul className="space-y-2">
                      {[
                        ["Category", product.category?.name],
                        ["Subcategory", product.subcategory?.[0]?.name],
                        ["Brand", product.brand?.name],
                        ["Items Sold", `${product.sold}+ sold`],
                      ].map(([k, v]) => (
                        <li key={k} className="flex justify-between text-sm">
                          <span className="text-gray-500">{k}</span>
                          <span className="text-gray-900 font-medium">{v}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">
                      Key Features
                    </h4>
                    <ul className="space-y-2">
                      {[
                        "Premium Quality Product",
                        "100% Authentic Guarantee",
                        "Fast & Secure Packaging",
                        "Quality Tested",
                      ].map((f) => (
                        <li
                          key={f}
                          className="flex items-center text-sm text-gray-600"
                        >
                          <FaCheck className="text-green-600 mr-2 w-4" /> {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {tab === "reviews" && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-gray-900 mb-2">
                      {product.ratingsAverage}
                    </div>
                    <div className="text-yellow-400 flex justify-center">
                      {[1, 2, 3, 4, 5].map((s) =>
                        product.ratingsAverage >= s ? (
                          <FaStar key={s} />
                        ) : product.ratingsAverage >= s - 0.5 ? (
                          <FaStar key={s} className="opacity-50" />
                        ) : (
                          <FaRegStar key={s} />
                        ),
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      Based on {product.ratingsQuantity} reviews
                    </p>
                  </div>
                  <div className="flex-1 w-full">
                    {dist.map(({ s, pct }) => (
                      <div key={s} className="flex items-center gap-3 mb-2">
                        <span className="text-sm text-gray-600 w-8">
                          {s} star
                        </span>
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-yellow-400 rounded-full transition-all duration-300"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-500 w-10">
                          {pct}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-semibold text-gray-900">
                      Customer Reviews
                    </h4>
                    <button
                      type="button"
                      onClick={() => {
                        setShowForm(!showForm);
                        setEditingId(null);
                        setText("");
                        setRating(5);
                      }}
                      className="text-green-600 hover:text-green-700 font-medium"
                    >
                      Write a Review
                    </button>
                  </div>

                  {showForm && (
                    <form
                      onSubmit={submit}
                      className="bg-gray-50 rounded-xl p-4 mb-6 space-y-3"
                    >
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setRating(s)}
                            className="text-xl"
                          >
                            {s <= rating ? (
                              <FaStar className="text-yellow-400" />
                            ) : (
                              <FaRegStar className="text-gray-300" />
                            )}
                          </button>
                        ))}
                      </div>
                      <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        required
                        rows={3}
                        placeholder="Share your experience with this product..."
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none resize-none"
                      />
                      <div className="flex gap-2">
                        <button
                          type="submit"
                          disabled={busy}
                          className="px-5 py-2.5 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 disabled:opacity-60 flex items-center gap-2"
                        >
                          {busy && <ImSpinner10 className="animate-spin" />}{" "}
                          {editingId ? "Update" : "Submit"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowForm(false)}
                          className="px-5 py-2.5 rounded-xl bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}

                  {loading ? (
                    <div className="flex justify-center py-8">
                      <ImSpinner10 className="animate-spin text-green-600 text-3xl" />
                    </div>
                  ) : reviews.length === 0 ? (
                    <div className="text-center py-8">
                      <FaStar className="text-4xl text-gray-300 mb-3 mx-auto" />
                      <p className="text-gray-500">
                        Customer reviews will be displayed here.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {reviews.map((r) => (
                        <div key={r._id} className="bg-gray-50 rounded-xl p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <span className="w-9 h-9 rounded-full bg-green-100 text-green-700 font-bold flex items-center justify-center">
                                {r.user?.name?.[0]?.toUpperCase() ?? "U"}
                              </span>
                              <div>
                                <p className="font-medium text-gray-900 text-sm">
                                  {r.user?.name}
                                </p>
                                <p className="text-xs text-gray-400">
                                  {new Date(r.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="text-yellow-400 flex text-sm">
                                {[1, 2, 3, 4, 5].map((s) =>
                                  s <= r.rating ? (
                                    <FaStar key={s} />
                                  ) : (
                                    <FaRegStar
                                      key={s}
                                      className="text-gray-300"
                                    />
                                  ),
                                )}
                              </div>
                              {session?.user?.id === r.user?._id && (
                                <>
                                  <button
                                    type="button"
                                    title="Edit"
                                    onClick={() => {
                                      setEditingId(r._id);
                                      setText(r.review);
                                      setRating(r.rating);
                                      setShowForm(true);
                                    }}
                                    className="text-gray-400 hover:text-green-600"
                                  >
                                    <FaPen className="text-xs" />
                                  </button>
                                  <button
                                    type="button"
                                    title="Delete"
                                    onClick={() => remove(r._id)}
                                    className="text-gray-400 hover:text-red-500"
                                  >
                                    <FaTrash className="text-xs" />
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-gray-600">{r.review}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {tab === "shipping" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-linear-to-br from-green-50 to-green-100 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-12 w-12 bg-green-600 text-white rounded-full flex items-center justify-center">
                        <FaTruck className="text-xl" />
                      </div>
                      <h4 className="font-semibold text-gray-900">
                        Shipping Information
                      </h4>
                    </div>
                    <ul className="space-y-3">
                      {[
                        "Free shipping on orders over 500 EGP",
                        "Standard delivery: 3-5 business days",
                        "Express delivery available (1-2 business days)",
                        "Track your order in real-time",
                      ].map((t) => (
                        <li
                          key={t}
                          className="flex items-start gap-2 text-sm text-gray-700"
                        >
                          <FaCheck className="text-green-600 mt-0.5" /> {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-linear-to-br from-green-50 to-green-100 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-12 w-12 bg-green-600 text-white rounded-full flex items-center justify-center">
                        <FaRotateLeft className="text-xl" />
                      </div>
                      <h4 className="font-semibold text-gray-900">
                        Returns & Refunds
                      </h4>
                    </div>
                    <ul className="space-y-3">
                      {[
                        "30-day hassle-free returns",
                        "Full refund or exchange available",
                        "Free return shipping on defective items",
                        "Easy online return process",
                      ].map((t) => (
                        <li
                          key={t}
                          className="flex items-start gap-2 text-sm text-gray-700"
                        >
                          <FaCheck className="text-green-600 mt-0.5" /> {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-6 flex items-center gap-4">
                  <div className="h-14 w-14 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center shrink-0">
                    <FaShieldHalved className="text-2xl" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      Buyer Protection Guarantee
                    </h4>
                    <p className="text-sm text-gray-600">
                      Get a full refund if your order doesn't arrive or isn't as
                      described. We ensure your shopping experience is safe and
                      secure.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
