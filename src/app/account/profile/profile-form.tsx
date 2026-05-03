"use client";

import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { updateCustomerProfileAction } from "@/app/account/actions";

type Props = {
  initialFullName: string;
  email: string | null | undefined;
};

export function ProfileForm({ initialFullName, email }: Props) {
  const router = useRouter();
  const update = useAction(updateCustomerProfileAction, {
    onSuccess() {
      router.refresh();
    },
  });

  return (
    <form
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        update.execute({
          fullName: String(fd.get("fullName") || "").trim(),
        });
      }}
    >
      <div className="space-y-2">
        <label htmlFor="acct-email" className="block text-sm font-medium text-brand-charcoal">
          Email {`(sign-in)`}
        </label>
        <input
          id="acct-email"
          type="email"
          defaultValue={email ?? ""}
          readOnly
          aria-readonly="true"
          tabIndex={-1}
          className="w-full rounded-xl border border-brand-charcoal/10 bg-brand-cream/35 px-4 py-3 text-sm text-brand-charcoal/75"
        />
        <p className="text-xs text-brand-charcoal/55">
          Changing email isn&apos;t offered here yet. Contact support if you need to move your purchases.
        </p>
      </div>
      <div className="space-y-2">
        <label htmlFor="acct-name" className="block text-sm font-medium text-brand-charcoal">
          Display name
        </label>
        <input
          id="acct-name"
          name="fullName"
          type="text"
          defaultValue={initialFullName}
          minLength={2}
          required
          className="w-full rounded-xl border border-brand-charcoal/10 bg-white px-4 py-3 text-sm text-brand-charcoal shadow-sm outline-none transition-[border-color,box-shadow] focus:border-brand-green/35 focus:ring-4 focus:ring-brand-green/10"
        />
      </div>
      {update.result?.validationErrors?.fullName?.[0]?._errors?.[0] ? (
        <p className="text-sm text-red-600">{update.result.validationErrors.fullName[0]._errors[0]}</p>
      ) : null}
      {update.result?.serverError ? (
        <p className="text-sm text-red-600">{String(update.result.serverError)}</p>
      ) : null}
      {update.result?.data?.ok ? (
        <p className="text-sm font-medium text-brand-green-dark" role="status">
          Profile saved.
        </p>
      ) : null}
      <button
        type="submit"
        disabled={update.status === "executing"}
        className="inline-flex items-center justify-center rounded-xl bg-brand-green px-6 py-3 text-sm font-semibold text-white shadow-md shadow-brand-green/15 hover:bg-brand-green-dark disabled:opacity-55"
      >
        {update.status === "executing" ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
}
