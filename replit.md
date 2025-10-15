# Space Portfolio - Personal Portfolio Website with CMS

## Overview

Space Portfolio is a space-themed personal portfolio website featuring a "developer from space" concept with dark cosmic animations, starfield backgrounds, and comprehensive content management system. The application showcases projects, skills, experience, and includes a contact form with admin CMS panel for content management. Built with modern TypeScript stack using React for the frontend and Express.js for the backend.

## User Preferences

Preferred communication style: Simple, everyday language.
Color preferences: Dark blue theme instead of purple colors.
UI preferences: Darker menu buttons with borders for better visibility.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom space-themed color scheme
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for client-side routing
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Schema**: Centralized schema definitions in `/shared/schema.ts`
- **API Pattern**: RESTful API with JSON responses
- **Error Handling**: Centralized error handling middleware

### Database Design
The application uses a relational database structure with the following main entities:
- **Users**: Admin authentication for CMS access
- **Overview**: Hero section content with title, subtitle, description, and expertise
- **About**: About section with content, experiences, and achievements
- **Skills**: Technical skills with categories, levels, and descriptions
- **Projects**: Portfolio projects with technologies, links, and featured status
- **Contacts**: Contact form messages with read status and Telegram integration

## Key Components

### Authentication System
- Environment-based admin authentication using ADMIN_USERNAME and ADMIN_PASSWORD
- Secure credential management via Replit Secrets
- Role-based access control for admin panel
- Simple login system with environment variable integration

### Time Tracking Engine
- Real-time timer functionality with start/stop capabilities
- Manual time entry creation and editing
- Running timer detection and display
- Time aggregation and reporting

### Client & Project Management
- Client CRUD operations with company details and hourly rates
- Project organization under clients with status tracking
- Project-based time entry filtering

### Invoice Generation
- Automated invoice creation from time entries
- Date range-based billing
- Tax calculation and total computation
- Invoice numbering system

### Internationalization
- Multi-language support framework
- Translation key management
- Language switching capability

## Data Flow

1. **Time Tracking Flow**:
   - User starts timer for a specific project
   - System tracks elapsed time in real-time
   - Time entries are saved with project association
   - Running timers persist across sessions

2. **Invoice Generation Flow**:
   - User selects client and date range
   - System aggregates time entries for the period
   - Calculations include hours × hourly rate + tax
   - Invoice is generated with unique number

3. **Client Data Flow**:
   - Client information stored with hourly rates
   - Projects linked to clients for organization
   - Time entries linked to projects for billing

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL connection
- **drizzle-orm**: Type-safe SQL query builder
- **@tanstack/react-query**: Server state management
- **wouter**: Lightweight React router
- **react-hook-form**: Form handling
- **zod**: Schema validation

### UI Dependencies
- **@radix-ui/***: Accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **lucide-react**: Icon library

### Development Tools
- **vite**: Fast build tool and dev server
- **typescript**: Type safety
- **drizzle-kit**: Database migration tool
- **esbuild**: JavaScript bundler for production

## Deployment Strategy

### Development Environment
- Vite dev server for frontend with HMR
- Express server with TypeScript execution via tsx
- Database migrations handled by Drizzle Kit
- Environment variables for database configuration

### Production Build
1. Frontend built with Vite to `dist/public`
2. Backend bundled with esbuild to `dist/index.js`
3. Static files served by Express in production
4. Database schema pushed via `drizzle-kit push`

### Database Strategy
- PostgreSQL hosted on Neon Database
- Schema-first approach with Drizzle ORM
- Migrations stored in `/migrations` directory
- Connection pooling handled by Neon's serverless architecture

### Environment Configuration
- `DATABASE_URL` required for database connection
- `NODE_ENV` for environment detection
- Development and production build scripts configured
- TypeScript paths configured for clean imports