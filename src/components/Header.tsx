import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

interface HeaderProps {
  onLoginClick: () => void;
  onSignUpClick: () => void;
}

const Header = ({ onLoginClick, onSignUpClick }: HeaderProps) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Heart className="w-6 h-6 text-primary fill-primary" />
          <h1 className="font-poppins font-bold text-xl text-foreground">
            Companion Journal
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            onClick={onLoginClick}
            className="font-poppins font-medium hover:bg-muted rounded-full"
          >
            Login
          </Button>
          <Button
            onClick={onSignUpClick}
            className="font-poppins font-semibold bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-md hover:shadow-lg transition-all"
          >
            Sign Up
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
