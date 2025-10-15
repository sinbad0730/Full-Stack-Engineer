import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./mem-storage";
import { insertOverviewSchema, insertAboutSchema, insertSkillSchema, insertProjectSchema, insertContactSchema } from "@shared/mongodb-schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Overview section
  app.get("/api/overview", async (req, res) => {
    try {
      const overview = await storage.getOverview();
      res.json(overview);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch overview" });
    }
  });

  app.put("/api/overview", async (req, res) => {
    try {
      const overviewData = insertOverviewSchema.parse(req.body);
      const overview = await storage.updateOverview(overviewData);
      res.json(overview);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid overview data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update overview" });
      }
    }
  });

  // About section
  app.get("/api/about", async (req, res) => {
    try {
      const about = await storage.getAbout();
      res.json(about);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch about" });
    }
  });

  app.put("/api/about", async (req, res) => {
    try {
      const aboutData = insertAboutSchema.parse(req.body);
      const about = await storage.updateAbout(aboutData);
      res.json(about);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid about data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update about" });
      }
    }
  });

  // Skills
  app.get("/api/skills", async (req, res) => {
    try {
      const skills = await storage.getSkills();
      res.json(skills);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch skills" });
    }
  });

  app.post("/api/skills", async (req, res) => {
    try {
      const skillData = insertSkillSchema.parse(req.body);
      const skill = await storage.createSkill(skillData);
      res.status(201).json(skill);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid skill data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create skill" });
      }
    }
  });

  app.put("/api/skills/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const skill = await storage.updateSkill(id, updateData);
      if (!skill) {
        res.status(404).json({ message: "Skill not found" });
        return;
      }
      res.json(skill);
    } catch (error) {
      res.status(500).json({ message: "Failed to update skill" });
    }
  });

  app.delete("/api/skills/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteSkill(id);
      if (!deleted) {
        res.status(404).json({ message: "Skill not found" });
        return;
      }
      res.json({ message: "Skill deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete skill" });
    }
  });

  app.patch("/api/skills/reorder", async (req, res) => {
    try {
      const { skills } = req.body;
      await storage.updateSkillsOrder(skills);
      res.json({ message: "Skills order updated successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to update skills order" });
    }
  });

  // Projects
  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await storage.getProjects();
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.get("/api/projects/featured", async (req, res) => {
    try {
      const projects = await storage.getFeaturedProjects();
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured projects" });
    }
  });

  app.post("/api/projects", async (req, res) => {
    try {
      const projectData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(projectData);
      res.status(201).json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid project data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create project" });
      }
    }
  });

  app.put("/api/projects/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const project = await storage.updateProject(id, updateData);
      if (!project) {
        res.status(404).json({ message: "Project not found" });
        return;
      }
      res.json(project);
    } catch (error) {
      res.status(500).json({ message: "Failed to update project" });
    }
  });

  app.delete("/api/projects/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteProject(id);
      if (!deleted) {
        res.status(404).json({ message: "Project not found" });
        return;
      }
      res.json({ message: "Project deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete project" });
    }
  });

  app.patch("/api/projects/reorder", async (req, res) => {
    try {
      const { projects } = req.body;
      await storage.updateProjectsOrder(projects);
      res.json({ message: "Projects order updated successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to update projects order" });
    }
  });

  // Contact messages
  app.get("/api/contacts", async (req, res) => {
    try {
      const contacts = await storage.getContacts();
      res.json(contacts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch contacts" });
    }
  });

  app.post("/api/contacts", async (req, res) => {
    try {
      const contactData = insertContactSchema.parse(req.body);
      const contact = await storage.createContact(contactData);
      
      // TODO: Implement Telegram notification here
      // You can add the Telegram bot integration later
      
      res.status(201).json(contact);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid contact data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to send message" });
      }
    }
  });

  app.patch("/api/contacts/:id/read", async (req, res) => {
    try {
      const { id } = req.params;
      const contact = await storage.markContactAsRead(id);
      if (!contact) {
        res.status(404).json({ message: "Contact not found" });
        return;
      }
      res.json(contact);
    } catch (error) {
      res.status(500).json({ message: "Failed to mark contact as read" });
    }
  });

  // Authentication
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      // Get admin credentials from environment variables
      const adminUsername = process.env.ADMIN_USERNAME || "admin";
      const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
      
      // Simple authentication (in production, use proper password hashing)
      if (username === adminUsername && password === adminPassword) {
        res.json({ 
          success: true, 
          message: "Login successful",
          user: { username: adminUsername, role: "admin" }
        });
      } else {
        res.status(401).json({ 
          success: false, 
          message: "Invalid credentials" 
        });
      }
    } catch (error) {
      res.status(500).json({ message: "Login failed" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
