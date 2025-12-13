import { useNavigate } from "react-router-dom";
import { Heart, ArrowLeft, TrendingUp, Sparkles, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "@/lib/api/dashboard";
import { journalApi } from "@/lib/api/journal";

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

  // Fetch dashboard stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: () => dashboardApi.getStats(),
  });

  // Fetch weekly activity
  const { data: weeklyData = [] } = useQuery({
    queryKey: ["dashboard-weekly"],
    queryFn: () => dashboardApi.getWeeklyActivity(),
  });

  // Fetch mood distribution
  const { data: moodData = [] } = useQuery({
    queryKey: ["dashboard-moods"],
    queryFn: () => dashboardApi.getMoodDistribution(),
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5 font-poppins relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }}></div>
        <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "4s" }}></div>
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-primary fill-primary animate-pulse" />
            <h1 className="font-poppins font-bold text-xl text-foreground bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Your Journey 🌸
            </h1>
          </div>
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
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-20 px-4 relative z-10">
        <div className="container mx-auto max-w-6xl">
          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* Streak Card */}
            <div className="bg-gradient-to-br from-primary/20 to-primary/10 rounded-3xl p-6 shadow-lg border border-border animate-fade-in hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <Flame className="w-8 h-8 text-primary animate-pulse" />
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-4xl font-bold text-foreground mb-1 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  {statsLoading ? "..." : stats?.streak || 0} Days
                </h3>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Journal Streak
                </p>
              </div>
            </div>

            {/* Total Entries Card */}
            <div className="bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-3xl p-6 shadow-lg border border-border animate-fade-in hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full blur-2xl"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-4xl">📖</span>
                </div>
                <h3 className="text-4xl font-bold text-foreground mb-1 bg-gradient-to-r from-secondary to-secondary/60 bg-clip-text text-transparent">
                  {statsLoading ? "..." : stats?.totalEntries || 0}
                </h3>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Total Entries
                </p>
              </div>
            </div>

            {/* Habits Card */}
            <div className="bg-gradient-to-br from-accent/20 to-accent/10 rounded-3xl p-6 shadow-lg border border-border animate-fade-in hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-2xl"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-4xl">💫</span>
                </div>
                <h3 className="text-4xl font-bold text-foreground mb-1 bg-gradient-to-r from-accent to-accent/60 bg-clip-text text-transparent">
                  {statsLoading ? "..." : stats?.habitsTotal > 0 ? `${stats?.habitsCompleted || 0}/${stats?.habitsTotal || 0}` : "0"}
                </h3>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Habits Today
                </p>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Weekly Activity */}
            <div className="bg-card/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-border animate-fade-in hover:shadow-xl transition-all duration-300">
              <h2 className="font-bold text-xl text-foreground mb-6 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                📊 Weekly Activity
              </h2>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis 
                    dataKey="name" 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={12}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "12px",
                      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Bar 
                    dataKey="entries" 
                    fill="hsl(var(--primary))" 
                    radius={[8, 8, 0, 0]}
                    className="hover:opacity-80 transition-opacity"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Mood Distribution */}
            <div className="bg-card/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-border animate-fade-in hover:shadow-xl transition-all duration-300">
              <h2 className="font-bold text-xl text-foreground mb-6 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
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
                        `${entry.name} ${((entry.value / moodData.reduce((sum, d) => sum + d.value, 0)) * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      className="hover:opacity-80 transition-opacity"
                    >
                      {moodData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "12px",
                        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <Sparkles className="w-12 h-12 mx-auto mb-2 opacity-50 animate-pulse" />
                    <p>Start journaling to see your mood patterns 💕</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Affirmation */}
          <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-3xl p-8 text-center animate-fade-in hover:shadow-xl transition-all duration-300 border border-border/50 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 animate-pulse"></div>
            <div className="relative">
              <Sparkles className="w-8 h-8 mx-auto mb-4 text-primary animate-pulse" />
              <p className="text-xl font-medium text-foreground mb-2">
                You're becoming more consistent 💖
              </p>
              <p className="text-muted-foreground">
                Every entry is a step toward understanding yourself better
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-8 flex justify-center gap-4">
            <Button
              onClick={() => navigate("/planner")}
              className="rounded-full hover:scale-105 active:scale-95 transition-all shadow-lg hover:shadow-xl"
            >
              📋 Planner
            </Button>
            <Button
              onClick={() => navigate("/motivation")}
              variant="secondary"
              className="rounded-full hover:scale-105 active:scale-95 transition-all shadow-lg hover:shadow-xl"
            >
              💫 Get Inspired
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-muted-foreground relative z-10">
        Growing with you, one day at a time 🌸
      </footer>
    </div>
  );
};

export default Dashboard;
