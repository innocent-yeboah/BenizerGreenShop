import Link from "next/link";
import { Mail, MapPin } from "lucide-react";
import { BrandSealMark } from "@/components/brand-seal";
import { SocialLinks } from "@/components/social-links";
import { siteConfig } from "@/lib/site-data";
import { cn } from "@/lib/utils";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
    </svg>
  );
}

const iconBtnClass =
  "inline-flex size-9 items-center justify-center rounded-full bg-white/10 text-white/90 transition-colors hover:bg-brand-gold/25 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold-light";

type FooterLink = { href: string; label: string; prefetch?: boolean };

const shopLinks: FooterLink[] = [
  { href: "/products", label: "All products" },
  { href: "/wishlist", label: "Wishlist", prefetch: false },
  { href: "/become-distributor", label: "Distributors" },
];

const supportLinks: FooterLink[] = [
  { href: "/contact", label: "Contact" },
  { href: "/about", label: "About" },
  { href: "/order-status", label: "Track order" },
  { href: "/account", label: "Account", prefetch: false },
];

function FooterNavColumn({ title, links }: { title: string; links: FooterLink[] }) {
  return (
    <nav aria-label={title}>
      <h2 className="text-[10px] font-bold uppercase tracking-[0.14em] text-brand-gold-light">{title}</h2>
      <ul className="mt-2 flex flex-col gap-1.5">
        {links.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              prefetch={item.prefetch}
              className="text-[13px] text-white/82 transition-colors hover:text-brand-gold-light"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** Compact global footer — dense columns, icon-only contact actions. */
export function SiteFooter() {
  const loc = siteConfig.location;
  const waDigits = siteConfig.whatsappAi.replace("+", "");
  const year = new Date().getFullYear();

  return (
    <footer className="bg-brand-green-dark text-white" role="contentinfo">
      <div className="container-shell border-b border-white/10 py-7 md:py-8">
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4 md:gap-8 lg:gap-10">
          {/* Brand + social */}
          <div className="sm:col-span-2 md:col-span-1">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold-light"
            >
              <BrandSealMark variant="nav" />
              <span className="font-heading text-sm font-bold leading-tight text-white">{siteConfig.name}</span>
            </Link>
            <p className="mt-2 text-[11px] uppercase tracking-[0.12em] text-brand-gold-light/85">
              {siteConfig.brandLockupSubtitle}
            </p>
            <SocialLinks variant="footer" layout="icons" className="mt-3" />
          </div>

          <FooterNavColumn title="Shop" links={shopLinks} />
          <FooterNavColumn title="Help" links={supportLinks} />

          {/* Icon-only contact */}
          <div>
            <h2 className="text-[10px] font-bold uppercase tracking-[0.14em] text-brand-gold-light">Contact</h2>
            <div className="mt-2 flex flex-wrap gap-2" role="list">
              <a
                href={`https://wa.me/${waDigits}`}
                target="_blank"
                rel="noopener noreferrer"
                role="listitem"
                aria-label={`WhatsApp ${siteConfig.whatsappDirect}`}
                title={`WhatsApp ${siteConfig.whatsappDirect}`}
                className={cn(iconBtnClass, "text-[#25D366] hover:text-[#25D366]")}
              >
                <WhatsAppIcon className="size-[18px]" />
              </a>
              <a
                href={`mailto:${siteConfig.email}`}
                role="listitem"
                aria-label={`Email ${siteConfig.email}`}
                title={siteConfig.email}
                className={iconBtnClass}
              >
                <Mail className="size-[18px]" strokeWidth={1.75} />
              </a>
              <a
                href={loc.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                role="listitem"
                aria-label={`Directions to ${loc.name}, ${loc.locality}`}
                title={`${loc.name} — get directions`}
                className={iconBtnClass}
              >
                <MapPin className="size-[18px]" strokeWidth={1.75} />
              </a>
            </div>
            <p className="mt-2 text-[11px] leading-snug text-white/50">
              <Link href="/contact#visit" className="hover:text-brand-gold-light hover:underline">
                {loc.name}, {loc.locality}
              </Link>
            </p>
          </div>
        </div>
      </div>

      <div className="container-shell flex flex-col items-center justify-between gap-2 py-3.5 text-[11px] text-white/60 sm:flex-row sm:gap-4">
        <p>© {year} {siteConfig.name}</p>
        <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
          <li>
            <Link href="/privacy" className="hover:text-brand-gold-light">
              Privacy
            </Link>
          </li>
          <li>
            <Link href="/cookies" className="hover:text-brand-gold-light">
              Cookies
            </Link>
          </li>
          <li>
            <a
              href="https://buildwithinnocent.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-brand-gold-light"
            >
              buildwithinnocent.com
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
