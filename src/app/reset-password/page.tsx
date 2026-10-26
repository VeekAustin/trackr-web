"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiFetch } from "@/lib/api";
import {
  resetPasswordSchema,
  ResetPasswordFormData,
} from "@/lib/schemas";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  async function onSubmit(data: ResetPasswordFormData) {
    if (!token) return;
    setServerError("");
    try {
      await apiFetch("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, password: data.password }),
      });
      router.push("/login?reset=success");
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : "Something went wrong",
      );
    }
  }

  // All hooks are above this line; early returns must stay below them.
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 w-full max-w-sm">
          <h1 className="text-xl font-semibold text-white mb-3">
            Reset link not valid
          </h1>
          <p className="text-gray-300 text-sm">
            This page needs the link from your reset email. Request a new one
            and open the link from that email.
          </p>
          <Link
            href="/forgot-password"
            className="inline-block mt-6 text-sm text-emerald-400 hover:underline"
          >
            Request a new link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="bg-gray-900 border border-gray-800 rounded-lg p-8 w-full max-w-sm"
      >
        <h1 className="text-xl font-semibold text-white mb-6">
          Choose a new password
        </h1>

        {serverError && (
          <div className="mb-4">
            <p className="text-red-400 text-sm">{serverError}</p>
            <Link
              href="/forgot-password"
              className="text-sm text-emerald-400 hover:underline"
            >
              Request a new link
            </Link>
          </div>
        )}

        <div className="mb-3">
          <input
            type="password"
            placeholder="New password"
            aria-label="New password"
            autoComplete="new-password"
            {...register("password")}
            className="w-full bg-gray-800 text-white rounded px-3 py-2 outline-none"
          />
          {errors.password && (
            <p className="text-red-400 text-xs mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="mb-4">
          <input
            type="password"
            placeholder="Confirm new password"
            aria-label="Confirm new password"
            autoComplete="new-password"
            {...register("confirmPassword")}
            className="w-full bg-gray-800 text-white rounded px-3 py-2 outline-none"
          />
          {errors.confirmPassword && (
            <p className="text-red-400 text-xs mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-emerald-600 text-white rounded py-2 font-medium disabled:opacity-50"
        >
          {isSubmitting ? "Updating..." : "Update password"}
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}