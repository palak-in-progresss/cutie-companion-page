import { supabase } from "@/integrations/supabase/client";

export interface JournalEntry {
  id: string;
  user_id: string;
  entry_text: string;
  mood: string | null;
  companion_reply: string | null;
  date: string;
  created_at: string;
  updated_at: string;
}

export interface CreateJournalEntry {
  entry_text: string;
  mood?: string;
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
      .eq("date", today)
      .order("created_at", { ascending: true });

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

  // Create a new journal entry, then trigger companion reply
  async createEntry(entry: CreateJournalEntry): Promise<JournalEntry> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const today = new Date().toISOString().split("T")[0];

    const { data, error } = await supabase
      .from("journal_entries")
      .insert({
        user_id: user.id,
        entry_text: entry.entry_text,
        mood: entry.mood || null,
        date: today,
      })
      .select()
      .single();

    if (error) throw error;
    const newEntry = data as JournalEntry;

    // Fire-and-forget companion reply (non-blocking)
    journalApi.generateCompanionReply(newEntry.id, entry.entry_text, entry.mood);

    return newEntry;
  },

  // Call the companion-reply Edge Function and patch the entry
  async generateCompanionReply(entryId: string, entryText: string, mood?: string) {
    try {
      const { data, error } = await supabase.functions.invoke("companion-reply", {
        body: { entry_text: entryText, mood: mood || null },
      });

      if (error || !data?.reply) return;

      // Patch the entry with the reply
      await supabase
        .from("journal_entries")
        .update({ companion_reply: data.reply })
        .eq("id", entryId);
    } catch {
      // Silently fail — companion reply is a bonus feature
    }
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
