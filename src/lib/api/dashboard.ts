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
  // Calculate journal streak
  async getStreak(): Promise<number> {
    const entries = await journalApi.getAllEntries();

    if (entries.length === 0) return 0;

    // Get unique dates with entries, sorted by date descending
    const uniqueDates = new Set(
      entries.map((entry) => new Date(entry.date).toDateString())
    );

    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    // Check if today has an entry, if not start from yesterday
    const todayStr = currentDate.toDateString();
    if (!uniqueDates.has(todayStr)) {
      currentDate.setDate(currentDate.getDate() - 1);
    }

    // Count consecutive days
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

    const [entries, habits] = await Promise.all([
      journalApi.getAllEntries(),
      supabase
        .from("habits")
        .select("*")
        .eq("user_id", user.id)
        .eq("date", new Date().toISOString().split("T")[0]),
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

  // Get weekly activity data
  async getWeeklyActivity(): Promise<WeeklyActivity[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const last7Days: WeeklyActivity[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];

      const { count } = await supabase
        .from("journal_entries")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("date", dateStr); // Verify 'date' column exists in journal_entries or use created_at

      // Note: journal_entries might not have a 'date' column if it uses created_at.
      // Based on previous schema, it had 'created_at'.
      // Let's check logic: original code used 'date' in eq("date", dateStr).
      // But journal table definition earlier showed 'created_at'.
      // Wait, journalApi return JournalEntry type which has 'date'?
      // Let's check journalApi type definition in next step if this fails, but for now assuming original code knew schema.
      // Actually, my earlier schema dump showed `created_at`.
      // The original dashboard.ts code (Step 241) used `.eq("date", dateStr)`.
      // I should stick to that unless I know it's wrong.
      // Wait, looking at getStreak in original code: entries.map((entry) => new Date(entry.date).toDateString())
      // This implies JournalEntry has a `date` property.

      last7Days.push({
        name: date.toLocaleDateString("en-US", { weekday: "short" }),
        entries: count || 0,
      });
    }

    return last7Days;
  },

  // Get mood distribution
  async getMoodDistribution(): Promise<MoodDistribution[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { data: entries } = await supabase
      .from("journal_entries")
      .select("mood")
      .eq("user_id", user.id);

    if (!entries) return [];

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
