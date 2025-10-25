import mascotImage from "@/assets/mascot.jpg";
import { Button } from "@/components/ui/button";

interface HeroProps {
  onGetStartedClick: () => void;
}

const Hero = ({ onGetStartedClick }: HeroProps) => {
  return (
    <section className="pt-32 pb-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 text-center lg:text-left animate-fade-in">
            <h2 className="font-poppins font-bold text-5xl md:text-6xl text-foreground mb-6 leading-tight">
              Your diary talks back{" "}
              <span className="text-primary">🌸</span>
            </h2>
            <p className="font-poppins text-xl text-muted-foreground mb-8 leading-relaxed">
              Journal your thoughts, track your moods, and get thoughtful replies from your AI companion. 
              It's like having a friend who always listens.
            </p>
            <Button
              onClick={onGetStartedClick}
              size="lg"
              className="font-poppins font-semibold text-lg bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 py-6 shadow-xl hover:shadow-2xl transition-all hover:scale-105"
            >
              Get Started Free ✨
            </Button>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-3xl" />
              <img
                src={mascotImage}
                alt="Companion Journal Mascot"
                className="relative w-full max-w-lg animate-float rounded-3xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
