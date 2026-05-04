import { siteConfig } from "@/lib/site-data";
import { cn } from "@/lib/utils";

type Props = {
  variant?: "footer" | "inline";
  className?: string;
};

export function SocialLinks({ variant = "footer", className }: Props) {
  const { tiktok } = siteConfig.social;
  const linkClass =
    variant === "footer"
      ? "inline-flex items-center gap-2 rounded-lg text-sm text-white/90 transition-colors hover:text-brand-gold-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold-light"
      : "inline-flex items-center gap-2 text-sm font-semibold text-brand-green hover:text-brand-green-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green";

  const iconClass = cn(
    "size-5 shrink-0 object-contain",
    variant === "footer" && "opacity-90 invert",
  );

  return (
    <div className={cn("flex flex-wrap gap-x-6 gap-y-3", className)}>
      <a
        href={tiktok}
        className={linkClass}
        target="_blank"
        rel="noopener noreferrer"
      >
        <img src="/icons/social/tiktok.svg" alt="" className={iconClass} width={20} height={20} />
        <span>TikTok</span>
      </a>
    </div>
  );
}
