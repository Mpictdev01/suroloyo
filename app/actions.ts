'use server'

import { supabaseAdmin } from "@/lib/supabase-admin";

export async function getHomepageData() {
    try {
        console.log("Fetching homepage data via Server Action (Admin Bypass)...");
        const [galleryRes, newsRes] = await Promise.all([
            supabaseAdmin.from("gallery").select("*").order("created_at", { ascending: false }).limit(8),
            supabaseAdmin.from("news_articles").select("*").eq("status", "published").order("created_at", { ascending: false }).limit(3)
        ]);

        if (galleryRes.error) console.error("Server Gallery Error:", galleryRes.error);
        if (newsRes.error) console.error("Server News Error:", newsRes.error);

        return {
            gallery: galleryRes.data || [],
            news: newsRes.data || [],
            error: galleryRes.error || newsRes.error
        };
    } catch (e: any) {
        console.error("Server Action Error:", e);
        return {
            gallery: [],
            news: [],
            error: e.message
        };
    }
}

export async function checkUserRole(userId: string) {
    try {
        if (!userId) return { error: "No User ID" };
        
        const { data, error } = await supabaseAdmin
            .from("users")
            .select("id, email, name, role")
            .eq("id", userId)
            .single();
            
        if (error) {
            console.error("Server User Check Error:", error);
            return { error };
        }
        return { user: data };
    } catch (e) {
        return { error: e };
    }
}

export async function getUsers() {
    try {
        console.log("Fetching all users (Auth + Public) server action...");
        
        // 1. Fetch ALL users from Auth API (Source of Truth)
        const { data: { users: authUsers }, error: authError } = await supabaseAdmin.auth.admin.listUsers({
            page: 1,
            perPage: 1000
        });

        if (authError) {
            console.error("Auth Admin List Error:", authError);
            return { users: [], error: authError };
        }

        // 2. Fetch Public Profiles
        const { data: publicUsers, error: publicError } = await supabaseAdmin
            .from("users")
            .select("*");

        if (publicError) {
            console.error("Public Users List Error:", publicError);
            // Fallback to just auth users if public table fails
        }

        // 3. Merge Data
        // We want to return an array of users that looks like the public.users shape
        // but includes everyone from authUsers.
        const mergedUsers = authUsers.map((authUser) => {
            const publicProfile = publicUsers?.find(p => p.id === authUser.id);
            
            return {
                id: authUser.id,
                email: authUser.email,
                phone: authUser.phone || publicProfile?.phone,
                name: publicProfile?.name || authUser.user_metadata?.full_name || authUser.user_metadata?.name || authUser.email?.split("@")[0] || "User",
                role: publicProfile?.role || 'user', // Default to 'user' if no profile
                avatar: publicProfile?.avatar || authUser.user_metadata?.avatar_url,
                is_banned: publicProfile?.is_banned || false, // Or check authUser.banned_until
                created_at: authUser.created_at,
                // Add a flag to indicate if profile is missing
                is_missing_profile: !publicProfile
            };
        });

        // Sort by created_at desc
        mergedUsers.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        
        return { users: mergedUsers };
    } catch (e: any) {
        return { users: [], error: e.message };
    }
}

export async function getUserDetails(userId: string) {
    try {
        let userProfile = null;
        let authUser = null;

        // 1. Try to get Public Profile
        const { data: publicUser, error: publicError } = await supabaseAdmin
            .from("users")
            .select("*")
            .eq("id", userId)
            .single();

        if (publicUser) {
            userProfile = publicUser;
        } else {
            console.warn(`Public profile not found for ${userId}, fetching from Auth...`);
            // 2. Unhappy path: Profile missing, fetch from Auth
            const { data: { user }, error: authError } = await supabaseAdmin.auth.admin.getUserById(userId);
            
            if (authError || !user) {
                console.error("Auth User Fetch Error:", authError);
                throw new Error("User tidak ditemukan di sistem.");
            }
            
            authUser = user;
            // Construct fallback profile
            userProfile = {
                id: user.id,
                email: user.email,
                name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split("@")[0] || "User",
                phone: user.phone,
                role: 'user', // Default
                avatar: user.user_metadata?.avatar_url,
                created_at: user.created_at,
                is_missing_profile: true // Flag for UI
            };
        }

        // 3. Get User Bookings
        const { data: bookings, error: bookingsError } = await supabaseAdmin
            .from("bookings")
            .select("*")
            .eq("user_id", userId)
            .order("created_at", { ascending: false });

        return { 
            user: userProfile, 
            bookings: bookings || [],
            error: bookingsError 
        };

    } catch (e: any) {
        console.error("Get User Details Error:", e);
        return { user: null, bookings: [], error: e.message || e };
    }
}

export async function updateUserRole(userId: string, newRole: string) {
    try {
        console.log(`Updating user ${userId} to role ${newRole}...`);
        
        // Validate role
        if (!['user', 'admin', 'super_admin'].includes(newRole)) {
            return { error: "Invalid role" };
        }

        const { error } = await supabaseAdmin
            .from("users")
            .update({ role: newRole })
            .eq("id", userId);

        if (error) {
            console.error("Update Role Error:", error);
            return { error };
        }

        return { success: true };
    } catch (e: any) {
        console.error("Update Role Exception:", e);
        return { error: e.message || e };
    }
}
