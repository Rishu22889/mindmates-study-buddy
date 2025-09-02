import { TrendingUp, Clock, Target } from 'lucide-react';

const ProofOfImpact = () => {
  const stats = [
    {
      icon: Clock,
      value: "+8.5",
      unit: "hrs/week",
      label: "Additional Study Time",
      description: "Students study 8.5 hours more per week on average"
    },
    {
      icon: Target,
      value: "43%",
      unit: "more",
      label: "Mock Tests Completed",
      description: "Significant increase in practice test attempts"
    },
    {
      icon: TrendingUp,
      value: "2.3x",
      unit: "faster",
      label: "Problem Completion",
      description: "Collaborative solving accelerates learning"
    }
  ];

  return (
    <section className="section-spacing bg-gradient-subtle">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Proven Results That
            <span className="block text-secondary">Speak Volumes</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our students consistently outperform their solo study sessions with measurable improvements.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Before/After Visualization */}
          <div className="bg-card rounded-3xl p-8 mb-16 shadow-elegant">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-semibold text-foreground mb-4">Study Performance Transformation</h3>
              <p className="text-muted-foreground">Average improvement across 10,000+ students in their first month</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Before */}
              <div className="text-center">
                <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-6 mb-4">
                  <h4 className="text-lg font-semibold text-red-700 dark:text-red-300 mb-4">Before MindMates</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-red-600 dark:text-red-400">Study Hours/Week</span>
                      <span className="font-semibold text-red-700 dark:text-red-300">12.5</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-red-600 dark:text-red-400">Mock Tests/Month</span>
                      <span className="font-semibold text-red-700 dark:text-red-300">7</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-red-600 dark:text-red-400">Problem Solving Speed</span>
                      <span className="font-semibold text-red-700 dark:text-red-300">1x</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* After */}
              <div className="text-center">
                <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-6 mb-4">
                  <h4 className="text-lg font-semibold text-green-700 dark:text-green-300 mb-4">After MindMates</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-green-600 dark:text-green-400">Study Hours/Week</span>
                      <span className="font-semibold text-green-700 dark:text-green-300">21</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-green-600 dark:text-green-400">Mock Tests/Month</span>
                      <span className="font-semibold text-green-700 dark:text-green-300">10</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-green-600 dark:text-green-400">Problem Solving Speed</span>
                      <span className="font-semibold text-green-700 dark:text-green-300">2.3x</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="bg-card rounded-3xl p-8 shadow-elegant hover:shadow-glow transition-all duration-300 group-hover:-translate-y-2">
                  <div className="bg-gradient-hero p-4 rounded-2xl w-fit mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <stat.icon className="h-8 w-8 text-white" />
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-4xl md:text-5xl font-bold text-primary">{stat.value}</span>
                      <span className="text-2xl font-semibold text-secondary">{stat.unit}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-foreground mb-2">{stat.label}</h3>
                  <p className="text-muted-foreground text-sm">{stat.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProofOfImpact;