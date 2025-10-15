import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Github, Star } from "lucide-react";
import { Link } from "wouter";

export function ProjectsSection() {
  const { data: projects } = useQuery({
    queryKey: ["/api/projects/featured"],
  });

  return (
    <section id="projects" className="py-20 bg-space-dark/30">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-stellar-white mb-6">
              <span className="bg-gradient-to-r from-neon-blue to-cosmic-accent bg-clip-text text-transparent">
                Featured Projects
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Explore some of my latest and most exciting projects. Each one represents 
              a unique challenge solved with creativity and cutting-edge technology.
            </p>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {projects?.map((project: any, index: number) => (
              <Card 
                key={project.id} 
                className="glass cosmic-glow overflow-hidden group hover:scale-105 transition-all duration-300 animate-float"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="relative h-48 overflow-hidden">
                  {project.images && project.images.length > 0 ? (
                    <img 
                      src={project.images[0]} 
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-space-blue to-cosmic-accent flex items-center justify-center">
                      <div className="text-6xl opacity-50">🚀</div>
                    </div>
                  )}
                  
                  {/* Overlay on hover - removed as requested */}

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
                        className="bg-neon-blue/20 border-neon-blue/50 text-stellar-white hover:bg-neon-blue/30 transition-colors"
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
                        variant="outline"
                        className="px-4 py-2 border-neon-blue/50 text-neon-blue hover:bg-neon-blue hover:text-space-dark transition-all duration-300"
                        onClick={() => window.open(project.githubUrl, '_blank')}
                      >
                        <Github className="w-4 h-4 mr-2" />
                        View Code
                      </Button>
                    )}
                    {project.websiteUrl && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="px-4 py-2 border-cosmic-accent/50 text-cosmic-accent hover:bg-cosmic-accent hover:text-space-dark transition-all duration-300"
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

          {/* View All Projects Button */}
          <div className="text-center mt-12">
            <Link href="/projects">
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-4 border-neon-blue/50 text-neon-blue hover:bg-neon-blue/10 hover:scale-105 transition-all duration-300"
              >
                View All Projects
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}