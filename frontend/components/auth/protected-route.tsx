"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { getToken } from "@/lib/auth";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const token = getToken();

  useEffect(() => {
    if (!token) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [pathname, router, token]);

  if (!token) return null;

  return <>{children}</>;
}
