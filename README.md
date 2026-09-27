# FITFLOW — Next-Gen Gym Membership & Studio Management Platform

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel%20Production-emerald?style=for-the-badge&logo=vercel)](https://fitflow-ladt.vercel.app/)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL%20RLS-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)

> **"Manage your gym. Elevate your athletes. Grow your community."**

🌐 **Live Production Deployment**: [https://fitflow-ladt.vercel.app/](https://fitflow-ladt.vercel.app/)  
📦 **GitHub Repository**: [https://github.com/Muhammadislam776/fitflow.git](https://github.com/Muhammadislam776/fitflow.git)

---

## 🌟 Overview

**FITFLOW** is an enterprise-grade, high-performance SaaS platform purpose-built for boutique fitness studios, CrossFit boxes, and commercial gym clubs. It combines a clean high-contrast dark aesthetic with atomic concurrency-safe class bookings, automated waitlist promotions, live dual-mode QR check-ins, a full trainer coaching suite with Web Audio HIIT stopwatches, and an **Executive Admin Command Center** featuring **Real-Time Member Audit Reports** and 1-click `.CSV` dataset exports.

---

## 🚀 Key Modules & Capabilities

### 1. 🛡️ Executive Admin Command Center
* **Live Operational Spotlight**: Real-time Supabase cloud sync status, latency monitor (18ms), turnstile uptime (99.98%), and today's revenue run-rates.
* **Balanced Responsive Action Toolbar**: 4 full-width symmetric action buttons (`Export Reports`, `Schedule Class`, `Register Member`, `Sync Database`) perfectly responsive across all viewports.
* **Real-Time Member Records Audit Hub**:
  * Live reactive table showing all enrolled athletes with custom Dicebear avatars, contact emails, and member IDs.
  * Plan tier badges with monthly fees: **Unlimited VIP (£70/mo)**, **Premium Gold (£50/mo)**, and **Starter Basic (£30/mo)**.
  * Active/Expired membership status with pulsing indicators.
  * Turnstile check-in frequency counters with visual activity bars.
  * **Real-time Filter & Search Engine**: Instant search by name, email, or ID; filter by plan tier or status; sort by newest joined, check-ins, or alphabetical order.
  * **1-Click CSV Exports**: Download Filtered Roster (`.CSV`), Master Executive Audit (`.CSV`), or Individual Athlete Dossier (`.CSV`) with Web Audio chime and confetti effects.
* **Interactive Analytics Suite (Recharts)**: Membership Growth Velocity (Area Chart), Weekly Attendance Velocity (Bar Chart), and Subscription Plan Distribution (Donut Chart).
* **Facility Radar & Staff Leaderboard**: Live occupancy meters across studio zones and coach schedules.

### 2. 🏋️‍♂️ Certified Coach & Trainer Portal
* **Daily Class Schedule & Attendees**: Real-time rosters, checked-in athlete counts, and spot caps.
* **Integrated HIIT / Tabata Audio Stopwatch**: Digital workout timer with customizable interval presets (HIIT, Tabata, EMOM) and synthesized Web Audio beeps (start, countdown, finish).
* **Studio Workout Category Covers**: High-resolution studio cards for Strength, Mobility, Functional Rig, and Conditioning.

### 3. 📱 Athlete / Member Portal
* **Personalized Athlete Hub**: Greeting, active subscription status, quick streak tracking, and QR pass shortcut.
* **Dynamic Class Booking Engine**:
  * Real-time capacity enforcement (`18/20 spots booked`).
  * 1-Click atomic **Book Class** or **Join Waitlist**.
  * Auto-promotion: When a confirmed member cancels, the top waitlisted athlete is instantly promoted with celebratory notifications.
* **Digital QR Access Pass**: Dynamic QR code pass (`qrcode.react`) with 60-second rotating security tokens for turnstile scanning.
* **Booking & Attendance History**: Active reservations, waitlist queue position badges, and verified turnstile logs.

### 4. 📷 Dual-Mode QR Check-In Scanner
* **Option 1 — Live Camera Scanning**: Active laser HUD targeting box, webcam stream selector, and auto-fallback with instant sound chime & confetti on verification.
* **Option 2 — Drag & Drop / Image Upload**: Scan QR passes from saved screenshots or photo files (`html5-qrcode`).

### 5. 🌐 High-Converting Public Landing Page
* **Interactive Persona Switcher**: Live tabbed interface showcasing benefits tailored for Gym Owners, Coaches, and Athletes.
* **Studio Timetable Preview**: Live class cards with trainers and room locations.
* **FAQ Accordion & Dark Theme Footer**: Interactive questions, newsletter subscription, and social links.

---

## 🔑 Demo Sandbox Accounts (1-Click Switcher Available in Top Navbar)

The application features a convenient **Role Switcher** on the top navigation bar (`[Admin]`, `[Trainer]`, `[Member]`) allowing instant zero-login role testing. You can also sign in manually:

| Role | Name | Demo Email | Password | Access Level |
|---|---|---|---|---|
| **Admin / Owner** | Muhammad Islam | `admin@fitflow.com` | `password123` | Full Studio Management & Reports |
| **Trainer / Coach** | Alex Morgan | `alex.trainer@fitflow.com` | `password123` | Class Rosters, Timers & Attendance |
| **Athlete Member** | Sarah Jenkins | `sarah@example.com` | `password123` | Bookings, QR Pass & Schedules |

---

## 🛠️ Technology Stack

| Domain | Technologies |
|---|---|
| **Frontend Framework** | React 18, Vite 8, React Router v6 |
| **Styling & Design** | Tailwind CSS v3.4, Lucide React Icons |
| **Charts & Analytics** | Recharts (Area, Bar, Pie, ResponsiveContainer) |
| **QR Code Engine** | `qrcode.react` (Generation), `html5-qrcode` (Live Camera & File Scan) |
| **Audio & FX** | Web Audio API (Synthesizer Chimes & HIIT Beeps), `canvas-confetti` |
| **Database & Auth** | Supabase (PostgreSQL 15, Row Level Security, RPC Functions) |
| **Local Fallback Engine** | Dual-Engine LocalStorage Seed Store (Zero-config instant testing) |
| **Deployment** | Vercel (Continuous Deployment from GitHub `main`) |

---

## 📦 Local Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Muhammadislam776/fitflow.git
   cd fitflow
   ```

2. **Install project dependencies**:
   ```bash
   npm install
   ```

3. **Start the Vite development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

4. **Production Build & Preview**:
   ```bash
   npm run build
   npm run preview
   ```

---

## 🗄️ Database Architecture & Supabase Setup

The production schema with atomic RPC functions and multi-tenant Row Level Security is available in:
```text
supabase/schema.sql
```

Key tables:
* `gyms` — Facility configuration and branding
* `profiles` — Role-based user accounts (`admin`, `trainer`, `member`)
* `membership_plans` — Subscription tiers, durations, and pricing
* `memberships` — Active member contracts and validity periods
* `classes` — Schedules, instructors, rooms, and spot limits
* `class_bookings` — Confirmed athlete slots with atomic concurrency guards
* `waitlists` — FIFO auto-promotion queue
* `attendance` — Turnstile check-in logs with verification methods

To connect your own Supabase instance, create a `.env` file:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

---

## 🌐 Deployment to Vercel

FitFlow is configured for 1-click deployment on Vercel:
* **Build Command**: `npm run build`
* **Output Directory**: `dist`
* **Install Command**: `npm install`
* **Single Page Application Routing**: Configured via Vite build rules.

**Live URL**: [https://fitflow-ladt.vercel.app/](https://fitflow-ladt.vercel.app/)

---

## 📄 License

This project is licensed under the MIT License. Built with ❤️ for modern fitness communities.
