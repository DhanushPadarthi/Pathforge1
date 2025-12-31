# PathForge - Complete User Flow Documentation

## 🎯 Overview
PathForge is an AI-powered learning platform that creates personalized roadmaps for students targeting specific career roles. It supports both users with and without resumes.

---

## 👥 User Personas

### 1. **Student WITH Resume**
- Has prior experience or education
- Can upload resume for skill extraction
- Gets personalized roadmap based on extracted skills

### 2. **Student WITHOUT Resume**
- Fresh beginner or career switcher
- Completes guided onboarding questionnaire
- Gets roadmap based on manually entered interests

---

## 🚀 Complete User Journey

### **Phase 1: Registration & Authentication**

#### Option A: Email/Password
1. User visits `/register`
2. Enters: Name, Email, Password
3. Creates account
4. Redirected to `/dashboard`

#### Option B: Google OAuth
1. User clicks "Sign in with Google"
2. Authenticates via Google
3. Auto-registered in system
4. Redirected to `/dashboard`

**Backend:** `POST /api/auth/register` or `POST /api/auth/verify`

---

### **Phase 2: Student Onboarding**

#### Path A: **User WITH Resume**

1. **Navigate to Profile** → `/profile`
2. **Upload Resume**
   - Accepts: PDF, DOCX
   - Click "Upload Resume" button
   - File sent to backend
3. **AI Processing**
   - Backend extracts text from resume
   - AI extracts: Skills, Experience Years, Education
   - Skills matched with database
4. **Skills Added to Profile**
   - Extracted skills saved as UserSkills
   - Proficiency set to "Intermediate"
5. **Set Career Goal**
   - Select target career role (e.g., "Full Stack Developer")
   - Set available hours per week
6. **Profile Complete** ✅

**Backend APIs:**
- `POST /api/users/{user_id}/upload-resume`
- `PUT /api/users/{user_id}` (update target role)

---

#### Path B: **User WITHOUT Resume**

1. **Navigate to Onboarding** → `/onboarding`
2. **Step 1: Basic Info**
   - Enter full name
   - Click "Next"
3. **Step 2: Career Goal**
   - Select target career role from dropdown
   - View role description
   - Click "Next"
4. **Step 3: Time Commitment**
   - Use slider to set available hours (1-40 hours/week)
   - See personalized tip based on hours
   - Click "Next"
5. **Step 4: Skills & Interests**
   - Add skills/interests one by one (e.g., "Python", "JavaScript")
   - Can skip if complete beginner
   - Click "Complete Setup"
6. **Profile Saved**
   - Skills added to profile with "Beginner" proficiency
   - Target role and hours saved
7. **Redirected to** → `/roadmap/new`

**Backend API:**
- `POST /api/users/{user_id}/complete-profile`

**Request Body:**
```json
{
  "name": "John Doe",
  "target_role": "role_id_here",
  "available_hours_per_week": 10,
  "interests": ["Python", "React", "MongoDB"]
}
```

---

### **Phase 3: Roadmap Generation**

1. **User at** → `/roadmap/new`
2. **Select Preferences**
   - Duration: 4, 8, 12, 16, 24 weeks
   - Difficulty: Beginner, Intermediate, Advanced
3. **Click "Generate Roadmap"**
4. **AI Processing**
   - Fetches user's current skills
   - Fetches target role's required skills
   - **Skill Gap Analysis** (AI)
     - Identifies missing skills
     - Determines gap severity (High/Medium/Low)
     - Sets learning priority
   - **Roadmap Generation** (AI)
     - Creates 2-12 modules (based on duration)
     - Each module contains 3-5 resources
     - Resources: Videos, Articles, Courses, Practice
     - Evenly distributes across timeline
5. **Roadmap Saved to Database**
   - Stored in `roadmaps` collection
   - Linked to user via `user_id`
6. **Redirected to** → `/roadmap/{roadmap_id}`

**Backend API:**
- `POST /api/roadmaps/generate`

**Request Body:**
```json
{
  "user_id": "user123",
  "target_role_id": "role456",
  "deadline_weeks": 12,
  "preferences": {
    "difficulty": "intermediate",
    "duration": "12 weeks"
  }
}
```

**AI Flow:**
```
User Skills → Skill Gap Analysis (Groq AI) → Learning Roadmap Generation (Groq AI)
→ Module Structure → Week Assignment → Resource Unlocking Logic → Database Storage
```

---

### **Phase 4: Progress Tracking**

#### **Dashboard Overview** → `/dashboard`

**Stats Displayed:**
- Total Skills: Count of current_skills
- Total Roadmaps: Count of user's roadmaps
- Modules Completed: X/Y modules done
- Overall Progress: Percentage bar

**Recent Activity:**
- List of active roadmaps
- Quick access to continue learning

---

#### **Roadmap Detail View** → `/roadmap/{id}`

