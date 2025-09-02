import { useState } from 'react';
import { ChevronLeft, ChevronRight, Clock, Volume2, PenTool } from 'lucide-react';
import { Button } from '@/components/ui/button';

const StudyZoneShowcase = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const screenshots = [
    {
      title: "Focused Study Environment",
      description: "Clean, distraction-free interface designed for deep focus",
      features: ["Real-time sync", "Ambient sounds", "Focus mode"]
    },
    {
      title: "Collaborative Whiteboard",
      description: "Interactive whiteboard for visual learning and problem solving",
      features: ["Multi-user editing", "Drawing tools", "Save & share"]
    },
    {
      title: "Pomodoro Timer Integration",
      description: "Built-in productivity timers synchronized across all participants",
      features: ["25-min focus blocks", "Break reminders", "Progress tracking"]
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % screenshots.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + screenshots.length) % screenshots.length);
  };

  return (
    <section className="section-spacing">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Your Perfect
            <span className="block text-secondary">Study Zone</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Experience our virtual study rooms designed for maximum productivity and collaboration.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Carousel */}
          <div className="relative">
            <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-3xl p-8 mb-8">
              <div className="aspect-video bg-background rounded-2xl shadow-elegant flex items-center justify-center mb-6">
                <div className="text-center">
                  <div className="text-6xl mb-4">📚</div>
                  <h3 className="text-2xl font-semibold text-foreground mb-2">
                    {screenshots[currentSlide].title}
                  </h3>
                  <p className="text-muted-foreground">
                    {screenshots[currentSlide].description}
                  </p>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex justify-between items-center">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={prevSlide}
                  className="rounded-full"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <div className="flex space-x-2">
                  {screenshots.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        index === currentSlide ? 'bg-primary' : 'bg-border'
                      }`}
                    />
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={nextSlide}
                  className="rounded-full"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Feature Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center space-x-4 p-6 bg-card rounded-2xl border">
                <div className="bg-primary/10 p-3 rounded-xl">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Pomodoro Timer Sync</h4>
                  <p className="text-sm text-muted-foreground">Stay focused together</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-6 bg-card rounded-2xl border">
                <div className="bg-secondary/10 p-3 rounded-xl">
                  <Volume2 className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Ambient Soundscapes</h4>
                  <p className="text-sm text-muted-foreground">Nature sounds & lo-fi</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-6 bg-card rounded-2xl border">
                <div className="bg-primary/10 p-3 rounded-xl">
                  <PenTool className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Whiteboard Tool</h4>
                  <p className="text-sm text-muted-foreground">Collaborative drawing</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StudyZoneShowcase;