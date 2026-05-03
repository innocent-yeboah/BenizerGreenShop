import { cn } from "@/lib/utils";

/** Revobit-style four pillars — localized for Benizer (Ghana delivery, organic focus). */
type Stat = {
  title: string;
  subtitle: string;
  icon: "heart" | "shield" | "truck" | "banknotes";
  iconColor: string;
  iconBg: string;
  titleColor: string;
};

const STATS: Stat[] = [
  {
    title: "Get back your health",
    subtitle: "Wellness-focused formulas you can trust",
    icon: "heart",
    iconColor: "text-emerald-600",
    iconBg: "bg-emerald-600/14",
    titleColor: "text-emerald-950",
  },
  {
    title: "Certified products",
    subtitle: "100% organic formulas",
    icon: "shield",
    iconColor: "text-amber-700",
    iconBg: "bg-amber-500/15",
    titleColor: "text-amber-950",
  },
  {
    title: "Fast shipping",
    subtitle: "Tamale · Accra · nationwide Ghana",
    icon: "truck",
    iconColor: "text-sky-600",
    iconBg: "bg-sky-600/14",
    titleColor: "text-sky-950",
  },
  {
    title: "Get rewards",
    subtitle: "Distributor bonuses & referral earnings",
    icon: "banknotes",
    iconColor: "text-rose-600",
    iconBg: "bg-rose-600/14",
    titleColor: "text-rose-950",
  },
];

function StatIcon({
  name,
  className,
}: {
  name: Stat["icon"];
  className?: string;
}) {
  const common = {
    xmlns: "http://www.w3.org/2000/svg" as const,
    fill: "none" as const,
    viewBox: "0 0 24 24",
    strokeWidth: 1.5,
    stroke: "currentColor",
    className: cn("h-9 w-9", className),
    "aria-hidden": true as const,
  };

  switch (name) {
    case "heart":
      return (
        <svg {...common}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
          />
        </svg>
      );
    case "shield":
      return (
        <svg {...common}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
          />
        </svg>
      );
    case "truck":
      return (
        <svg {...common}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
          />
        </svg>
      );
    case "banknotes":
      return (
        <svg {...common}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z"
          />
        </svg>
      );
  }
}

export function HomeHighlightStats() {
  return (
    <section className="border-y border-brand-green/10 bg-white py-10 md:py-12">
      <div className="container-shell">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((item) => (
            <div
              key={item.title}
              className="surface-card flex flex-col items-center rounded-2xl border border-brand-charcoal/6 bg-white px-5 py-6 text-center shadow-[0_12px_40px_-28px_rgba(13,59,15,0.2)] transition-transform hover:-translate-y-px"
            >
              <div
                className={cn(
                  "mb-4 flex size-14 items-center justify-center rounded-full",
                  item.iconBg,
                  item.iconColor,
                )}
              >
                <StatIcon name={item.icon} />
              </div>
              <p className={cn("text-lg font-bold capitalize", item.titleColor)}>{item.title}</p>
              <p className="mt-1.5 text-sm font-medium leading-snug text-brand-charcoal/72">{item.subtitle}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
