"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import useGalleryAnimation from "../hooks/useGalleryAnimation";


const images = [
  {
    src: "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?q=80&w=600&auto=format&fit=crop",
    span: "col-span-1 md:col-span-2 row-span-1 md:row-span-2",
  },
  {
    src: "https://images.unsplash.com/photo-1587061949409-02df41d5e562?q=80&w=600&auto=format&fit=crop",
    span: "col-span-1 row-span-1",
  },
  {
    src: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=600&auto=format&fit=crop",
    span: "col-span-1 row-span-1",
  },
  {
    src: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=600&auto=format&fit=crop",
    span: "col-span-1 row-span-1 md:row-span-2",
  },
  {
    src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=600&auto=format&fit=crop",
    span: "col-span-1 row-span-1",
  },
  {
    src: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=600&auto=format&fit=crop",
    span: "col-span-2 md:col-span-2 row-span-1",
  },
];

export default function GallerySection() {
  const {sectionRef} = useGalleryAnimation()

  return (
    <section
      ref={sectionRef}
      id="gallery"
      className="py-24 md:py-32 px-6 bg-background relative overflow-hidden"
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto">
        <div className="gallery-title text-center mb-16">
          <span className="text-amber-400 text-sm font-medium tracking-wider">
            گالری
          </span>
          <h2 className="text-4xl md:text-6xl font-bold text-white mt-4">
            تجربه
            <br />
            <span className="text-amber-400">بصری</span>
          </h2>
          <p className="text-white/50 mt-4 max-w-2xl mx-auto">
            گوشه‌ای از تجربه‌های فوق‌العاده‌ای که در هورایزن در انتظار شماست.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 auto-rows-[150px] sm:auto-rows-[200px] md:auto-rows-[250px]">
          {images.map((img, index) => (
            <div
              key={index}
              className={`gallery-item ${img.span} relative rounded-2xl overflow-hidden group cursor-pointer`}
            >
              <img
                src={img.src}
                alt={`تصویر گالری ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="w-14 h-14 border-2 border-white rounded-full flex items-center justify-center backdrop-blur-sm bg-white/10">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
