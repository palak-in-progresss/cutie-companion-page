import { useNavigate } from "react-router-dom";
import { Heart, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const Planner = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/5 to-accent/5 font-poppins">
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
            onClick={() => navigate("/mood-check")}
            className="font-poppins font-medium hover:bg-muted rounded-full"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="animate-fade-in">
            <h2 className="font-poppins font-bold text-5xl md:text-6xl text-foreground mb-6">
              Your Planner 📋
            </h2>
            <p className="font-poppins text-xl text-muted-foreground mb-8">
              This is where your daily plans and goals will be organized.
            </p>
            <div className="text-8xl mb-8 animate-float">📅</div>
            <p className="font-poppins text-muted-foreground">
              Planner page coming soon with goal tracking and organization tools!
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Planner;
