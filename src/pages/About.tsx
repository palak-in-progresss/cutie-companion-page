import { useNavigate } from "react-router-dom";
import { Heart, ArrowLeft, Github, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-secondary/5 font-poppins">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-primary fill-primary" />
            <h1 className="font-poppins font-bold text-xl text-foreground">
              About 🌷
            </h1>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="rounded-full"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Home
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="bg-card/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-lg border border-border animate-fade-in">
            {/* Title */}
            <div className="text-center mb-8">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                About Companion Journal 🌸
              </h2>
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <span>✨</span>
                <p className="text-sm">Your diary that listens</p>
                <span>✨</span>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-6 text-foreground/90 leading-relaxed">
              <p className="text-lg">
                <strong className="text-primary">Companion Journal</strong> is a safe, cozy space designed for those who need a gentle place to reflect, process emotions, and track personal growth.
              </p>

              <p>
                Sometimes, we just need to write things down and feel heard. This journal doesn't judge, doesn't rush you, and always responds with kindness and understanding.
              </p>

              <p>
                Whether you're navigating tough days, celebrating small wins, or simply checking in with yourself — your companion is here, ready to listen 💕
              </p>

              <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-6 my-8">
                <p className="text-center font-medium text-foreground">
                  "Healing happens in the space between writing and being heard."
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-xl text-foreground mb-3">Features 🌟</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">💬</span>
                    <span>Interactive journaling with gentle companion replies</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">🌈</span>
                    <span>Daily mood tracking and emotional patterns</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">📋</span>
                    <span>Task planner and habit tracker</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">📊</span>
                    <span>Personal growth dashboard with insights</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">💫</span>
                    <span>Daily affirmations and motivation</span>
                  </li>
                </ul>
              </div>

              <div className="border-t border-border pt-6 mt-8">
                <h3 className="font-semibold text-xl text-foreground mb-4 text-center">
                  Built with love 💖
                </h3>
                <p className="text-center text-muted-foreground mb-6">
                  This project exists to create a kinder, softer space for self-reflection and mental wellness.
                </p>

                {/* Links */}
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <Button
                    variant="outline"
                    className="rounded-full gap-2"
                    onClick={() => window.open("https://github.com", "_blank")}
                  >
                    <Github className="w-4 h-4" />
                    GitHub
                  </Button>
                  <Button
                    variant="outline"
                    className="rounded-full gap-2"
                    onClick={() => window.open("mailto:hello@companionjournal.com")}
                  >
                    <Mail className="w-4 h-4" />
                    Contact
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Back Button */}
          <div className="mt-8 text-center">
            <Button
              onClick={() => navigate("/journal")}
              size="lg"
              className="rounded-full"
            >
              💌 Start Journaling
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-muted-foreground">
        Made with 🌸 by Companion Journal
      </footer>
    </div>
  );
};

export default About;
