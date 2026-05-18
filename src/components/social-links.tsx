import Image from "next/image";
import { siteConfig } from "@/lib/site-data";
import { cn } from "@/lib/utils";

type Props = {
  variant?: "footer" | "inline";
  /** One link per row (recommended for footer side column). */
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

export function SocialLinks({ variant = "footer", stack = false, className }: Props) {
  const linkClass =
    variant === "footer"
      ? cn(
          "inline-flex items-center gap-2 rounded-lg text-sm text-white/90 transition-colors hover:text-brand-gold-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold-light",
          stack && "w-full gap-3 py-1.5 sm:w-auto sm:py-1",
        )
      : "inline-flex items-center gap-2 text-sm font-semibold text-brand-green hover:text-brand-green-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green";

  const iconClass = cn(
    "size-5 shrink-0 object-contain",
    variant === "footer" && "opacity-90 invert",
  );

  const links = ICONS.map((item) => ({
    ...item,
    href: siteConfig.social[item.hrefKey]?.trim(),
  })).filter((item) => Boolean(item.href));

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
          <Image src={src} alt="" width={20} height={20} className={iconClass} />
          <span>{label}</span>
        </a>
      ))}
    </div>
  );
}