**Header Section:**
- Roadmap title (e.g., "Full Stack Developer Learning Path")
- Skill gaps count
- Total estimated hours
- Back button to roadmap list

**Overall Progress Card:**
- Progress bar (0-100%)
- X of Y modules completed
- Current module indicator

**Skills to Master:**
- Badge list of all skill gaps
- Visual representation of learning goals

**Learning Modules (Accordion):**

Each module shows:
- **Module Header**
  - Module number & title
  - Week number badge
  - Lock/Play/Complete icon
  - Progress bar (mini)
  - X/Y resources completed

- **Module Body (when expanded)**
  - Description
  - Skills covered (badges)
  - **Learning Resources (cards):**

---

#### **Resource Interaction** ⭐

Each resource card displays:
- **Status Icons:**
  - 🔒 Locked (gray) - Previous resource not complete
  - 📖 Unlocked (blue) - Ready to start
  - ▶️ In Progress (blue) - Currently active
  - ✅ Completed (green) - Done
  - ⏭️ Skipped (yellow) - User already knows

- **Resource Info:**
  - Title
  - Type badge (video/article/course/practice)
  - Description
  - Estimated hours
  - Star rating (if rated by others)

- **Time Tracking:**
  - Time spent counter (live)
  - Progress bar (time spent vs estimated)
  - Updates every second when active
  - Syncs to backend every 30 seconds

- **Action Buttons:**

  **When Unlocked/In Progress:**
  - **"Open"** → Opens URL in new tab
    - Marks as "in_progress"
    - Starts time tracking
    - Backend: `POST /api/roadmaps/{id}/open-resource`
  
  - **"Mark Complete"** → Manual completion
    - Stops time tracking
    - Marks as "completed"
    - Unlocks next resource
    - Checks if module completed → Shows summary modal
    - Backend: `POST /api/roadmaps/{id}/complete-resource`
  
  - **"Skip"** → For known topics
    - Marks as "skipped"
    - Unlocks next resource
    - Still counts toward module completion
    - Backend: `POST /api/roadmaps/{id}/skip-resource`

  **When Completed:**
  - **"Re-open"** → Access again
  - **"Rate"** → Submit rating (1-5 stars)

---

### **Phase 5: Module Completion**

**Trigger:** When last resource in module is completed/skipped

**Flow:**
1. Backend detects module completion
2. AI generates motivational summary:
   - What student accomplished
   - Skills gained
   - What's next
3. Summary stored in module data:
   ```json
   {
     "completion_summary": "Congratulations! You've mastered...",
     "summary_generated_at": "2025-12-30T..."
   }
   ```
4. **Modal Displayed** 🎉
   - Success header (green)
   - Module title
   - AI-generated summary
   - "Continue Learning" button
5. Next module auto-unlocks

**Backend:**
- `generate_module_summary()` in AI service
- Returned in complete/skip resource response

---

### **Phase 6: Progress Analytics**

**Visual Elements:**

1. **Progress Bars**
   - Overall roadmap progress (0-100%)
   - Per-module progress (resources done/total)
   - Per-resource time progress (time spent/estimated)

2. **Status Badges**
   - Module: In Progress / Completed
   - Resource: Locked / Unlocked / In Progress / Completed / Skipped

3. **Week Organization**
   - Modules grouped by week number
   - Helps students plan weekly learning

4. **Time Tracking**
   - Live timer when resource active
   - Total time spent per resource
   - Auto-complete at 90% of estimated time

5. **Completion Summary**
   - Modal on module completion
   - Shows learning achievements
   - Motivational messaging

---

## 📊 Core Features Matrix

| Feature | With Resume | Without Resume | Status |
|---------|-------------|----------------|--------|
| **Authentication** | ✅ | ✅ | Complete |
| **Resume Upload** | ✅ | ❌ | Complete |
| **AI Skill Extraction** | ✅ | ❌ | Complete |
| **Manual Skill Entry** | ✅ | ✅ | Complete |
| **Onboarding Flow** | Partial | ✅ | Complete |
| **Skill Gap Analysis** | ✅ | ✅ | Complete |
| **AI Roadmap Generation** | ✅ | ✅ | Complete |
| **Deadline-Based Planning** | ✅ | ✅ | Complete |
| **Week Organization** | ✅ | ✅ | Complete |
| **Progressive Unlock** | ✅ | ✅ | Complete |
| **Time Tracking** | ✅ | ✅ | Complete |
| **Mark Complete** | ✅ | ✅ | Complete |
| **Skip Known Topics** | ✅ | ✅ | Complete |
| **Module Summary** | ✅ | ✅ | Complete |
| **Visual Progress** | ✅ | ✅ | Complete |
| **Resource Rating** | ✅ | ✅ | Complete |

---

## 🔄 Complete User Flow Diagram

