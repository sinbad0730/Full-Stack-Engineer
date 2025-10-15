import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export function SkillsSection() {
  const { data: skills } = useQuery({
    queryKey: ["/api/skills"],
  });

  const skillCategories = (skills || []).reduce((acc: any, skill: any) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {});

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "expert": return "text-green-400";
      case "advanced": return "text-blue-400";
      case "intermediate": return "text-yellow-400";
      case "beginner": return "text-orange-400";
      default: return "text-gray-400";
    }
  };

  const getLevelPercentage = (level: string) => {
    switch (level.toLowerCase()) {
      case "expert": return 95;
      case "advanced": return 80;
      case "intermediate": return 60;
      case "beginner": return 35;
      default: return 0;
    }
  };

  return (
    <section id="skills" className="py-20">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-stellar-white mb-6">
              <span className="bg-gradient-to-r from-neon-blue to-cosmic-accent bg-clip-text text-transparent">
                Tech Arsenal
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              My technological expertise spans across the full development stack, 
              from crafting beautiful user interfaces to building robust server architectures.
            </p>
          </div>

          {/* Skills Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {Object.entries(skillCategories).map(([category, categorySkills]: [string, any]) => (
              <Card key={category} className="glass cosmic-glow">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-r from-neon-blue to-cosmic-accent"></div>
                    <h3 className="text-2xl font-bold text-stellar-white">{category}</h3>
                  </div>
                  
                  <div className="space-y-6">
                    {categorySkills.map((skill: any, index: number) => (
                      <div 
                        key={skill.id} 
                        className="animate-float"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <span className="text-lg font-medium text-stellar-white">
                              {skill.name}
                            </span>
                            <Badge 
                              className={`${getLevelColor(skill.level)} bg-neon-blue/20 border-neon-blue/50`}
                            >
                              {skill.level}
                            </Badge>
                          </div>
                        </div>
                        
                        <Progress 
                          value={getLevelPercentage(skill.level)} 
                          className="h-2 mb-2"
                        />
                        
                        {skill.description && (
                          <p className="text-sm text-gray-400">{skill.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>


        </div>
      </div>
    </section>
  );
}

function getSkillIcon(skillName: string) {
  const icons: Record<string, string> = {
    "React.js": "⚛️",
    "Next.js": "▲",
    "TypeScript": "🔷",
    "Tailwind CSS": "🎨",
    "Node.js": "🟢",
    "Express.js": "🚀",
    "Python": "🐍",
    "MongoDB": "🍃",
    "PostgreSQL": "🐘",
    "Docker": "🐳",
    "AWS": "☁️",
    "Git": "📝"
  };
  
  return icons[skillName] || "⚡";
}