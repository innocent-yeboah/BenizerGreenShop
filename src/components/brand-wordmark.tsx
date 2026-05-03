import { cn } from "@/lib/utils";

type Props = {
  /** Header nav vs prominent section title */
  size?: "sm" | "lg";
  /** Dark green hero backgrounds vs light storefront surfaces */
  tone?: "light" | "dark";
  /** Softer serif hero lockup — use on the home hero only */
  variant?: "default" | "editorial";
  className?: string;
};

/** Bold logotype: forest green + gold accents (matches site header / logo palette). */
export function BrandWordmark({
  size = "sm",
  tone = "light",
  variant = "default",
  className,
}: Props) {
  if (variant === "editorial" && tone === "light") {
    return (
      <span className={cn("block space-y-2 sm:space-y-3", className)}>
        <span className="block font-accent text-[clamp(2.35rem,6vw,3.95rem)] font-semibold leading-[1.06] tracking-[-0.028em] text-brand-green-dark">
          Benizer Green
        </span>
        <span className="flex items-baseline gap-3 sm:gap-4">
          <span className="h-px min-w-[2.25rem] flex-1 max-w-[3.25rem] bg-[#ada286]/85" aria-hidden />
          <span className="font-accent text-[clamp(1rem,2.75vw,1.35rem)] font-normal uppercase tracking-[0.38em] text-[#6e6248]">
            Shop
          </span>
        </span>
      </span>
    );
  }

  return (
    <span
      className={cn(
        "font-heading font-extrabold tracking-tight",
        size === "lg"
          ? "text-2xl sm:text-3xl md:text-4xl"
          : "text-base sm:text-lg md:text-xl",
        className,
      )}
    >
      {tone === "dark" ? (
        <>
          <span className="text-brand-gold-light">Benizer</span>{" "}
          <span className="text-brand-green-light">Green</span>{" "}
          <span className="text-white">Shop</span>
        </>
      ) : (
        <>
          <span className="text-brand-green-dark">Benizer</span>{" "}
          <span className="text-brand-green">Green</span>{" "}
          <span className="text-brand-gold-dark">Shop</span>
        </>
      )}
    </span>
  );
}
