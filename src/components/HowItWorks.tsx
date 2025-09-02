import { UserPlus, Users2, TrendingUp } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: UserPlus,
      title: "Sign up & complete profile",
      description: "Tell us about your subjects, study preferences, and goals to get perfectly matched.",
      step: "01"
    },
    {
      icon: Users2,
      title: "Get matched & join room",
      description: "Our AI finds your ideal study partners and creates a virtual room for your session.",
      step: "02"
    },
    {
      icon: TrendingUp,
      title: "Study together & track progress",
      description: "Collaborate in real-time while our analytics help you optimize your learning.",
      step: "03"
    }
  ];

  return (
    <section id="how-it-works" className="section-spacing bg-gradient-subtle">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            How It
            <span className="block text-primary">Works</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Get started in minutes and transform your study experience with AI-powered collaboration.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                {/* Connector Line (Desktop) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-primary to-secondary z-0 transform translate-x-8" />
                )}

                <div className="relative z-10 text-center">
                  {/* Step Number */}
                  <div className="bg-gradient-hero text-white text-2xl font-bold w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 shadow-glow">
                    {step.step}
                  </div>

                  {/* Icon */}
                  <div className="bg-card rounded-2xl p-8 shadow-elegant hover:shadow-glow transition-all duration-300 group">
                    <div className="bg-gradient-hero p-4 rounded-2xl w-fit mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                      <step.icon className="h-8 w-8 text-white" />
                    </div>

                    <h3 className="text-xl font-semibold text-foreground mb-4">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-16">
            <button className="btn-primary text-xl px-12 py-6">
              Start Your Journey Today
            </button>
            <p className="text-sm text-muted-foreground mt-4">
              No credit card required • Free forever plan available
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;