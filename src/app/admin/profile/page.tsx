import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUserWithRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { EmailForm, FullNameForm, PasswordForm } from "./profile-forms";

export default async function AdminProfilePage() {
  const ctx = await getCurrentUserWithRole();
  if (!ctx || ctx.role !== "admin") {
    redirect("/");
  }

  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", ctx.user.id)
    .maybeSingle();

  const email = ctx.user.email ?? "";
  const fullName = profile?.full_name ?? ctx.fullName ?? "";

  return (
    <main className="container-shell py-14">
      <p className="text-sm font-semibold text-brand-green">
        <Link href="/admin" className="hover:underline">
          ← Admin
        </Link>
      </p>
      <h1 className="mt-2 text-4xl font-bold text-brand-green-dark">Admin profile</h1>
      <p className="mt-2 max-w-2xl text-brand-charcoal/80">
        Update how you sign in and how your name appears. If you used{" "}
        <code className="rounded bg-brand-cream px-1 py-0.5 text-xs">npm run seed:admin</code>, change
        the default password here after first login.
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <section className="surface-card rounded-2xl p-6">
          <h2 className="text-xl font-bold text-brand-green-dark">Display name</h2>
          <p className="mt-1 text-sm text-brand-charcoal/70">Shown internally on your profile record.</p>
          <div className="mt-4">
            <FullNameForm initialFullName={fullName} />
          </div>
        </section>

        <section className="surface-card rounded-2xl p-6">
          <h2 className="text-xl font-bold text-brand-green-dark">Email</h2>
          <p className="mt-1 text-sm text-brand-charcoal/70">
            Used to sign in. Your project may send a confirmation link when you change this.
          </p>
          <div className="mt-4">
            <EmailForm initialEmail={email} />
          </div>
        </section>

        <section className="surface-card rounded-2xl p-6 lg:col-span-2">
          <h2 className="text-xl font-bold text-brand-green-dark">Password</h2>
          <p className="mt-1 text-sm text-brand-charcoal/70">
            Enter your current password, then choose a new one (at least 8 characters).
          </p>
          <div className="mt-4 max-w-md">
            <PasswordForm />
          </div>
        </section>
      </div>
    </main>
  );
}
