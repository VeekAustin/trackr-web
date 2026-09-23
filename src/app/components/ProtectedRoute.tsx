"use client"

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function ProtectedRoute({children}:{children:React.ReactNode}) {
    const {user, loading} = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && ! user) {
            router.push("/login");
        }
    }, [loading, user, router]);

    if (loading || !user) {
        return (
            <div className="min-h-screen flex-item justify-center bg-gray-950 text-gray-400">
                loading...
            </div>
        );
    }

    return <>{children}</>;
}