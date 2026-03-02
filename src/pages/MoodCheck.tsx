import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, LogOut, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { moodApi } from "@/lib/api/mood";
import { authApi } from "@/lib/api/auth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import mascotImage from "@/assets/mascot.jpg";

const moods = [
  { emoji: "😊", label: "Happy", color: "from-primary/20 to-primary/10", hoverColor: "hover:from-primary/30 hover:to-primary/20" },
  { emoji: "😐", label: "Neutral", color: "from-muted/40 to-muted/20", hoverColor: "hover:from-muted/50 hover:to-muted/30" },
  { emoji: "😞", label: "Sad", color: "from-secondary/20 to-secondary/10", hoverColor: "hover:from-secondary/30 hover:to-secondary/20" },
  { emoji: "😤", label: "Stressed", color: "from-destructive/20 to-destructive/10", hoverColor: "hover:from-destructive/30 hover:to-destructive/20" },
  { emoji: "😌", label: "Calm", color: "from-accent/20 to-accent/10", hoverColor: "hover:from-accent/30 hover:to-accent/20" },
  { emoji: "💫", label: "Motivated", color: "from-primary/30 to-secondary/20", hoverColor: "hover:from-primary/40 hover:to-secondary/30" },
];

const MoodCheck = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [userName, setUserName] = useState("Friend");
  // selectedMood is now only for UI state — does NOT auto-save
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [moodNote, setMoodNote] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Fetch user profile for display name
  const { data: profile } = useQuery({
    queryKey: ["user-profile"],
    queryFn: () => authApi.getUserProfile(),
  });

  useEffect(() => {
    // Use name if available, fall back to the part before @ in email
    if (profile?.name) {
      setUserName(profile.name);
    } else if (profile?.email) {
      setUserName(profile.email.split("@")[0]);
    }
  }, [profile]);

  // Create mood mutation
  const createMoodMutation = useMutation({
    mutationFn: (mood: { mood: string; note?: string }) =>
      moodApi.createMood({ mood: mood.mood, note: mood.note }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mood-today"] });
      setShowConfirmation(true);
      setTimeout(() => setShowConfirmation(false), 3000);
      toast({
        title: "Mood saved! 💖",
        description: "Thank you for checking in with yourself",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save mood",
        variant: "destructive",
      });
    },
  });

  // Save is now explicit — triggered by button, not card click
  const handleSaveMood = () => {
    if (!selectedMood) return;
    createMoodMutation.mutate({
      mood: selectedMood,
      note: moodNote.trim() || undefined,
    });
  };

  const handleLogout = async () => {
    try {
      await authApi.signOut();
      navigate("/");
      toast({ title: "Logged out", description: "See you soon! 🌸" });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to logout",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5 font-poppins relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 left-20 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1.5s" }}></div>
        <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "3s" }}></div>
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-primary fill-primary animate-pulse" />
            <h1 className="font-poppins font-bold text-xl text-foreground bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Companion Journal 🌸
            </h1>
          </div>
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="font-poppins font-medium hover:bg-muted rounded-full transition-all hover:scale-105"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-32 pb-20 px-4 relative z-10">
        <div className="container mx-auto max-w-4xl">
          {/* Welcome Message */}
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="font-poppins font-bold text-5xl md:text-6xl text-foreground mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Welcome back, {userName} 💕
            </h2>
            <p className="font-poppins text-2xl text-muted-foreground flex items-center justify-center gap-2">
              <Sparkles className="w-6 h-6 text-primary animate-pulse" />
              How are you feeling today?
            </p>
          </div>

          {/* Mascot */}
          <div className="flex justify-center mb-12">
            <div className="relative w-48 h-48">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-full blur-2xl animate-pulse"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-xl"></div>
              <img
                src={mascotImage}
                alt="Your companion"
                className="relative w-full h-full object-cover rounded-full shadow-2xl ring-4 ring-primary/20 animate-float"
              />
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-primary/20 backdrop-blur-sm px-4 py-1 rounded-full border border-primary/30">
                <p className="text-xs text-primary font-semibold">Your companion 💖</p>
              </div>
            </div>
          </div>

          {/* Step 1: Pick a mood (no auto-save) */}
          <p className="text-center text-sm text-muted-foreground mb-4 font-medium tracking-wide uppercase">
            Step 1 — Pick your mood
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            {moods.map((mood) => (
              <Card
                key={mood.label}
                onClick={() => setSelectedMood(mood.emoji)}
                className={`
                  cursor-pointer transition-all duration-300 hover:scale-110 hover:shadow-2xl
                  border-2 rounded-3xl p-6 text-center relative overflow-hidden
                  ${selectedMood === mood.emoji
                    ? `border-primary bg-gradient-to-br ${mood.color} shadow-xl scale-105 ring-4 ring-primary/30`
                    : `border-border hover:border-primary/50 bg-card/80 backdrop-blur-sm ${mood.hoverColor}`
                  }
                `}
              >
                {selectedMood === mood.emoji && (
                  <div className="absolute top-2 right-2">
                    <CheckCircle2 className="w-6 h-6 text-primary fill-primary animate-bounce" />
                  </div>
                )}
                <div className="text-5xl mb-3 animate-bounce" style={{ animationDuration: '2s' }}>
                  {mood.emoji}
                </div>
                <p className="font-poppins font-semibold text-lg text-foreground">
                  {mood.label}
                </p>
              </Card>
            ))}
          </div>

          {/* Step 2: Optional note */}
          <p className="text-center text-sm text-muted-foreground mb-4 font-medium tracking-wide uppercase">
            Step 2 — Add a note (optional)
          </p>
          <Card className="mb-8 rounded-3xl border-border bg-card/50 backdrop-blur-sm p-6 animate-fade-in hover:shadow-xl transition-all duration-300" style={{ animationDelay: '0.4s' }}>
            <label className="font-poppins font-semibold text-lg text-foreground mb-3 block flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Want to write a quick note about your day?
            </label>
            <Textarea
              placeholder="Share your thoughts... ✨"
              value={moodNote}
              onChange={(e) => setMoodNote(e.target.value)}
              className="min-h-[120px] rounded-2xl border-input bg-background/80 focus:ring-2 focus:ring-primary resize-none transition-all"
            />
          </Card>

          {/* Confirmation Message */}
          {showConfirmation && (
            <div className="text-center mb-6 animate-fade-in">
              <div className="inline-flex items-center gap-2 bg-primary/20 backdrop-blur-sm px-6 py-3 rounded-full border border-primary/30">
                <CheckCircle2 className="w-5 h-5 text-primary animate-pulse" />
                <p className="font-poppins text-lg text-primary font-semibold">
                  Mood saved 💖
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Save button */}
          <div className="flex justify-center mb-8 animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <Button
              onClick={handleSaveMood}
              disabled={!selectedMood || createMoodMutation.isPending}
              size="lg"
              className="font-poppins font-semibold text-lg rounded-full px-12 py-6 shadow-xl hover:shadow-2xl transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed bg-gradient-to-r from-primary to-secondary text-primary-foreground"
            >
              {createMoodMutation.isPending ? "Saving... 💫" : "Save my mood ✨"}
            </Button>
          </div>

          {/* Navigation Buttons */}
          <div className="grid md:grid-cols-2 gap-6 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <Button
              onClick={() => navigate("/journal")}
              size="lg"
              className="font-poppins font-semibold text-lg bg-primary hover:bg-primary/90 text-primary-foreground rounded-full py-8 shadow-xl hover:shadow-2xl transition-all hover:scale-105 active:scale-95 bg-gradient-to-r from-primary to-primary/90"
            >
              Go to Journal ✨
            </Button>
            <Button
              onClick={() => navigate("/planner")}
              size="lg"
              variant="secondary"
              className="font-poppins font-semibold text-lg bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-full py-8 shadow-xl hover:shadow-2xl transition-all hover:scale-105 active:scale-95 bg-gradient-to-r from-secondary to-secondary/90"
            >
              Open Planner 📋
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-sm text-muted-foreground font-poppins relative z-10">
        Made with 🌸 by Companion Journal
      </footer>
    </div>
  );
};

export default MoodCheck;
