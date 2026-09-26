import React from "react";
import { Navigate } from "react-router-dom";
import { usePlatform } from "../../context/PlatformContext.js";
import { AdminForbiddenPage } from "./AdminForbiddenPage.js";

export const AdminRouteGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, authLoading, currentUser } = usePlatform();

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-3">
        <div className="h-10 w-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-semibold text-slate-400 font-mono">Verifying administrative security claims...</p>
      </div>
    );
  }

  // 1. Unauthenticated -> Redirect to dedicated Admin Login
  if (!isAuthenticated || !currentUser) {
    return <Navigate to="/admin/login" replace />;
  }

  // 2. Authenticated as non-admin -> Show 403 Forbidden screen
  const userRole = (currentUser.role || "LEARNER").toString().toUpperCase();
  if (userRole !== "ADMIN") {
    return <AdminForbiddenPage />;
  }

  // 3. Authorized Administrator
  return <>{children}</>;
};

export default AdminRouteGuard;
