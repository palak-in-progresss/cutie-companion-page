import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Heart, ArrowLeft, Plus, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

interface Task {
  id: string;
  text: string;
  completed: boolean;
}

interface Habit {
  id: string;
  label: string;
  completed: boolean;
}

const motivationalQuotes = [
  "You're doing better than you think 🌸",
  "Small steps still move you forward 💫",
  "Be gentle with yourself today 🌷",
  "You deserve rest and peace 💕",
  "Progress, not perfection 🌼",
];

const Planner = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [habits, setHabits] = useState<Habit[]>([
    { id: "meditate", label: "🧘 Meditate", completed: false },
    { id: "hydrate", label: "💧 Drink Water", completed: false },
    { id: "journal", label: "✍️ Write", completed: false },
    { id: "rest", label: "😴 Rest Well", completed: false },
    { id: "move", label: "🚶 Move Body", completed: false },
  ]);
  const [dailyQuote, setDailyQuote] = useState("");

  useEffect(() => {
    // Load tasks
    const savedTasks = localStorage.getItem("plannerTasks");
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }

    // Load habits
    const savedHabits = localStorage.getItem("plannerHabits");
    if (savedHabits) {
      setHabits(JSON.parse(savedHabits));
    }

    // Set daily quote
    const quote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
    setDailyQuote(quote);
  }, []);

  const saveTasks = (updatedTasks: Task[]) => {
    setTasks(updatedTasks);
    localStorage.setItem("plannerTasks", JSON.stringify(updatedTasks));
  };

  const saveHabits = (updatedHabits: Habit[]) => {
    setHabits(updatedHabits);
    localStorage.setItem("plannerHabits", JSON.stringify(updatedHabits));
  };

  const addTask = () => {
    if (!newTask.trim()) return;

    const task: Task = {
      id: Date.now().toString(),
      text: newTask,
      completed: false,
    };

    saveTasks([...tasks, task]);
    setNewTask("");
  };

  const toggleTask = (id: string) => {
    const updated = tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    saveTasks(updated);
  };

  const deleteTask = (id: string) => {
    saveTasks(tasks.filter(task => task.id !== id));
  };

  const toggleHabit = (id: string) => {
    const updated = habits.map(habit =>
      habit.id === id ? { ...habit, completed: !habit.completed } : habit
    );
    saveHabits(updated);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/5 to-accent/5 font-poppins">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-primary fill-primary" />
            <h1 className="font-poppins font-bold text-xl text-foreground">
              Gentle Planner 🌼
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/journal")}
              className="rounded-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Journal
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-20 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Gentle Reminder */}
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-3xl p-6 mb-6 text-center animate-fade-in">
            <p className="text-lg text-foreground font-medium">
              🕯️ {dailyQuote}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* To-Do List */}
            <div className="bg-card/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-border animate-fade-in">
              <h2 className="font-bold text-2xl text-foreground mb-4 flex items-center gap-2">
                ✏️ Daily Tasks
              </h2>

              {/* Add Task */}
              <div className="flex gap-2 mb-4">
                <Input
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  placeholder="Add a gentle task..."
                  className="rounded-full"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") addTask();
                  }}
                />
                <Button
                  onClick={addTask}
                  size="icon"
                  className="rounded-full shrink-0"
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
                      className="flex items-center gap-3 bg-background/50 rounded-2xl p-3 group hover:bg-background/80 transition-colors"
                    >
                      <button
                        onClick={() => toggleTask(task.id)}
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                          task.completed
                            ? "bg-primary border-primary"
                            : "border-muted-foreground"
                        }`}
                      >
                        {task.completed && (
                          <Check className="w-3 h-3 text-primary-foreground" />
                        )}
                      </button>
                      <span
                        className={`flex-1 ${
                          task.completed
                            ? "line-through text-muted-foreground"
                            : "text-foreground"
                        }`}
                      >
                        {task.text}
                      </span>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Habits Tracker */}
            <div className="bg-card/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-border animate-fade-in">
              <h2 className="font-bold text-2xl text-foreground mb-4 flex items-center gap-2">
                💧 Daily Habits
              </h2>

              <div className="space-y-4">
                {habits.map((habit) => (
                  <div
                    key={habit.id}
                    className="flex items-center gap-3 bg-background/50 rounded-2xl p-4 hover:bg-background/80 transition-colors"
                  >
                    <Checkbox
                      checked={habit.completed}
                      onCheckedChange={() => toggleHabit(habit.id)}
                      className="w-6 h-6"
                    />
                    <span
                      className={`text-lg ${
                        habit.completed
                          ? "line-through text-muted-foreground"
                          : "text-foreground"
                      }`}
                    >
                      {habit.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Progress */}
              <div className="mt-6 p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl">
                <p className="text-sm text-muted-foreground mb-2">
                  Today's Progress
                </p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-background/50 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-primary to-secondary h-full transition-all duration-500 rounded-full"
                      style={{
                        width: `${
                          (habits.filter((h) => h.completed).length /
                            habits.length) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-foreground">
                    {habits.filter((h) => h.completed).length}/{habits.length}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Navigation */}
          <div className="mt-8 flex justify-center gap-4">
            <Button
              onClick={() => navigate("/dashboard")}
              className="rounded-full bg-secondary hover:bg-secondary/90 text-secondary-foreground"
            >
              📊 View Dashboard
            </Button>
            <Button
              onClick={() => navigate("/motivation")}
              className="rounded-full"
            >
              💫 Get Inspired
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-muted-foreground">
        Plan gently, grow consistently 🌸
      </footer>
    </div>
  );
};

export default Planner;
