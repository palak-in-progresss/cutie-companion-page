import { MessageCircle, Smile, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const Features = () => {
  const features = [
    {
      icon: MessageCircle,
      title: "Journal with Replies",
      description: "Write your thoughts and get thoughtful, supportive responses from your AI companion.",
      color: "text-primary",
    },
    {
      icon: Smile,
      title: "Mood Tracker",
      description: "Track your emotions over time and discover patterns in your mental wellness journey.",
      color: "text-secondary",
    },
    {
      icon: Calendar,
      title: "Planner Integration",
      description: "Organize your days, set goals, and reflect on your progress with built-in planning tools.",
      color: "text-accent",
    },
  ];

  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <h3 className="font-poppins font-bold text-4xl text-center text-foreground mb-4">
          Everything you need to journal mindfully
        </h3>
        <p className="font-poppins text-lg text-center text-muted-foreground mb-16">
          Features designed to make journaling a delightful daily habit
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border-border bg-card hover:shadow-xl transition-all duration-300 hover:-translate-y-2 rounded-3xl overflow-hidden animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-8 text-center">
                <div className="mb-6 flex justify-center">
                  <div className="p-4 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl">
                    <feature.icon className={`w-10 h-10 ${feature.color}`} />
                  </div>
                </div>
                <h4 className="font-poppins font-semibold text-xl text-foreground mb-3">
                  {feature.title}
                </h4>
                <p className="font-poppins text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
