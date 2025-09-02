import { Brain, Users, GraduationCap, BarChart3 } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: Brain,
      title: "AI Matching",
      description: "Personalized study partner pairing based on your learning style, subjects, and goals."
    },
    {
      icon: Users,
      title: "Virtual Rooms",
      description: "Distraction-free Pomodoro sync with ambient soundscapes and productivity tools."
    },
    {
      icon: GraduationCap,
      title: "Live Tutoring",
      description: "Instant expert help from qualified tutors whenever you need guidance."
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Track progress & performance with detailed insights and study analytics."
    }
  ];

  return (
    <section id="features" className="section-spacing bg-gradient-subtle">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Everything You Need to
            <span className="block text-primary">Excel Together</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our AI-powered platform brings students together with the perfect blend of technology and human connection.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="feature-card group">
              <div className="bg-gradient-hero p-4 rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;