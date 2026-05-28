"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { siteConfig } from "@/lib/site-data";
import { cn } from "@/lib/utils";

type SlideCta = { label: string; href: string };

type Slide = {
  eyebrow: string;
  title: string;
  body: string;
  primaryCta: SlideCta;
  secondaryCta: SlideCta;
  image: string;
  alt: string;
};

const AUTOPLAY_MS = 6500;

/**
 * Full-bleed cinematic hero carousel.
 * Each slide's image fills the entire section; text + controls float on top
 * over a tasteful left-to-right and bottom-up dark scrim for legibility.
 */
export function HomeHeroSlider() {
  const slides = siteConfig.homePage.slider as readonly Slide[];
  const total = slides.length;
  const headingId = useId();

  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(mq.matches);
    sync();
    mq.addEventListener?.("change", sync);
    return () => mq.removeEventListener?.("change", sync);
  }, []);

  const goTo = useCallback(
    (next: number) => setIndex(((next % total) + total) % total),
    [total],
  );
  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  useEffect(() => {
    if (reducedMotion || isPaused) return;
    const t = window.setTimeout(() => goTo(index + 1), AUTOPLAY_MS);
    return () => window.clearTimeout(t);
  }, [index, isPaused, reducedMotion, goTo]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  const touchStartX = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current == null) return;
    const dx = (e.changedTouches[0]?.clientX ?? 0) - touchStartX.current;
    if (Math.abs(dx) > 40) (dx < 0 ? next : prev)();
    touchStartX.current = null;
  };

  const active = slides[index];
  const slideKey = useMemo(() => `${index}-${active.image}`, [index, active.image]);
  const fadeTransition = reducedMotion ? "" : "transition-opacity duration-1000 ease-out";

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured wellness products"
      aria-labelledby={headingId}
      className="relative isolate flex min-h-[560px] flex-col overflow-hidden border-b border-brand-green/15 bg-brand-green-dark sm:min-h-[620px] md:min-h-[700px] lg:min-h-[780px]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div aria-hidden className="absolute inset-0">
        {slides.map((slide, i) => {
          const isActive = i === index;
          return (
            <div
              key={slide.image}
              aria-hidden={!isActive}
              className={cn(
                "absolute inset-0",
                fadeTransition,
                isActive ? "opacity-100" : "opacity-0",
              )}
            >
              <Image
                src={`/images/hero-slides/${slide.image}.webp`}
                alt={slide.alt}
                fill
                priority={i === 0}
                sizes="100vw"
                className="object-cover object-center"
              />
            </div>
          );
        })}
      </div>

      <div
        aria-hidden
        className="absolute inset-0 bg-linear-to-r from-black/80 via-black/50 to-black/25 md:from-black/75 md:via-black/35 md:to-transparent"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/55 to-transparent"
      />

      <div className="container-shell relative z-10 flex flex-1 flex-col justify-center py-16 md:py-20 lg:py-24">
        <div className="max-w-xl">
          <p
            className={cn(
              "inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-white ring-1 ring-white/25 backdrop-blur-sm",
              fadeTransition,
            )}
          >
            {active.eyebrow}
          </p>
          <h1
            id={headingId}
            className={cn(
              "mt-5 font-heading text-4xl font-bold leading-[1.05] tracking-tight text-white drop-shadow-[0_2px_18px_rgba(0,0,0,0.45)] sm:text-5xl md:text-6xl lg:text-[4rem]",
              fadeTransition,
            )}
          >
            {active.title}
          </h1>
          <p
            className={cn(
              "mt-5 max-w-lg text-base leading-relaxed text-white/90 md:text-lg",
              fadeTransition,
            )}
          >
            {active.body}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href={active.primaryCta.href}
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-brand-gold px-7 text-sm font-bold uppercase tracking-wider text-brand-green-dark shadow-[0_12px_30px_-12px_rgba(204,160,0,0.6)] transition-all hover:-translate-y-0.5 hover:bg-brand-gold-light"
            >
              {active.primaryCta.label}
            </Link>
            <Link
              href={active.secondaryCta.href}
              className="inline-flex min-h-12 items-center justify-center rounded-full border-2 border-white/40 bg-white/10 px-7 text-sm font-bold uppercase tracking-wider text-white backdrop-blur-sm transition-colors hover:border-white/70 hover:bg-white/20"
            >
              {active.secondaryCta.label}
            </Link>
          </div>
        </div>
      </div>

      <div className="container-shell relative z-10 pb-8 md:pb-10">
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            type="button"
            aria-label="Previous slide"
            onClick={prev}
            className="inline-flex size-10 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
          >
            <ChevronLeft className="size-5" aria-hidden />
          </button>

          <ul role="tablist" aria-label="Choose slide" className="flex items-center gap-2">
            {slides.map((slide, i) => {
              const isActive = i === index;
              return (
                <li key={slide.image}>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-label={`Slide ${i + 1}: ${slide.title}`}
                    onClick={() => goTo(i)}
                    className={cn(
                      "h-1.5 rounded-full transition-all duration-500",
                      isActive
                        ? "w-9 bg-brand-gold"
                        : "w-3 bg-white/35 hover:bg-white/55",
                    )}
                  >
                    <span className="sr-only">Slide {i + 1}</span>
                  </button>
                </li>
              );
            })}
          </ul>

          <button
            type="button"
            aria-label="Next slide"
            onClick={next}
            className="inline-flex size-10 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
          >
            <ChevronRight className="size-5" aria-hidden />
          </button>

          <button
            type="button"
            aria-label={isPaused ? "Resume autoplay" : "Pause autoplay"}
            aria-pressed={isPaused}
            onClick={() => setIsPaused((v) => !v)}
            className="ml-1 inline-flex size-9 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          >
            {isPaused ? (
              <Play className="size-4" aria-hidden />
            ) : (
              <Pause className="size-4" aria-hidden />
            )}
          </button>

          <span className="ml-auto text-xs font-semibold tabular-nums text-white/75">
            <span aria-hidden>{String(index + 1).padStart(2, "0")}</span>
            <span className="mx-1 text-white/40" aria-hidden>
              /
            </span>
            <span aria-hidden>{String(total).padStart(2, "0")}</span>
            <span className="sr-only">
              Slide {index + 1} of {total}
            </span>
          </span>
        </div>
      </div>

      <div
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        key={slideKey}
      >
        Now showing: {active.title}. {active.body}
      </div>
    </section>
  );
}
