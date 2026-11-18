import {
  FaHeadset,
  FaRotateLeft,
  FaShieldHalved,
  FaTruck,
} from "react-icons/fa6";

const features = [
  {
    icon: FaTruck,
    title: "Free Shipping",
    sub: "On orders over 500 EGP",
    iconBg: "bg-blue-50",
    iconText: "text-blue-500",
  },
  {
    icon: FaShieldHalved,
    title: "Secure Payment",
    sub: "100% secure transactions",
    iconBg: "bg-emerald-50",
    iconText: "text-emerald-500",
  },
  {
    icon: FaRotateLeft,
    title: "Easy Returns",
    sub: "14-day return policy",
    iconBg: "bg-orange-50",
    iconText: "text-orange-500",
  },
  {
    icon: FaHeadset,
    title: "24/7 Support",
    sub: "Dedicated support team",
    iconBg: "bg-purple-50",
    iconText: "text-purple-500",
  },
];

export default function FeaturesUP() {
  return (
    <section className="py-8 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map(({ icon: Icon, title, sub, iconBg, iconText }) => (
            <div
              key={title}
              className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${iconBg}`}
              >
                <Icon className={`text-xl ${iconText}`} />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 text-sm">{title}</h4>
                <p className="text-gray-500 text-xs">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
