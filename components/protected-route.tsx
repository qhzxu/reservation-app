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
  const { user, accessToken } = useAuthStore();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    if (!accessToken || !user) {
      router.replace("/login");
      return;
    }

    if (requiredRole && user.role !== requiredRole) {
      router.replace("/");
      return;
    }
  }, [hydrated, accessToken, user, requiredRole, router]);

  if (!hydrated || !accessToken || (requiredRole && user?.role !== requiredRole)) {
    return <div className="flex items-center justify-center min-h-screen">로딩 중...</div>;
  }

  return <>{children}</>;
}
