import Image from "next/image";
import Link from "next/link";
import {
  LuCreditCard,
  LuFacebook,
  LuInstagram,
  LuMail,
  LuMapPin,
  LuPhone,
  LuTwitter,
  LuYoutube,
} from "react-icons/lu";
import logo from "@/assets/pictures/faction.png";

const cols = [
  {
    h: "Shop",
    links: [
      ["All Products", "/productdetails"],
      ["Categories", "/categories"],
      ["Brands", "/brands"],
      ["Electronics", "/productdetails?keyword=electronics"],
      ["Men's Fashion", "/productdetails?keyword=men"],
      ["Women's Fashion", "/productdetails?keyword=women"],
    ],
  },
  {
    h: "Account",
    links: [
      ["My Account", "/profile/addresses"],
      ["Order History", "/orders"],
      ["Wishlist", "/wishlist"],
      ["Shopping Cart", "/cart"],
      ["Sign In", "/login"],
      ["Create Account", "/register"],
    ],
  },
  {
    h: "Support",
    links: [
      ["Contact Us", "/contact"],
      ["Help Center", "#"],
      ["Shipping Info", "#"],
      ["Returns & Refunds", "#"],
      ["Track Order", "/orders"],
    ],
  },
  {
    h: "Legal",
    links: [
      ["Privacy Policy", "/privacy"],
      ["Terms of Service", "/terms"],
      ["Cookie Policy", "#"],
    ],
  },
];

export default function Footer() {
  return (
    <footer className=" bg-gray-900 text-gray-300">
      <div className="container mx-auto grid grid-cols-1 gap-8 px-4 py-12 md:grid-cols-2 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="mb-6 inline-block rounded-lg bg-white px-4 py-2">
            <Image
              src={logo}
              alt="FreshCart"
              width={150}
              height={32}
              className="h-8 w-auto"
            />
          </div>
          <p className="text-sm leading-relaxed text-gray-400">
            FreshCart is your one-stop destination for quality products. From
            fashion to electronics, we bring you the best brands at competitive
            prices with a seamless shopping experience.
          </p>
          <ul className="mt-6 space-y-3 text-sm">
            <li>
              <Link
                href="tel:+18001234567"
                className="flex items-center gap-3 hover:text-green-400"
              >
                <LuPhone className="text-green-500" /> +1 (800) 123-4567
              </Link>
            </li>
            <li>
              <Link
                href="mailto:support@freshcart.com"
                className="flex items-center gap-3 hover:text-green-400"
              >
                <LuMail className="text-green-500" /> support@freshcart.com
              </Link>
            </li>
            <li className="flex items-center gap-3">
              <LuMapPin className="text-green-500" /> 123 Commerce Street, New
              York, NY 10001
            </li>
          </ul>
          <div className="mt-6 flex gap-2">
            {[LuFacebook, LuTwitter, LuInstagram, LuYoutube].map((I, i) => (
              <Link
                key={i}
                href="#"
                aria-label="Social link"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 text-gray-400 transition-colors hover:bg-green-600 hover:text-white"
              >
                <I className="text-sm" />
              </Link>
            ))}
          </div>
        </div>
        {cols.map((c) => (
          <div key={c.h} className="lg:col-span-2">
            <h3 className="mb-5 text-lg font-semibold text-white">{c.h}</h3>
            <ul className="space-y-2.5">
              {c.links.map(([label, href]) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-gray-400 transition-colors hover:text-green-400"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-gray-800">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-6 md:flex-row">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} FreshCart. All rights reserved.
          </p>
          <div className="flex items-center gap-5 text-sm text-gray-500">
            <span className="flex items-center gap-2">
              <LuCreditCard /> Visa
            </span>
            <span className="flex items-center gap-2">
              <LuCreditCard /> Mastercard
            </span>
            <span className="flex items-center gap-2">
              <LuCreditCard /> PayPal
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
