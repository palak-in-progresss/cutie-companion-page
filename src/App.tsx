import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthGuard } from "@/components/AuthGuard";
import Index from "./pages/Index";
import MoodCheck from "./pages/MoodCheck";
import Journal from "./pages/Journal";
import Planner from "./pages/Planner";
import Dashboard from "./pages/Dashboard";
import Motivation from "./pages/Motivation";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          {/* Protected routes */}
          <Route
            path="/mood-check"
            element={
              <AuthGuard>
                <MoodCheck />
              </AuthGuard>
            }
          />
          <Route
            path="/journal"
            element={
              <AuthGuard>
                <Journal />
              </AuthGuard>
            }
          />
          <Route
            path="/planner"
            element={
              <AuthGuard>
                <Planner />
              </AuthGuard>
            }
          />
          <Route
            path="/dashboard"
            element={
              <AuthGuard>
                <Dashboard />
              </AuthGuard>
            }
          />
          <Route
            path="/motivation"
            element={
              <AuthGuard>
                <Motivation />
              </AuthGuard>
            }
          />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
