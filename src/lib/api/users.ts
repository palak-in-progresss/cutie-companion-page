import { supabase } from "@/integrations/supabase/client";

export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface CreateUser {
  id: string;
  email: string;
}

export const usersApi = {
  // Get user by ID
  async getUserById(id: string) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data as User;
  },

  // Get user by email
  async getUserByEmail(email: string) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .maybeSingle();

    if (error) throw error;
    return data as User | null;
  },

  // Create a new user
  async createUser(user: CreateUser) {
    const { data, error } = await supabase
      .from("users")
      .insert({
        id: user.id,
        email: user.email,
      })

      .select()
      .single();

    if (error) throw error;
    return data as User;
  },

  // Check if user exists, create if not
  async getOrCreateUser(email: string) {
    // Try to get existing user
    const existing = await this.getUserByEmail(email);
    if (existing) {
      return existing;
    }

    // Create new user if doesn't exist
    return await this.createUser({ email });
  },
};


