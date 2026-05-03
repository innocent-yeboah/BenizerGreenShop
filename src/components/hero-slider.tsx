"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { products } from "@/lib/site-data";

const slides = products.map((p) => ({
  key: p.slug,
  src: p.images[0],
  alt: p.shortTitle,
  category: p.category,
  title: p.tagline,
  subtitle: p.shortBenefit,
  secondaryHref: `/products/${p.slug}`,
  secondaryLabel: `Shop ${p.shortTitle}`,
}));

export function HeroSlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const totalSlides = slides.length;

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % totalSlides);
    }, 5500);
    return () => clearInterval(interval);
  }, [totalSlides]);

  const activeSlide = useMemo(() => slides[activeIndex], [activeIndex]);

  return (
    <section
      className="relative isolate overflow-hidden border-b border-brand-green/10 bg-linear-to-br from-brand-cream via-white to-brand-green-light/25"
      aria-roledescription="carousel"
      aria-label="Featured products"
    >
      <div className="container-shell relative z-10 py-10 pb-16 md:py-12 md:pb-16 lg:py-14 lg:pb-20">
        <div className="grid min-h-[min(72vw,380px)] items-center gap-10 md:min-h-[400px] md:gap-12 lg:min-h-[440px] lg:grid-cols-[1fr_minmax(260px,420px)] lg:gap-14 xl:grid-cols-[1.05fr_440px]">
          <div className="order-2 max-w-xl lg:order-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-green">
              {activeSlide.category}
            </p>
            <h2 className="mt-2 text-3xl font-bold leading-tight text-brand-green-dark md:text-4xl lg:text-[2.65rem]">
              {activeSlide.title}
            </h2>
            <p className="mt-3 text-base text-brand-charcoal/85 md:text-lg">
              {activeSlide.subtitle}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-full bg-brand-green px-6 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white shadow-[0_8px_24px_-12px_rgba(27,94,32,0.55)] hover:bg-brand-green-dark"
              >
                Shop collections
                <span aria-hidden>→</span>
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center justify-center rounded-full border border-brand-green-dark/35 bg-transparent px-6 py-3 text-xs font-bold uppercase tracking-[0.18em] text-brand-green-dark hover:border-brand-green hover:bg-brand-green/6"
              >
                Our story
              </Link>
            </div>
            <Link
              href={activeSlide.secondaryHref}
              className="mt-4 inline-block text-sm font-semibold text-brand-green underline underline-offset-4 hover:text-brand-green-dark"
            >
              {activeSlide.secondaryLabel}
            </Link>
          </div>

          <div className="order-1 flex justify-center lg:order-2 lg:justify-end">
            <div className="relative aspect-square w-full max-w-[min(100%,320px)] sm:max-w-[360px] md:max-w-[400px] lg:max-w-none lg:w-full">
              {slides.map((slide, index) => (
                <div
                  key={slide.key}
                  className={`absolute inset-0 transition-opacity duration-500 ease-out ${
                    index === activeIndex ? "z-10 opacity-100" : "z-0 opacity-0"
                  }`}
                  aria-hidden={index !== activeIndex}
                >
                  <div className="relative h-full w-full overflow-hidden rounded-3xl border border-brand-green/15 bg-white shadow-[0_20px_50px_-24px_rgba(13,59,15,0.35)]">
                    <Image
                      src={slide.src}
                      alt={slide.alt}
                      fill
                      priority={index === 0}
                      className="object-contain p-6 sm:p-8"
                      sizes="(max-width: 1024px) min(90vw, 400px), 440px"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {slides.map((slide, index) => (
          <button
            key={slide.key}
            type="button"
            className={`h-2.5 rounded-full transition-all ${
              index === activeIndex
                ? "w-8 bg-brand-green"
                : "w-2.5 bg-brand-green/35 hover:bg-brand-green/55"
            }`}
            onClick={() => setActiveIndex(index)}
            aria-label={`Go to slide ${index + 1}: ${slide.alt}`}
            aria-current={index === activeIndex ? "true" : undefined}
          />
        ))}
      </div>
    </section>
  );
}
