import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Heart, ArrowLeft, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

interface JournalEntry {
  id: string;
  date: string;
  mood: string;
  entry: string;
  reply: string;
  timestamp: number;
}

const moodColors: Record<string, string> = {
  "😊": "#fbbf24",
  "😐": "#94a3b8",
  "😞": "#60a5fa",
  "😤": "#f87171",
  "😌": "#a78bfa",
  "💫": "#fb923c",
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [streak, setStreak] = useState(0);
  const [habits, setHabits] = useState<any[]>([]);

  useEffect(() => {
    // Load journal entries
    const savedEntries = localStorage.getItem("journalEntries");
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }

    // Load habits
    const savedHabits = localStorage.getItem("plannerHabits");
    if (savedHabits) {
      setHabits(JSON.parse(savedHabits));
    }

    // Calculate streak
    calculateStreak(savedEntries ? JSON.parse(savedEntries) : []);
  }, []);

  const calculateStreak = (allEntries: JournalEntry[]) => {
    if (allEntries.length === 0) {
      setStreak(0);
      return;
    }

    const sortedEntries = [...allEntries].sort((a, b) => b.timestamp - a.timestamp);
    const uniqueDays = new Set(
      sortedEntries.map(entry => new Date(entry.timestamp).toDateString())
    );

    let currentStreak = 0;
    let currentDate = new Date();

    for (let i = 0; i < 30; i++) {
      const dateStr = currentDate.toDateString();
      if (uniqueDays.has(dateStr)) {
        currentStreak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else if (i === 0) {
        // If today doesn't have an entry, check yesterday
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    setStreak(currentStreak);
  };

  // Mood frequency data
  const getMoodData = () => {
    const moodCount: Record<string, number> = {};
    entries.forEach(entry => {
      moodCount[entry.mood] = (moodCount[entry.mood] || 0) + 1;
    });

    return Object.entries(moodCount).map(([mood, count]) => ({
      name: mood,
      value: count,
      color: moodColors[mood] || "#94a3b8",
    }));
  };

  // Weekly activity data
  const getWeeklyData = () => {
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toDateString();
      
      const count = entries.filter(
        entry => new Date(entry.timestamp).toDateString() === dateStr
      ).length;

      last7Days.push({
        name: date.toLocaleDateString("en-US", { weekday: "short" }),
        entries: count,
      });
    }
    return last7Days;
  };

  const moodData = getMoodData();
  const weeklyData = getWeeklyData();
  const habitCompletion = habits.filter(h => h.completed).length;
  const habitTotal = habits.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5 font-poppins">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-primary fill-primary" />
            <h1 className="font-poppins font-bold text-xl text-foreground">
              Your Journey 🌸
            </h1>
          </div>
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
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* Streak Card */}
            <div className="bg-gradient-to-br from-primary/20 to-primary/10 rounded-3xl p-6 shadow-lg border border-border animate-fade-in">
              <div className="flex items-center justify-between mb-4">
                <span className="text-4xl">🔥</span>
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-3xl font-bold text-foreground mb-1">{streak} Days</h3>
              <p className="text-sm text-muted-foreground">Journal Streak</p>
            </div>

            {/* Total Entries Card */}
            <div className="bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-3xl p-6 shadow-lg border border-border animate-fade-in">
              <div className="flex items-center justify-between mb-4">
                <span className="text-4xl">📖</span>
              </div>
              <h3 className="text-3xl font-bold text-foreground mb-1">{entries.length}</h3>
              <p className="text-sm text-muted-foreground">Total Entries</p>
            </div>

            {/* Habits Card */}
            <div className="bg-gradient-to-br from-accent/20 to-accent/10 rounded-3xl p-6 shadow-lg border border-border animate-fade-in">
              <div className="flex items-center justify-between mb-4">
                <span className="text-4xl">💫</span>
              </div>
              <h3 className="text-3xl font-bold text-foreground mb-1">
                {habitTotal > 0 ? `${habitCompletion}/${habitTotal}` : "0"}
              </h3>
              <p className="text-sm text-muted-foreground">Habits Today</p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Weekly Activity */}
            <div className="bg-card/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-border animate-fade-in">
              <h2 className="font-bold text-xl text-foreground mb-6">
                📊 Weekly Activity
              </h2>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "12px",
                    }}
                  />
                  <Bar dataKey="entries" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Mood Distribution */}
            <div className="bg-card/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-border animate-fade-in">
              <h2 className="font-bold text-xl text-foreground mb-6">
                🌈 Mood Distribution
              </h2>
              {moodData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={moodData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry: any) =>
                        `${entry.name} ${(entry.percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {moodData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                  <p>Start journaling to see your mood patterns 💕</p>
                </div>
              )}
            </div>
          </div>

          {/* Affirmation */}
          <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-3xl p-8 text-center animate-fade-in">
            <p className="text-xl font-medium text-foreground mb-2">
              You're becoming more consistent 💖
            </p>
            <p className="text-muted-foreground">
              Every entry is a step toward understanding yourself better
            </p>
          </div>

          {/* Navigation */}
          <div className="mt-8 flex justify-center gap-4">
            <Button
              onClick={() => navigate("/planner")}
              className="rounded-full"
            >
              📋 Planner
            </Button>
            <Button
              onClick={() => navigate("/motivation")}
              variant="secondary"
              className="rounded-full"
            >
              💫 Get Inspired
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-muted-foreground">
        Growing with you, one day at a time 🌸
      </footer>
    </div>
  );
};

export default Dashboard;
