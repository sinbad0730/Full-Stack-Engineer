import {
  User, Overview, About, Skill, Project, Contact,
  type InsertUser, type InsertOverview, type InsertAbout,
  type InsertSkill, type InsertProject, type InsertContact,
  type IUser, type IOverview, type IAbout,
  type ISkill, type IProject, type IContact
} from "@shared/mongodb-schema";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: string): Promise<IUser | undefined>;
  getUserByUsername(username: string): Promise<IUser | undefined>;
  createUser(insertUser: InsertUser): Promise<IUser>;

  // Overview section
  getOverview(): Promise<IOverview | undefined>;
  updateOverview(insertOverview: InsertOverview): Promise<IOverview>;

  // About section
  getAbout(): Promise<IAbout | undefined>;
  updateAbout(insertAbout: InsertAbout): Promise<IAbout>;

  // Skills
  getSkills(): Promise<ISkill[]>;
  getSkill(id: string): Promise<ISkill | undefined>;
  createSkill(insertSkill: InsertSkill): Promise<ISkill>;
  updateSkill(id: string, updateData: Partial<InsertSkill>): Promise<ISkill | undefined>;
  deleteSkill(id: string): Promise<boolean>;
  updateSkillsOrder(skills: { id: string; order: string }[]): Promise<void>;

  // Projects
  getProjects(): Promise<IProject[]>;
  getProject(id: string): Promise<IProject | undefined>;
  getFeaturedProjects(): Promise<IProject[]>;
  createProject(insertProject: InsertProject): Promise<IProject>;
  updateProject(id: string, updateData: Partial<InsertProject>): Promise<IProject | undefined>;
  deleteProject(id: string): Promise<boolean>;
  updateProjectsOrder(projects: { id: string; order: string }[]): Promise<void>;

  // Contact messages
  getContacts(): Promise<IContact[]>;
  getContact(id: string): Promise<IContact | undefined>;
  createContact(insertContact: InsertContact): Promise<IContact>;
  markContactAsRead(id: string): Promise<IContact | undefined>;
  markTelegramSent(id: string): Promise<IContact | undefined>;
}

export class MongoDBStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<IUser | undefined> {
    const user = await User.findById(id);
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<IUser | undefined> {
    const user = await User.findOne({ username });
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<IUser> {
    const user = new User(insertUser);
    return await user.save();
  }

  // Overview section
  async getOverview(): Promise<IOverview | undefined> {
    const overview = await Overview.findOne({ isActive: true });
    return overview || undefined;
  }

  async updateOverview(insertOverview: InsertOverview): Promise<IOverview> {
    // Check if overview exists
    let overview = await Overview.findOne({ isActive: true });
    
    if (overview) {
      // Update existing
      Object.assign(overview, { ...insertOverview, updatedAt: new Date() });
      return await overview.save();
    } else {
      // Create new
      overview = new Overview({ ...insertOverview, updatedAt: new Date() });
      return await overview.save();
    }
  }

  // About section
  async getAbout(): Promise<IAbout | undefined> {
    const about = await About.findOne({ isActive: true });
    return about || undefined;
  }

  async updateAbout(insertAbout: InsertAbout): Promise<IAbout> {
    // Check if about exists
    let about = await About.findOne({ isActive: true });
    
    if (about) {
      // Update existing
      Object.assign(about, { ...insertAbout, updatedAt: new Date() });
      return await about.save();
    } else {
      // Create new
      about = new About({ ...insertAbout, updatedAt: new Date() });
      return await about.save();
    }
  }

  // Skills
  async getSkills(): Promise<ISkill[]> {
    return await Skill.find({ isActive: true }).sort({ order: 1 });
  }

  async getSkill(id: string): Promise<ISkill | undefined> {
    const skill = await Skill.findById(id);
    return skill || undefined;
  }

  async createSkill(insertSkill: InsertSkill): Promise<ISkill> {
    const skill = new Skill({ ...insertSkill, updatedAt: new Date() });
    return await skill.save();
  }

  async updateSkill(id: string, updateData: Partial<InsertSkill>): Promise<ISkill | undefined> {
    const skill = await Skill.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true }
    );
    return skill || undefined;
  }

  async deleteSkill(id: string): Promise<boolean> {
    const result = await Skill.findByIdAndDelete(id);
    return !!result;
  }

  async updateSkillsOrder(skills: { id: string; order: string }[]): Promise<void> {
    const promises = skills.map(({ id, order }) =>
      Skill.findByIdAndUpdate(id, { order, updatedAt: new Date() })
    );
    await Promise.all(promises);
  }

  // Projects
  async getProjects(): Promise<IProject[]> {
    return await Project.find({ isActive: true }).sort({ order: 1 });
  }

  async getProject(id: string): Promise<IProject | undefined> {
    const project = await Project.findById(id);
    return project || undefined;
  }

  async getFeaturedProjects(): Promise<IProject[]> {
    return await Project.find({ isActive: true, featured: true }).sort({ order: 1 });
  }

  async createProject(insertProject: InsertProject): Promise<IProject> {
    const project = new Project({
      ...insertProject,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return await project.save();
  }

  async updateProject(id: string, updateData: Partial<InsertProject>): Promise<IProject | undefined> {
    const project = await Project.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true }
    );
    return project || undefined;
  }

  async deleteProject(id: string): Promise<boolean> {
    const result = await Project.findByIdAndDelete(id);
    return !!result;
  }

  async updateProjectsOrder(projects: { id: string; order: string }[]): Promise<void> {
    const promises = projects.map(({ id, order }) =>
      Project.findByIdAndUpdate(id, { order, updatedAt: new Date() })
    );
    await Promise.all(promises);
  }

  // Contact messages
  async getContacts(): Promise<IContact[]> {
    return await Contact.find().sort({ createdAt: -1 });
  }

  async getContact(id: string): Promise<IContact | undefined> {
    const contact = await Contact.findById(id);
    return contact || undefined;
  }

  async createContact(insertContact: InsertContact): Promise<IContact> {
    const contact = new Contact({
      ...insertContact,
      isRead: false,
      telegramSent: false,
      createdAt: new Date()
    });
    return await contact.save();
  }

  async markContactAsRead(id: string): Promise<IContact | undefined> {
    const contact = await Contact.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true }
    );
    return contact || undefined;
  }

  async markTelegramSent(id: string): Promise<IContact | undefined> {
    const contact = await Contact.findByIdAndUpdate(
      id,
      { telegramSent: true },
      { new: true }
    );
    return contact || undefined;
  }
}

export const storage = new MongoDBStorage();