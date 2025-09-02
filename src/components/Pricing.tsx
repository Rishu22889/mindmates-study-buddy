import { useState } from 'react';
import { Check, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      name: "Free Forever",
      price: "₹0",
      period: "",
      description: "Perfect for getting started with collaborative studying",
      features: [
        "Up to 3 study sessions per week",
        "Basic AI matching",
        "30-minute session limit",
        "Community support",
        "Basic progress tracking"
      ],
      popular: false,
      cta: "Get Started Free"
    },
    {
      name: "Premium",
      price: isAnnual ? "₹290" : "₹350",
      period: isAnnual ? "/month (billed annually)" : "/month",
      originalPrice: isAnnual ? "₹350" : null,
      description: "For serious students who want unlimited access",
      features: [
        "Unlimited study sessions",
        "Priority AI matching",
        "Advanced analytics dashboard",
        "Priority tutor access",
        "Custom study rooms",
        "Progress insights & reports",
        "24/7 premium support"
      ],
      popular: true,
      cta: "Start Premium Trial"
    }
  ];

  return (
    <section id="pricing" className="section-spacing">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Simple, Transparent
            <span className="block text-primary">Pricing</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Start for free and upgrade when you're ready for unlimited access.
          </p>

          {/* Toggle */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <span className={`text-lg ${!isAnnual ? 'text-foreground font-semibold' : 'text-muted-foreground'}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative w-16 h-8 rounded-full transition-colors ${
                isAnnual ? 'bg-primary' : 'bg-border'
              }`}
            >
              <div
                className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                  isAnnual ? 'translate-x-8' : 'translate-x-0'
                }`}
              />
            </button>
            <span className={`text-lg ${isAnnual ? 'text-foreground font-semibold' : 'text-muted-foreground'}`}>
              Annual
            </span>
            {isAnnual && (
              <span className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm font-semibold">
                Save 17%
              </span>
            )}
          </div>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-3xl p-8 transition-all duration-300 hover:shadow-elegant hover:-translate-y-2 ${
                plan.popular
                  ? 'bg-gradient-to-br from-primary/5 to-secondary/5 border-2 border-primary/20 shadow-glow'
                  : 'bg-card border border-border'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-hero text-white px-6 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                    <Star className="h-4 w-4 fill-current" />
                    Most Popular
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-foreground mb-2">{plan.name}</h3>
                <div className="flex items-center justify-center gap-2 mb-4">
                  <span className="text-4xl md:text-5xl font-bold text-foreground">{plan.price}</span>
                  {plan.originalPrice && (
                    <span className="text-xl text-muted-foreground line-through">{plan.originalPrice}</span>
                  )}
                </div>
                <p className="text-muted-foreground">{plan.period}</p>
                <p className="text-sm text-muted-foreground mt-2">{plan.description}</p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <div className="bg-primary/10 p-1 rounded-full mt-0.5">
                      <Check className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full text-lg py-6 ${
                  plan.popular
                    ? 'btn-primary'
                    : 'btn-secondary'
                }`}
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground">
            All plans include a 14-day free trial • No setup fees • Cancel anytime
          </p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;