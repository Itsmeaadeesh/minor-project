# Skill Setu (कौशल सेतु) 🌉

> **An AI-Enabled Skill Assessment, Gap Analysis & Automated Course Recommendation Platform**  
> *Bridging the gap between raw document knowledge, diagnostic competency benchmarking, and personalized learning pathways.*

---

## 🌟 Executive Summary

**Skill Setu** is a production-quality, full-stack platform designed to diagnose skill deficiencies, benchmark learner competencies against standardized industry career tracks, and automatically generate personalized, linear learning pathways using prerequisite course graphs. 

The platform features an **AI Quiz Engine** powered by the **Google Gemini API** that converts uploaded study materials (PDF, PPTX, DOCX, TXT) into high-fidelity diagnostic multiple-choice questions with full pedagogical rationales and instant automated grading.

---

## 🏗 Architecture & Tech Stack

```
skill-setu/
├── client/                     # React + TypeScript + Vite + TailwindCSS (Vercel target)
│   ├── src/
│   │   ├── portals/
│   │   │   ├── learner/        # Public Learner Portal (served at /)
│   │   │   └── admin/          # Internal Operations Tool (served at /admin)
│   │   ├── components/         # Shared UI, Toasts, Modals
│   │   ├── context/            # Platform & Auth State
│   │   ├── services/           # REST API client & Supabase SDK
│   │   └── types/              # Normalized TypeScript definitions
│   ├── .env.example
│   └── vercel.json
│
├── server/                     # Node.js + Express + TypeScript + Prisma (Render/Railway target)
│   ├── prisma/
│   │   ├── schema.prisma       # Supabase PostgreSQL schema
│   │   ├── schema.sqlite.prisma# Offline SQLite dev schema
│   │   └── seed.ts             # Production seed script (tracks, courses, quizzes, logs)
│   ├── src/
│   │   ├── controllers/        # REST controllers (auth, tracks, quiz, admin, etc.)
│   │   ├── middleware/         # Server-side JWT & RBAC guards (403 enforcement)
│   │   ├── services/           # Gemini API, document parsing, gap analysis, recommender
│   │   └── routes/             # Express API route modules
│   └── .env.example
│
├── tests/                      # Full-stack E2E automated test suite
├── render.yaml                 # Infrastructure-as-code for Render deployment
├── vercel.json                 # Monorepo SPA rewrite config for Vercel
└── README.md
```

### Core Technologies
- **Frontend**: React 19, TypeScript, Vite, TailwindCSS, Recharts (Radar, Bar, Line charts), Lucide Icons
- **Backend**: Node.js, Express, TypeScript, Multer, PDF-Parse, Mammoth, Tesseract OCR
- **Database & Auth**: Supabase (PostgreSQL, Supabase Auth, Supabase Storage), Prisma ORM
- **AI Synthesis**: Google Gemini 1.5/2.0 API (`@google/generative-ai` with structured JSON schema)
- **Deployment**: Vercel (Frontend), Render / Railway (Backend API)

---

## 🏛 Two Completely Separate Portals

Skill Setu is intentionally structured into two distinct URL namespaces and architectural shells:

### 1. Learner Portal (`/`)
* **URL Namespace**: `/`, `/assessments`, `/path`, `/courses`, `/ai-studio`, `/history`, `/profile`, `/login`, `/onboarding`
* **Visual Aesthetic**: Inspiring, modern educational design with emerald and indigo gradients, responsive cards, and interactive progress rings.
* **Features**:
  * 360° Competency Radar Chart & Level Comparison Bar Chart (Recharts)
  * Priority-Ranked Skill Gaps (incorporating prerequisite weighting)
  * Sequential Linear Learning Path (ordered foundational → advanced)
  * AI Quiz Studio: Drag-and-drop document uploader with automatic OCR detection
  * Instant examination grading with detailed pedagogical rationales
  * Real-time skill profile promotion upon passing assessments

### 2. Admin Portal (`/admin`)
* **URL Namespace**: `/admin`, `/admin/learners`, `/admin/logs`, `/admin/quizzes`, `/admin/courses`, `/admin/login`
* **Visual Aesthetic**: High-density dark internal tool design (`slate-950` / `slate-900`), monospace indicators, telemetry badges, and dense data tables.
* **Server-Side RBAC**: Non-admin users hitting `/admin/*` or calling `/api/admin/*` endpoints receive an **HTTP 403 Forbidden** response enforced by Express middleware.
* **Features**:
  * Cohort Skill Deficit Distribution & Track Diagnostic Benchmarks
  * Enrolled Learner Directory with multi-column filtering and deep drill-down modals
  * **System Activity Logs View**: Live audit feed recording all quiz attempts, document uploads, recommendation recalculations, auth events, and score changes with live filters by **Learner**, **Event Type**, and **Date Range**, plus a JSON payload inspector!

---

## 🗄 Normalized Database Schema

Backed by **Supabase PostgreSQL** via Prisma:

| Table Name | Description |
|---|---|
| `users` | User credentials, roles (`LEARNER` / `ADMIN`), profile info, target track pointer, and onboarding state. |
| `tracks` | Career tracks (e.g. *Full Stack Web*, *Data Science & AI*, *Cloud Infrastructure & DevOps*). |
| `skills` | Competency taxonomy categorized by Frontend, Backend, Data, Cloud, CS, and Security. |
| `track_skills` | Association between tracks and skills with target `required_proficiency_level` (1–5 scale). |
| `learner_skill_levels` | Individual learner skill ratings with `current_level`, `source` (`self-rated`, `quiz`, `assessment`), and `last_updated`. |
| `courses` | Learning modules tagged with skills, difficulty levels, duration, and recursive `prerequisite_course_id` chains. |
| `learning_paths` | Persisted ordered sequences of courses synthesized for learners based on their unique skill gap topology. |
| `uploads` | Records of uploaded documents with file URL, file type, file size, and extracted text. |
| `quizzes` | Assessments linked to uploads or baseline tracks with time limits. |
| `quiz_questions` | MCQs with question text, 4 options, zero-based `correct_answer`, and pedagogical explanations. |
| `quiz_attempts` | Examination logs storing learner answers, score, percentage, and pass/fail outcome. |
| `activity_logs` | Immutable audit log powering the Admin Logs view (`actor_id`, `action_type`, JSON `metadata`, `timestamp`). |

---

## 🚀 Quickstart & Local Development

### Prerequisites
- Node.js `v20+` or `v24+`
- npm `v10+`

### 1. Clone & Install Dependencies
```bash
# Clone the repository
git clone https://github.com/your-username/skill-setu.git
cd skill-setu

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
cd ..
```

### 2. Environment Variables Configuration

Copy the example environment files:
```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

#### `server/.env`
```env
PORT=5000
CLIENT_URL=http://localhost:5173

# Supabase Postgres or Local SQLite for dev
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"

JWT_SECRET="skill_setu_production_super_secret_jwt_key_2026_secure"
GEMINI_API_KEY="AIzaSy...your-gemini-api-key"
GEMINI_MODEL="gemini-1.5-flash"

SUPABASE_URL="https://[PROJECT-REF].supabase.co"
SUPABASE_ANON_KEY="eyJh..."
```
*(Note: If testing completely offline without Supabase credentials, the database defaults seamlessly to SQLite with `DATABASE_URL="file:./dev.db"`).*

#### `client/.env`
```env
VITE_API_URL="http://localhost:5000/api"
VITE_SUPABASE_URL="https://[PROJECT-REF].supabase.co"
VITE_SUPABASE_ANON_KEY="eyJh..."
```

### 3. Database Migration & Seed
```bash
# Push schema and seed production data
npm run seed --prefix server
```

### 4. Run the Full Stack Application
```bash
# From the repository root, start both client and server concurrently:
npm run dev
```

The application will be accessible at:
- **Learner Portal**: `http://localhost:5173/`
- **Admin Portal**: `http://localhost:5173/admin`
- **Backend API**: `http://localhost:5000/api`
- **API Healthcheck**: `http://localhost:5000/api/health`

