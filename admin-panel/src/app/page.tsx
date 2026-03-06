"use client";

import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (user) {
                router.push('/dashboard');
            } else {
                router.push('/login');
            }
        }
    }, [user, loading, router]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-white">
            <div className="animate-pulse flex flex-col items-center">
                <div className="h-12 w-12 bg-primary/20 rounded-full mb-4"></div>
                <p className="text-gray-400 font-medium">Sparking things up...</p>
            </div>
        </div>
    );
}
