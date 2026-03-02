import { supabase } from "@/integrations/supabase/client";
import { journalApi } from "./journal";

export interface DashboardStats {
  streak: number;
  totalEntries: number;
  habitsCompleted: number;
  habitsTotal: number;
}

export interface WeeklyActivity {
  name: string;
  entries: number;
}

export interface MoodDistribution {
  name: string;
  value: number;
  color: string;
}

export const dashboardApi = {
  // Calculate journal streak based on created_at
  async getStreak(): Promise<number> {
    const entries = await journalApi.getAllEntries();
    if (entries.length === 0) return 0;

    // Get unique dates with entries (using created_at)
    const uniqueDates = new Set(
      entries.map((entry) => new Date(entry.created_at).toDateString())
    );

    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    // If today has no entry, start streak check from yesterday
    const todayStr = currentDate.toDateString();
    if (!uniqueDates.has(todayStr)) {
      currentDate.setDate(currentDate.getDate() - 1);
    }

    // Count consecutive days backwards
    for (let i = 0; i < 365; i++) {
      const dateStr = currentDate.toDateString();
      if (uniqueDates.has(dateStr)) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  },

  // Get dashboard stats
  async getStats(): Promise<DashboardStats> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const today = new Date().toISOString().split("T")[0];

    const [entries, habits] = await Promise.all([
      journalApi.getAllEntries(),
      supabase
        .from("habits")
        .select("*")
        .eq("user_id", user.id)
        .eq("date", today),
    ]);

    const streak = await this.getStreak();
    const habitsCompleted = habits.data?.filter((h) => h.completed).length || 0;
    const habitsTotal = habits.data?.length || 0;

    return {
      streak,
      totalEntries: entries.length,
      habitsCompleted,
      habitsTotal,
    };
  },

  // Get weekly journal activity using created_at range
  async getWeeklyActivity(): Promise<WeeklyActivity[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const last7Days: WeeklyActivity[] = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const { count } = await supabase
        .from("journal_entries")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .gte("created_at", startOfDay.toISOString())
        .lte("created_at", endOfDay.toISOString());

      last7Days.push({
        name: date.toLocaleDateString("en-US", { weekday: "short" }),
        entries: count || 0,
      });
    }

    return last7Days;
  },

  // Get mood distribution from mood_entries (the correct table)
  async getMoodDistribution(): Promise<MoodDistribution[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { data: entries } = await supabase
      .from("mood_entries")
      .select("mood")
      .eq("user_id", user.id)
      .not("mood", "is", null);

    if (!entries || entries.length === 0) return [];

    const moodCount: Record<string, number> = {};
    entries.forEach((entry) => {
      if (entry.mood) {
        moodCount[entry.mood] = (moodCount[entry.mood] || 0) + 1;
      }
    });

    const moodColors: Record<string, string> = {
      "😊": "#fbbf24",
      "😐": "#94a3b8",
      "😞": "#60a5fa",
      "😤": "#f87171",
      "😌": "#a78bfa",
      "💫": "#fb923c",
    };

    return Object.entries(moodCount).map(([mood, count]) => ({
      name: mood,
      value: count,
      color: moodColors[mood] || "#94a3b8",
    }));
  },
};