---

## 🔐 Pre-Seeded Evaluator Accounts

| Role | Email | Password | Target Career Track |
|---|---|---|---|
| **Administrator** | `admin@skillsetu.dev` | `Password123!` | All Tracks (Admin Access) |
| **Learner 1 (Web)** | `aarav.learner@skillsetu.dev` | `Password123!` | Full Stack Web Engineering |
| **Learner 2 (AI)** | `diya.learner@skillsetu.dev` | `Password123!` | Data Science & AI Engineering |
| **Learner 3 (DevOps)** | `rohan.learner@skillsetu.dev` | `Password123!` | Cloud Infrastructure & DevOps |

*(Both login portals also provide 1-Click quick login buttons for instant evaluator access).*

---

## 🧪 Automated End-to-End Verification Suite

To run the automated test suite verifying all 10 modules:
```bash
# Run E2E test suite
node tests/e2e-verification.js
```

### Verified Test Matrix (23/23 Passing):
1. ✅ **Healthcheck & DB Connectivity**: Database connection query verified.
2. ✅ **Learner Authentication**: JWT issuance and profile retrieval.
3. ✅ **Server-Side RBAC Guard**: Non-admin request to `/api/admin/analytics` blocked with **HTTP 403 Forbidden**.
4. ✅ **Track Taxonomy**: Retrieval of tracks and skill proficiency thresholds.
5. ✅ **Skill-Gap Analysis**: Priority ranking calculated using largest deficit with prerequisite skill weighting.
6. ✅ **Path Recommendation**: Topological sort using `prerequisite_course_id` chains ordered foundational-first.
7. ✅ **Course Catalogue**: Verification of prerequisite course relationships.
8. ✅ **Assessment Calibration**: Self-rating updates and dynamic learning path recalculation.
9. ✅ **AI Quiz Synthesis**: Document extraction (PDF/TXT) and Gemini API MCQ generation with 4 options and explanations.
10. ✅ **Assessment Scoring**: Instant grading, pass/fail status, and learner skill level promotion.
11. ✅ **Admin Login**: Verification of `ADMIN` claims.
12. ✅ **Admin Analytics**: Aggregate cohort skill deficits and track diagnostic averages for Recharts.
13. ✅ **Learner Directory & Drill-Down**: Full student telemetry and competency drill-down.
14. ✅ **System Activity Logs**: Multi-filtering audit trail verified across event types, learners, and date ranges.

---

## 🚢 Deployment Guide

The repository is structured with independent `client/` and `server/` directories, each with its own `package.json`, build scripts, and environment configuration.

### Deploying Frontend to Vercel
1. In the Vercel Dashboard, import the repository.
2. Set **Root Directory** to `client` (or use the root `vercel.json`).
3. Set **Framework Preset** to `Vite`.
4. Configure Environment Variables:
   - `VITE_API_URL`: Your deployed backend URL (e.g. `https://skill-setu-api.onrender.com/api`)
   - `VITE_SUPABASE_URL`: Your Supabase Project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase Anon Key
5. Deploy! Vercel handles static asset serving and SPA routing rewrites.

### Deploying Backend to Render / Railway
1. In Render, create a new **Web Service** connected to your repository.
2. Specify **Root Directory**: `server`
3. Set **Build Command**: `npm install && npx prisma generate && npm run build`
4. Set **Start Command**: `npm run start`
5. Configure Environment Variables:
   - `DATABASE_URL`: Supabase PostgreSQL connection string
   - `JWT_SECRET`: Random 64-character secret
   - `GEMINI_API_KEY`: Google Gemini API Key
   - `CLIENT_URL`: Your Vercel frontend URL
   - `SUPABASE_URL` and `SUPABASE_ANON_KEY`
6. Render will verify the service via `GET /api/health`.

---

## 📄 License
MIT License. Created for the Skill Setu Platform demonstration.
