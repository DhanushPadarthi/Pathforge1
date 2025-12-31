# Product Requirements Document (PRD)

## Product Name: PathForge
**Tagline:** AI-forged learning roadmaps to your career

---

## 1. Purpose of the Product
The purpose of PathForge is to help students and fresh graduates build career-ready skills through a personalized, AI-driven learning roadmap, tailored to their current skill level, learning time, and career goal.

The platform supports both students **with a resume** and **without a resume**, ensuring accessibility for all learners.

---

## 2. Problem Statement
Many students know their career goals but lack a clear and personalized path to achieve them. Existing platforms provide generic learning content, ignore a student's current skills, and fail to track actual progress. This leads to confusion, inefficiency, and incomplete career preparation.

There is a need for a platform that **understands a learner's background**, identifies skill gaps, provides relevant resources, and tracks progress in a structured manner.

---

## 3. Solution Overview
PathForge is an AI-powered learning platform that:
- Analyzes a user's **resume** or **basic inputs**
- Identifies skill gaps for a chosen career role
- Generates a **deadline-based learning roadmap**
- Recommends curated learning resources
- Tracks progress visually
- Allows users to skip known topics
- Summarizes completed learning modules

---

## 4. Target Users

### Primary Users
- College students
- Fresh graduates

### Secondary Users
- Platform administrators

---

## 5. User Entry Flow

### 5.1 Student With Resume
1. Upload resume (PDF/DOCX)
2. AI extracts skills and experience
3. Personalized roadmap generated

### 5.2 Student Without Resume
1. Answer limited basic questions
2. AI builds a base skill profile
3. Personalized roadmap generated

---

## 6. Core Objectives (5-Day Scope)
1. Provide personalized learning roadmaps
2. Support users with or without resumes
3. Identify skill gaps using AI
4. Deliver time-based learning resources
5. Track learning progress clearly

---

## 7. User Roles

### 7.1 Student
- Upload resume or answer questions
- Select career goal and learning time
- Follow roadmap
- Complete or skip resources
- Track progress

### 7.2 Admin
- Manage users
- Manage career roles
- Manage learning resources

---

## 8. Functional Requirements (CORE ONLY)

### 8.1 Authentication
- Secure login (Email / Google)
- Role-based access (Student / Admin)

### 8.2 Resume Upload & Processing
- Upload resume (PDF/DOCX)
- Backend extracts resume text using Python
- AI extracts skills and experience

### 8.3 Skill Gap Analysis
- Compare current skills with required role skills
- Identify missing skills using AI

### 8.4 Deadline-Based Roadmap Generation
- Generate step-by-step roadmap
- Roadmap aligned with user's learning time
- Clear milestones

### 8.5 Resource Recommendation
- AI recommends learning resources (external links)
- Each resource includes:
  - Title
  - Link
  - Estimated learning time

### 8.6 Learning Flow
- Resources unlocked sequentially
- User actions:
  - ✅ Complete resource
  - ⏭️ Skip resource (already known)

### 8.7 Progress Tracking
- Visual progress bar
- Progress updates in real time
- Completion percentage shown

### 8.8 Completed Module Summary
- Summary generated after each module
- Shows:
  - Skills covered
  - Time spent
  - Completion status

---

## 9. Admin Panel (Simple)
- View users
- Add/edit career roles
- Add/edit learning resources
- View basic progress statistics

---

## 10. Non-Functional Requirements
- Secure data handling
- Scalable architecture
- Responsive UI
- Fast response time

---

## 11. Technology Stack (FINAL)

### Frontend
- React.js / Next.js
- CSS / Bootstrap
- Hosting: Vercel

### Authentication
- Firebase Authentication

### Backend
- Python – FastAPI
- Resume extraction libraries

### Database
- MongoDB Atlas

### File Storage
- Firebase Storage

### AI
- ChatGPT API

---

## 12. System Architecture Summary
PathForge uses a **hybrid architecture** where a React frontend communicates with a Python FastAPI backend. Firebase handles authentication and file storage, MongoDB stores application data, and ChatGPT API provides AI-driven intelligence for skill analysis, roadmap creation, and resource recommendations.

---

## 13. User Flow Summary
User logs in → uploads resume or answers questions → AI analyzes skills → skill gaps identified → deadline-based roadmap generated → resources unlocked sequentially → user completes or skips → progress tracked → module summary shown.

---

## 14. Advanced Features (Future Scope)
The following features are planned after the core system is stable:

### AI Mentor Chatbot
- Acts as a virtual mentor
- Keeps users on track and motivated

### AI Project Generator
- Generates project ideas aligned with roadmap
- Helps build resume-ready projects

### Trending Skills Analyzer
- Shows in-demand skills for selected career role

*These features are intentionally kept as advanced enhancements to ensure quality and feasibility within the initial development timeline.*

---

## 15. Success Metrics
- User onboarding completion rate
- Roadmap completion rate
- Learning consistency
- User feedback

---

## 16. Final Summary
PathForge is a focused, AI-powered learning platform that delivers **personalized, deadline-based career roadmaps** with progress tracking and intelligent resource recommendations. The initial version prioritizes core learning outcomes, with advanced AI features planned for future expansion.
