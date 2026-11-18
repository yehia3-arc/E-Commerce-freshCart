"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { BrandType, CategoryType, ProductType } from "@/api/types/product.type";
import ProductCard from "@/app/_components/ProductCard/ProductCard";
import AddBtn from "@/app/_components/AddBtn/AddBtn";
import { proxyImage } from "@/lib/utils";
import Image from "next/image";
import { ImSpinner10 } from "react-icons/im";
import { IoMdStarHalf } from "react-icons/io";
import {
  FaChevronLeft,
  FaChevronRight,
  FaFilter,
  FaGripVertical,
  FaList,
  FaMagnifyingGlass,
  FaPlus,
  FaRegEye,
  FaRegHeart,
  FaRegStar,
  FaSliders,
  FaStar,
  FaXmark,
} from "react-icons/fa6";
import {
  getAllBrands,
  getAllCategory,
  getAllProducts,
} from "@/api/services/routemisr.service";

const PER_PAGE = 12;

export default function SearchPage() {
  const sp = useSearchParams();
  const q = sp.get("q") ?? "";

  const [all, setAll] = useState<ProductType[]>([]);
  const [booting, setBooting] = useState(true);
  const [searching, setSearching] = useState(false);
  const [query, setQuery] = useState(q);
  const [cats, setCats] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");
  const [sort, setSort] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(1);
  const [allCats, setAllCats] = useState<CategoryType[]>([]);
  const [allBrands, setAllBrands] = useState<BrandType[]>([]);
  useEffect(() => {
    getAllProducts().then((r) => {
      setAll(r ?? []);
      setBooting(false);
    });
    getAllCategory().then((r) => setAllCats(r ?? []));
    getAllBrands().then((r) => setAllBrands(r ?? []));
  }, []);
  useEffect(() => {
    setQuery(q);
    setPage(1);
  }, [q]);
  useEffect(() => {
    // "Searching products…" spinner like the video
    setSearching(true);
    const t = setTimeout(() => setSearching(false), 400);
    return () => clearTimeout(t);
  }, [query, cats, brands, min, max, sort]);

  const categories = useMemo(
    () =>
      [
        ...new Set(all.map((p) => p.category?.name).filter(Boolean)),
      ] as string[],
    [all],
  );
  const brandsList = useMemo(
    () =>
      [...new Set(all.map((p) => p.brand?.name).filter(Boolean))] as string[],
    [all],
  );

  const filtered = useMemo(() => {
    let list = [...all];
    const t = query.trim().toLowerCase();
    if (t) list = list.filter((p) => p.title.toLowerCase().includes(t));
    if (cats.length)
      list = list.filter((p) => cats.includes(p.category?.name ?? ""));
    if (brands.length)
      list = list.filter((p) => brands.includes(p.brand?.name ?? ""));
    if (min !== "") list = list.filter((p) => p.price >= +min);
    if (max !== "") list = list.filter((p) => p.price <= +max);
    if (sort === "price") list.sort((a, b) => a.price - b.price);
    if (sort === "-price") list.sort((a, b) => b.price - a.price);
    if (sort === "-ratingsAverage")
      list.sort((a, b) => b.ratingsAverage - a.ratingsAverage);
    if (sort === "title") list.sort((a, b) => a.title.localeCompare(b.title));
    if (sort === "-title") list.sort((a, b) => b.title.localeCompare(a.title));
    return list;
  }, [all, query, cats, brands, min, max, sort]);

  const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const current = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const toggle = (arr: string[], set: (v: string[]) => void, v: string) => {
    set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);
    setPage(1);
  };
  const clearAll = () => {
    setQuery("");
    setCats([]);
    setBrands([]);
    setMin("");
    setMax("");
    setSort("");
    setPage(1);
  };

  const chip =
    "flex items-center gap-1.5 bg-gray-100 text-gray-600 text-xs px-3 py-1.5 rounded-full";

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* ===== Header + search box ===== */}
      <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 py-6">
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-green-600 transition-colors">
              Home
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-gray-900 font-medium">Search Results</span>
          </nav>
          <form
            className="max-w-2xl"
            onSubmit={(e) => {
              e.preventDefault();
              setPage(1);
            }}
          >
            <div className="relative">
              <FaMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="Search for products..."
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all text-lg"
              />
            </div>
          </form>
          {query.trim() && (
            <div className="mt-4">
              <h1 className="text-2xl font-bold text-gray-900">
                Search Results for &quot;{query}&quot;
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                We found {filtered.length} products for you
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* ===== Sidebar filters ===== */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-24 space-y-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-900">Categories</h3>
                  {cats.length > 0 && (
                    <span className="text-xs font-medium text-green-600">
                      {cats.length} selected
                    </span>
                  )}
                </div>
                <div className="space-y-2 max-h-52 overflow-y-auto">
                  {allCats.map((c) => (
                    <label
                      key={c._id}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        checked={cats.includes(c.name)}
                        onChange={() => toggle(cats, setCats, c.name)}
                        className="w-4 h-4 rounded border-gray-300 accent-green-600"
                      />
                      <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                        {c.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              <hr className="border-gray-100" />
              <div>
                <h3 className="font-bold text-gray-900 mb-4">Price Range</h3>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">
                      Min (EGP)
                    </label>
                    <input
                      type="number"
                      value={min}
                      onChange={(e) => {
                        setMin(e.target.value);
                        setPage(1);
                      }}
                      placeholder="0"
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">
                      Max (EGP)
                    </label>
                    <input
                      type="number"
                      value={max}
                      onChange={(e) => {
                        setMax(e.target.value);
                        setPage(1);
                      }}
                      placeholder="No limit"
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none"
                    />
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {[500, 1000, 5000, 10000].map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => {
                        setMin("");
                        setMax(String(v));
                        setPage(1);
                      }}
                      className="px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                    >
                      Under {v >= 1000 ? `${v / 1000}K` : v}
                    </button>
                  ))}
                </div>
              </div>
              <hr className="border-gray-100" />
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-900">Brands</h3>
                  {brands.length > 0 && (
                    <span className="text-xs font-medium text-green-600">
                      {brands.length} selected
                    </span>
                  )}
                </div>
                <div className="space-y-2 max-h-52 overflow-y-auto">
                  {allBrands.map((b) => (
                    <label
                      key={b._id}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        checked={brands.includes(b.name)}
                        onChange={() => toggle(brands, setBrands, b.name)}
                        className="w-4 h-4 rounded border-gray-300 accent-green-600"
                      />
                      <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                        {b.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* ===== Results ===== */}
          <main className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  <FaSliders /> Filters
                </button>
                <div className="flex items-center gap-1 bg-white rounded-lg border border-gray-200 p-1">
                  <button
                    type="button"
                    aria-label="Grid view"
                    onClick={() => setView("grid")}
                    className={`p-2 rounded-md transition-colors ${view === "grid" ? "bg-green-600 text-white" : "text-gray-500 hover:text-gray-700"}`}
                  >
                    <FaGripVertical />
                  </button>
                  <button
                    type="button"
                    aria-label="List view"
                    onClick={() => setView("list")}
                    className={`p-2 rounded-md transition-colors ${view === "list" ? "bg-green-600 text-white" : "text-gray-500 hover:text-gray-700"}`}
                  >
                    <FaList />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Sort by:</span>
                <select
                  value={sort}
                  onChange={(e) => {
                    setSort(e.target.value);
                    setPage(1);
                  }}
                  className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none bg-white"
                >
                  <option value="">Relevance</option>
                  <option value="price">Price: Low to High</option>
                  <option value="-price">Price: High to Low</option>
                  <option value="-ratingsAverage">Rating: High to Low</option>
                  <option value="title">Name: A to Z</option>
                  <option value="-title">Name: Z to A</option>
                </select>
              </div>
            </div>

            {/* Active filter chips */}
            {(query || cats.length || brands.length || min || max) && (
              <div className="flex flex-wrap items-center gap-2 mb-6 text-sm">
                <span className="flex items-center gap-1.5 text-gray-500">
                  <FaFilter /> Active:
                </span>
                {query && (
                  <span className={chip}>
                    &quot;{query}&quot;{" "}
                    <button onClick={() => setQuery("")}>
                      <FaXmark />
                    </button>
                  </span>
                )}
                {cats.map((c) => (
                  <span key={c} className={chip}>
                    {c}{" "}
                    <button onClick={() => toggle(cats, setCats, c)}>
                      <FaXmark />
                    </button>
                  </span>
                ))}
                {brands.map((b) => (
                  <span key={b} className={chip}>
                    {b}{" "}
                    <button onClick={() => toggle(brands, setBrands, b)}>
                      <FaXmark />
                    </button>
                  </span>
                ))}
                {(min || max) && (
                  <span className={chip}>
                    {min || 0}–{max || "∞"} EGP{" "}
                    <button
                      onClick={() => {
                        setMin("");
                        setMax("");
                      }}
                    >
                      <FaXmark />
                    </button>
                  </span>
                )}
                <button
                  onClick={clearAll}
                  className="text-gray-500 underline hover:text-red-500"
                >
                  Clear all
                </button>
              </div>
            )}

            {/* Content */}
            {booting || searching ? (
              <div className="flex flex-col items-center justify-center py-24 text-gray-500">
                <ImSpinner10 className="animate-spin text-green-600 text-3xl mb-3" />
                Searching products...
              </div>
            ) : current.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-5">
                  <FaMagnifyingGlass className="text-3xl text-gray-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  No Products Found
                </h3>
                <p className="text-gray-500 mb-6">
                  Try adjusting your search or filters to find what you&apos;re
                  looking for.
                </p>
                <button
                  onClick={clearAll}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : view === "grid" ? (
              <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-6">
                {current.map((p) => (
                  <Link
                    key={p.id}
                    href={`/productdetails/${p.id}`}
                    className="block"
                  >
                    <ProductCard product={p} />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {current.map((p) => (
                  <Link
                    key={p.id}
                    href={`/productdetails/${p.id}`}
                    className="block"
                  >
                    <ProductCard product={p} />
                  </Link>
                ))}
              </div>
            )}

            {/* Pagination */}
            {pages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <FaChevronLeft />
                </button>
                {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    onClick={() => setPage(n)}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center font-medium transition-colors ${
                      n === page
                        ? "bg-green-600 text-white"
                        : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {n}
                  </button>
                ))}
                <button
                  disabled={page === pages}
                  onClick={() => setPage(page + 1)}
                  className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <FaChevronRight />
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
