import { supabase } from "@/integrations/supabase/client";

export interface Habit {
  id: string;
  user_id: string;
  label: string;
  emoji: string | null;
  completed: boolean;
  date: string;
  created_at: string;
  updated_at: string;
}

export interface CreateHabit {
  label: string;
  emoji?: string;
  date?: string;
}

export const habitsApi = {
  // Get all habits
  async getAllHabits() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("habits")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as Habit[];
  },

  // Get today's habits
  async getTodayHabits() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const today = new Date().toISOString().split("T")[0];
    const { data, error } = await supabase
      .from("habits")
      .select("*")
      .eq("user_id", user.id)
      .eq("date", today)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as Habit[];
  },

  // Initialize default habits for today if they don't exist
  async initializeDefaultHabits() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const today = new Date().toISOString().split("T")[0];

    // Check if habits already exist for today
    const { data: existingHabits } = await supabase
      .from("habits")
      .select("id")
      .eq("user_id", user.id)
      .eq("date", today)
      .limit(1);

    if (existingHabits && existingHabits.length > 0) {
      return existingHabits;
    }

    // Create default habits
    const defaultHabits = [
      { label: "Meditate", emoji: "🧘" },
      { label: "Drink Water", emoji: "💧" },
      { label: "Write", emoji: "✍️" },
      { label: "Rest Well", emoji: "😴" },
      { label: "Move Body", emoji: "🚶" },
    ];

    const { data, error } = await supabase
      .from("habits")
      .insert(
        defaultHabits.map((habit) => ({
          user_id: user.id,
          label: habit.label,
          emoji: habit.emoji,
          date: today,
          completed: false,
        }))
      )
      .select();

    if (error) throw error;
    return data as Habit[];
  },

  // Create a new habit
  async createHabit(habit: CreateHabit) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("habits")
      .insert({
        user_id: user.id,
        label: habit.label,
        emoji: habit.emoji || null,
        date: habit.date || new Date().toISOString().split("T")[0],
        completed: false,
      })
      .select()
      .single();

    if (error) throw error;
    return data as Habit;
  },

  // Toggle habit completion
  async toggleHabit(id: string) {
    const { data: habit, error: fetchError } = await supabase
      .from("habits")
      .select("completed")
      .eq("id", id)
      .single();

    if (fetchError) throw fetchError;

    const { data, error } = await supabase
      .from("habits")
      .update({ completed: !habit.completed })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as Habit;
  },

  // Update a habit
  async updateHabit(id: string, updates: Partial<Habit>) {
    const { data, error } = await supabase
      .from("habits")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as Habit;
  },

  // Delete a habit
  async deleteHabit(id: string) {
    const { error } = await supabase
      .from("habits")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },
};


