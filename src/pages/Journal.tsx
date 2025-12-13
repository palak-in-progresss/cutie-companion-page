import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Heart, Calendar, Edit2, Send, BookOpen, LogOut, BarChart3, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { journalApi, type JournalEntry as ApiJournalEntry } from "@/lib/api/journal";
import { moodApi } from "@/lib/api/mood";
import { authApi } from "@/lib/api/auth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import mascotImage from "@/assets/mascot.jpg";

const moodEmojiMap: Record<string, { emoji: string; label: string }> = {
  "😊": { emoji: "😊", label: "Happy" },
  "😐": { emoji: "😐", label: "Neutral" },
  "😞": { emoji: "😞", label: "Sad" },
  "😤": { emoji: "😤", label: "Stressed" },
  "😌": { emoji: "😌", label: "Calm" },
  "💫": { emoji: "💫", label: "Motivated" },
};

const Journal = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [currentEntry, setCurrentEntry] = useState("");
  const [todayMood, setTodayMood] = useState({ emoji: "😊", label: "Happy" });
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Fetch today's entries
  const { data: todaysEntries = [], isLoading: entriesLoading } = useQuery({
    queryKey: ["journal-entries-today"],
    queryFn: () => journalApi.getTodayEntries(),
  });

  // Fetch all entries for history
  const { data: allEntries = [] } = useQuery({
    queryKey: ["journal-entries-all"],
    queryFn: () => journalApi.getAllEntries(),
  });

  // Fetch today's mood
  const { data: todayMoodData } = useQuery({
    queryKey: ["mood-today"],
    queryFn: () => moodApi.getTodayMood(),
  });

  // Update today's mood display
  useEffect(() => {
    if (todayMoodData?.mood) {
      const moodInfo = moodEmojiMap[todayMoodData.mood];
      if (moodInfo) {
        setTodayMood(moodInfo);
      }
    }
  }, [todayMoodData]);

  // Create entry mutation
  const createEntryMutation = useMutation({
    mutationFn: (entryText: string) =>
      journalApi.createEntry({
        entry_text: entryText,
        mood: todayMood.emoji,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journal-entries-today"] });
      queryClient.invalidateQueries({ queryKey: ["journal-entries-all"] });
      setCurrentEntry("");
      setIsTyping(false);
      toast({
        title: "Entry saved! 💕",
        description: "Your companion has replied!",
      });
    },
    onError: (error: any) => {
      setIsTyping(false);
      toast({
        title: "Error",
        description: error.message || "Failed to save entry",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    // Auto-scroll to bottom when new entry is added
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [todaysEntries, isTyping]);

  const handleSubmit = async () => {
    if (!currentEntry.trim()) return;

    setIsTyping(true);
    createEntryMutation.mutate(currentEntry);
  };

  const handleLogout = async () => {
    try {
      await authApi.signOut();
      navigate("/");
      toast({
        title: "Logged out",
        description: "See you soon! 🌸",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to logout",
        variant: "destructive",
      });
    }
  };

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5 font-poppins relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }}></div>
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-primary fill-primary animate-pulse" />
            <h1 className="font-poppins font-bold text-xl text-foreground bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Daily Journal
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/dashboard")}
              className="rounded-full hover:bg-primary/10 transition-all hover:scale-110"
              title="Dashboard"
            >
              <BarChart3 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/planner")}
              className="rounded-full hover:bg-primary/10 transition-all hover:scale-110"
              title="Planner"
            >
              📋
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="rounded-full hover:bg-destructive/10 transition-all hover:scale-110"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-8 px-4 relative z-10">
        <div className="container mx-auto max-w-5xl">
          {/* Mood Summary Bar */}
          <div className="bg-card/80 backdrop-blur-sm rounded-3xl p-6 mb-6 shadow-lg border border-border animate-fade-in hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-card via-card/95 to-card">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <span className="text-4xl animate-bounce" style={{ animationDuration: "2s" }}>
                  {todayMood.emoji}
                </span>
                <div>
                  <p className="font-semibold text-foreground text-lg">
                    You felt {todayMood.label} today
                  </p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Let's talk about it 💬
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/mood-check")}
                  className="rounded-full hover:bg-primary/10 transition-all hover:scale-105"
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Change Mood
                </Button>
                <div className="flex items-center gap-2 text-muted-foreground bg-background/50 px-3 py-1.5 rounded-full">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">{currentDate}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-[1fr,200px] gap-6">
            {/* Journal Area */}
            <div className="space-y-6">
              {/* Conversation Area */}
              <div
                ref={scrollRef}
                className="bg-card/50 backdrop-blur-sm rounded-3xl p-6 min-h-[400px] max-h-[500px] overflow-y-auto border border-border shadow-lg relative"
              >
                {entriesLoading ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
                    <p>Loading your journal...</p>
                  </div>
                ) : todaysEntries.length === 0 && !isTyping ? (
                  <div className="text-center py-12 text-muted-foreground animate-fade-in">
                    <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50 animate-float" />
                    <p className="text-lg">Start writing to your companion...</p>
                    <p className="text-sm mt-2">Share your thoughts and feelings 💕</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {todaysEntries.map((entry) => (
                      <div key={entry.id} className="space-y-4 animate-fade-in">
                        {/* User Entry */}
                        <div className="flex justify-end">
                          <div className="bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl rounded-tr-sm p-4 max-w-[80%] shadow-md hover:shadow-lg transition-all">
                            <p className="text-foreground whitespace-pre-wrap">{entry.entry_text}</p>
                            {entry.mood && (
                              <span className="text-xs text-muted-foreground mt-2 block">
                                {entry.mood}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Companion Reply */}
                        {entry.companion_reply && (
                          <div className="flex justify-start gap-3">
                            <div className="relative">
                              <img
                                src={mascotImage}
                                alt="Companion"
                                className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/20 animate-float"
                              />
                              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background animate-pulse"></div>
                            </div>
                            <div className="bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-2xl rounded-tl-sm p-4 max-w-[80%] shadow-md hover:shadow-lg transition-all">
                              <p className="text-foreground">{entry.companion_reply}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}

                    {/* Typing Indicator */}
                    {isTyping && (
                      <div className="flex justify-start gap-3 animate-fade-in">
                        <img
                          src={mascotImage}
                          alt="Companion"
                          className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/20"
                        />
                        <div className="bg-secondary/20 rounded-2xl rounded-tl-sm p-4">
                          <div className="flex gap-1">
                            <span
                              className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                              style={{ animationDelay: "0s" }}
                            ></span>
                            <span
                              className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            ></span>
                            <span
                              className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                              style={{ animationDelay: "0.4s" }}
                            ></span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="bg-card/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-border hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-card via-card/95 to-card">
                <Textarea
                  value={currentEntry}
                  onChange={(e) => setCurrentEntry(e.target.value)}
                  placeholder="Dear Companion, today I feel..."
                  className="min-h-[120px] resize-none border-0 bg-transparent focus-visible:ring-0 text-base placeholder:text-muted-foreground/60"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                      handleSubmit();
                    }
                  }}
                  disabled={isTyping}
                />
                <div className="flex items-center justify-between mt-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" className="rounded-full hover:bg-primary/10 transition-all">
                        <BookOpen className="w-4 h-4 mr-2" />
                        View Past Entries
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh]">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <BookOpen className="w-5 h-5" />
                          Your Journal History 📖
                        </DialogTitle>
                      </DialogHeader>
                      <ScrollArea className="h-[60vh] pr-4">
                        <div className="space-y-6">
                          {allEntries.length === 0 ? (
                            <p className="text-center text-muted-foreground py-8">
                              No entries yet. Start journaling! 🌸
                            </p>
                          ) : (
                            [...allEntries].reverse().map((entry) => (
                              <div
                                key={entry.id}
                                className="border-b border-border pb-6 last:border-0 hover:bg-muted/30 p-4 rounded-lg transition-colors"
                              >
                                <div className="flex items-center gap-2 mb-2">
                                  {entry.mood && <span className="text-2xl">{entry.mood}</span>}
                                  <span className="text-sm text-muted-foreground">
                                    {new Date(entry.date).toLocaleDateString("en-US", {
                                      weekday: "long",
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                    })}
                                  </span>
                                </div>
                                <p className="text-foreground mb-3 whitespace-pre-wrap">
                                  {entry.entry_text}
                                </p>
                                {entry.companion_reply && (
                                  <div className="bg-secondary/20 rounded-lg p-3 mt-2 border-l-4 border-primary">
                                    <p className="text-sm text-muted-foreground">
                                      💬 {entry.companion_reply}
                                    </p>
                                  </div>
                                )}
                              </div>
                            ))
                          )}
                        </div>
                      </ScrollArea>
                    </DialogContent>
                  </Dialog>

                  <Button
                    onClick={handleSubmit}
                    disabled={!currentEntry.trim() || isTyping}
                    className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {isTyping ? "Sending..." : "Send to Companion ✨"}
                  </Button>
                </div>
              </div>
            </div>

            {/* Mascot Sidebar */}
            <div className="hidden md:block">
              <div className="sticky top-28 animate-float">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl blur-xl"></div>
                  <img
                    src={mascotImage}
                    alt="Your Companion"
                    className="relative w-full rounded-3xl shadow-2xl object-cover ring-4 ring-primary/20"
                  />
                </div>
                <p className="text-center text-sm text-muted-foreground mt-4 flex items-center justify-center gap-1">
                  <Sparkles className="w-4 h-4 text-primary" />
                  Your companion is here 💕
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-muted-foreground relative z-10">
        Companion Journal — your diary that listens 🌸
      </footer>
    </div>
  );
};

export default Journal;
