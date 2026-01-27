import { supabase } from "@/integrations/supabase/client";

export interface Task {
  id: string;
  user_id: string;
  text: string;
  completed: boolean;
  date: string;
  created_at: string;
  updated_at: string;
}

export interface CreateTask {
  text: string;
  date?: string;
}

export const tasksApi = {
  // Get all tasks
  async getAllTasks() {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as Task[];
  },

  // Get today's tasks
  async getTodayTasks() {
    const today = new Date().toISOString().split("T")[0];
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("date", today)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as Task[];
  },

  // Create a new task
  async createTask(task: CreateTask) {
    const { data, error } = await supabase
      .from("tasks")
      .insert({
        text: task.text,
        date: task.date || new Date().toISOString().split("T")[0],
        completed: false,
      })
      .select()
      .single();

    if (error) throw error;
    return data as Task;
  },

  // Update a task
  async updateTask(id: string, updates: Partial<Task>) {
    const { data, error } = await supabase
      .from("tasks")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as Task;
  },

  // Toggle task completion
  async toggleTask(id: string) {
    const { data: task, error: fetchError } = await supabase
      .from("tasks")
      .select("completed")
      .eq("id", id)
      .single();

    if (fetchError) throw fetchError;

    const { data, error } = await supabase
      .from("tasks")
      .update({ completed: !task.completed })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as Task;
  },

  // Delete a task
  async deleteTask(id: string) {
    const { error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },
};


