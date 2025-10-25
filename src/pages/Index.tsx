import { useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import AuthDialog from "@/components/AuthDialog";

const Index = () => {
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");

  const handleLoginClick = () => {
    setAuthMode("login");
    setAuthDialogOpen(true);
  };

  const handleSignUpClick = () => {
    setAuthMode("signup");
    setAuthDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background font-poppins">
      <Header onLoginClick={handleLoginClick} onSignUpClick={handleSignUpClick} />
      <main>
        <Hero onGetStartedClick={handleSignUpClick} />
        <Features />
      </main>
      <Footer />
      <AuthDialog
        open={authDialogOpen}
        onOpenChange={setAuthDialogOpen}
        mode={authMode}
      />
    </div>
  );
};

export default Index;
