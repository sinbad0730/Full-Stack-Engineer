import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Github, Star, ArrowLeft } from "lucide-react";
import { StarfieldBackground } from "@/components/starfield-background";
import { Navigation } from "@/components/navigation";
import { Link } from "wouter";

export default function AllProjects() {
  const { data: projects, isLoading } = useQuery({
    queryKey: ["/api/projects"],
  });

  return (
    <div className="min-h-screen relative">
      <StarfieldBackground />
      <Navigation />
      
      <main className="pt-20">
        <section className="py-20 bg-space-dark/30">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              {/* Back Button */}
              <div className="mb-8">
                <Link href="/#projects">
                  <Button
                    variant="ghost"
                    className="text-gray-400 hover:text-neon-blue"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Portfolio
                  </Button>
                </Link>
              </div>

              {/* Section Header */}
              <div className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-bold text-stellar-white mb-6">
                  <span className="bg-gradient-to-r from-neon-blue to-cosmic-accent bg-clip-text text-transparent">
                    All Projects
                  </span>
                </h1>
                <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                  A comprehensive showcase of my work, from featured projects to experimental builds. 
                  Each project tells a story of problem-solving and innovation.
                </p>
              </div>

              {/* Loading State */}
              {isLoading && (
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-neon-blue"></div>
                  <p className="text-gray-400 mt-4">Loading projects...</p>
                </div>
              )}

              {/* Projects Grid */}
              {projects && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {projects.map((project: any, index: number) => (
                    <Card 
                      key={project.id} 
                      className="glass cosmic-glow overflow-hidden group hover:scale-105 transition-all duration-300 animate-float"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="relative h-48 overflow-hidden">
                        <div className="w-full h-full bg-gradient-to-br from-space-blue to-cosmic-purple flex items-center justify-center">
                          <div className="text-6xl opacity-50">🚀</div>
                        </div>
                        
                        {/* Featured Badge */}
                        {project.featured && (
                          <div className="absolute top-4 right-4">
                            <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-space-dark border-0">
                              <Star className="w-3 h-3 mr-1" />
                              Featured
                            </Badge>
                          </div>
                        )}
                      </div>

                      <CardContent className="p-6">
                        <h3 className="text-xl font-bold text-stellar-white mb-3 group-hover:text-neon-blue transition-colors">
                          {project.title}
                        </h3>
                        
                        <p className="text-gray-300 mb-4 leading-relaxed">
                          {project.description}
                        </p>

                        {/* Technologies */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.technologies?.map((tech: string) => (
                            <Badge 
                              key={tech} 
                              variant="outline" 
                              className="border-cosmic-accent/50 text-cosmic-accent"
                            >
                              {tech}
                            </Badge>
                          ))}
                        </div>

                        {/* Links */}
                        <div className="flex space-x-3">
                          {project.githubUrl && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-gray-400 hover:text-neon-blue p-0"
                              onClick={() => window.open(project.githubUrl, '_blank')}
                            >
                              <Github className="w-4 h-4 mr-2" />
                              View Code
                            </Button>
                          )}
                          {project.websiteUrl && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-gray-400 hover:text-cosmic-accent p-0"
                              onClick={() => window.open(project.websiteUrl, '_blank')}
                            >
                              <ExternalLink className="w-4 h-4 mr-2" />
                              Live Site
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* No Projects Message */}
              {projects && projects.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🌌</div>
                  <h3 className="text-2xl font-bold text-stellar-white mb-2">No Projects Yet</h3>
                  <p className="text-gray-400">Projects are being crafted in the cosmic void...</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}