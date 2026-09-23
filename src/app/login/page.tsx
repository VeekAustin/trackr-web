"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
    const { login } = useAuth();
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setloading] = useState(false)

    async function handleSubmit (e:React.FormEvent) {
        e.preventDefault();
        setError("");
        setloading(true);
        try{
            await login(email, password);
            router.push("/dashboard");
        }catch(err:any) {
            setError(err.message);
        }finally {
            setloading(false);
        }
    }

    return (
        <div className="min-h-screen flex-items-center justify-center bg bg-gray-950 px-4">
            <form
            onSubmit={handleSubmit}
            className="bg bg-gray-900 border border-gray-800 rounded-lg p-8 w-full max-w-sm">
                <h1 className="text-xl font-semibold text-white mb-6">log in</h1>
                {error && (
                    <p className="text-red-400 text-sm mb-4">{error}</p>
                )}

                <input 
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-gray-800 text-white rounded px-3 py-2 mb-3 outline-none"
                    required
                />
                <input 
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-gray-800 text-white rounded px-3 py-2 mb-4 outline-none"
                    required
                />
                <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 text-white rounded py-2 font-medium disabled:opacity-50"                
                >
                    {loading ? "logging in..." : "log in"}
                </button>

                <p className="text-gray-400 text-sm mt-4">
                    Don't have an account?{" "}
                    <a href="/signup" className="text-emerald-400">Sign up</a>
                </p>
            </form>
        </div>
    );
}