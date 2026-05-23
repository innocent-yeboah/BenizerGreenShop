import Image from "next/image";
import { siteConfig } from "@/lib/site-data";
import { cn } from "@/lib/utils";

type Props = {
  variant?: "footer" | "inline";
  /** Text + icon rows (footer default) or circular icon buttons only. */
  layout?: "text" | "icons";
  /** One link per row (text layout only). */
  stack?: boolean;
  className?: string;
};

const ICONS = [
  {
    key: "facebook",
    hrefKey: "facebook" as const,
    label: "Facebook",
    src: "/icons/social/facebook.svg",
  },
  {
    key: "instagram",
    hrefKey: "instagram" as const,
    label: "Instagram",
    src: "/icons/social/instagram.svg",
  },
  {
    key: "tiktok",
    hrefKey: "tiktok" as const,
    label: "TikTok",
    src: "/icons/social/tiktok.svg",
  },
];

export function SocialLinks({ variant = "footer", layout = "text", stack = false, className }: Props) {
  const links = ICONS.map((item) => ({
    ...item,
    href: siteConfig.social[item.hrefKey]?.trim(),
  })).filter((item) => Boolean(item.href));

  const iconImgClass = cn(
    "size-5 shrink-0 object-contain",
    variant === "footer" && layout === "text" && "opacity-90 invert",
    variant === "footer" && layout === "icons" && "opacity-95 invert",
  );

  if (layout === "icons" && variant === "footer") {
    return (
      <div className={cn("flex flex-wrap gap-2.5", className)} role="list">
        {links.map(({ key, label, src, href }) => (
          <a
            key={key}
            href={href}
            role="listitem"
            aria-label={label}
            title={label}
            className="inline-flex size-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-brand-gold/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold-light"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image src={src} alt="" width={20} height={20} className={iconImgClass} />
          </a>
        ))}
      </div>
    );
  }

  const linkClass =
    variant === "footer"
      ? cn(
          "inline-flex items-center gap-2 rounded-lg text-sm text-white/90 transition-colors hover:text-brand-gold-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold-light",
          stack && "w-full gap-3 py-1.5 sm:w-auto sm:py-1",
        )
      : "inline-flex items-center gap-2 text-sm font-semibold text-brand-green hover:text-brand-green-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green";

  return (
    <div
      className={cn(
        stack && variant === "footer" ? "flex flex-col gap-1" : "flex flex-wrap gap-x-6 gap-y-3",
        className,
      )}
    >
      {links.map(({ key, label, src, href }) => (
        <a
          key={key}
          href={href}
          className={linkClass}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image src={src} alt="" width={20} height={20} className={iconImgClass} />
          <span>{label}</span>
        </a>
      ))}
    </div>
  );
}
