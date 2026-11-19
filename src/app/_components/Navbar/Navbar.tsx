"use client";
import React, { useContext } from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  LuChevronDown,
  LuHeadset,
  LuHeart,
  LuMail,
  LuMenu,
  LuSearch,
  LuUser,
  LuX,
  LuLogOut,
  LuPackage,
  LuMapPin,
  LuSettings,
} from "react-icons/lu";
import { FaShoppingCart } from "react-icons/fa";

import { FaAddressCard } from "react-icons/fa";
import { WishlistContext } from "@/context/WishlistContext";
import { FaRegHeart } from "react-icons/fa6";

import logo from "@/assets/pictures/faction.png";
import { FaGift, FaPhoneAlt, FaTruck, FaUserPlus } from "react-icons/fa";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
// import { getLoggedUserCart } from "@/actions/cart.actions";
// import { guestCartCount } from "@/lib/guestCart";
import { useRouter } from "next/navigation";
import { CartContext } from "@/context/CartContext";

const links = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/productdetails" },
  { label: "Categories", href: "/categories" },
  { label: "Brands", href: "/brands" },
];

const categoryLinks = [
  { label: "All Categories", href: "/categories" },
  { label: "Electronics", href: "/productdetails?category=electronics" },
  {
    label: "Women's Fashion",
    href: "/productdetails?category=women's-fashion",
  },
  { label: "Men's Fashion", href: "/productdetails?category=men's-fashion" },
  //{ label: "Beauty & Health", href: "/productdetails?category=beauty-health" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();
  const [term, setTerm] = useState("");
  const { numberOfCartItems } = useContext(CartContext);

  console.log(numberOfCartItems);
  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    if (term.trim())
      router.push(`/search?q=${encodeURIComponent(term.trim())}`);
  }
  const { numberOfWishlistItems } = useContext(WishlistContext);

  // console.log(mySession);
  //status : loading , authenticated , umauthenticated
  function handleLogOut() {
    signOut({ redirect: true, callbackUrl: "/login" });
  }
  // const [cartCount, setCartCount] = useState(0);
  // useEffect(() => {
  //   async function sync() {
  //     if (status === "authenticated") {
  //       const res = await getLoggedUserCart();
  //       setCartCount(res?.numOfCartItems ?? 0);
  //     } else setCartCount(guestCartCount());
  //   }
  //   sync();
  //   window.addEventListener("guest-cart-changed", sync);
  //   return () => window.removeEventListener("guest-cart-changed", sync);
  // }, [status]);
  return (
    <>
      <div className="hidden lg:block text-sm border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-10">
            <div className="flex items-center gap-6 text-gray-500">
              <span className="flex items-center gap-2">
                <FaTruck className="text-green-600 " />
                Free Shipping on Orders 500 EGP
              </span>
              <span className="flex items-center gap-2">
                <FaGift className="text-green-600 " />
                New Arrivals Daily
              </span>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-4 text-gray-500">
                <a
                  href="tel:+1 (800) 123-4567"
                  className="flex items-center gap-1.5 hover:text-green-600"
                >
                  <FaPhoneAlt className="text-xs" />
                  +1 (800) 123-4567
                </a>
                <Link
                  href="mailto:support@freshcart.com"
                  className="flex items-center gap-1.5 hover:text-green-600"
                >
                  <LuMail className="text-xs" />
                  support@freshcart.com
                </Link>
              </div>

              <span className="w-px h-4 bg-gray-200" />
              {status === "loading" ? (
                <span className="h-4 w-24 animate-pulse rounded bg-gray-200" />
              ) : status === "unauthenticated" ? (
                <>
                  <Link
                    href="/login"
                    className="flex items-center gap-1.5 text-gray-600 hover:text-green-600"
                  >
                    <LuUser /> Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="flex items-center gap-1.5 text-gray-600 hover:text-green-600"
                  >
                    <FaUserPlus /> Sign Up
                  </Link>
                </>
              ) : (
                <>
                  <span className="flex items-center gap-1.5 text-gray-700 font-medium">
                    <LuUser className="text-green-600" /> {session?.user?.name}
                  </span>
                  <Button
                    variant="ghost"
                    onClick={handleLogOut}
                    className="flex items-center gap-1.5 text-gray-600 hover:text-red-500 transition-colors bg-transparent"
                  >
                    <LuLogOut className="text-lg" /> Sign Out
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <header className="sticky top-0 z-40 bg-white shadow-sm">
        <div className="bg-white">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16 lg:h-18 gap-4 lg:gap-8">
              {/* ===== Logo: icon image + "FreshCart" text ===== */}
              <Link href="/" className="shrink-0 flex items-center gap-2">
                <Image
                  width={50}
                  height={50}
                  src={logo}
                  alt="FreshCart logo"
                  priority
                  className="h-8 w-auto object-contain"
                />
                {/* FIX 2: the wordmark text beside the icon */}
                <span className="text-2xl font-extrabold text-gray-800 tracking-tight">
                  FreshCart
                </span>
              </Link>

              {/* ===== Search (desktop) ===== */}
              <form
                className="hidden lg:flex flex-1 max-w-2xl"
                onSubmit={submitSearch}
              >
                <div className="relative w-full">
                  <input
                    type="text"
                    value={term}
                    onChange={(e) => setTerm(e.target.value)}
                    placeholder="Search for products, brands and more..."
                    className="w-full px-5 py-3 pr-12 rounded-full border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all text-sm"
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-green-600 text-white flex items-center justify-center hover:bg-green-700 transition-colors"
                  >
                    <LuSearch className="text-sm" />
                  </button>
                </div>
              </form>

              {/* ===== Nav links (desktop) ===== */}
              <nav className="hidden lg:flex items-center gap-6">
                {links.map((link) =>
                  link.label === "Categories" ? (
                    <div key={link.label} className="relative group">
                      <Button
                        variant="ghost"
                        className="flex items-center gap-1.5 text-gray-700 hover:text-green-600 font-medium transition-colors py-2"
                      >
                        Categories
                        <LuChevronDown className="text-[10px] transition-transform group-hover:rotate-180" />
                      </Button>
                      <div className="absolute top-full left-0 pt-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                        <div className="bg-white border border-gray-100 rounded-xl shadow-xl py-2 min-w-50">
                          {categoryLinks.map((cat) => (
                            <Link
                              key={cat.label}
                              href={cat.href}
                              className="block px-4 py-2.5 text-gray-600 hover:text-green-600 hover:bg-green-50 transition-colors"
                            >
                              {cat.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="text-gray-700 hover:text-green-600 font-medium transition-colors"
                    >
                      {link.label}
                    </Link>
                  ),
                )}
              </nav>

              {/* ===== Right icons ===== */}
              <div className="flex items-center gap-1 lg:gap-2">
                <Link
                  href="/contact"
                  className="hidden lg:flex items-center gap-2 pr-3 mr-2 border-r border-gray-200 hover:opacity-80 transition-opacity"
                >
                  <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
                    <LuHeadset className="text-green-600" />
                  </div>
                  <div className="text-xs">
                    <div className="text-gray-400">Support</div>
                    <div className="font-semibold text-gray-700">24/7 Help</div>
                  </div>
                </Link>

                <Link
                  href="/wishlist"
                  title="Wishlist"
                  className="group relative rounded-full p-2.5 transition-colors hover:bg-gray-100"
                >
                  <FaRegHeart className="text-xl text-gray-500 transition-colors group-hover:text-green-600" />
                  {numberOfWishlistItems > 0 && (
                    <span className="absolute right-0.5 top-0.5 flex size-4.5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
                      {numberOfWishlistItems > 9 ? "9+" : numberOfWishlistItems}
                    </span>
                  )}
                </Link>
                <Link
                  href="/cart"
                  title="Cart"
                  className="relative p-2.5 rounded-full hover:bg-gray-100 transition-colors group"
                >
                  <FaShoppingCart className="text-xl text-gray-500 group-hover:text-green-600 transition-colors" />
                  {numberOfCartItems > 0 && (
                    <span className="absolute top-0.5 right-0.5 size-4.5 rounded-full bg-green-600 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
                      {numberOfCartItems > 9 ? "9+" : numberOfCartItems}
                    </span>
                  )}
                </Link>
                {status === "unauthenticated" ? (
                  <Link
                    href="/login"
                    className="hidden lg:flex items-center gap-2 ml-2 px-5 py-2.5 rounded-full bg-green-600 hover:bg-green-700 text-white text-sm font-semibold transition-colors shadow-sm shadow-green-600/20"
                  >
                    <LuUser /> Sign In
                  </Link>
                ) : (
                  <div className="relative  ml-1 hidden lg:flex ">
                    {/* Account Button */}
                    <Button
                      variant="ghost"
                      type="button"
                      onClick={() => setAccountOpen((v) => !v)}
                      aria-label="Account menu"
                      className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-full text-gray-600">
                        <FaAddressCard className="text-2xl" />
                      </span>
                    </Button>

                    {/* Click-outside closer */}
                    {accountOpen && (
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setAccountOpen(false)}
                      />
                    )}

                    {/* Dropdown (video verbatim) */}
                    {accountOpen && (
                      <div className="absolute right-0 top-full mt-2 w-72 rounded-xl bg-white shadow-xl border border-gray-100 overflow-hidden z-50">
                        <div className="flex items-center gap-3 p-4">
                          <span className="h-10 w-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                            <LuUser />
                          </span>
                          <div className="min-w-0">
                            <div className="font-semibold text-gray-800 truncate">
                              {session?.user?.name}
                            </div>
                            <div className="text-xs text-gray-500 truncate">
                              {session?.user?.email}
                            </div>
                          </div>
                        </div>
                        <nav className="border-t border-gray-100 py-2">
                          {[
                            {
                              icon: LuUser,
                              label: "My Profile",
                              href: "/profile/addresses",
                            },
                            {
                              icon: LuPackage,
                              label: "My Orders",
                              href: "/orders",
                            },
                            {
                              icon: LuHeart,
                              label: "My Wishlist",
                              href: "/wishlist",
                            },
                            {
                              icon: LuMapPin,
                              label: "Addresses",
                              href: "/profile/addresses",
                            },
                            {
                              icon: LuSettings,
                              label: "Settings",
                              href: "/profile/settings",
                            },
                          ].map(({ icon: Icon, label, href }) => (
                            <Link
                              key={label}
                              href={href}
                              onClick={() => setAccountOpen(false)}
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:text-green-600 hover:bg-green-50 transition-colors"
                            >
                              <Icon className="text-gray-400" /> {label}
                            </Link>
                          ))}
                        </nav>
                        <Button
                          variant="ghost"
                          type="button"
                          onClick={() => {
                            setAccountOpen(false); //close dropdown first
                            handleLogOut();
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 border-t border-gray-100 transition-colors"
                        >
                          <LuLogOut /> Sign Out
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {/* Mobile menu toggle */}
                <Button
                  variant="ghost"
                  onClick={() => setOpen(!open)}
                  aria-label="Toggle menu"
                  className="lg:hidden ml-1 w-10 h-10 rounded-full bg-green-600 hover:bg-green-700 text-white flex items-center justify-center transition-colors"
                >
                  {open ? <LuX /> : <LuMenu />}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* ===== Mobile menu overlay ===== */}

        <div
          className={`fixed inset-0 bg-black/50 z-50 lg:hidden transition-opacity duration-500 ${
            open ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setOpen(false)}
        >
          {/* Slide-out panel */}
          <div
            className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl transition-transform duration-500 ease-in-out overflow-y-auto ${
              open ? "translate-x-0" : "translate-x-full"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with logo and close Button */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/50">
              <Image
                src={logo}
                alt="FreshCart"
                width={160}
                height={31}
                className="h-8 w-auto"
              />
              <Button
                variant="ghost"
                onClick={() => setOpen(false)}
                className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              >
                <LuX className="text-gray-600" />
              </Button>
            </div>

            {/* Search form */}
            <form
              className="p-4 border-b border-gray-100"
              onSubmit={submitSearch}
            >
              <div className="relative">
                <input
                  type="text"
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                  placeholder="Search products..."
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 text-sm"
                />
                <Button
                  variant="ghost"
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-green-600 text-white flex items-center justify-center "
                >
                  <LuSearch className="text-sm" />
                </Button>
              </div>
            </form>

            {/* Navigation links */}
            <nav className="p-4">
              <div className="space-y-1">
                {links.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-gray-700 hover:text-green-600 hover:bg-green-50 transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </nav>

            {/* Divider */}
            <div className="mx-4 border-t border-gray-100" />

            {/* Wishlist and Cart */}
            <div className="p-4 space-y-1">
              <Link
                href="/wishlist"
                onClick={() => setOpen(false)}
                className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-green-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center">
                    <LuHeart className="text-red-500" />
                  </div>
                  <span className="font-medium text-gray-700">Wishlist</span>
                </div>
              </Link>

              <Link
                href="/cart"
                onClick={() => setOpen(false)}
                className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-green-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-green-50 flex items-center justify-center">
                    <FaShoppingCart className="text-green-600" />
                  </div>
                  <span className="font-medium text-gray-700">Cart</span>
                </div>
              </Link>
            </div>

            {/* Divider */}
            <div className="mx-4 border-t border-gray-100" />

            {/* Sign In / Sign Up Buttons */}
            <div className="p-4 space-y-1">
              <div className="grid grid-cols-2 gap-3 pt-2">
                {status === "unauthenticated" ? (
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <Link
                      href="/login"
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-green-600 text-green-600 font-semibold hover:bg-green-50 transition-colors"
                    >
                      Sign Up
                    </Link>
                  </div>
                ) : (
                  <div className=" w-full">
                    <Link
                      href="/profile"
                      className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-green-50 transition-colors"
                    >
                      <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
                        <LuUser />
                      </div>
                      <div className="font-medium text-gray-700">
                        {session?.user?.name}
                      </div>
                    </Link>

                    <Button
                      variant="ghost"
                      onClick={() => {
                        setOpen(false);
                        handleLogOut();
                      }}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 transition-colors w-full text-left bg-transparent"
                    >
                      <div className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center">
                        <LuLogOut />
                      </div>

                      <span className="font-medium text-red-600">Sign Out</span>
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Support */}
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="mx-4 mt-2 p-4 rounded-xl bg-gray-50 border border-gray-100 flex items-center gap-3 hover:bg-green-50 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <LuHeadset className="text-green-600" />
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-700">
                  Need Help?
                </div>
                <div className="text-sm text-green-600">Contact Support</div>
              </div>
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}
