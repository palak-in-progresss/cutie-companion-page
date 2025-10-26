import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import mascotImage from "@/assets/mascot.jpg";

const moods = [
  { emoji: "😊", label: "Happy", color: "from-primary/20 to-primary/10" },
  { emoji: "😐", label: "Neutral", color: "from-muted/40 to-muted/20" },
  { emoji: "😞", label: "Sad", color: "from-secondary/20 to-secondary/10" },
  { emoji: "😤", label: "Stressed", color: "from-destructive/20 to-destructive/10" },
  { emoji: "😌", label: "Calm", color: "from-accent/20 to-accent/10" },
  { emoji: "💫", label: "Motivated", color: "from-primary/30 to-secondary/20" },
];

const MoodCheck = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("Friend");
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [moodNote, setMoodNote] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    // Get user name from localStorage or default to "Friend"
    const storedName = localStorage.getItem("userName");
    if (storedName) {
      setUserName(storedName);
    }
  }, []);

  const handleMoodSelect = (moodLabel: string) => {
    setSelectedMood(moodLabel);
    
    // Save mood with timestamp
    const moodData = {
      mood: moodLabel,
      note: moodNote,
      timestamp: new Date().toISOString(),
    };
    
    const existingMoods = JSON.parse(localStorage.getItem("moodHistory") || "[]");
    existingMoods.push(moodData);
    localStorage.setItem("moodHistory", JSON.stringify(existingMoods));
    
    setShowConfirmation(true);
    setTimeout(() => setShowConfirmation(false), 2000);
  };

  const handleLogout = () => {
    // Clear auth data and redirect to home
    localStorage.removeItem("isAuthenticated");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5 font-poppins">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-primary fill-primary" />
            <h1 className="font-poppins font-bold text-xl text-foreground">
              Companion Journal 🌸
            </h1>
          </div>
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="font-poppins font-medium hover:bg-muted rounded-full"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Welcome Message */}
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="font-poppins font-bold text-5xl md:text-6xl text-foreground mb-4">
              Welcome back, {userName} 💕
            </h2>
            <p className="font-poppins text-2xl text-muted-foreground">
              How are you feeling today?
            </p>
          </div>

          {/* Mascot */}
          <div className="flex justify-center mb-12">
            <div className="relative w-48 h-48">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-2xl" />
              <img
                src={mascotImage}
                alt="Your companion"
                className="relative w-full h-full object-cover rounded-full shadow-xl animate-float"
              />
            </div>
          </div>

          {/* Mood Selection */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            {moods.map((mood) => (
              <Card
                key={mood.label}
                onClick={() => handleMoodSelect(mood.label)}
                className={`
                  cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl
                  border-2 rounded-3xl p-6 text-center
                  ${selectedMood === mood.label 
                    ? 'border-primary bg-gradient-to-br ' + mood.color + ' shadow-lg scale-105' 
                    : 'border-border hover:border-primary/50 bg-card'
                  }
                `}
              >
                <div className="text-5xl mb-3 animate-bounce" style={{ animationDuration: '2s' }}>
                  {mood.emoji}
                </div>
                <p className="font-poppins font-semibold text-lg text-foreground">
                  {mood.label}
                </p>
              </Card>
            ))}
          </div>

          {/* Confirmation Message */}
          {showConfirmation && (
            <div className="text-center mb-6 animate-fade-in">
              <p className="font-poppins text-lg text-primary font-semibold">
                Mood saved 💖
              </p>
            </div>
          )}

          {/* Mood Notes Section */}
          <Card className="mb-8 rounded-3xl border-border bg-card/50 backdrop-blur-sm p-6 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <label className="font-poppins font-semibold text-lg text-foreground mb-3 block">
              Want to write a quick note about your day?
            </label>
            <Textarea
              placeholder="Share your thoughts... ✨"
              value={moodNote}
              onChange={(e) => setMoodNote(e.target.value)}
              className="min-h-[120px] rounded-2xl border-input bg-background/80 focus:ring-2 focus:ring-primary resize-none"
            />
          </Card>

          {/* Navigation Buttons */}
          <div className="grid md:grid-cols-2 gap-6 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <Button
              onClick={() => navigate("/journal")}
              size="lg"
              className="font-poppins font-semibold text-lg bg-primary hover:bg-primary/90 text-primary-foreground rounded-full py-8 shadow-xl hover:shadow-2xl transition-all hover:scale-105"
            >
              Go to Journal ✨
            </Button>
            <Button
              onClick={() => navigate("/planner")}
              size="lg"
              variant="secondary"
              className="font-poppins font-semibold text-lg bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-full py-8 shadow-xl hover:shadow-2xl transition-all hover:scale-105"
            >
              Open Planner 📋
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-sm text-muted-foreground font-poppins">
        Made with 🌸 by Companion Journal
      </footer>
    </div>
  );
};

export default MoodCheck;
