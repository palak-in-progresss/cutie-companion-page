import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Heart, ArrowLeft, RefreshCw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const affirmations = [
  {
    text: "You don't have to be perfect to be loved.",
    emoji: "💖",
  },
  {
    text: "You're doing better than you think.",
    emoji: "🌟",
  },
  {
    text: "Small steps still move you forward.",
    emoji: "🦋",
  },
  {
    text: "You deserve rest and peace.",
    emoji: "🌙",
  },
  {
    text: "Your feelings are valid and important.",
    emoji: "💕",
  },
  {
    text: "It's okay to take things slowly.",
    emoji: "🌸",
  },
  {
    text: "You are enough, just as you are.",
    emoji: "✨",
  },
  {
    text: "Progress, not perfection.",
    emoji: "🌱",
  },
  {
    text: "You're stronger than you realize.",
    emoji: "💪",
  },
  {
    text: "Be gentle with yourself today.",
    emoji: "🌷",
  },
  {
    text: "You're allowed to rest without guilt.",
    emoji: "☁️",
  },
  {
    text: "Your journey is uniquely yours.",
    emoji: "🦄",
  },
  {
    text: "Healing isn't linear, and that's okay.",
    emoji: "🌈",
  },
  {
    text: "You're worthy of kindness, especially from yourself.",
    emoji: "💝",
  },
  {
    text: "Tomorrow is a fresh start.",
    emoji: "🌅",
  },
];

const Motivation = () => {
  const navigate = useNavigate();
  const [currentAffirmation, setCurrentAffirmation] = useState(affirmations[0]);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Get daily affirmation based on date
    const today = new Date().toDateString();
    const savedDate = localStorage.getItem("motivationDate");
    const savedIndex = localStorage.getItem("motivationIndex");

    if (savedDate === today && savedIndex) {
      setCurrentAffirmation(affirmations[parseInt(savedIndex)]);
    } else {
      const randomIndex = Math.floor(Math.random() * affirmations.length);
      setCurrentAffirmation(affirmations[randomIndex]);
      localStorage.setItem("motivationDate", today);
      localStorage.setItem("motivationIndex", randomIndex.toString());
    }
  }, []);

  const getNewQuote = () => {
    setIsAnimating(true);
    
    setTimeout(() => {
      let newIndex;
      do {
        newIndex = Math.floor(Math.random() * affirmations.length);
      } while (affirmations[newIndex].text === currentAffirmation.text);
      
      setCurrentAffirmation(affirmations[newIndex]);
      setIsAnimating(false);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5 font-poppins flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-primary fill-primary" />
            <h1 className="font-poppins font-bold text-xl text-foreground">
              Daily Inspiration 💫
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
      <main className="flex-1 flex items-center justify-center px-4 pt-20 pb-8">
        <div className="container mx-auto max-w-3xl">
          <div
            className={`bg-card/80 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-border text-center transition-all duration-300 ${
              isAnimating ? "scale-95 opacity-50" : "scale-100 opacity-100"
            }`}
          >
            {/* Emoji */}
            <div className="text-8xl mb-8 animate-float">
              {currentAffirmation.emoji}
            </div>

            {/* Affirmation Text */}
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-relaxed">
                {currentAffirmation.text}
              </h2>
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Sparkles className="w-4 h-4" />
                <p className="text-sm">Today's Affirmation</p>
                <Sparkles className="w-4 h-4" />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                onClick={getNewQuote}
                className="rounded-full gap-2"
                size="lg"
              >
                <RefreshCw className="w-4 h-4" />
                New Quote
              </Button>
              <Button
                onClick={() => navigate("/journal")}
                variant="secondary"
                className="rounded-full"
                size="lg"
              >
                💌 Back to Journal
              </Button>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="mt-12 text-center space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
              <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-4 border border-border">
                <p className="text-2xl mb-1">🌱</p>
                <p className="text-xs text-muted-foreground">Keep Growing</p>
              </div>
              <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-4 border border-border">
                <p className="text-2xl mb-1">💖</p>
                <p className="text-xs text-muted-foreground">Stay Kind</p>
              </div>
              <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-4 border border-border">
                <p className="text-2xl mb-1">✨</p>
                <p className="text-xs text-muted-foreground">Believe</p>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button
                variant="ghost"
                onClick={() => navigate("/planner")}
                className="rounded-full text-muted-foreground"
              >
                📋 Planner
              </Button>
              <span className="text-muted-foreground">•</span>
              <Button
                variant="ghost"
                onClick={() => navigate("/dashboard")}
                className="rounded-full text-muted-foreground"
              >
                📊 Dashboard
              </Button>
              <span className="text-muted-foreground">•</span>
              <Button
                variant="ghost"
                onClick={() => navigate("/about")}
                className="rounded-full text-muted-foreground"
              >
                🪞 About
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-muted-foreground">
        You're doing amazing 🌸
      </footer>
    </div>
  );
};

export default Motivation;
