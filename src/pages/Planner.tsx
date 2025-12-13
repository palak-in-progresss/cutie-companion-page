import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Heart, ArrowLeft, Plus, X, Check, Sparkles, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { tasksApi, type Task } from "@/lib/api/tasks";
import { habitsApi, type Habit } from "@/lib/api/habits";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";

const motivationalQuotes = [
  "You're doing better than you think 🌸",
  "Small steps still move you forward 💫",
  "Be gentle with yourself today 🌷",
  "You deserve rest and peace 💕",
  "Progress, not perfection 🌼",
];

const Planner = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [newTask, setNewTask] = useState("");
  const [dailyQuote, setDailyQuote] = useState("");

  // Fetch today's tasks
  const { data: tasks = [] } = useQuery({
    queryKey: ["tasks-today"],
    queryFn: () => tasksApi.getTodayTasks(),
  });

  // Fetch today's habits
  const { data: habits = [], isLoading: habitsLoading } = useQuery({
    queryKey: ["habits-today"],
    queryFn: async () => {
      // Initialize default habits if they don't exist
      await habitsApi.initializeDefaultHabits();
      return habitsApi.getTodayHabits();
    },
  });

  // Set daily quote on mount
  useEffect(() => {
    const quote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
    setDailyQuote(quote);
  }, []);

  // Create task mutation
  const createTaskMutation = useMutation({
    mutationFn: (text: string) => tasksApi.createTask({ text }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks-today"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      setNewTask("");
      toast({
        title: "Task added! ✨",
        description: "You've got this!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add task",
        variant: "destructive",
      });
    },
  });

  // Toggle task mutation
  const toggleTaskMutation = useMutation({
    mutationFn: (id: string) => tasksApi.toggleTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks-today"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
  });

  // Delete task mutation
  const deleteTaskMutation = useMutation({
    mutationFn: (id: string) => tasksApi.deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks-today"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      toast({
        title: "Task removed",
        description: "Task deleted successfully",
      });
    },
  });

  // Toggle habit mutation
  const toggleHabitMutation = useMutation({
    mutationFn: (id: string) => habitsApi.toggleHabit(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits-today"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
  });

  const addTask = () => {
    if (!newTask.trim()) return;
    createTaskMutation.mutate(newTask);
  };

  const toggleTask = (id: string) => {
    toggleTaskMutation.mutate(id);
  };

  const deleteTask = (id: string) => {
    deleteTaskMutation.mutate(id);
  };

  const toggleHabit = (id: string) => {
    toggleHabitMutation.mutate(id);
  };

  const habitCompletion = habits.filter((h) => h.completed).length;
  const habitTotal = habits.length;
  const completionPercentage = habitTotal > 0 ? (habitCompletion / habitTotal) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/5 to-accent/5 font-poppins relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }}></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "4s" }}></div>
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-primary fill-primary animate-pulse" />
            <h1 className="font-poppins font-bold text-xl text-foreground bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Gentle Planner 🌼
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/journal")}
              className="rounded-full hover:bg-primary/10 transition-all hover:scale-105"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Journal
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-20 px-4 relative z-10">
        <div className="container mx-auto max-w-4xl">
          {/* Gentle Reminder */}
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-3xl p-6 mb-6 text-center animate-fade-in hover:shadow-xl transition-all duration-300 border border-border/50 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 animate-pulse"></div>
            <div className="relative flex items-center justify-center gap-3">
              <Flame className="w-6 h-6 text-primary animate-pulse" />
              <p className="text-lg text-foreground font-medium">
                {dailyQuote}
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* To-Do List */}
            <div className="bg-card/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-border animate-fade-in hover:shadow-xl transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-2xl"></div>
              <div className="relative">
                <h2 className="font-bold text-2xl text-foreground mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  ✏️ Daily Tasks
                </h2>

                {/* Add Task */}
                <div className="flex gap-2 mb-4">
                  <Input
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="Add a gentle task..."
                    className="rounded-full border-input focus:ring-2 focus:ring-primary transition-all"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") addTask();
                    }}
                    disabled={createTaskMutation.isPending}
                  />
                  <Button
                    onClick={addTask}
                    size="icon"
                    className="rounded-full shrink-0 hover:scale-110 active:scale-95 transition-all shadow-md hover:shadow-lg"
                    disabled={createTaskMutation.isPending}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                {/* Task List */}
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {tasks.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      No tasks yet. Add something gentle 🌸
                    </p>
                  ) : (
                    tasks.map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center gap-3 bg-background/50 rounded-2xl p-3 group hover:bg-background/80 transition-all duration-200 hover:scale-[1.02] border border-border/50"
                      >
                        <button
                          onClick={() => toggleTask(task.id)}
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all hover:scale-110 ${
                            task.completed
                              ? "bg-primary border-primary shadow-md"
                              : "border-muted-foreground hover:border-primary"
                          }`}
                        >
                          {task.completed && (
                            <Check className="w-3 h-3 text-primary-foreground" />
                          )}
                        </button>
                        <span
                          className={`flex-1 transition-all ${
                            task.completed
                              ? "line-through text-muted-foreground opacity-60"
                              : "text-foreground"
                          }`}
                        >
                          {task.text}
                        </span>
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110 active:scale-95"
                        >
                          <X className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Habits Tracker */}
            <div className="bg-card/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-border animate-fade-in hover:shadow-xl transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-secondary/5 rounded-full blur-2xl"></div>
              <div className="relative">
                <h2 className="font-bold text-2xl text-foreground mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  💧 Daily Habits
                </h2>

                {habitsLoading ? (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4">
                      {habits.map((habit) => (
                        <div
                          key={habit.id}
                          className="flex items-center gap-3 bg-background/50 rounded-2xl p-4 hover:bg-background/80 transition-all duration-200 hover:scale-[1.02] border border-border/50"
                        >
                          <Checkbox
                            checked={habit.completed}
                            onCheckedChange={() => toggleHabit(habit.id)}
                            className="w-6 h-6 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                          />
                          <span
                            className={`text-lg transition-all ${
                              habit.completed
                                ? "line-through text-muted-foreground opacity-60"
                                : "text-foreground"
                            }`}
                          >
                            {habit.emoji} {habit.label}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Progress */}
                    <div className="mt-6 p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl border border-border/50">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          Today's Progress
                        </p>
                        <span className="text-sm font-semibold text-foreground">
                          {habitCompletion}/{habitTotal}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-background/50 rounded-full h-3 overflow-hidden border border-border/50">
                          <div
                            className="bg-gradient-to-r from-primary to-secondary h-full transition-all duration-500 rounded-full shadow-sm"
                            style={{
                              width: `${completionPercentage}%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-sm font-semibold text-foreground min-w-[3rem] text-right">
                          {Math.round(completionPercentage)}%
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Navigation */}
          <div className="mt-8 flex justify-center gap-4">
            <Button
              onClick={() => navigate("/dashboard")}
              className="rounded-full bg-secondary hover:bg-secondary/90 text-secondary-foreground hover:scale-105 active:scale-95 transition-all shadow-lg hover:shadow-xl"
            >
              📊 View Dashboard
            </Button>
            <Button
              onClick={() => navigate("/motivation")}
              className="rounded-full hover:scale-105 active:scale-95 transition-all shadow-lg hover:shadow-xl"
            >
              💫 Get Inspired
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-muted-foreground relative z-10">
        Plan gently, grow consistently 🌸
      </footer>
    </div>
  );
};

export default Planner;
