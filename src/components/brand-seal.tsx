import Image from "next/image";
import { cn } from "@/lib/utils";

const SRC = "/branding/benizer-seal.png";

const presets = {
  /** Dense storefront header — compact mark; PNG is circular transparent — thin pad + controlled shadow. */
  nav: {
    wrap: cn(
      "relative isolate flex size-9 shrink-0 items-center justify-center rounded-full bg-white p-[3px]",
      "shadow-[0_2px_10px_rgba(13,59,15,0.14)] ring-1 ring-neutral-200/75 sm:size-10 sm:p-[3.5px]",
    ),
    img: "object-contain drop-shadow-[0_1px_1px_rgba(15,23,42,0.08)]",
    side: 96,
    sizes: "40px",
  },
  /** Homepage hero — restrained seal so typography stays primary. */
  hero: {
    wrap: cn(
      "relative isolate mx-auto flex h-[3.75rem] w-[3.75rem] shrink-0 items-center justify-center rounded-full bg-white/95 p-[5px]",
      "shadow-[0_8px_28px_-12px_rgba(13,59,15,0.4)] ring-1 ring-neutral-200/65",
      "sm:h-[4rem] sm:w-[4rem] md:h-[4.25rem] md:w-[4.25rem] md:bg-white/18 md:shadow-[0_14px_44px_-14px_rgba(0,0,0,0.48)] md:ring-white/24",
    ),
    img: "object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.18)]",
    side: 112,
    sizes: "(max-width:768px) 72px,80px",
  },
  /** About hero on dark green band — slightly larger for editorial balance. */
  aboutHero: {
    wrap: cn(
      "relative isolate flex h-[5rem] w-[5rem] shrink-0 items-center justify-center rounded-full bg-white/14 p-[6px]",
      "shadow-[0_12px_36px_-14px_rgba(0,0,0,0.55)] ring-1 ring-white/35 backdrop-blur-[2px]",
      "sm:h-[5.25rem] sm:w-[5.25rem] md:h-[5.75rem] md:w-[5.75rem]",
    ),
    img: "object-contain drop-shadow-[0_4px_14px_rgba(0,0,0,0.35)]",
    side: 144,
    sizes: "(max-width:768px) 88px,100px",
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
