"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiFetch } from "@/lib/api";
import {
  forgotPasswordSchema,
  ForgotPasswordFormData,
} from "@/lib/schemas";

export default function ForgotPasswordPage() {
  const [serverError, setServerError] = useState("");
  const [sent, setSent] = useState(false);

  // Wake the API early; on Render's free tier the first request can be slow.
  useEffect(() => {
    apiFetch("/health").catch(() => {});
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  async function onSubmit(data: ForgotPasswordFormData) {
    setServerError("");
    try {
      await apiFetch("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify(data),
      });
      setSent(true);
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : "Something went wrong",
      );
    }
  }

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 w-full max-w-sm">
          <h1 className="text-xl font-semibold text-white mb-3">
            Check your email
          </h1>
          <p className="text-gray-300 text-sm">
            If an account exists for that email, we&apos;ve sent a link to reset
            your password. It expires in 30 minutes. If you don&apos;t see it,
            check your spam folder.
          </p>
          <Link
            href="/login"
            className="inline-block mt-6 text-sm text-emerald-400 hover:underline"
          >
            Back to log in
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
        <h1 className="text-xl font-semibold text-white mb-2">
          Forgot your password?
        </h1>
        <p className="text-gray-300 text-sm mb-6">
          Enter your email and we&apos;ll send you a link to choose a new one.
        </p>

        {serverError && (
          <p className="text-red-400 text-sm mb-4">{serverError}</p>
        )}

        <div className="mb-4">
          <input
            type="email"
            placeholder="Email"
            aria-label="Email"
            autoComplete="email"
            {...register("email")}
            className="w-full bg-gray-800 text-white rounded px-3 py-2 outline-none"
          />
          {errors.email && (
            <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-emerald-600 text-white rounded py-2 font-medium disabled:opacity-50"
        >
          {isSubmitting
            ? "Sending - this can take up to a minute..."
            : "Send reset link"}
        </button>

        <p className="text-gray-400 text-sm mt-4">
          Remembered it?{" "}
          <Link href="/login" className="text-emerald-400 hover:underline">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}