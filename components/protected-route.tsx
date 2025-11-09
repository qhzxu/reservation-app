"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores/auth-store";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "USER" | "ADMIN";
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const router = useRouter();
  const { user, accessToken, clearAuth } = useAuthStore();
  const [hydrated, setHydrated] = useState(false);

  // JWT 만료 체크
  function isTokenExpired(token: string) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    if (!accessToken || !user || isTokenExpired(accessToken)) {
      clearAuth();
      router.replace("/login");
      return;
    }

    if (requiredRole && user.role !== requiredRole) {
      router.replace("/");
      return;
    }
  }, [hydrated, accessToken, user, requiredRole, router, clearAuth]);

  if (!hydrated || !accessToken || (requiredRole && user?.role !== requiredRole)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="animate-pulse text-gray-500">로딩 중...</span>
      </div>
    );
  }

  return <>{children}</>;
}
