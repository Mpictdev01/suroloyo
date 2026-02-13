"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { User as SupabaseUser } from "@supabase/supabase-js";

export interface EmergencyContact {
  name: string;
  phone: string;
  relation: string;
}

export interface Member {
  name: string;
  id: string; // NIK
  phone?: string;
  email?: string;
  avatar?: string;
  gender?: "L" | "P";
  address?: string;
  age?: number;
  dob?: string;
  ktpPhoto?: string;
  emergencyContact?: EmergencyContact;
}

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  nik?: string;
  phone?: string;
  address?: string;
  gender?: "L" | "P";
}

export interface BookingHistoryItem {
  id: string;
  date: string; // Hike Date
  leader: Member;
  members: Member[];
  totalPrice: number;
  status: "Menunggu Pembayaran" | "Diproses" | "Berhasil" | "Dibatalkan";
  createdAt: string;
}

interface BookingContextType {
  user: User | null;
  loading: boolean;
  login: (userData: User) => void;
  logout: () => void;
  leader: Member | null;
  setLeader: (leader: Member) => void;
  bookingDate: string | null; // Format: YYYY-MM-DD
  setBookingDate: (date: string) => void;
  members: Member[];
  addMember: (member: Member) => void;
  removeMember: (index: number) => void;
  bookingId: string | null;
  generateBookingId: () => void;
  resetBooking: () => void;
  history: BookingHistoryItem[];
  addToHistory: (item: BookingHistoryItem) => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [leader, setLeader] = useState<Member | null>(null);
  const [bookingDate, setBookingDate] = useState<string | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [history, setHistory] = useState<BookingHistoryItem[]>([]);

  useEffect(() => {
    // Initial session check
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          // Fetch profile data
          const { data: profile, error } = await supabase
            .from("users")
            .select("*")
            .eq("id", session.user.id)
            .single();

          if (error) {
              console.warn("Could not fetch user profile on initial check (might not exist yet):", error.message);
          }

          setUser({
            id: session.user.id,
            name: profile?.name || session.user.email?.split("@")[0] || "User",
            email: session.user.email || "",
            avatar: `https://ui-avatars.com/api/?background=random&name=${profile?.name || session.user.email}`,
            nik: profile?.nik,
            phone: profile?.phone,
            address: profile?.address,
            gender: profile?.gender,
          });
        }
      } catch (err: any) {
          if (err.name !== 'AbortError') {
              console.error("Session check error:", err);
          }
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      try {
        if (session?.user) {
          const { data: profile, error } = await supabase
            .from("users")
            .select("*")
            .eq("id", session.user.id)
            .maybeSingle();

          if (error) console.warn("Profile sync warning:", error.message);

          setUser({
            id: session.user.id,
            name: profile?.name || session.user.email?.split("@")[0] || "User",
            email: session.user.email || "",
            avatar: `https://ui-avatars.com/api/?background=random&name=${profile?.name || session.user.email}`,
            nik: profile?.nik,
            phone: profile?.phone,
            address: profile?.address,
            gender: profile?.gender,
          });
        } else {
          setUser(null);
          resetBooking();
        }
      } catch (err: any) {
          if (err.name !== 'AbortError') {
              console.error("Auth change sync error:", err);
          }
      } finally {
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    // Profile is already synced via onAuthStateChange
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    resetBooking();
  };

  const addMember = (member: Member) => {
    setMembers((prev) => [...prev, member]);
  };

  const removeMember = (index: number) => {
    setMembers((prev) => prev.filter((_, i) => i !== index));
  };

  const generateBookingId = () => {
    const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
    const year = new Date().getFullYear();
    setBookingId(`SRL-${year}-${randomStr}`);
  };

  const addToHistory = (item: BookingHistoryItem) => {
    setHistory(prev => [item, ...prev]);
  };

  const resetBooking = () => {
    setLeader(null);
    setBookingDate(null);
    setMembers([]);
    setBookingId(null);
  };

  // Auto-set leader if user is logged in and leader is not set
  useEffect(() => {
    if (user && !leader) {
      setLeader({
        name: user.name,
        email: user.email,
        id: user.nik || "",
        avatar: user.avatar,
        phone: user.phone,
        address: user.address,
        gender: user.gender,
      });
    }
  }, [user, leader]);

  return (
    <BookingContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        leader,
        setLeader,
        bookingDate,
        setBookingDate,
        members,
        addMember,
        removeMember,
        bookingId,
        generateBookingId,
        resetBooking,
        history,
        addToHistory,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
}
