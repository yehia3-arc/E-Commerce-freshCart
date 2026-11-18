"use client";
import { useState } from "react";

export default function ProductGallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const [active, setActive] = useState(0);
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 sticky top-4">
      <div className="h-80 sm:h-96 flex items-center justify-center overflow-hidden rounded-lg bg-gray-50">
        <img
          src={images[active]}
          alt={title}
          className="max-h-full max-w-full object-contain"
        />
      </div>
      <div className="flex gap-2 mt-3 overflow-x-auto">
        {images.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => setActive(i)}
            className={`w-20 h-20 shrink-0 rounded-lg border-2 overflow-hidden bg-gray-50 p-1 transition ${
              i === active
                ? "border-blue-500"
                : "border-transparent hover:border-gray-300"
            }`}
          >
            <img src={src} alt="" className="w-full h-full object-contain" />
          </button>
        ))}
      </div>
    </div>
  );
}
