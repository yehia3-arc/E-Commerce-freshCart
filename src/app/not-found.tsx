"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FaAppleWhole,
  FaArrowLeft,
  FaCarrot,
  FaCartShopping,
  FaHouse,
  FaLemon,
  FaSeedling,
} from "react-icons/fa6";

export default function NotFound() {
  const router = useRouter();

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#fafbfc] px-4 py-16">
      {/* ===== Floating fruits + blobs ===== */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <FaAppleWhole className="absolute top-[10%] left-[5%] text-4xl text-green-200  " />
        <FaCarrot className="absolute top-[20%] right-[10%] text-3xl text-green-200 " />
        <FaLemon className="absolute bottom-[25%] left-[8%] text-3xl text-green-200 " />
        <FaSeedling className="absolute bottom-[15%] right-[15%] text-4xl text-green-200 " />
        <FaAppleWhole className="absolute top-[50%] left-[15%] text-2xl text-green-100" />
        <FaCarrot className="absolute top-[40%] right-[5%] text-2xl text-green-100" />
        <div className="absolute top-0 right-0 h-125 w-125 rounded-full bg-linear-to-bl from-green-100/40 to-transparent blur-3xl" />
        <div className="absolute bottom-0 left-0 h-100 w-100 rounded-full bg-linear-to-tr from-green-100/30 to-transparent blur-3xl" />
      </div>

      {/* ===== Content ===== */}
      <div className="relative z-10 w-full max-w-xl">
        {/* Cart illustration */}
        <div className="mb-10 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 h-52 w-64 rounded-[32px] bg-green-100/50 blur-2xl sm:h-60 sm:w-72" />
            <div className="relative h-52 w-64 sm:h-60 sm:w-72">
              <div className="absolute inset-x-0 top-4 mx-auto flex h-40 w-52 items-center justify-center overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-xl shadow-gray-200/60 sm:h-44 sm:w-60">
                <div className="absolute inset-0 bg-linear-to-br from-green-50/80 via-transparent to-green-100/40" />
                <FaCartShopping className="relative text-6xl text-green-400/80 sm:text-7xl" />
              </div>
              {/* 404 badge */}
              <div className="absolute -top-2 -right-2 sm:top-0 sm:right-0">
                <div className="relative">
                  <div className="absolute -inset-2 rounded-full bg-white shadow-lg" />
                  <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-br from-green-500 to-green-600 shadow-lg shadow-green-500/40 sm:h-20 sm:w-20">
                    <span className="text-xl font-black tracking-tight text-white sm:text-2xl">
                      404
                    </span>
                  </div>
                </div>
              </div>
              {/* wheels */}
              <div className="absolute -bottom-1 left-1/2 flex -translate-x-1/2 items-center justify-center gap-4">
                <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
                <div className="h-4 w-8 rounded-b-full border-b-[3px] border-green-400" />
                <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Heading */}
        <div className="mb-10 text-center">
          <h1 className="mb-4 text-4xl font-black tracking-tight text-gray-900 sm:text-5xl">
            Oops! Nothing Here
          </h1>
          <p className="mx-auto max-w-md text-lg leading-relaxed text-gray-500">
            Looks like this page went out of stock! Don&apos;t worry,
            there&apos;s plenty more fresh content to explore.
          </p>
        </div>

        {/* Buttons */}
        <div className="mb-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/"
            className="group inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-green-600 px-8 py-4 text-lg font-bold text-white shadow-lg shadow-green-600/25 transition-all duration-300 hover:-translate-y-1 hover:bg-green-700 hover:shadow-xl hover:shadow-green-600/30 sm:w-auto"
          >
            <FaHouse className="transition-transform duration-300 group-hover:scale-110" />
            Go to Homepage
          </Link>
          <button
            type="button"
            onClick={() => router.back()}
            className="group inline-flex w-full items-center justify-center gap-3 rounded-2xl border border-gray-200 bg-white px-8 py-4 text-lg font-bold text-gray-700 shadow-md transition-all duration-300 hover:-translate-y-1 hover:bg-gray-50 hover:shadow-lg sm:w-auto"
          >
            <FaArrowLeft className="transition-transform duration-300 group-hover:-translate-x-1" />
            Go Back
          </button>
        </div>

        {/* Popular destinations */}
        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <p className="mb-4 text-center text-sm font-medium uppercase tracking-wider text-gray-400">
            Popular Destinations
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/productdetails"
              className="rounded-xl bg-green-50 px-5 py-2.5 text-sm font-semibold text-green-700 transition-colors hover:bg-green-100"
            >
              All Products
            </Link>
            <Link
              href="/categories"
              className="rounded-xl bg-gray-100 px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-200"
            >
              Categories
            </Link>
            <Link
              href="/brands"
              className="rounded-xl bg-gray-100 px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-200"
            >
              Brands
            </Link>
            <Link
              href="/contact"
              className="rounded-xl bg-gray-100 px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-200"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
