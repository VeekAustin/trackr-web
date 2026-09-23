"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function SignupPage() {
    const { signup } = useAuth();
    const router = useRouter();
    const [name, setName ] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit (e:React.FormEvent){
        e.preventDefault();
        setError("");
        setLoading(true);
        try{
            await signup(name, email, password);
            router.push("/dashboard");
        }catch(err:any){
            setError(err.message);
        }finally{
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex-items-center justify-center bg-gray-950 px-4">
            <form
            onSubmit={handleSubmit}
            className="bg-gray-900 border border-gray-800 rounded-lg p-8 w-full max-w-sm"
            >
                <h1 className="text-xl font-semibold text-white mb-6">Create Account</h1>
                {error && (
                    <p  className="text-red-400 text-sm mb-4">{error}</p>
                )}

                <input 
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-gray-800 text-white rounded px-3 py-2 mb-3 outline-none"
                    required
                />
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
                    {loading ? "Creating account..." : "Signup"}
                </button>

                <p className="text-gray-400 text-sm ml-4">
                    Already have an account?{" "}
                    <a href="/dashboard" className="text-emerald-400">Log in</a>
                </p>
            </form>
        </div>
    )
}