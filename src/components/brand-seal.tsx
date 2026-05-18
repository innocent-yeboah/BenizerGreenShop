import Image from "next/image";
import { cn } from "@/lib/utils";

const SRC = "/branding/benizer-seal.png";

const presets = {
  /** Dense storefront header — Fortune 500–style compact mark (~36–40px). */
  nav: {
    wrap: cn(
      "relative isolate flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white",
      "shadow-[0_1px_2px_rgba(15,23,42,0.06)] ring-1 ring-neutral-200/85 sm:size-10",
    ),
    img: "object-contain p-[10%]",
    side: 80,
    sizes: "40px",
  },
  /** Homepage hero — restrained seal so typography stays primary. */
  hero: {
    wrap: cn(
      "relative isolate mx-auto flex h-[3.75rem] w-[3.75rem] shrink-0 items-center justify-center overflow-hidden rounded-full bg-white",
      "shadow-[0_6px_24px_-10px_rgba(13,59,15,0.35)] ring-1 ring-neutral-200/70",
      "sm:h-[4rem] sm:w-[4rem] md:h-[4.25rem] md:w-[4.25rem] md:bg-white/14 md:shadow-[0_12px_40px_-14px_rgba(0,0,0,0.45)] md:ring-white/22",
    ),
    img: "object-contain p-[8%]",
    side: 96,
    sizes: "(max-width:768px) 64px,72px",
  },
  /** About hero on dark green band — slightly larger for editorial balance. */
  aboutHero: {
    wrap: cn(
      "relative isolate flex h-[5rem] w-[5rem] shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/12 shadow-lg shadow-black/25 ring-1 ring-white/28 backdrop-blur-[2px]",
      "sm:h-[5.25rem] sm:w-[5.25rem] md:h-[5.75rem] md:w-[5.75rem]",
    ),
    img: "object-contain p-[8%]",
    side: 128,
    sizes: "(max-width:768px) 80px,92px",
  },
} as const;

export type BrandSealVariant = keyof typeof presets;

type Props = {
  variant: BrandSealVariant;
  className?: string;
  priority?: boolean;
};

/** Official embossed seal — replaces flat SVG wordmark lockups where a premium mark is shown. */
export function BrandSealMark({ variant, className, priority }: Props) {
  const p = presets[variant];
  return (
    <span className={cn(p.wrap, className)}>
      <Image
        src={SRC}
        alt=""
        width={p.side}
        height={p.side}
        className={cn("h-full w-full", p.img)}
        sizes={p.sizes}
        priority={priority}
      />
    </span>
  );
}
