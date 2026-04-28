import { cn } from "@/lib/utils";

type Props = {
  /** Header nav vs prominent section title */
  size?: "sm" | "lg";
  /** Dark green hero backgrounds vs light storefront surfaces */
  tone?: "light" | "dark";
  className?: string;
};

/** Bold logotype: forest green + gold accents (matches site header / logo palette). */
export function BrandWordmark({ size = "sm", tone = "light", className }: Props) {
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
