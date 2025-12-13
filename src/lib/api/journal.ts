import { supabase } from "@/integrations/supabase/client";

export interface JournalEntry {
  id: string;
  user_id: string;
  entry_text: string;
  mood: string | null;
  companion_reply: string | null;
  sentiment_score: number | null;
  sentiment_label: string | null;
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
    const { data, error } = await supabase
      .from("journal_entries")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as JournalEntry[];
  },

  // Get today's journal entries
  async getTodayEntries() {
    const today = new Date().toISOString().split("T")[0];
    const { data, error } = await supabase
      .from("journal_entries")
      .select("*")
      .eq("date", today)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as JournalEntry[];
  },

  // Get entries by date range
  async getEntriesByDateRange(startDate: string, endDate: string) {
    const { data, error } = await supabase
      .from("journal_entries")
      .select("*")
      .gte("date", startDate)
      .lte("date", endDate)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as JournalEntry[];
  },

  // Create a new journal entry and get AI companion reply
  async createEntry(entry: CreateJournalEntry) {
    // First, create the entry
    const { data: entryData, error: entryError } = await supabase
      .from("journal_entries")
      .insert({
        entry_text: entry.entry_text,
        mood: entry.mood || null,
        date: new Date().toISOString().split("T")[0],
      })
      .select()
      .single();

    if (entryError) throw entryError;

    // Then, get AI companion reply
    try {
      const { data: replyData, error: replyError } = await supabase.functions.invoke(
        "companion-reply",
        {
          body: {
            entry_text: entry.entry_text,
            mood: entry.mood || null,
          },
        }
      );

      if (replyError) throw replyError;

      // Update the entry with the companion reply and sentiment
      const { data: updatedEntry, error: updateError } = await supabase
        .from("journal_entries")
        .update({
          companion_reply: replyData.reply,
          sentiment_score: replyData.sentiment.score,
          sentiment_label: replyData.sentiment.label,
        })
        .eq("id", entryData.id)
        .select()
        .single();

      if (updateError) throw updateError;

      return updatedEntry as JournalEntry;
    } catch (error) {
      // If AI reply fails, return the entry without reply
      console.error("Failed to get companion reply:", error);
      return entryData as JournalEntry;
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

