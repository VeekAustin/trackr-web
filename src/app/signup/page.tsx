"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { signupSchema, SignupFormData } from "@/lib/schemas";

export default function SignupPage() {
  const { signup } = useAuth();
  const router = useRouter();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  async function onSubmit(data: SignupFormData) {
    setServerError("");
    try {
      await signup(data.name, data.email, data.password);
      router.push("/dashboard");
    } catch (err: any) {
      setServerError(err.message);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-gray-900 border border-gray-800 rounded-lg p-8 w-full max-w-sm"
      >
        <h1 className="text-xl font-semibold text-white mb-6">Create account</h1>

        {serverError && (
          <p className="text-red-400 text-sm mb-4">{serverError}</p>
        )}

        <div className="mb-3">
          <input
            type="text"
            placeholder="Name"
            {...register("name")}
            className="w-full bg-gray-800 text-white rounded px-3 py-2 outline-none"
          />
          {errors.name && (
            <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>
          )}
        </div>

        <div className="mb-3">
          <input
            type="email"
            placeholder="Email"
            {...register("email")}
            className="w-full bg-gray-800 text-white rounded px-3 py-2 outline-none"
          />
          {errors.email && (
            <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>

        <div className="mb-4">
          <input
            type="password"
            placeholder="Password"
            {...register("password")}
            className="w-full bg-gray-800 text-white rounded px-3 py-2 outline-none"
          />
          {errors.password && (
            <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-emerald-600 text-white rounded py-2 font-medium disabled:opacity-50"
        >
          {isSubmitting ? "Creating account..." : "Sign up"}
        </button>

        <p className="text-gray-400 text-sm mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-emerald-400">Log in</a>
        </p>
      </form>
    </div>
  );
}