import mongoose, { Schema, Document } from 'mongoose';
import { z } from "zod";

// Type definitions
export interface IUser extends Document {
  username: string;
  password: string;
  name: string;
  email: string;
  role: string;
}

export interface IOverview extends Document {
  title: string;
  subtitle: string;
  description: string;
  expertise: string[];
  backgroundImage?: string;
  isActive: boolean;
  updatedAt: Date;
}

export interface IAbout extends Document {
  title: string;
  content: string;
  experiences: string[];
  achievements: string[];
  profileImage?: string;
  isActive: boolean;
  updatedAt: Date;
}

export interface ISkill extends Document {
  category: string;
  name: string;
  level: string;
  icon?: string;
  description?: string;
  isActive: boolean;
  order: string;
  updatedAt: Date;
}

export interface IProject extends Document {
  title: string;
  description: string;
  technologies: string[];
  images: string[];
  githubUrl?: string;
  websiteUrl?: string;
  featured: boolean;
  isActive: boolean;
  order: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IContact extends Document {
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  telegramSent: boolean;
  createdAt: Date;
}

// Mongoose Schemas
const UserSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, required: true, default: 'admin' }
});

const OverviewSchema = new Schema<IOverview>({
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  description: { type: String, required: true },
  expertise: [{ type: String, required: true }],
  backgroundImage: { type: String },
  isActive: { type: Boolean, default: true },
  updatedAt: { type: Date, default: Date.now }
});

const AboutSchema = new Schema<IAbout>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  experiences: [{ type: String, required: true }],
  achievements: [{ type: String, required: true }],
  profileImage: { type: String },
  isActive: { type: Boolean, default: true },
  updatedAt: { type: Date, default: Date.now }
});

const SkillSchema = new Schema<ISkill>({
  category: { type: String, required: true },
  name: { type: String, required: true },
  level: { type: String, required: true },
  icon: { type: String },
  description: { type: String },
  isActive: { type: Boolean, default: true },
  order: { type: String, default: '0' },
  updatedAt: { type: Date, default: Date.now }
});

const ProjectSchema = new Schema<IProject>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  technologies: [{ type: String, required: true }],
  images: [{ type: String, required: true }],
  githubUrl: { type: String },
  websiteUrl: { type: String },
  featured: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  order: { type: String, default: '0' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const ContactSchema = new Schema<IContact>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  telegramSent: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

// Models
export const User = mongoose.model<IUser>('User', UserSchema);
export const Overview = mongoose.model<IOverview>('Overview', OverviewSchema);
export const About = mongoose.model<IAbout>('About', AboutSchema);
export const Skill = mongoose.model<ISkill>('Skill', SkillSchema);
export const Project = mongoose.model<IProject>('Project', ProjectSchema);
export const Contact = mongoose.model<IContact>('Contact', ContactSchema);

// Zod schemas for validation
export const insertUserSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(6),
  name: z.string().min(1),
  email: z.string().email(),
  role: z.string().default('admin')
});

export const insertOverviewSchema = z.object({
  title: z.string().min(1),
  subtitle: z.string().min(1),
  description: z.string().min(1),
  expertise: z.array(z.string()).min(1),
  backgroundImage: z.string().optional(),
  isActive: z.boolean().default(true)
});

export const insertAboutSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(10),
  experiences: z.array(z.string()).min(1),
  achievements: z.array(z.string()).min(1),
  profileImage: z.string().optional(),
  isActive: z.boolean().default(true)
});

export const insertSkillSchema = z.object({
  category: z.string().min(1),
  name: z.string().min(1),
  level: z.enum(['Beginner', 'Intermediate', 'Advanced', 'Expert']),
  icon: z.string().optional(),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
  order: z.string().default('0')
});

export const insertProjectSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(10),
  technologies: z.array(z.string()).min(1),
  images: z.array(z.string()).default([]),
  githubUrl: z.string().url().optional().or(z.literal('')),
  websiteUrl: z.string().url().optional().or(z.literal('')),
  featured: z.boolean().default(false),
  isActive: z.boolean().default(true),
  order: z.string().default('0')
});

export const insertContactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  subject: z.string().min(1),
  message: z.string().min(10)
});

// Type exports for use in the application
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertOverview = z.infer<typeof insertOverviewSchema>;
export type InsertAbout = z.infer<typeof insertAboutSchema>;
export type InsertSkill = z.infer<typeof insertSkillSchema>;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type InsertContact = z.infer<typeof insertContactSchema>;

// Type aliases for compatibility
export type { IUser as UserDocument };
export type { IOverview as OverviewDocument };
export type { IAbout as AboutDocument };
export type { ISkill as SkillDocument };
export type { IProject as ProjectDocument };
export type { IContact as ContactDocument };