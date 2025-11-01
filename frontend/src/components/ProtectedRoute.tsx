import { useRouter } from "next/router";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: "admin" | "user";
  redirectTo?: string;
}

const ProtectedRoute = ({ children, requiredRole, redirectTo = "/login" }: ProtectedRouteProps) => {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useAuth();
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.replace({ pathname: redirectTo, query: { from: router.asPath } }).catch(console.error);
      return;
    }

    if (requiredRole && user?.role !== requiredRole) {
      router.replace("/").catch(console.error);
      return;
    }

    setIsVerified(true);
  }, [isAuthenticated, isLoading, requiredRole, router, redirectTo, user?.role]);

  if (isLoading || !isVerified) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-slate-500">
        Loading...
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
