# FITFLOW — Complete Gym Membership & Workout Management Platform (Phase 1)

> **"Manage your gym. Grow your community."**

FITFLOW is a production-quality, modern fitness SaaS platform engineered for boutique studios, CrossFit boxes, and commercial fitness centers. It features a complete role-based architecture (**Admin/Gym Owner**, **Trainer/Staff**, and **Gym Member**), atomic database-level class booking capacity enforcement, automatic waitlist promotion, camera-based QR check-in scanning, and executive analytics powered by Recharts.

---

## 🚀 Key Features

### 1. Multi-Role Portals & Dashboards
* **Admin / Gym Owner**:
  * Executive dashboard with **Membership Growth** (LineChart), **Weekly Attendance Velocity** (BarChart), and **Plan Tier Distribution** (DonutChart).
  * Member directory with search, status filters, and detailed profile viewer (with overview, plan benefits, bookings, attendance, and Phase 2 workout placeholders).
  * Membership plan creation & management (£30 Basic, £50 Premium, £70 Unlimited).
  * Class timetable scheduling with trainer assignment, location, and spot capacity caps.
  * Real-time Bookings & Waitlist tracking with instant manual promotion/cancellation.
  * Live Attendance logs with QR scan vs. manual check-in filters.
  * Coaching staff management and studio settings.
* **Trainer / Staff**:
  * Assigned sessions roster viewer with real-time attendee lists.
  * Live Front Desk & Class Camera QR Scanner (`html5-qrcode`) with fallback manual search.
  * Athlete workout and attendance notes.
* **Member**:
  * Personalized dashboard with greeting, membership status, and 7-day workout streak fire counter.
  * Interactive class catalog with category filters, live capacity progress bars (`18/20 spots`), and 1-click **Book Class** or **Join Waitlist**.
  * Personal digital gym check-in pass (`qrcode.react`) with 60-second auto-refreshing security tokens.
  * My Bookings manager with waitlist queue positions (`#1 on waitlist`) and atomic cancellation.
  * Personal attendance and check-in timeline.

### 2. Concurrency Safety & Automated Waitlists
* **Atomic Capacity Lock**: Safe booking logic prevents race conditions so multiple members cannot simultaneously claim the final open spot.
* **Instant Waitlist Promotion**: When a confirmed member cancels their spot, the top-position waitlisted member is automatically promoted to `confirmed`, and a real-time celebratory toast notification is dispatched.

### 3. Dual-Engine Persistence
* **Direct Supabase Integration**: Connects via `@supabase/supabase-js` using PostgreSQL with Row Level Security (RLS) policies and PL/pgSQL stored procedures.
* **Instant Seed Engine**: Includes an initial rich dataset (1 Gym, 3 Plans, 10 Members, 3 Trainers, 8 Classes with bookings and attendance) stored in browser storage. Allows instant zero-setup live testing with zero broken buttons right out of the box.

---

## 🛠️ Technology Stack

* **Frontend**: React 18, Vite, Tailwind CSS, Lucide React, React Router v6
* **Data Visualization**: Recharts
* **QR Barcode Technology**: `qrcode.react` (SVG generation), `html5-qrcode` (webcam & camera scanner)
* **Celebration Effects**: `canvas-confetti`
* **Database & Auth**: Supabase (PostgreSQL, Row Level Security, RPC Functions)

---

## 📦 Installation & Setup

1. **Clone or enter the project directory**:
   ```bash
   cd f:\internship\products\FitFlow
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```

4. **Production Build**:
   ```bash
   npm run build
   npm run preview
   ```

---

## 🔑 Demo Sandbox Accounts (1-Click Switcher Available on Navbar & Login)

| Role | Name | Email | Password |
|---|---|---|---|
| **Admin / Gym Owner** | Muhammad Islam | `admin@fitflow.com` | `password123` |
| **Trainer / Coach** | Alex Morgan | `alex.trainer@fitflow.com` | `password123` |
| **Member** | Sarah Jenkins | `sarah@example.com` | `password123` |

*Note: The top navigation bar includes an instant 1-click Role Switcher (`[Admin]`, `[Trainer]`, `[Member]`) for rapid workflow evaluation.*

---

## 🗄️ Database Schema & Supabase Setup

The complete PostgreSQL migration script is available in:
```text
supabase/schema.sql
```

It includes:
1. `gyms`
2. `profiles`
3. `membership_plans`
4. `memberships`
5. `classes`
6. `class_bookings`
7. `waitlists`
8. `attendance`
9. Multi-tenant Row Level Security (RLS) policies
10. Atomic stored procedures: `book_class_atomic` & `cancel_booking_atomic`

To connect your Supabase project, copy `.env.example` to `.env`:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

---

## 🚀 Phase 2 Ready

The codebase is modularly partitioned to seamlessly receive Phase 2 enhancements:
* AI Workout Generation & Adaptive Routines
* Biometric Facial Recognition Check-In
* GoCardless Direct Debit & Automated Retry
* Studio Gamification & Leaderboards
* CRM & Automated SMS/Email Waitlist Alerts
