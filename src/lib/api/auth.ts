import { supabase } from "@/integrations/supabase/client";
import { usersApi } from "./users";

export interface UserProfile {
  id: string;
  email: string;
  created_at: string;
}

export const authApi = {
  // Sign up with email and password
  async signUp(email: string, password: string) {
    // Sign up with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) throw authError;

    // Create user in custom users table
    if (authData.user) {
      try {
        await usersApi.createUser({ id: authData.user.id, email });
      } catch (error) {
        // User might already exist, that's okay
        console.log("User already exists in users table");
      }
    }

    return authData;
  },

  // Sign in with email and password
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    // Ensure user exists in custom users table
    if (data.user) {
      try {
        await usersApi.getOrCreateUser(email);
      } catch (error) {
        console.error("Error syncing user:", error);
      }
    }

    return data;
  },

  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // Get current user from Supabase Auth
  async getCurrentUser() {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) throw error;
    return user;
  },

  // Get user from custom users table
  async getUserProfile(): Promise<UserProfile | null> {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || !user.email) return null;

    try {
      const userData = await usersApi.getUserByEmail(user.email);
      return userData;
    } catch (error) {
      // If user doesn't exist in custom table, create it
      if (user.email) {
        try {
          return await usersApi.createUser({ id: user.id, email: user.email });
        } catch (createError) {
          console.error("Error creating user:", createError);
          return null;
        }
      }
      return null;
    }
  },

  // Get user ID from custom users table (for use in other APIs)
  async getUserId(): Promise<string | null> {
    const profile = await this.getUserProfile();
    return profile?.id || null;
  },

  // Listen to auth state changes
  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  },
};
