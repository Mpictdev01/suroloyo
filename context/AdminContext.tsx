"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: "admin" | "super_admin";
}

interface AdminContextType {
  user: AdminUser | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check current session
    checkUser();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session) {
        await checkUser();
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        if (pathname?.startsWith("/admin") && pathname !== "/admin/login") {
          router.push("/admin/login");
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkUser = async () => {
    try {
      const {
        data: { session },
        error: sessionError
      } = await supabase.auth.getSession();

      if (sessionError) throw sessionError;

      if (!session) {
        setUser(null);
        setLoading(false);
        return;
      }

      // USE SERVER ACTION TO BYPASS RLS CHECKS
      const { user: userData, error } = await import("@/app/actions").then(mod => mod.checkUserRole(session.user.id));

      if (error) {
        console.warn("User role check failed:", error);
        // Fallback: don't sign out, just fail admin check
        setUser(null);
        setLoading(false);
        return;
      }

      if (!userData) {
        console.warn("User not found in DB.");
        await supabase.auth.signOut();
        setUser(null);
        setLoading(false);
        return;
      }

      // Check if user is admin
      if (userData.role !== "admin" && userData.role !== "super_admin") {
        await supabase.auth.signOut();
        setUser(null);
        setLoading(false);
        return;
      }

      setUser(userData as AdminUser);
    } catch (error) {
       console.warn("Error in checkUser wrapper:", (error as Error).message || error);
       setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push("/admin/login");
  };

  return (
    <AdminContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error("useAdmin must be used within AdminProvider");
  }
  return context;
}
