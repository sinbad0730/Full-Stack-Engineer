import { randomUUID } from "crypto";
import {
  type InsertUser, type InsertOverview, type InsertAbout,
  type InsertSkill, type InsertProject, type InsertContact
} from "@shared/mongodb-schema";

// Simple plain object types for in-memory storage
type User = InsertUser & { id: string };
type Overview = InsertOverview & { id: string; updatedAt: Date };
type About = InsertAbout & { id: string; updatedAt: Date };
type Skill = InsertSkill & { id: string; updatedAt: Date };
type Project = InsertProject & { id: string; createdAt: Date; updatedAt: Date };
type Contact = InsertContact & { id: string; isRead: boolean; telegramSent: boolean; createdAt: Date };

// Interface for storage operations  
export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(insertUser: InsertUser): Promise<User>;

  // Overview section
  getOverview(): Promise<Overview | undefined>;
  updateOverview(insertOverview: InsertOverview): Promise<Overview>;

  // About section
  getAbout(): Promise<About | undefined>;
  updateAbout(insertAbout: InsertAbout): Promise<About>;

  // Skills
  getSkills(): Promise<Skill[]>;
  getSkill(id: string): Promise<Skill | undefined>;
  createSkill(insertSkill: InsertSkill): Promise<Skill>;
  updateSkill(id: string, updateData: Partial<InsertSkill>): Promise<Skill | undefined>;
  deleteSkill(id: string): Promise<boolean>;
  updateSkillsOrder(skills: { id: string; order: string }[]): Promise<void>;

  // Projects
  getProjects(): Promise<Project[]>;
  getProject(id: string): Promise<Project | undefined>;
  getFeaturedProjects(): Promise<Project[]>;
  createProject(insertProject: InsertProject): Promise<Project>;
  updateProject(id: string, updateData: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: string): Promise<boolean>;
  updateProjectsOrder(projects: { id: string; order: string }[]): Promise<void>;

  // Contact messages
  getContacts(): Promise<Contact[]>;
  getContact(id: string): Promise<Contact | undefined>;
  createContact(insertContact: InsertContact): Promise<Contact>;
  markContactAsRead(id: string): Promise<Contact | undefined>;
  markTelegramSent(id: string): Promise<Contact | undefined>;
}

// In-memory storage with sample space portfolio data
export class MemStorage implements IStorage {
  private users = new Map<string, User>();
  private overview: Overview | undefined;
  private about: About | undefined;
  private skills = new Map<string, Skill>();
  private projects = new Map<string, Project>();
  private contacts = new Map<string, Contact>();

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Create admin user
    const adminId = randomUUID();
    const adminUser: User = {
      id: adminId,
      username: "admin",
      password: "admin123", // In production, this should be hashed
      name: "Space Portfolio Admin",
      email: "admin@spaceportfolio.dev",
      role: "admin"
    };
    this.users.set(adminId, adminUser);

    // Seed overview
    this.overview = {
      id: randomUUID(),
      title: "Space Developer",
      subtitle: "Coding from the cosmos",
      description: "Building innovative web applications with modern technologies while exploring the infinite possibilities of the digital universe.",
      expertise: ["React", "Node.js", "TypeScript", "MongoDB", "Space Technology"],
      backgroundImage: "/space-bg.jpg",
      isActive: true,
      updatedAt: new Date()
    };

    // Seed about section
    this.about = {
      id: randomUUID(),
      title: "About the Space Developer",
      content: "With over 5 years of experience in web development, I specialize in creating stellar applications that push the boundaries of what's possible. My journey began with a fascination for both space exploration and coding, leading me to combine these passions into a unique development approach.",
      experiences: [
        "Senior Full-Stack Developer at Stellar Systems",
        "Lead Frontend Engineer at Cosmic Solutions", 
        "Freelance Space-Tech Consultant",
        "Contributor to Open Source Space Projects"
      ],
      achievements: [
        "Built 50+ web applications",
        "Mentored 20+ junior developers", 
        "Speaker at 10+ tech conferences",
        "Winner of Space Hackathon 2023"
      ],
      profileImage: "/profile.jpg",
      isActive: true,
      updatedAt: new Date()
    };

    // Sample skills
    const skillsData = [
      { category: "Frontend", name: "React", level: "Expert" as const, description: "Building dynamic user interfaces", order: "0" },
      { category: "Frontend", name: "TypeScript", level: "Advanced" as const, description: "Type-safe JavaScript development", order: "1" },
      { category: "Frontend", name: "Tailwind CSS", level: "Advanced" as const, description: "Utility-first CSS framework", order: "2" },
      { category: "Backend", name: "Node.js", level: "Expert" as const, description: "Server-side JavaScript runtime", order: "3" },
      { category: "Backend", name: "Express.js", level: "Advanced" as const, description: "Web application framework", order: "4" },
      { category: "Database", name: "MongoDB", level: "Advanced" as const, description: "NoSQL database solutions", order: "5" },
      { category: "Database", name: "PostgreSQL", level: "Intermediate" as const, description: "Relational database management", order: "6" },
      { category: "DevOps", name: "Docker", level: "Intermediate" as const, description: "Containerization technology", order: "7" }
    ];

    skillsData.forEach(skill => {
      const id = randomUUID();
      this.skills.set(id, {
        id,
        ...skill,
        isActive: true,
        updatedAt: new Date()
      });
    });

