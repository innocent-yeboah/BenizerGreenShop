"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { siteConfig } from "@/lib/site-data";
import { cn } from "@/lib/utils";

type Tone = "sky" | "forest" | "espresso" | "cream";

type SlideCta = { label: string; href: string };

type Slide = {
  eyebrow: string;
  title: string;
  body: string;
  primaryCta: SlideCta;
  secondaryCta: SlideCta;
  image: string;
  alt: string;
  tone: Tone;
};

const AUTOPLAY_MS = 6500;

const toneStyles: Record<Tone, { badge: string; accent: string; halo: string }> = {
  sky: {
    badge: "bg-[#5BA7E6]/15 text-[#1E3A8A] ring-[#5BA7E6]/35",
    accent: "from-[#dbeafe] via-brand-cream to-brand-cream",
    halo: "from-[#bfdbfe]/55 via-transparent to-transparent",
  },
  forest: {
    badge: "bg-brand-green/12 text-brand-green-dark ring-brand-green/30",
    accent: "from-brand-green/10 via-brand-cream to-brand-cream",
    halo: "from-brand-green/22 via-transparent to-transparent",
  },
  espresso: {
    badge: "bg-amber-700/12 text-amber-900 ring-amber-700/30",
    accent: "from-amber-100/60 via-brand-cream to-brand-cream",
    halo: "from-amber-300/35 via-transparent to-transparent",
  },
  cream: {
    badge: "bg-brand-gold/18 text-brand-green-dark ring-brand-gold/35",
    accent: "from-brand-gold/10 via-brand-cream to-brand-cream",
    halo: "from-brand-gold/25 via-transparent to-transparent",
  },
};

export function HomeHeroSlider() {
  const slides = siteConfig.homePage.slider as readonly Slide[];
  const total = slides.length;
  const headingId = useId();

  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const interactedRef = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(mq.matches);
    sync();
    mq.addEventListener?.("change", sync);
    return () => mq.removeEventListener?.("change", sync);
  }, []);

  const goTo = useCallback(
    (next: number) => {
      setIndex(((next % total) + total) % total);
      interactedRef.current = true;
    },
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

  // Touch swipe (mobile)
  const touchStartX = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current == null) return;
    const dx = (e.changedTouches[0]?.clientX ?? 0) - touchStartX.current;
    if (Math.abs(dx) > 40) {
      if (dx < 0) next();
      else prev();
    }
    touchStartX.current = null;
  };

  const active = slides[index];
  const tone = toneStyles[active.tone];

  const transition = reducedMotion ? "" : "transition-all duration-700 ease-[cubic-bezier(0.22,0.61,0.36,1)]";

  const slideKey = useMemo(() => `${index}-${active.image}`, [index, active.image]);

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured wellness products"
      aria-labelledby={headingId}
      className={cn(
        "relative overflow-hidden border-b border-brand-green/15",
        "bg-linear-to-br",
        tone.accent,
        transition,
      )}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_75%_25%,var(--tw-gradient-stops))]",
          "bg-linear-to-br",
          tone.halo,
          transition,
        )}
      />

      <div className="container-shell relative grid items-center gap-10 py-12 md:grid-cols-2 md:gap-12 md:py-16 lg:gap-16 lg:py-20">
        <div className="relative order-2 md:order-1">
          <p
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] ring-1",
              tone.badge,
              transition,
            )}
          >
            {active.eyebrow}
          </p>
          <h1
            id={headingId}
            className={cn(
              "mt-4 font-heading text-3xl font-bold leading-[1.08] tracking-tight text-brand-green-dark sm:text-4xl md:text-5xl lg:text-[3.4rem]",
              transition,
            )}
          >
            {active.title}
          </h1>
          <p
            className={cn(
              "mt-5 max-w-xl text-[15px] leading-relaxed text-brand-charcoal/85 md:text-base lg:text-lg",
              transition,
            )}
          >
            {active.body}
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link
              href={active.primaryCta.href}
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-brand-green-dark px-7 text-sm font-bold uppercase tracking-wider text-white shadow-[0_10px_28px_-12px_rgba(13,59,15,0.55)] transition-colors hover:bg-brand-green"
            >
              {active.primaryCta.label}
            </Link>
            <Link
              href={active.secondaryCta.href}
              className="inline-flex min-h-12 items-center justify-center rounded-full border-2 border-brand-green-dark/25 bg-white/80 px-7 text-sm font-bold uppercase tracking-wider text-brand-green-dark transition-colors hover:border-brand-green-dark hover:bg-white"
            >
              {active.secondaryCta.label}
            </Link>
          </div>

          {/* Controls */}
          <div className="mt-9 flex items-center gap-3 sm:gap-4">
            <button
              type="button"
              aria-label="Previous slide"
              onClick={prev}
              className="inline-flex size-10 items-center justify-center rounded-full border border-brand-green-dark/20 bg-white/85 text-brand-green-dark transition-colors hover:bg-white"
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
                          ? "w-9 bg-brand-green-dark"
                          : "w-3 bg-brand-green-dark/25 hover:bg-brand-green-dark/45",
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
              className="inline-flex size-10 items-center justify-center rounded-full border border-brand-green-dark/20 bg-white/85 text-brand-green-dark transition-colors hover:bg-white"
            >
              <ChevronRight className="size-5" aria-hidden />
            </button>

            <button
              type="button"
              aria-label={isPaused ? "Resume autoplay" : "Pause autoplay"}
              aria-pressed={isPaused}
              onClick={() => setIsPaused((v) => !v)}
              className="ml-1 inline-flex size-9 items-center justify-center rounded-full text-brand-green-dark/55 transition-colors hover:bg-white/70 hover:text-brand-green-dark"
            >
              {isPaused ? <Play className="size-4" aria-hidden /> : <Pause className="size-4" aria-hidden />}
            </button>

            <span className="ml-auto text-xs font-semibold tabular-nums text-brand-green-dark/55">
              <span aria-hidden>{String(index + 1).padStart(2, "0")}</span>
              <span className="mx-1 text-brand-green-dark/30" aria-hidden>/</span>
              <span aria-hidden>{String(total).padStart(2, "0")}</span>
              <span className="sr-only">
                Slide {index + 1} of {total}
              </span>
            </span>
          </div>
        </div>

        <div className="relative order-1 md:order-2">
          <div className="relative mx-auto aspect-5/6 w-full max-w-md overflow-hidden rounded-3xl bg-white/40 shadow-[0_28px_70px_-28px_rgba(13,59,15,0.45)] ring-1 ring-brand-green/15 sm:max-w-lg md:aspect-4/5 md:max-w-none">
            {slides.map((slide, i) => {
              const isActive = i === index;
              return (
                <div
                  key={slide.image}
                  aria-hidden={!isActive}
                  className={cn(
                    "absolute inset-0",
                    reducedMotion
                      ? isActive
                        ? "opacity-100"
                        : "opacity-0"
                      : "transition-all duration-700 ease-out",
                    !reducedMotion && (isActive ? "scale-100 opacity-100" : "scale-[1.03] opacity-0"),
                  )}
                >
                  <Image
                    src={`/images/hero-slides/${slide.image}.webp`}
                    alt={slide.alt}
                    fill
                    priority={i === 0}
                    sizes="(max-width: 768px) 92vw, (max-width: 1280px) 46vw, 600px"
                    className="object-cover object-center"
                  />
                </div>
              );
            })}

            <div
              aria-live="polite"
              aria-atomic="true"
              className="sr-only"
              key={slideKey}
            >
              Now showing: {active.title}. {active.body}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
