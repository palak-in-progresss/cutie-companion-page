import { supabase } from "@/integrations/supabase/client";

export interface MoodEntry {
  id: string;
  user_id: string;
  mood: string | null;
  note: string | null;
  created_at: string;
}

export interface CreateMoodEntry {
  mood: string;
  note?: string;
}

export const moodApi = {
  // Get all mood entries for the current user
  async getAllMoods() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("mood_entries")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as MoodEntry[];
  },

  // Get today's mood
  async getTodayMood() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const today = new Date().toISOString().split("T")[0];
    const { data, error } = await supabase
      .from("mood_entries")
      .select("*")
      .eq("user_id", user.id)
      .gte("created_at", today)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    return data as MoodEntry | null;
  },

  // Create a new mood entry
  async createMood(mood: CreateMoodEntry) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("mood_entries")
      .insert({
        user_id: user.id,
        mood: mood.mood,
        note: mood.note || null,
      })
      .select()
      .single();

    if (error) throw error;
    return data as MoodEntry;
  },

  // Get mood entries by date range
  async getMoodsByDateRange(startDate: string, endDate: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("mood_entries")
      .select("*")
      .eq("user_id", user.id)
      .gte("created_at", startDate)
      .lte("created_at", endDate)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as MoodEntry[];
  },
};