    // Sample projects
    const projectsData = [
      {
        title: "Space Portfolio CMS",
        description: "A comprehensive portfolio website with content management system, featuring space-themed design and drag-and-drop functionality.",
        technologies: ["React", "TypeScript", "Tailwind CSS", "MongoDB", "Express.js"],
        images: [],
        githubUrl: "https://github.com/space-dev/portfolio-cms",
        websiteUrl: "https://space-portfolio.dev",
        featured: true,
        order: "0"
      },
      {
        title: "Cosmic Task Manager", 
        description: "A stellar task management application with real-time collaboration and space-themed animations.",
        technologies: ["React", "Socket.io", "Node.js", "PostgreSQL"],
        images: [],
        githubUrl: "https://github.com/space-dev/cosmic-tasks",
        websiteUrl: "https://cosmic-tasks.dev",
        featured: true,
        order: "1"
      },
      {
        title: "Stellar E-commerce",
        description: "An out-of-this-world e-commerce platform with advanced filtering and payment integration.",
        technologies: ["Next.js", "Stripe", "MongoDB", "Vercel"],
        images: [],
        githubUrl: "https://github.com/space-dev/stellar-shop",
        websiteUrl: "https://stellar-shop.dev", 
        featured: false,
        order: "2"
      }
    ];

    projectsData.forEach(project => {
      const id = randomUUID();
      this.projects.set(id, {
        id,
        ...project,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    });
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const users = Array.from(this.users.values());
    for (const user of users) {
      if (user.username === username) {
        return user;
      }
    }
    return undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = {
      id,
      ...insertUser
    };
    this.users.set(id, user);
    return user;
  }

  // Overview section
  async getOverview(): Promise<Overview | undefined> {
    return this.overview;
  }

  async updateOverview(insertOverview: InsertOverview): Promise<Overview> {
    const updated: Overview = {
      id: this.overview?.id || randomUUID(),
      ...insertOverview,
      updatedAt: new Date()
    };
    this.overview = updated;
    return updated;
  }

  // About section
  async getAbout(): Promise<About | undefined> {
    return this.about;
  }

  async updateAbout(insertAbout: InsertAbout): Promise<About> {
    const updated: About = {
      id: this.about?.id || randomUUID(),
      ...insertAbout,
      updatedAt: new Date()
    };
    this.about = updated;
    return updated;
  }

  // Skills
  async getSkills(): Promise<Skill[]> {
    return Array.from(this.skills.values()).sort((a, b) => a.order.localeCompare(b.order));
  }

  async getSkill(id: string): Promise<Skill | undefined> {
    return this.skills.get(id);
  }

  async createSkill(insertSkill: InsertSkill): Promise<Skill> {
    const id = randomUUID();
    const skill: Skill = {
      id,
      ...insertSkill,
      updatedAt: new Date()
    };
    this.skills.set(id, skill);
    return skill;
  }

  async updateSkill(id: string, updateData: Partial<InsertSkill>): Promise<Skill | undefined> {
    const skill = this.skills.get(id);
    if (!skill) return undefined;

    const updated: Skill = {
      ...skill,
      ...updateData,
      updatedAt: new Date()
    };
    this.skills.set(id, updated);
    return updated;
  }

  async deleteSkill(id: string): Promise<boolean> {
    return this.skills.delete(id);
  }

  async updateSkillsOrder(skillsOrder: { id: string; order: string }[]): Promise<void> {
    for (const skillUpdate of skillsOrder) {
      const skill = this.skills.get(skillUpdate.id);
      if (skill) {
        skill.order = skillUpdate.order;
        skill.updatedAt = new Date();
      }
    }
  }

  // Projects
  async getProjects(): Promise<Project[]> {
    return Array.from(this.projects.values()).sort((a, b) => a.order.localeCompare(b.order));
  }

  async getProject(id: string): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async getFeaturedProjects(): Promise<Project[]> {
    return Array.from(this.projects.values())
      .filter(project => project.featured && project.isActive)
      .sort((a, b) => a.order.localeCompare(b.order));
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = randomUUID();
    const project: Project = {
      id,
      ...insertProject,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.projects.set(id, project);
    return project;
  }

  async updateProject(id: string, updateData: Partial<InsertProject>): Promise<Project | undefined> {
    const project = this.projects.get(id);
    if (!project) return undefined;

    const updated: Project = {
      ...project,
      ...updateData,
      updatedAt: new Date()
    };
    this.projects.set(id, updated);
    return updated;
  }

  async deleteProject(id: string): Promise<boolean> {
    return this.projects.delete(id);
  }

  async updateProjectsOrder(projectsOrder: { id: string; order: string }[]): Promise<void> {
    for (const projectUpdate of projectsOrder) {
      const project = this.projects.get(projectUpdate.id);
      if (project) {
        project.order = projectUpdate.order;
        project.updatedAt = new Date();
      }
    }
  }

  // Contact messages
  async getContacts(): Promise<Contact[]> {
    return Array.from(this.contacts.values()).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getContact(id: string): Promise<Contact | undefined> {
    return this.contacts.get(id);
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    const id = randomUUID();
    const contact: Contact = {
      id,
      ...insertContact,
      isRead: false,
      telegramSent: false,
      createdAt: new Date()
    };
    this.contacts.set(id, contact);
    return contact;
  }

  async markContactAsRead(id: string): Promise<Contact | undefined> {
    const contact = this.contacts.get(id);
    if (!contact) return undefined;

    const updatedContact = { ...contact, isRead: true };
    this.contacts.set(id, updatedContact);
    return updatedContact;
  }

  async markTelegramSent(id: string): Promise<Contact | undefined> {
    const contact = this.contacts.get(id);
    if (!contact) return undefined;

    const updatedContact = { ...contact, telegramSent: true };
    this.contacts.set(id, updatedContact);
    return updatedContact;
  }
}

export const storage = new MemStorage();