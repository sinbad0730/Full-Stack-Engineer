import { 
  type User, type InsertUser, 
  type Overview, type InsertOverview,
  type About, type InsertAbout,
  type Skill, type InsertSkill,
  type Project, type InsertProject,
  type Contact, type InsertContact
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users (for CMS admin)
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Overview section
  getOverview(): Promise<Overview | undefined>;
  updateOverview(overview: InsertOverview): Promise<Overview>;

  // About section
  getAbout(): Promise<About | undefined>;
  updateAbout(about: InsertAbout): Promise<About>;

  // Skills
  getSkills(): Promise<Skill[]>;
  getSkill(id: string): Promise<Skill | undefined>;
  createSkill(skill: InsertSkill): Promise<Skill>;
  updateSkill(id: string, skill: Partial<InsertSkill>): Promise<Skill | undefined>;
  deleteSkill(id: string): Promise<boolean>;
  updateSkillsOrder(skills: { id: string; order: string }[]): Promise<void>;

  // Projects
  getProjects(): Promise<Project[]>;
  getProject(id: string): Promise<Project | undefined>;
  getFeaturedProjects(): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: string, project: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: string): Promise<boolean>;
  updateProjectsOrder(projects: { id: string; order: string }[]): Promise<void>;

  // Contact messages
  getContacts(): Promise<Contact[]>;
  getContact(id: string): Promise<Contact | undefined>;
  createContact(contact: InsertContact): Promise<Contact>;
  markContactAsRead(id: string): Promise<Contact | undefined>;
  markTelegramSent(id: string): Promise<Contact | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private overview: Overview | undefined;
  private about: About | undefined;
  private skills: Map<string, Skill>;
  private projects: Map<string, Project>;
  private contacts: Map<string, Contact>;

  constructor() {
    this.users = new Map();
    this.skills = new Map();
    this.projects = new Map();
    this.contacts = new Map();
    this.seedData();
  }

  private seedData() {
    // Create admin user from environment variables
    const adminUsername = process.env.ADMIN_USERNAME || "admin";
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
    
    const adminUser: User = {
      id: randomUUID(),
      username: adminUsername,
      password: adminPassword, // In production, this should be hashed
      name: "Portfolio Admin",
      email: "admin@portfolio.com", 
      role: "admin",
    };
    this.users.set(adminUser.id, adminUser);

    // Create default overview content
    this.overview = {
      id: randomUUID(),
      title: "Full Stack Developer from Space",
      subtitle: "Bringing Cosmic Solutions to Earth",
      description: "I'm a passionate full-stack developer who creates stellar web applications with cutting-edge technologies. From concept to deployment, I deliver solutions that are out of this world.",
      expertise: ["React.js", "Node.js", "TypeScript", "MongoDB", "AWS", "Docker"],
      backgroundImage: null,
      isActive: true,
      updatedAt: new Date(),
    };

    // Create default about content
    this.about = {
      id: randomUUID(),
      title: "About Me",
      content: "With over 5 years of experience in full-stack development, I specialize in creating modern, scalable web applications. My journey began with a fascination for how things work, leading me to master both frontend and backend technologies.",
      experiences: [
        "Senior Full Stack Developer at TechCorp (2022-Present)",
        "Frontend Developer at StartupXYZ (2020-2022)",
        "Junior Developer at WebAgency (2019-2020)",
        "Freelance Web Developer (2018-2019)"
      ],
      achievements: [
        "Built 50+ production applications",
        "Led development teams of 5+ engineers",
        "Mentored 20+ junior developers",
        "Contributor to open source projects"
      ],
      profileImage: null,
      isActive: true,
      updatedAt: new Date(),
    };

    // Create sample skills
    const skillsData = [
      { category: "Frontend", name: "React.js", level: "Expert", icon: "react", description: "Modern React with hooks and context" },
      { category: "Frontend", name: "Next.js", level: "Advanced", icon: "nextjs", description: "Server-side rendering and static generation" },
      { category: "Frontend", name: "TypeScript", level: "Advanced", icon: "typescript", description: "Type-safe JavaScript development" },
      { category: "Frontend", name: "Tailwind CSS", level: "Expert", icon: "tailwind", description: "Utility-first CSS framework" },
      { category: "Backend", name: "Node.js", level: "Expert", icon: "nodejs", description: "Server-side JavaScript runtime" },
      { category: "Backend", name: "Express.js", level: "Advanced", icon: "express", description: "Fast, unopinionated web framework" },
      { category: "Backend", name: "Python", level: "Intermediate", icon: "python", description: "Versatile programming language" },
      { category: "Database", name: "MongoDB", level: "Advanced", icon: "mongodb", description: "NoSQL document database" },
      { category: "Database", name: "PostgreSQL", level: "Advanced", icon: "postgresql", description: "Powerful relational database" },
      { category: "DevOps", name: "Docker", level: "Intermediate", icon: "docker", description: "Containerization platform" },
      { category: "DevOps", name: "AWS", level: "Intermediate", icon: "aws", description: "Cloud computing services" },
      { category: "DevOps", name: "Git", level: "Expert", icon: "git", description: "Version control system" }
    ];

    skillsData.forEach((skill, index) => {
      const skillEntity: Skill = {
        id: randomUUID(),
        category: skill.category,
        name: skill.name,
        level: skill.level,
        icon: skill.icon,
        description: skill.description,
        isActive: true,
        order: index.toString(),
        updatedAt: new Date(),
      };
      this.skills.set(skillEntity.id, skillEntity);
    });

    // Create sample projects
    const projectsData = [
      {
        title: "E-Commerce Platform",
        description: "Full-featured e-commerce platform with React, Node.js, and MongoDB. Features include user authentication, product catalog, shopping cart, and payment integration.",
        technologies: ["React", "Node.js", "MongoDB", "Stripe", "Tailwind CSS"],
        images: ["/api/placeholder/600/400"],
        githubUrl: "https://github.com/example/ecommerce",
        websiteUrl: "https://ecommerce-demo.com",
        featured: true,
        order: "1"
      },
      {
        title: "Task Management App",
        description: "Collaborative task management application with real-time updates, drag-and-drop functionality, and team collaboration features.",
        technologies: ["Next.js", "TypeScript", "PostgreSQL", "Socket.io", "Prisma"],
        images: ["/api/placeholder/600/400"],
        githubUrl: "https://github.com/example/taskmanager",
        websiteUrl: null,
        featured: true,
        order: "2"
      },
      {
        title: "Weather Dashboard",
        description: "Beautiful weather dashboard with interactive maps, forecasts, and location-based weather data visualization.",
        technologies: ["Vue.js", "Express", "OpenWeather API", "Chart.js"],
        images: ["/api/placeholder/600/400"],
        githubUrl: null,
        websiteUrl: "https://weather-dashboard-demo.com",
        featured: false,
        order: "3"
      }
    ];

    projectsData.forEach((project, index) => {
      const projectEntity: Project = {
        id: randomUUID(),
        title: project.title,
        description: project.description,
        technologies: project.technologies,
        images: project.images,
        githubUrl: project.githubUrl,
        websiteUrl: project.websiteUrl,
        featured: project.featured,
        isActive: true,
        order: project.order,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.projects.set(projectEntity.id, projectEntity);
    });
  }

  // Users (for CMS admin)
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id, role: insertUser.role || "admin" };
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
      backgroundImage: insertOverview.backgroundImage || null,
      isActive: insertOverview.isActive ?? true,
      updatedAt: new Date(),
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
      profileImage: insertAbout.profileImage || null,
      isActive: insertAbout.isActive ?? true,
      updatedAt: new Date(),
    };
    this.about = updated;
    return updated;
  }

  // Skills
  async getSkills(): Promise<Skill[]> {
    return Array.from(this.skills.values()).sort((a, b) => 
      parseInt(a.order || "0") - parseInt(b.order || "0")
    );
  }

  async getSkill(id: string): Promise<Skill | undefined> {
    return this.skills.get(id);
  }

  async createSkill(insertSkill: InsertSkill): Promise<Skill> {
    const id = randomUUID();
    const skill: Skill = { 
      ...insertSkill, 
      id,
      order: insertSkill.order || "0",
      description: insertSkill.description || null,
      isActive: insertSkill.isActive ?? true,
      icon: insertSkill.icon || null,
      updatedAt: new Date()
    };
    this.skills.set(id, skill);
    return skill;
  }

  async updateSkill(id: string, updateData: Partial<InsertSkill>): Promise<Skill | undefined> {
    const skill = this.skills.get(id);
    if (!skill) return undefined;

    const updatedSkill = { 
      ...skill, 
      ...updateData, 
      updatedAt: new Date() 
    };
    this.skills.set(id, updatedSkill);
    return updatedSkill;
  }

  async deleteSkill(id: string): Promise<boolean> {
    return this.skills.delete(id);
  }

  async updateSkillsOrder(skills: { id: string; order: string }[]): Promise<void> {
    for (const { id, order } of skills) {
      const skill = this.skills.get(id);
      if (skill) {
        const updatedSkill = { ...skill, order, updatedAt: new Date() };
        this.skills.set(id, updatedSkill);
      }
    }
  }

  // Projects
  async getProjects(): Promise<Project[]> {
    return Array.from(this.projects.values())
      .filter(project => project.isActive)
      .sort((a, b) => parseInt(a.order || "0") - parseInt(b.order || "0"));
  }

  async getProject(id: string): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async getFeaturedProjects(): Promise<Project[]> {
    return Array.from(this.projects.values())
      .filter(project => project.isActive && project.featured)
      .sort((a, b) => parseInt(a.order || "0") - parseInt(b.order || "0"));
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = randomUUID();
    const project: Project = { 
      ...insertProject, 
      id,
      order: insertProject.order || "0",
      isActive: insertProject.isActive ?? true,
      githubUrl: insertProject.githubUrl || null,
      websiteUrl: insertProject.websiteUrl || null,
      featured: insertProject.featured ?? false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.projects.set(id, project);
    return project;
  }

  async updateProject(id: string, updateData: Partial<InsertProject>): Promise<Project | undefined> {
    const project = this.projects.get(id);
    if (!project) return undefined;

    const updatedProject = { 
      ...project, 
      ...updateData, 
      updatedAt: new Date() 
    };
    this.projects.set(id, updatedProject);
    return updatedProject;
  }

  async deleteProject(id: string): Promise<boolean> {
    return this.projects.delete(id);
  }

  async updateProjectsOrder(projects: { id: string; order: string }[]): Promise<void> {
    for (const { id, order } of projects) {
      const project = this.projects.get(id);
      if (project) {
        const updatedProject = { ...project, order, updatedAt: new Date() };
        this.projects.set(id, updatedProject);
      }
    }
  }

  // Contact messages
  async getContacts(): Promise<Contact[]> {
    return Array.from(this.contacts.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getContact(id: string): Promise<Contact | undefined> {
    return this.contacts.get(id);
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    const id = randomUUID();
    const contact: Contact = { 
      ...insertContact, 
      id, 
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
