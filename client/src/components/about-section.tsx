import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Award, Users, Code } from "lucide-react";

export function AboutSection() {
  const { data: about } = useQuery({
    queryKey: ["/api/about"],
  });

  if (!about) {
    return (
      <section id="about" className="py-20 bg-space-dark/30">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-space-blue/50 rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-space-blue/30 rounded w-96 mx-auto"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="about" className="py-20 bg-space-dark/30">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-stellar-white mb-6">
              <span className="bg-gradient-to-r from-neon-blue to-cosmic-accent bg-clip-text text-transparent">
                {about.title}
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              {about.content}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Profile Image */}
            <div className="relative">
              <div className="relative w-80 h-80 mx-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-neon-blue via-cosmic-accent to-blue-600 rounded-full animate-pulse opacity-40"></div>
                <div className="relative w-full h-full rounded-full border-4 border-neon-blue/40 overflow-hidden cosmic-glow shadow-2xl">
                  {about?.profileImage ? (
                    <img 
                      src={about.profileImage} 
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

            {/* Content */}
            <div className="space-y-8">
              {/* Experience */}
              <Card className="glass cosmic-glow">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center">
                      <Code className="w-5 h-5 text-stellar-white" />
                    </div>
                    <h3 className="text-xl font-bold text-stellar-white">Professional Experience</h3>
                  </div>
                  <div className="space-y-3">
                    {about.experiences.map((experience, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                        <p className="text-gray-300">{experience}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Achievements */}
              <Card className="glass cosmic-glow">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center">
                      <Award className="w-5 h-5 text-stellar-white" />
                    </div>
                    <h3 className="text-xl font-bold text-stellar-white">Key Achievements</h3>
                  </div>
                  <div className="space-y-3">
                    {about.achievements.map((achievement, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <Award className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                        <p className="text-gray-300">{achievement}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Fun Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 glass rounded-lg">
                  <div className="text-3xl font-bold text-neon-blue">5+</div>
                  <div className="text-sm text-gray-400">Years Experience</div>
                </div>
                <div className="text-center p-4 glass rounded-lg">
                  <div className="text-3xl font-bold text-cosmic-accent">50+</div>
                  <div className="text-sm text-gray-400">Projects Completed</div>
                </div>
                <div className="text-center p-4 glass rounded-lg">
                  <div className="text-3xl font-bold text-green-400">20+</div>
                  <div className="text-sm text-gray-400">Happy Clients</div>
                </div>
                <div className="text-center p-4 glass rounded-lg">
                  <div className="text-3xl font-bold text-yellow-400">∞</div>
                  <div className="text-sm text-gray-400">Lines of Code</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}