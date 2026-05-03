/** Maps DB order status strings to compact badge styles for account / admin UI. */
export function orderStatusBadgeClass(status: string): string {
  const s = status.toLowerCase().replace(/_/g, " ");
  if (s === "failed" || s === "cancelled" || s === "canceled")
    return "bg-red-50 text-red-800 ring-red-200/80";
  if (s === "pending" || s === "processing")
    return "bg-amber-50 text-amber-900 ring-amber-200/90";
  if (s === "paid" || s === "shipped" || s === "delivered")
    return "bg-emerald-50 text-emerald-900 ring-emerald-200/80";
  return "bg-brand-cream text-brand-green-dark ring-brand-green/15";
}

export function orderStatusLabel(status: string): string {
  return status.replace(/-/g, " ").replace(/_/g, " ");
}
