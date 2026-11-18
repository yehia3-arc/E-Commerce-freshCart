import Link from "next/link";
import {
  LuArrowLeft,
  LuArrowRight,
  LuClock,
  LuCookie,
  LuDatabase,
  LuLock,
  LuMail,
  LuShare2,
  LuShieldCheck,
  LuUserCheck,
  LuUsers,
} from "react-icons/lu";
import type { IconType } from "react-icons";
import PageHeader from "@/app/_components/PageHeader/PageHeader";

type ArticleItem = { lead?: string; text: string };
type Article = { icon: IconType; n: number; t: string; items: ArticleItem[] };

const articles: Article[] = [
  {
    icon: LuDatabase,
    n: 1,
    t: "Information We Collect",
    items: [
      {
        lead: "Personal Data:",
        text: "Name, email address, phone number, and shipping address.",
      },
      {
        lead: "Payment Data:",
        text: "Credit card information processed securely by our payment providers.",
      },
      {
        lead: "Technical Data:",
        text: "IP address, browser type, device information, and access times.",
      },
      {
        lead: "Usage Data:",
        text: "Pages viewed, products browsed, and actions taken within our platform.",
      },
    ],
  },
  {
    icon: LuUsers,
    n: 2,
    t: "How We Use Your Information",
    items: [
      { text: "To process and fulfill your orders." },
      { text: "To send order confirmations and shipping updates." },
      { text: "To provide customer support and respond to inquiries." },
      { text: "To improve our products, services, and user experience." },
      { text: "To send promotional communications (with your consent)." },
    ],
  },
  {
    icon: LuLock,
    n: 3,
    t: "Data Protection",
    items: [
      {
        text: "We implement industry-standard encryption (SSL/TLS) for all data transfers.",
      },
      {
        text: "Payment information is processed by PCI-compliant payment providers.",
      },
      {
        text: "We conduct regular security audits and vulnerability assessments.",
      },
      {
        text: "Access to personal data is restricted to authorized personnel only.",
      },
    ],
  },
  {
    icon: LuShare2,
    n: 4,
    t: "Information Sharing",
    items: [
      {
        text: "We do not sell, trade, or rent your personal information to third parties.",
      },
      {
        text: "We may share data with trusted service providers who assist in our operations.",
      },
      {
        text: "We may disclose information when required by law or to protect our rights.",
      },
    ],
  },
  {
    icon: LuUserCheck,
    n: 5,
    t: "Your Rights",
    items: [
      { lead: "Access:", text: "Request a copy of your personal data." },
      {
        lead: "Rectification:",
        text: "Request correction of inaccurate data.",
      },
      { lead: "Erasure:", text: "Request deletion of your personal data." },
      { lead: "Portability:", text: "Request your data in a portable format." },
      {
        lead: "Opt-out:",
        text: "Unsubscribe from marketing communications at any time.",
      },
    ],
  },
  {
    icon: LuCookie,
    n: 6,
    t: "Cookies",
    items: [
      {
        text: "We use cookies to enhance your browsing experience and remember preferences.",
      },
      {
        text: "You can control cookie settings through your browser preferences.",
      },
      {
        text: "Disabling cookies may affect the functionality of certain features.",
      },
    ],
  },
  {
    icon: LuClock,
    n: 7,
    t: "Data Retention",
    items: [
      {
        text: "We retain your personal information only for as long as necessary to fulfill the purposes outlined in this policy or as required by law. Account data is deleted within 30 days of account closure upon request.",
      },
    ],
  },
  {
    icon: LuMail,
    n: 8,
    t: "Contact Us",
    items: [
      {
        text: "For questions about this Privacy Policy or to exercise your rights, contact our Data Protection Officer at privacy@freshcart.com",
      },
    ],
  },
];

export default function PrivacyPage() {
  return (
    <>
      <PageHeader
        title="Privacy Policy"
        subtitle="Last updated: February 2026"
        icon={LuShieldCheck}
      />
      <main className="bg-gray-50 py-10">
        <div className="container mx-auto px-4">
          <div className="mb-8 rounded-xl border border-green-100 bg-green-50 p-6">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-500 text-white">
                <LuShieldCheck />
              </span>
              <h2 className="font-bold text-green-800">Your Privacy Matters</h2>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-green-900/80">
              This Privacy Policy describes how FreshCart collects, uses, and
              protects your personal information when you use our services. We
              are committed to ensuring that your privacy is protected.
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
                      <span>
                        {it.lead && (
                          <strong className="font-semibold text-gray-800">
                            {it.lead}{" "}
                          </strong>
                        )}
                        {it.text}
                      </span>
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
              href="/terms"
              className="flex items-center gap-2 rounded-lg bg-green-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-green-500/25 hover:bg-green-600"
            >
              View Terms of Service <LuArrowRight />
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
