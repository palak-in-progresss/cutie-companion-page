import { supabase } from "@/integrations/supabase/client";

export interface MoodEntry {
  id: string;
  user_id: string;
  mood: string;
  note: string | null;
  date: string;
  created_at: string;
}

export interface CreateMoodEntry {
  mood: string;
  note?: string;
}

export const moodApi = {
  // Get all mood history
  async getAllMoods() {
    const { data, error } = await supabase
      .from("mood_history")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as MoodEntry[];
  },

  // Get today's mood
  async getTodayMood() {
    const today = new Date().toISOString().split("T")[0];
    const { data, error } = await supabase
      .from("mood_history")
      .select("*")
      .eq("date", today)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    return data as MoodEntry | null;
  },

  // Create a new mood entry
  async createMood(mood: CreateMoodEntry) {
    const { data, error } = await supabase
      .from("mood_history")
      .insert({
        mood: mood.mood,
        note: mood.note || null,
        date: new Date().toISOString().split("T")[0],
      })
      .select()
      .single();

    if (error) throw error;
    return data as MoodEntry;
  },

  // Get mood history by date range
  async getMoodsByDateRange(startDate: string, endDate: string) {
    const { data, error } = await supabase
      .from("mood_history")
      .select("*")
      .gte("date", startDate)
      .lte("date", endDate)
      .order("date", { ascending: false });

    if (error) throw error;
    return data as MoodEntry[];
  },
};

