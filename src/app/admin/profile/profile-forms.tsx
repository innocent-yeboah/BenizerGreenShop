"use client";

import { useActionState } from "react";
import type { ProfileActionState } from "./actions";
import {
  updateAdminEmailAction,
  updateAdminFullNameAction,
  updateAdminPasswordAction,
} from "./actions";

function FormMessage({ state }: { state: ProfileActionState | null }) {
  if (!state?.error && !state?.message) return null;
  if (state.error) {
    return (
      <p className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800" role="alert">
        {state.error}
      </p>
    );
  }
  return (
    <p className="mt-3 rounded-lg border border-brand-green/25 bg-brand-green-light/25 p-3 text-sm text-brand-green-dark">
      {state.message}
    </p>
  );
}

export function FullNameForm({ initialFullName }: { initialFullName: string }) {
  const [state, action, pending] = useActionState(updateAdminFullNameAction, {});

  return (
    <form action={action} className="space-y-3">
      <label className="block text-sm font-semibold text-brand-green-dark">
        Display name
        <input
          name="fullName"
          type="text"
          defaultValue={initialFullName}
          className="mt-1 w-full rounded-lg border border-brand-green/20 p-3 font-normal"
          placeholder="Your name"
          autoComplete="name"
        />
      </label>
      <button type="submit" className="btn-secondary rounded-lg px-4 py-2.5" disabled={pending}>
        {pending ? "Saving…" : "Save name"}
      </button>
      <FormMessage state={state} />
    </form>
  );
}

export function EmailForm({ initialEmail }: { initialEmail: string }) {
  const [state, action, pending] = useActionState(updateAdminEmailAction, {});

  return (
    <form action={action} className="space-y-3">
      <label className="block text-sm font-semibold text-brand-green-dark">
        Sign-in email
        <input
          name="email"
          type="email"
          required
          defaultValue={initialEmail}
          className="mt-1 w-full rounded-lg border border-brand-green/20 p-3 font-normal"
          autoComplete="email"
        />
      </label>
      <button type="submit" className="btn-secondary rounded-lg px-4 py-2.5" disabled={pending}>
        {pending ? "Updating…" : "Update email"}
      </button>
      <FormMessage state={state} />
    </form>
  );
}

export function PasswordForm() {
  const [state, action, pending] = useActionState(updateAdminPasswordAction, {});

  return (
    <form action={action} className="space-y-3">
      <label className="block text-sm font-semibold text-brand-green-dark">
        Current password
        <input
          name="currentPassword"
          type="password"
          required
          className="mt-1 w-full rounded-lg border border-brand-green/20 p-3 font-normal"
          autoComplete="current-password"
        />
      </label>
      <label className="block text-sm font-semibold text-brand-green-dark">
        New password
        <input
          name="newPassword"
          type="password"
          required
          minLength={8}
          className="mt-1 w-full rounded-lg border border-brand-green/20 p-3 font-normal"
          autoComplete="new-password"
        />
      </label>
      <label className="block text-sm font-semibold text-brand-green-dark">
        Confirm new password
        <input
          name="confirmPassword"
          type="password"
          required
          minLength={8}
          className="mt-1 w-full rounded-lg border border-brand-green/20 p-3 font-normal"
          autoComplete="new-password"
        />
      </label>
      <button type="submit" className="btn-secondary rounded-lg px-4 py-2.5" disabled={pending}>
        {pending ? "Updating…" : "Change password"}
      </button>
      <FormMessage state={state} />
    </form>
  );
}