```
START
  ↓
[Register/Login]
  ↓
[Dashboard] → First time user?
  ↓                    ↓
  No                  Yes
  ↓                    ↓
[View Roadmaps]    [Onboarding Choice]
  ↓                    ↓
                  Have Resume?
                   ↓         ↓
                  Yes        No
                   ↓         ↓
            [Upload Resume] [Answer Questions]
                   ↓         ↓
            [AI Extracts]   [Manual Entry]
                   ↓         ↓
                [Set Target Role]
                       ↓
              [Select Preferences]
                       ↓
            [Generate Roadmap (AI)]
                       ↓
           [View Roadmap Detail]
                       ↓
           [Start Learning Module]
                       ↓
              [Open Resource]
                ↓      ↓      ↓
          [Complete] [Skip] [Re-open]
                ↓      ↓
          [Time Tracked]
                ↓
        [Last Resource Done?]
                ↓
         [Module Summary] 🎉
                ↓
         [Next Module Unlocked]
                ↓
        [Continue or Finish]
                ↓
              [END]
```

---

## 🎨 UI/UX Highlights

### **Onboarding Page** (`/onboarding`)
- 4-step wizard with progress bar
- Each step has icon and clear heading
- Validation before "Next"
- Can go back to previous steps
- Friendly tips and guidance
- Alternative link to upload resume

### **Roadmap Detail Page** (`/roadmap/{id}`)
- Accordion-based module navigation
- Color-coded status icons
- Live time tracking
- Inline progress bars
- Responsive action buttons
- Celebration modal on completion

### **Dashboard** (`/dashboard`)
- Stats cards with icons
- Progress overview
- Quick access to active roadmaps
- "Continue Learning" buttons

---

## 🔧 Technical Implementation

### **Frontend Stack**
- Next.js 14 (App Router)
- TypeScript
- React Bootstrap
- Firebase Auth
- Context API (AuthContext)

### **Backend Stack**
- FastAPI (Python)
- MongoDB (Database)
- GridFS (File Storage)
- Groq API (AI - Llama 3.3)
- PyPDF2/python-docx (Resume Parsing)

### **Key Collections**
```
users
  - firebase_uid
  - email, name, role
  - current_skills: [{ skill_id, proficiency, added_at }]
  - target_role_id
  - available_hours_per_week
  - has_resume, resume_file_id

roadmaps
  - user_id
  - target_role
  - skill_gaps: [{ skill, current_level, required_level, gap_severity }]
  - modules: [{ id, title, resources[], week_number, is_completed }]
  - progress_percentage
  - current_module_index

skills
  - name, category, description

career_roles
  - title, description
  - required_skills: [skill_names]
```

---

## ✨ Prototype Success Criteria

### **User Flow Validation** ✅
- Smooth onboarding for both resume paths
- Clear navigation through roadmap generation
- Intuitive resource interaction

### **Usability** ✅
- No user gets stuck or confused
- Clear visual feedback on all actions
- Progress tracking is transparent

### **Core Value Delivery** ✅
- AI generates relevant, personalized roadmaps
- Skill gaps identified accurately
- Learning path is deadline-based and realistic
- Users can track progress effectively
- Module summaries provide motivation

---

## 🚦 User Testing Scenarios

### Scenario 1: Fresh Beginner
**Profile:** College student, no tech experience, wants to become Web Developer

**Flow:**
1. Register → Onboarding
2. Step 1: Name "Alice"
3. Step 2: Role "Full Stack Developer"
4. Step 3: 8 hours/week
5. Step 4: No skills (skip)
6. Generate 12-week roadmap
7. Start Module 1 "HTML & CSS Basics"
8. Complete resources, see time tracking
9. Module summary appears
10. Continue to Module 2

**Success:** User understands how to navigate, sees progress clearly

---

### Scenario 2: Experienced User with Resume
**Profile:** Graduate with internship experience, has resume

**Flow:**
1. Register → Profile
2. Upload resume (PDF)
3. AI extracts: Python, Java, SQL, Git
4. Set target role: "Backend Engineer"
5. Set 15 hours/week
6. Generate 8-week roadmap
7. Roadmap skips basics (already has skills)
8. Focuses on advanced topics
9. User skips known resources
10. Completes new topics, tracks progress

**Success:** Roadmap is personalized, skip function works, no redundant content

---

## 📝 Future Enhancements (Out of Scope)

- Email notifications
- Social features (share roadmaps)
- Certificates on completion
- Community forums
- Video call mentorship
- Custom resource uploads
- Advanced analytics dashboard
- Mobile app

---

## 🎉 Conclusion

PathForge successfully delivers:
✅ Personalized AI-driven learning roadmaps
✅ Support for both resume and non-resume users
✅ Clear skill gap identification
✅ Deadline-based planning
✅ Visual progress tracking
✅ Resource interaction (complete/skip)
✅ Module completion summaries
✅ Intuitive user flow

**The prototype validates the core value proposition and is ready for user testing.**

---

**Document Version:** 1.0  
**Last Updated:** December 30, 2025  
**Status:** Complete ✅
