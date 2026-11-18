import Link from "next/link";
import {
  LuArrowLeft,
  LuArrowRight,
  LuCheck,
  LuCreditCard,
  LuFileText,
  LuMail,
  LuRefreshCw,
  LuTruck,
  LuUserCheck,
  LuUserPlus,
} from "react-icons/lu";
import { GoLaw } from "react-icons/go";

import PageHeader from "@/app/_components/PageHeader/PageHeader";

const articles = [
  {
    icon: LuCheck,
    n: 1,
    t: "Acceptance of Terms",
    items: [
      {
        text: "By accessing or using the Service, you acknowledge that you have read, understood, and agree to be bound by these Terms.",
      },
      {
        text: "If you do not agree to these Terms, you must not access or use the Service.",
      },
      {
        text: "We reserve the right to modify these Terms at any time, and such modifications shall be effective immediately upon posting.",
      },
    ],
  },
  {
    icon: LuUserCheck,
    n: 2,
    t: "User Eligibility",
    items: [
      {
        text: "The Service is intended for users who are at least eighteen (18) years of age.",
      },
      {
        text: "By using the Service, you represent and warrant that you are of legal age to form a binding contract.",
      },
      {
        text: "If you are accessing the Service on behalf of a legal entity, you represent that you have the authority to bind such entity.",
      },
    ],
  },
  {
    icon: LuUserPlus,
    n: 3,
    t: "Account Registration",
    items: [
      {
        text: "You may be required to create an account to access certain features of the Service.",
      },
      {
        text: "You agree to provide accurate, current, and complete information during registration.",
      },
      {
        text: "You are solely responsible for maintaining the confidentiality of your account credentials.",
      },
    ],
  },
  {
    icon: LuCreditCard,
    n: 4,
    t: "Orders and Payments",
    items: [
      {
        text: "All orders placed through the Service are subject to acceptance and availability.",
      },
      {
        text: "Prices are subject to change without notice prior to order confirmation.",
      },
      {
        text: "Payment must be made in full at the time of purchase through approved payment methods.",
      },
      {
        text: "We reserve the right to refuse or cancel any order at our sole discretion.",
      },
    ],
  },
  {
    icon: LuTruck,
    n: 5,
    t: "Shipping and Delivery",
    items: [
      { text: "Delivery times are estimates only and are not guaranteed." },
      {
        text: "Risk of loss and title for items purchased pass to you upon delivery to the carrier.",
      },
      {
        text: "We are not responsible for delays caused by carriers, customs, or other factors beyond our control.",
      },
    ],
  },
  {
    icon: LuRefreshCw,
    n: 6,
    t: "Returns and Refunds",
    items: [
      {
        text: "Our return policy allows returns within 14 days of delivery for most items.",
      },
      { text: "Products must be unused and in original packaging." },
      {
        text: "Refunds will be processed within 5-7 business days after receiving the returned item.",
      },
    ],
  },
  {
    icon: GoLaw,
    n: 7,
    t: "Limitation of Liability",
    items: [
      {
        text: "To the maximum extent permitted by law, FreshCart shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues.",
      },
    ],
  },
  {
    icon: LuMail,
    n: 8,
    t: "Contact Us",
    items: [
      {
        text: "If you have any questions about these Terms, please contact us at support@freshcart.com",
      },
    ],
  },
];

export default function TermsPage() {
  return (
    <>
      <PageHeader
        title="Terms of Service"
        subtitle="Last updated: February 2026"
        icon={LuFileText}
      />
      <main className="bg-gray-50 py-10">
        <div className="container mx-auto px-4">
          <div className="mb-8 rounded-xl border border-amber-200 bg-amber-50 p-6">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500 text-white">
                <LuFileText />
              </span>
              <h2 className="font-bold text-amber-800">Important Notice</h2>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-amber-900/80">
              By accessing and using FreshCart, you accept and agree to be bound
              by the terms and provisions of this agreement. Please read these
              terms carefully before using our services.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {articles.map((a) => (
              <div
                key={a.n}
                className="rounded-xl border border-gray-200 bg-white p-6"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-600">
                    <a.icon />
                  </span>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-green-600">
                      Article {a.n}
                    </p>
                    <h3 className="text-lg font-bold text-gray-900">{a.t}</h3>
                  </div>
                </div>
                <ul className="mt-5 space-y-3">
                  {a.items.map((it, i) => (
                    <li key={i} className="flex gap-3 text-sm text-gray-600">
                      <span className="font-bold text-green-600">
                        {a.n}.{i + 1}
                      </span>
                      <span>{it.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-gray-200 pt-8">
            <Link
              href="/"
              className="flex items-center gap-2 rounded-lg bg-gray-100 px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-200"
            >
              <LuArrowLeft /> Back to Home
            </Link>
            <Link
              href="/privacy"
              className="flex items-center gap-2 rounded-lg bg-green-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-green-500/25 hover:bg-green-600"
            >
              View Privacy Policy <LuArrowRight />
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
