import { supabase } from "@/integrations/supabase/client";

export interface JournalEntry {
  id: string;
  user_id: string;
  title: string;
  content: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateJournalEntry {
  title: string;
  content?: string;
}

export const journalApi = {
  // Get all journal entries for the current user
  async getAllEntries() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("journal_entries")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as JournalEntry[];
  },

  // Get today's journal entries
  async getTodayEntries() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const today = new Date().toISOString().split("T")[0];
    const { data, error } = await supabase
      .from("journal_entries")
      .select("*")
      .eq("user_id", user.id)
      .gte("created_at", today)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as JournalEntry[];
  },

  // Get entries by date range
  async getEntriesByDateRange(startDate: string, endDate: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("journal_entries")
      .select("*")
      .eq("user_id", user.id)
      .gte("created_at", startDate)
      .lte("created_at", endDate)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as JournalEntry[];
  },

  // Create a new journal entry
  async createEntry(entry: CreateJournalEntry) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("journal_entries")
      .insert({
        user_id: user.id,
        title: entry.title,
        content: entry.content || null,
      })
      .select()
      .single();

    if (error) throw error;
    return data as JournalEntry;
  },

  // Update a journal entry
  async updateEntry(id: string, updates: Partial<JournalEntry>) {
    const { data, error } = await supabase
      .from("journal_entries")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as JournalEntry;
  },

  // Delete a journal entry
  async deleteEntry(id: string) {
    const { error } = await supabase
      .from("journal_entries")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },
};
