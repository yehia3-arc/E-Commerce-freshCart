import {
  FaHeadset,
  FaRotateLeft,
  FaShieldHalved,
  FaTruck,
} from "react-icons/fa6";

const features = [
  { icon: FaTruck, title: "Free Shipping", sub: "On orders over 500 EGP" },
  { icon: FaRotateLeft, title: "Easy Returns", sub: "14-day return policy" },
  {
    icon: FaShieldHalved,
    title: "Secure Payment",
    sub: "100% secure checkout",
  },
  { icon: FaHeadset, title: "24/7 Support", sub: "Contact us anytime" },
];

export default function FeaturesStrip() {
  return (
    <div className="bg-green-50 border-y border-green-100">
      <div className="container mx-auto px-4 py-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map(({ icon: Icon, title, sub }) => (
            <div key={title} className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center shrink-0">
                <Icon className="text-green-600 text-lg" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 text-sm">{title}</h4>
                <p className="text-gray-500 text-xs">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
