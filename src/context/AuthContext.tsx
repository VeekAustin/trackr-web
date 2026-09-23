"use client";

import {createContext, useContext, useState, useEffect, ReactNode } from "react";
import { apiFetch } from "@/lib/api";

interface User{
    id: string;
    name: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    token: String | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (name: string, emaii: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider ({children}: {children: ReactNode}) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");
        if (storedToken && storedUser) {
            setToken(storedToken)
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, [])

    function persist(newToken: string, newUser: User) {
        localStorage.setItem("token", newToken);
        localStorage.setItem("user", JSON.stringify(newUser));
        setToken(newToken);
        setUser(newUser);
    }

    async function login (email: string, password: string){
        const data = await apiFetch("/auth/login", {
            method: "POST",
            body: JSON.stringify({email, password }),
        });
        persist(data.token, data.user);
    }

    async function signup (name: string, email: string, password: string){
        const data = await apiFetch("/auth/signup", {
            method: "POST",
            body: JSON.stringify({name, email, password }),
        });
        persist(data.token, data.user);
    }
     
    function logout () {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{user, token, loading, login, signup, logout}}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth () {
    const context = useContext(AuthContext);
    if(!context) {
        throw new Error("useAuth must be within AuthProvider");
    }
    return context;
}