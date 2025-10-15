import { useQuery } from "@tanstack/react-query";
import { ChevronDown, Github, Linkedin, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  const { data: overview } = useQuery({
    queryKey: ["/api/overview"],
  });

  const scrollToNext = () => {
    const aboutSection = document.getElementById("about");
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="hero" className="min-h-screen flex items-center justify-center relative pt-20">
      <div className="container mx-auto px-6 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Profile Avatar */}
          <div className="mb-8 animate-float">
            <div className="relative w-48 h-48 mx-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-neon-blue via-cosmic-accent to-blue-600 rounded-full animate-pulse opacity-40"></div>
              <div className="relative w-full h-full rounded-full border-4 border-neon-blue/40 overflow-hidden cosmic-glow">
                {overview?.backgroundImage ? (
                  <img 
                    src={overview.backgroundImage} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-space-blue via-cosmic-purple to-blue-600 flex items-center justify-center">
                    <div className="text-8xl">👨‍💻</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            <h1 className="text-5xl md:text-7xl font-bold text-stellar-white leading-tight">
              <span className="bg-gradient-to-r from-neon-blue to-cosmic-accent bg-clip-text text-transparent">
                {overview?.title || "Full Stack Developer from Space"}
              </span>
            </h1>
            
            <h2 className="text-2xl md:text-3xl text-gray-300 font-medium">
              {overview?.subtitle || "Bringing Cosmic Solutions to Earth"}
            </h2>
            
            <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              {overview?.description || "I'm a passionate full-stack developer who creates stellar web applications with cutting-edge technologies. From concept to deployment, I deliver solutions that are out of this world."}
            </p>

            {/* Expertise Tags */}
            <div className="flex flex-wrap justify-center gap-3 mt-8">
              {(overview?.expertise || ["React.js", "Node.js", "TypeScript", "MongoDB", "AWS", "Docker"]).map((skill, index) => (
                <span
                  key={skill}
                  className="px-4 py-2 bg-neon-blue/20 border border-neon-blue/50 rounded-full text-stellar-white text-sm cosmic-glow animate-float"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  {skill}
                </span>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
              <Button
                onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
                size="lg"
                className="px-8 py-4 bg-gradient-to-r from-neon-blue to-cosmic-accent hover:scale-105 transition-all duration-300 cosmic-glow text-lg"
              >
                View My Work
              </Button>
              <Button
                onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                size="lg"
                variant="outline"
                className="px-8 py-4 border-neon-blue/50 text-neon-blue hover:bg-neon-blue/10 hover:scale-105 transition-all duration-300 text-lg"
              >
                Get In Touch
              </Button>
            </div>

            {/* Social Links */}
            <div className="flex justify-center space-x-6 mt-8">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-space-blue/50 flex items-center justify-center hover:bg-neon-blue/20 transition-all duration-300 cosmic-glow hover:scale-110"
              >
                <Github className="w-6 h-6 text-stellar-white" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-space-blue/50 flex items-center justify-center hover:bg-neon-blue/20 transition-all duration-300 cosmic-glow hover:scale-110"
              >
                <Linkedin className="w-6 h-6 text-stellar-white" />
              </a>
              <a
                href="mailto:hello@example.com"
                className="w-12 h-12 rounded-full bg-space-blue/50 flex items-center justify-center hover:bg-neon-blue/20 transition-all duration-300 cosmic-glow hover:scale-110"
              >
                <Mail className="w-6 h-6 text-stellar-white" />
              </a>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <button
            onClick={scrollToNext}
            className="animate-bounce p-2 rounded-full bg-space-blue/30 hover:bg-neon-blue/20 transition-all duration-300 mt-8"
          >
            <ChevronDown className="w-6 h-6 text-neon-blue" />
          </button>
        </div>
      </div>
    </section>
  );
}