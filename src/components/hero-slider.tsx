"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { products, siteConfig } from "@/lib/site-data";

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
      className="relative isolate min-h-[min(74vh,34rem)] overflow-hidden border-b border-brand-green/10 sm:min-h-[min(76vh,38rem)] md:min-h-[min(82vh,44rem)]"
      aria-roledescription="carousel"
      aria-label="Featured products"
    >
      <div className="absolute inset-0" aria-hidden>
        {slides.map((slide, index) => (
          <div
            key={slide.key}
            className={`absolute inset-0 transition-opacity duration-700 ease-out ${
              index === activeIndex ? "z-[1] opacity-100" : "z-0 opacity-0"
            }`}
          >
            <Image
              src={slide.src}
              alt=""
              fill
              priority={index === 0}
              className="object-cover object-center"
              sizes="100vw"
            />
          </div>
        ))}
      </div>

      <div
        className="pointer-events-none absolute inset-0 z-[2] bg-linear-to-b from-brand-cream/95 via-brand-cream/75 to-brand-cream/50 md:bg-linear-to-r md:from-brand-cream/95 md:via-white/82 md:to-white/25"
        aria-hidden
      />

      <div className="container-shell relative z-10 flex min-h-[min(74vh,34rem)] flex-col justify-center py-12 pb-20 sm:min-h-[min(76vh,38rem)] sm:py-14 md:min-h-[min(82vh,44rem)] md:py-16 md:pb-24">
        <div className="max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-green">
            {activeSlide.category}
          </p>
          <h2 className="mt-2 text-3xl font-bold leading-tight text-brand-green-dark md:text-4xl lg:text-[2.65rem]">
            {activeSlide.title}
          </h2>
          <p className="mt-3 text-base text-brand-charcoal/90 md:text-lg">
            {activeSlide.subtitle}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-full bg-brand-green px-6 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white shadow-[0_8px_24px_-12px_rgba(27,94,32,0.55)] hover:bg-brand-green-dark"
            >
              {siteConfig.homePage.primaryCta}
              <span aria-hidden>→</span>
            </Link>
            <Link
              href="/become-distributor"
              className="inline-flex items-center justify-center rounded-full border border-brand-green-dark/35 bg-white/90 px-6 py-3 text-xs font-bold uppercase tracking-[0.18em] text-brand-green-dark backdrop-blur-sm hover:border-brand-green hover:bg-white"
            >
              {siteConfig.homePage.secondaryCta}
            </Link>
          </div>
          <Link
            href={activeSlide.secondaryHref}
            className="mt-4 inline-block text-sm font-semibold text-brand-green underline underline-offset-4 hover:text-brand-green-dark"
          >
            {activeSlide.secondaryLabel}
          </Link>
        </div>
      </div>

      <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 gap-2 rounded-full bg-black/10 px-3 py-2 backdrop-blur-sm md:bottom-7">
        {slides.map((slide, index) => (
          <button
            key={slide.key}
            type="button"
            className={`h-2.5 rounded-full transition-all ${
              index === activeIndex
                ? "w-8 bg-brand-green"
                : "w-2.5 bg-brand-green/45 hover:bg-brand-green/70"
            }`}
            onClick={() => setActiveIndex(index)}
            aria-label={`Go to slide ${index + 1}: ${slide.alt}`}
            aria-current={index === activeIndex ? "true" : undefined}
          />
        ))}
      </div>

      <p className="sr-only" aria-live="polite">
        Slide {activeIndex + 1} of {totalSlides}: {activeSlide.alt}. {activeSlide.title}
      </p>
    </section>
  );
}
