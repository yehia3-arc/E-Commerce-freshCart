import Image from "next/image";
import Link from "next/link";
import type { IconType } from "react-icons";

export default function PageHeader({
  title,
  subtitle,
  icon: Icon,
  image,
  gradient = "from-green-600  to-green-500",
}: {
  title: string;
  subtitle?: string;
  icon?: IconType;
  image?: string;
  gradient?: string;
}) {
  return (
    <div className={`bg-linear-to-r ${gradient}`}>
      <div className="container mx-auto px-4 py-12 sm:py-16">
        <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-white/70">
          <Link href="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <span className="text-white/40">/</span>
          <span className="font-medium text-white">{title}</span>
        </nav>
        <div className="flex items-center gap-5">
          {image ? (
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 shadow-xl ring-1 ring-white/30 backdrop-blur-sm">
              <Image
                src={image}
                alt={title}
                width={40}
                height={40}
                className="h-10 w-10 object-contain"
              />
            </div>
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 shadow-xl ring-1 ring-white/30 backdrop-blur-sm">
              {Icon && <Icon className="text-3xl text-white" />}
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold text-white sm:text-4xl">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-1 text-sm text-white/80">{subtitle}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
