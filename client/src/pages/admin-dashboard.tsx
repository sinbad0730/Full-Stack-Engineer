import { useState, useEffect } from "react";
import React from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  Settings, 
  LogOut, 
  User, 
  Briefcase, 
  Code2, 
  Mail, 
  Edit,
  Save,
  Plus,
  Trash2,
  Star,
  GripVertical,
  MessageCircle,
  Eye,
  ExternalLink,
  Github
} from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import {
  CSS,
} from '@dnd-kit/utilities';

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("overview");

  // Check authentication
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("admin_logged_in");
    if (!isLoggedIn) {
      setLocation("/admin");
    }
  }, [setLocation]);

  const handleLogout = () => {
    localStorage.removeItem("admin_logged_in");
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully.",
    });
    setLocation("/admin");
  };

  // Fetch data
  const { data: overview } = useQuery({ queryKey: ["/api/overview"] });
  const { data: about } = useQuery({ queryKey: ["/api/about"] });
  const { data: skills } = useQuery({ queryKey: ["/api/skills"] });
  const { data: projects } = useQuery({ queryKey: ["/api/projects"] });
  const { data: contacts } = useQuery({ queryKey: ["/api/contacts"] });

  return (
    <div className="min-h-screen bg-space-dark">
      {/* Header */}
      <header className="glass border-b border-neon-blue/20 p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-neon-blue to-cosmic-accent flex items-center justify-center">
              <Settings className="w-5 h-5 text-stellar-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-stellar-white">Portfolio CMS</h1>
              <p className="text-sm text-gray-400">Content Management System</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => setLocation("/")}
              className="text-gray-300 hover:text-neon-blue"
            >
              View Site
            </Button>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="border-red-400/50 text-red-400 hover:bg-red-400/10"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5 mb-8 glass">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="about" className="flex items-center space-x-2">
              <Briefcase className="w-4 h-4" />
              <span>About</span>
            </TabsTrigger>
            <TabsTrigger value="skills" className="flex items-center space-x-2">
              <Code2 className="w-4 h-4" />
              <span>Skills</span>
            </TabsTrigger>
            <TabsTrigger value="projects" className="flex items-center space-x-2">
              <Star className="w-4 h-4" />
              <span>Projects</span>
            </TabsTrigger>
            <TabsTrigger value="contacts" className="flex items-center space-x-2">
              <Mail className="w-4 h-4" />
              <span>Messages</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <OverviewSection overview={overview} />
          </TabsContent>

          <TabsContent value="about">
            <AboutSection about={about} />
          </TabsContent>

          <TabsContent value="skills">
            <SkillsSection skills={skills || []} />
          </TabsContent>

          <TabsContent value="projects">
            <ProjectsSection projects={projects || []} />
          </TabsContent>

          <TabsContent value="contacts">
            <ContactsSection contacts={contacts || []} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function OverviewSection({ overview }: { overview: any }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    expertise: "",
  });
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [backgroundImagePreview, setBackgroundImagePreview] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");

  // Update form data when overview loads
  useEffect(() => {
    if (overview) {
      setFormData({
        title: overview.title || "",
        subtitle: overview.subtitle || "",
        description: overview.description || "",
        expertise: overview.expertise?.join(", ") || "",
      });
      setBackgroundImage(overview.backgroundImage || null);
      setBackgroundImagePreview(overview.backgroundImage || null);
      setImageUrl(overview.backgroundImage || "");
    }
  }, [overview]);



  const handleImageUrlChange = (url: string) => {
    setImageUrl(url);
    if (url.trim()) {
      setBackgroundImage(url);
      setBackgroundImagePreview(url);
    }
  };

  const removeImage = () => {
    setBackgroundImage(null);
    setBackgroundImagePreview(null);
    setImageUrl("");
  };

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      const requestBody = {
        title: data.title,
        subtitle: data.subtitle,
        description: data.description,
        expertise: data.expertise.split(",").map((s: string) => s.trim()).filter((s: string) => s.length > 0),
        backgroundImage: backgroundImage,
        isActive: true,
      };
      
      const response = await fetch("/api/overview", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error:", errorData);
        throw new Error(errorData.message || "Failed to update overview");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/overview"] });
      toast({ title: "Overview updated successfully!" });
    },
    onError: (error) => {
      console.error("Update error:", error);
      toast({ 
        title: "Update Failed", 
        description: error.message || "Could not save changes. Please try again.",
        variant: "destructive" 
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  return (
    <Card className="glass cosmic-glow">
      <CardHeader>
        <CardTitle className="text-stellar-white flex items-center space-x-2">
          <Edit className="w-5 h-5" />
          <span>Hero Section</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="text-stellar-white">Main Title</Label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="bg-space-blue/20 border-neon-blue/30 text-stellar-white"
            />
          </div>
          <div>
            <Label className="text-stellar-white">Subtitle</Label>
            <Input
              value={formData.subtitle}
              onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
              className="bg-space-blue/20 border-neon-blue/30 text-stellar-white"
            />
          </div>
          <div>
            <Label className="text-stellar-white">Description</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="bg-space-blue/20 border-neon-blue/30 text-stellar-white"
              rows={4}
            />
          </div>
          <div>
            <Label className="text-stellar-white">Expertise (comma-separated)</Label>
            <Input
              value={formData.expertise}
              onChange={(e) => setFormData(prev => ({ ...prev, expertise: e.target.value }))}
              className="bg-space-blue/20 border-neon-blue/30 text-stellar-white"
              placeholder="React.js, Node.js, TypeScript"
            />
          </div>

          <div>
            <Label className="text-stellar-white">Profile Image URL</Label>
            <Input
              type="url"
              value={imageUrl}
              onChange={(e) => handleImageUrlChange(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="bg-space-blue/20 border-neon-blue/30 text-stellar-white"
            />
          </div>
          <Button 
            type="submit" 
            disabled={updateMutation.isPending}
            className="bg-gradient-to-r from-neon-blue to-cosmic-accent"
          >
            <Save className="w-4 h-4 mr-2" />
            {updateMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function AboutSection({ about }: { about: any }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    experiences: "",
    achievements: "",
  });
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string>("");

  // Update form data when about loads
  useEffect(() => {
    if (about) {
      setFormData({
        title: about.title || "",
        content: about.content || "",
        experiences: about.experiences?.join("\n") || "",
        achievements: about.achievements?.join("\n") || "",
      });
      setProfileImage(about.profileImage || null);
      setProfileImagePreview(about.profileImage || null);
      setProfileImageUrl(about.profileImage || "");
    }
  }, [about]);



  const handleProfileImageUrlChange = (url: string) => {
    setProfileImageUrl(url);
    if (url.trim()) {
      setProfileImage(url);
      setProfileImagePreview(url);
    }
  };



  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      const requestBody = {
        title: data.title,
        content: data.content,
        experiences: data.experiences.split("\n").map((s: string) => s.trim()).filter((s: string) => s.length > 0),
        achievements: data.achievements.split("\n").map((s: string) => s.trim()).filter((s: string) => s.length > 0),
        profileImage: profileImage,
        isActive: true,
      };
      
      const response = await fetch("/api/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error:", errorData);
        throw new Error(errorData.message || "Failed to update about");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/about"] });
      toast({ title: "About section updated successfully!" });
    },
    onError: (error) => {
      console.error("Update error:", error);
      toast({ 
        title: "Update Failed", 
        description: error.message || "Could not save changes. Please try again.",
        variant: "destructive" 
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  return (
    <Card className="glass cosmic-glow">
      <CardHeader>
        <CardTitle className="text-stellar-white flex items-center space-x-2">
          <Edit className="w-5 h-5" />
          <span>About Section</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="text-stellar-white">Section Title</Label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="bg-space-blue/20 border-neon-blue/30 text-stellar-white"
            />
          </div>
          <div>
            <Label className="text-stellar-white">Main Content</Label>
            <Textarea
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              className="bg-space-blue/20 border-neon-blue/30 text-stellar-white"
              rows={6}
            />
          </div>
          <div>
            <Label className="text-stellar-white">Experiences (one per line)</Label>
            <Textarea
              value={formData.experiences}
              onChange={(e) => setFormData(prev => ({ ...prev, experiences: e.target.value }))}
              className="bg-space-blue/20 border-neon-blue/30 text-stellar-white"
              rows={4}
            />
          </div>
          <div>
            <Label className="text-stellar-white">Achievements (one per line)</Label>
            <Textarea
              value={formData.achievements}
              onChange={(e) => setFormData(prev => ({ ...prev, achievements: e.target.value }))}
              className="bg-space-blue/20 border-neon-blue/30 text-stellar-white"
              rows={4}
            />
          </div>

          <div>
            <Label className="text-stellar-white">Profile Image URL</Label>
            <Input
              type="url"
              value={profileImageUrl}
              onChange={(e) => handleProfileImageUrlChange(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="bg-space-blue/20 border-neon-blue/30 text-stellar-white"
            />
          </div>

          <Button 
            type="submit" 
            disabled={updateMutation.isPending}
            className="bg-gradient-to-r from-neon-blue to-cosmic-accent"
          >
            <Save className="w-4 h-4 mr-2" />
            {updateMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function SortableSkillItem({ skill, onEdit, onDelete }: { skill: any; onEdit: (skill: any) => void; onDelete: (id: string) => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: skill.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className="p-4 bg-space-blue/30 rounded-lg border border-neon-blue/20 flex items-center gap-4"
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab hover:cursor-grabbing text-gray-400 hover:text-neon-blue"
      >
        <GripVertical className="w-4 h-4" />
      </div>
      
      <div className="flex-1">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-medium text-stellar-white">{skill.name}</h4>
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onEdit(skill)}
              className="text-blue-400 hover:text-blue-300"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDelete(skill.id)}
              className="text-red-400 hover:text-red-300"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <Badge variant="outline" className="mb-2">
          {skill.category}
        </Badge>
        <p className="text-sm text-gray-300 mb-2">{skill.description}</p>
        <Badge className={`${getLevelColor(skill.level)}`}>
          {skill.level}
        </Badge>
      </div>
    </div>
  );
}

function SkillsSection({ skills }: { skills: any[] }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingSkill, setEditingSkill] = useState<any>(null);
  const [isSkillDialogOpen, setIsSkillDialogOpen] = useState(false);

  const deleteSkillMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/skills/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete skill");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/skills"] });
      toast({ title: "Skill deleted successfully!" });
    },
  });

  const addSkillMutation = useMutation({
    mutationFn: async (data: any) => {
      const requestBody = {
        category: data.category,
        name: data.name,
        level: data.level,
        description: data.description || "",
        isActive: true,
        order: "0"
      };
      
      const response = await fetch("/api/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error:", errorData);
        throw new Error(errorData.message || "Failed to add skill");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/skills"] });
      toast({ title: "Skill added successfully!" });
      setIsSkillDialogOpen(false);
      setEditingSkill(null);
    },
  });

  const updateSkillMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const requestBody = {
        category: data.category,
        name: data.name,
        level: data.level,
        description: data.description || "",
        isActive: true,
      };
      
      const response = await fetch(`/api/skills/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error:", errorData);
        throw new Error(errorData.message || "Failed to update skill");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/skills"] });
      toast({ title: "Skill updated successfully!" });
      setIsSkillDialogOpen(false);
      setEditingSkill(null);
    },
  });

  const handleAddSkill = () => {
    setEditingSkill(null);
    setIsSkillDialogOpen(true);
  };

  const handleEditSkill = (skill: any) => {
    setEditingSkill(skill);
    setIsSkillDialogOpen(true);
  };

  const handleSkillSubmit = (data: any) => {
    if (editingSkill) {
      updateSkillMutation.mutate({ id: editingSkill.id, data });
    } else {
      addSkillMutation.mutate(data);
    }
  };

  return (
    <Card className="glass cosmic-glow">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-stellar-white">Skills Management</CardTitle>
        <Button 
          onClick={handleAddSkill}
          className="bg-gradient-to-r from-neon-blue to-cosmic-accent"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Skill
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {skills.map((skill) => (
            <div 
              key={skill.id}
              className="p-4 bg-space-blue/30 rounded-lg border border-neon-blue/20"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-stellar-white">{skill.name}</h4>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEditSkill(skill)}
                    className="text-blue-400 hover:text-blue-300"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteSkillMutation.mutate(skill.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <Badge variant="outline" className="mb-2">
                {skill.category}
              </Badge>
              <p className="text-sm text-gray-300 mb-2">{skill.description}</p>
              <Badge className={`${getLevelColor(skill.level)}`}>
                {skill.level}
              </Badge>
            </div>
          ))}
        </div>

        <Dialog open={isSkillDialogOpen} onOpenChange={setIsSkillDialogOpen}>
          <DialogContent className="bg-space-dark border-neon-blue/20">
            <DialogHeader>
              <DialogTitle className="text-stellar-white">
                {editingSkill ? "Edit Skill" : "Add New Skill"}
              </DialogTitle>
              <DialogDescription className="text-gray-300">
                {editingSkill ? "Update the skill information below." : "Add a new skill to your portfolio."}
              </DialogDescription>
            </DialogHeader>
            <SkillForm
              skill={editingSkill}
              onSubmit={handleSkillSubmit}
              onCancel={() => setIsSkillDialogOpen(false)}
              isLoading={addSkillMutation.isPending || updateSkillMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

function SortableProjectItem({ project, onEdit, onDelete }: { project: any; onEdit: (project: any) => void; onDelete: (id: string) => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: project.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className="p-6 bg-space-blue/30 rounded-lg border border-neon-blue/20 flex items-start gap-4"
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab hover:cursor-grabbing text-gray-400 hover:text-neon-blue mt-2"
      >
        <GripVertical className="w-4 h-4" />
      </div>
      
      <div className="flex-1">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-xl font-bold text-stellar-white mb-2">{project.title}</h3>
            {project.featured && (
              <Badge className="bg-yellow-500 text-black mb-2">
                <Star className="w-3 h-3 mr-1" />
                Featured
              </Badge>
            )}
          </div>
          <div className="flex space-x-2">
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={() => onEdit(project)}
              className="text-blue-400"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDelete(project.id)}
              className="text-red-400"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <p className="text-gray-300 mb-4">{project.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-3">
          {project.technologies?.map((tech: string) => (
            <Badge key={tech} variant="outline" className="text-cosmic-accent border-cosmic-accent/50">
              {tech}
            </Badge>
          ))}
        </div>
        
        <div className="flex space-x-4 text-sm text-gray-400">
          {project.githubUrl && (
            <span>GitHub: {project.githubUrl}</span>
          )}
          {project.websiteUrl && (
            <span>Website: {project.websiteUrl}</span>
          )}
        </div>
      </div>
    </div>
  );
}

function ProjectsSection({ projects }: { projects: any[] }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingProject, setEditingProject] = useState<any>(null);
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);

  const deleteProjectMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete project");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({ title: "Project deleted successfully!" });
    },
  });

  const addProjectMutation = useMutation({
    mutationFn: async (data: any) => {
      const requestBody = {
        title: data.title,
        description: data.description,
        technologies: data.technologies.split(",").map((s: string) => s.trim()).filter((s: string) => s.length > 0),
        images: [],
        githubUrl: data.githubUrl || "",
        websiteUrl: data.websiteUrl || "",
        featured: data.featured || false,
        isActive: true,
        order: "0"
      };
      
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error:", errorData);
        throw new Error(errorData.message || "Failed to add project");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({ title: "Project added successfully!" });
      setIsProjectDialogOpen(false);
      setEditingProject(null);
    },
  });

  const updateProjectMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const requestBody = {
        title: data.title,
        description: data.description,
        technologies: data.technologies.split(",").map((s: string) => s.trim()).filter((s: string) => s.length > 0),
        githubUrl: data.githubUrl || "",
        websiteUrl: data.websiteUrl || "",
        featured: data.featured || false,
        isActive: true,
      };
      
      const response = await fetch(`/api/projects/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error:", errorData);
        throw new Error(errorData.message || "Failed to update project");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({ title: "Project updated successfully!" });
      setIsProjectDialogOpen(false);
      setEditingProject(null);
    },
  });

  const handleAddProject = () => {
    setEditingProject(null);
    setIsProjectDialogOpen(true);
  };

  const handleEditProject = (project: any) => {
    setEditingProject(project);
    setIsProjectDialogOpen(true);
  };

  const handleProjectSubmit = (data: any) => {
    if (editingProject) {
      updateProjectMutation.mutate({ id: editingProject.id, data });
    } else {
      addProjectMutation.mutate(data);
    }
  };

  return (
    <Card className="glass cosmic-glow">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-stellar-white">Projects Management</CardTitle>
        <Button 
          onClick={handleAddProject}
          className="bg-gradient-to-r from-neon-blue to-cosmic-accent"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Project
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {projects.map((project) => (
            <div 
              key={project.id} 
              className="p-4 bg-space-blue/30 rounded-lg border border-neon-blue/20"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-xl font-bold text-stellar-white mb-2">{project.title}</h3>
                  {project.featured && (
                    <Badge className="bg-yellow-500 text-black mb-2">
                      <Star className="w-3 h-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => handleEditProject(project)}
                    className="text-blue-400"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteProjectMutation.mutate(project.id)}
                    className="text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <p className="text-gray-300 mb-4">{project.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-3">
                {project.technologies?.map((tech: string) => (
                  <Badge key={tech} variant="outline" className="text-cosmic-accent border-cosmic-accent/50">
                    {tech}
                  </Badge>
                ))}
              </div>
              
              <div className="flex space-x-4 text-sm text-gray-400">
                {project.githubUrl && (
                  <span className="flex items-center">
                    <Github className="w-3 h-3 mr-1" />
                    GitHub
                  </span>
                )}
                {project.websiteUrl && (
                  <span className="flex items-center">
                    <ExternalLink className="w-3 h-3 mr-1" />
                    Website
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        <Dialog open={isProjectDialogOpen} onOpenChange={setIsProjectDialogOpen}>
          <DialogContent className="bg-space-dark border-neon-blue/20 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-stellar-white">
                {editingProject ? "Edit Project" : "Add New Project"}
              </DialogTitle>
              <DialogDescription className="text-gray-300">
                {editingProject ? "Update the project information below." : "Add a new project to your portfolio."}
              </DialogDescription>
            </DialogHeader>
            <ProjectForm
              project={editingProject}
              onSubmit={handleProjectSubmit}
              onCancel={() => setIsProjectDialogOpen(false)}
              isLoading={addProjectMutation.isPending || updateProjectMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

function ContactsSection({ contacts }: { contacts: any[] }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const markAsReadMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/contacts/${id}/read`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" }
      });
      if (!response.ok) throw new Error("Failed to mark as read");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contacts"] });
      toast({ title: "Message marked as read!" });
    },
  });

  return (
    <Card className="glass cosmic-glow">
      <CardHeader>
        <CardTitle className="text-stellar-white">Contact Messages</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {contacts.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No messages yet.</p>
          ) : (
            contacts.map((contact) => (
              <div 
                key={contact.id} 
                className={`p-4 rounded-lg border ${
                  contact.isRead 
                    ? 'bg-space-blue/20 border-gray-500/30' 
                    : 'bg-space-blue/40 border-neon-blue/30'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-medium text-stellar-white">{contact.name}</h4>
                    <p className="text-sm text-gray-400">{contact.email}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {!contact.isRead && (
                      <Badge className="bg-neon-blue text-space-dark">New</Badge>
                    )}
                    <span className="text-xs text-gray-400">
                      {new Date(contact.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <p className="font-medium text-stellar-white mb-2">{contact.subject}</p>
                <p className="text-gray-300 mb-3">{contact.message}</p>
                {!contact.isRead && (
                  <Button
                    size="sm"
                    onClick={() => markAsReadMutation.mutate(contact.id)}
                    className="bg-neon-blue text-space-dark"
                  >
                    Mark as Read
                  </Button>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function SkillForm({ skill, onSubmit, onCancel, isLoading }: {
  skill?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isLoading: boolean;
}) {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    level: "Beginner",
    description: "",
  });

  // Update form data when skill loads
  useEffect(() => {
    if (skill) {
      setFormData({
        name: skill.name || "",
        category: skill.category || "",
        level: skill.level || "Beginner",
        description: skill.description || "",
      });
    } else {
      setFormData({
        name: "",
        category: "",
        level: "Beginner",
        description: "",
      });
    }
  }, [skill]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-stellar-white">Skill Name</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="bg-space-blue/20 border-neon-blue/30 text-stellar-white"
              required
            />
          </div>
          <div>
            <Label className="text-stellar-white">Category</Label>
            <Input
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className="bg-space-blue/20 border-neon-blue/30 text-stellar-white"
              required
            />
          </div>
        </div>
        
        <div>
          <Label className="text-stellar-white">Level</Label>
          <Select 
            value={formData.level} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, level: value }))}
          >
            <SelectTrigger className="bg-space-blue/20 border-neon-blue/30 text-stellar-white">
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Beginner">Beginner</SelectItem>
              <SelectItem value="Intermediate">Intermediate</SelectItem>
              <SelectItem value="Advanced">Advanced</SelectItem>
              <SelectItem value="Expert">Expert</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-stellar-white">Description</Label>
          <Textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className="bg-space-blue/20 border-neon-blue/30 text-stellar-white"
            rows={3}
          />
        </div>

        <div className="flex space-x-3">
          <Button 
            type="submit" 
            disabled={isLoading}
            className="bg-gradient-to-r from-neon-blue to-cosmic-accent"
          >
            <Save className="w-4 h-4 mr-2" />
            {isLoading ? "Saving..." : "Save Skill"}
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            className="border-gray-500 text-gray-300"
          >
            Cancel
          </Button>
        </div>
      </form>
  );
}

function ProjectForm({ project, onSubmit, onCancel, isLoading }: {
  project?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isLoading: boolean;
}) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    technologies: "",
    githubUrl: "",
    websiteUrl: "",
    featured: false,
  });

  // Update form data when project loads
  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || "",
        description: project.description || "",
        technologies: project.technologies?.join(", ") || "",
        githubUrl: project.githubUrl || "",
        websiteUrl: project.websiteUrl || "",
        featured: project.featured || false,
      });
    } else {
      setFormData({
        title: "",
        description: "",
        technologies: "",
        githubUrl: "",
        websiteUrl: "",
        featured: false,
      });
    }
  }, [project]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label className="text-stellar-white">Project Title</Label>
        <Input
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          className="bg-space-blue/20 border-neon-blue/30 text-stellar-white"
          required
        />
      </div>

      <div>
        <Label className="text-stellar-white">Description</Label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          className="bg-space-blue/20 border-neon-blue/30 text-stellar-white"
          rows={4}
          required
        />
      </div>

      <div>
        <Label className="text-stellar-white">Technologies (comma-separated)</Label>
        <Input
          value={formData.technologies}
          onChange={(e) => setFormData(prev => ({ ...prev, technologies: e.target.value }))}
          className="bg-space-blue/20 border-neon-blue/30 text-stellar-white"
          placeholder="React, Node.js, TypeScript"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className="text-stellar-white">GitHub URL (optional)</Label>
          <Input
            type="url"
            value={formData.githubUrl}
            onChange={(e) => setFormData(prev => ({ ...prev, githubUrl: e.target.value }))}
            className="bg-space-blue/20 border-neon-blue/30 text-stellar-white"
            placeholder="https://github.com/username/repo"
          />
        </div>
        <div>
          <Label className="text-stellar-white">Website URL (optional)</Label>
          <Input
            type="url"
            value={formData.websiteUrl}
            onChange={(e) => setFormData(prev => ({ ...prev, websiteUrl: e.target.value }))}
            className="bg-space-blue/20 border-neon-blue/30 text-stellar-white"
            placeholder="https://yourproject.com"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="featured"
          checked={formData.featured}
          onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
          className="w-4 h-4 text-neon-blue bg-space-blue border-neon-blue/30 rounded"
        />
        <Label htmlFor="featured" className="text-stellar-white">Featured Project</Label>
      </div>

      <div className="flex space-x-3">
        <Button 
          type="submit" 
          disabled={isLoading}
          className="bg-gradient-to-r from-neon-blue to-cosmic-accent"
        >
          <Save className="w-4 h-4 mr-2" />
          {isLoading ? "Saving..." : "Save Project"}
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          className="border-gray-500 text-gray-300"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}

function getLevelColor(level: string) {
  switch (level.toLowerCase()) {
    case "expert": return "bg-green-500";
    case "advanced": return "bg-blue-500";
    case "intermediate": return "bg-yellow-500";
    default: return "bg-gray-500";
  }
}