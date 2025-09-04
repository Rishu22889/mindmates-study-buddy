import { Linkedin, Twitter, Github, Instagram } from 'lucide-react';

const AboutTeam = () => {
  const founders = [
    {
      name: "Rishi Singh",
      role: "Co-Founder & CTO",
      image: "/assets/rishi.png?w=300&h=300&fit=crop&crop=face",
      bio: "Student at IIT ISM Dhanbad, actively learning AI/ML, web development, and technology product development. He leads the technical direction at MindMates, driving innovation and building the platform’s cutting-edge features with a strong focus on AI and product development.",
      socials: {
        linkedin: "https://www.linkedin.com/in/rishi-singh-b299131aa/",
        instagram: "https://www.instagram.com/me_rishisingh1819/",
        github: "https://github.com/Rishu22889"
      }
    },
    {
      name: "Sumi Debnath",
      role: "Co-Founder & CEO",
      image: "/assets/sumi.png?w=300&h=300&fit=crop&crop=face",
      bio: "Student at Amity University Online, focusing on AI/ML and managing the business and marketing strategy for MindMates. As CEO, she spearheads growth initiatives and ensures the company’s vision aligns with market needs, fostering a thriving learning community.",
      socials: {
        linkedin: "https://www.linkedin.com/in/sumi-debnath-4a783533a/",
        twitter: "#",
        github: "#"
      }
    }
  ];

  const advisors = [
    {
      name: "Dr. Pradeep Kumar",
      role: "Former VP Engineering, Unacademy",
      company: "Unacademy"
    },
    {
      name: "Sarah Chen",
      role: "Ex-Head of Product, PhysicsWallah",
      company: "PhysicsWallah"
    },
    {
      name: "Rajesh Gupta",
      role: "EdTech Investor & Mentor",
      company: "Sequoia Capital"
    },
    {
      name: "Dr. Anita Sharma",
      role: "Education Policy Expert",
      company: "NEP Advisory"
    }
  ];

  return (
    <section id="about" className="section-spacing">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Meet the Team Behind
            <span className="block text-primary">MindMates</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We're a passionate team of educators and technologists committed to revolutionizing collaborative learning.
          </p>
        </div>

        {/* Founders */}
        <div className="max-w-4xl mx-auto mb-20">
          <h3 className="text-3xl font-semibold text-center text-foreground mb-12">Founders</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {founders.map((founder, index) => (
              <div
                key={index}
                className="bg-card rounded-3xl p-8 shadow-elegant hover:shadow-glow transition-all duration-300 hover:-translate-y-2 group text-center"
              >
                <div className="relative mb-6">
                  <img
                    src={founder.image}
                    alt={founder.name}
                    className="w-32 h-32 rounded-full object-cover mx-auto mb-4 group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                
                <h4 className="text-2xl font-semibold text-foreground mb-2">{founder.name}</h4>
                <p className="text-primary font-medium mb-4">{founder.role}</p>
                <p className="text-muted-foreground leading-relaxed mb-6">{founder.bio}</p>
                
                <div className="flex justify-center gap-4">
                  <a
                    href={founder.socials.linkedin}
                    className="bg-primary/10 p-3 rounded-full hover:bg-primary/20 transition-colors group/icon"
                  >
                    <Linkedin className="h-5 w-5 text-primary group-hover/icon:scale-110 transition-transform" />
                  </a>
                  <a
                    href={founder.socials.twitter}
                    className="bg-primary/10 p-3 rounded-full hover:bg-primary/20 transition-colors group/icon"
                  >
                    <Twitter className="h-5 w-5 text-primary group-hover/icon:scale-110 transition-transform" />
                  </a>
                  <a
                    href={founder.socials.github}
                    className="bg-primary/10 p-3 rounded-full hover:bg-primary/20 transition-colors group/icon"
                  >
                    <Github className="h-5 w-5 text-primary group-hover/icon:scale-110 transition-transform" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Advisors */}
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-semibold text-center text-foreground mb-12">Advisory Board</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {advisors.map((advisor, index) => (
              <div
                key={index}
                className="bg-card rounded-2xl p-6 shadow-elegant hover:shadow-glow transition-all duration-300 hover:-translate-y-2 text-center group"
              >
                <div className="w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white font-bold text-xl">
                    {advisor.name.charAt(0)}
                  </span>
                </div>
                <h4 className="font-semibold text-foreground mb-1">{advisor.name}</h4>
                <p className="text-sm text-muted-foreground mb-2">{advisor.role}</p>
                <div className="inline-block bg-secondary/10 text-secondary px-3 py-1 rounded-full text-xs font-medium">
                  {advisor.company}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mission Statement */}
        <div className="mt-20 text-center">
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-3xl p-12 max-w-4xl mx-auto">
            <h3 className="text-3xl font-semibold text-foreground mb-6">Our Mission</h3>
            <p className="text-xl text-muted-foreground leading-relaxed">
              To democratize collaborative learning by connecting students worldwide through AI-powered matching,
              creating a supportive community where everyone can achieve their academic goals together.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutTeam;