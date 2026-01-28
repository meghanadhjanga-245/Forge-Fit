# Forge Fit – Local‑First Fitness Tracker 

## Overview

**Forge Fit** is a fully client‑side, local‑first fitness tracking web application built using **pure HTML, CSS, and JavaScript**. It is designed as a **portfolio‑grade case study** to demonstrate front‑end engineering depth, UI/UX polish, data modeling, and secure client‑side state management — without relying on any backend services.

The application simulates a modern fitness OS where users can:

* Create an account or log in (local‑only)
* Choose fitness goals (Lean, Bulk, Maintenance)
* View structured workout & diet plans
* Track workouts, meals, hydration, and body measurements
* See analytics‑style progress dashboards

All data is **user‑scoped, encrypted, and stored locally** in the browser.

---

## Key Design Principles

### 1. Local‑First Architecture

* No backend, no cloud, no APIs
* All data lives in `localStorage`
* Each user has isolated, encrypted storage
* App works fully offline after first load

### 2. Portfolio‑Ready UX

* Recruiter‑friendly information hierarchy
* Clear feature separation (Home → Plans → Goals → Progress)
* Dashboard‑style analytics UI
* Neutral, professional visual language

### 3. Realistic Fitness Logic

* Natural training & nutrition guidance
* Realistic timelines (no extreme promises)
* Emphasis on consistency, recovery, and habits

---

## Tech Stack

| Layer          | Technology                                         |
| -------------- | -------------------------------------------------- |
| Structure      | HTML5                                              |
| Styling        | CSS3 (custom properties, gradients, glassmorphism) |
| Logic          | Vanilla JavaScript (ES6+)                          |
| Storage        | Browser localStorage                               |
| Security       | Client‑side hashing + lightweight encryption       |
| Responsiveness | CSS Grid + Flexbox                                 |

No frameworks, libraries, or build tools are used.

---

## Application Structure

### 1. Navigation Bar

* Sticky header with brand identity
* Section navigation (SPA‑style)
* Theme toggle (Dark / Light)
* Authentication state indicator

### 2. Sections (SPA Layout)

The app behaves like a **Single Page Application** using section toggling.

| Section        | Purpose                                 |
| -------------- | --------------------------------------- |
| Home           | Case‑study overview & demo stats        |
| Workout & Diet | Goal‑based training & nutrition plans   |
| Transformation | Timeline‑based expectations             |
| Progress       | Analytics dashboard & logging           |
| Contact        | Mock contact form for portfolio context |

---

## Authentication & User Management

### Signup / Login

* Email + password authentication
* Passwords are **hashed client‑side** (non‑reversible)
* Users are stored in a shared user registry
* Each user has isolated fitness data

### Guest Mode

* No account required
* Uses in‑memory demo data
* No persistence after refresh

### Session Persistence

* Optional "Remember me" functionality
* Stores session email in localStorage

---

## Security Model (Client‑Side)

> This is **not enterprise‑grade security** — it is a **demonstration of security thinking** in a frontend‑only environment.

### Implemented Measures

* Password hashing before storage
* Per‑user storage keys
* XOR‑based encryption layer for user data
* No shared plaintext fitness data

### Why This Matters

Shows understanding of:

* Threat modeling
* User data isolation
* Secure defaults even in demo apps

---

## Fitness Goals System

Users select one primary goal:

### Lean (Recomposition)

* Mild calorie deficit
* Hypertrophy‑focused training
* Fat loss with muscle retention

### Bulk (Muscle Gain)

* Controlled calorie surplus
* Strength‑biased programming
* Lean mass prioritization

### Maintenance

* Calories at maintenance
* Hybrid training split
* Lifestyle sustainability

The selected goal dynamically affects:

* Plans shown
* Timeline expectations
* Dashboard targets

---

## Workout & Diet Plans

Each goal contains:

* Training split overview
* Macro‑nutrition roadmap
* Sample daily meal structure

Plans are:

* Data‑driven
* Text‑based for clarity
* Easy to extend or replace with API data

---

## Transformation Timelines

Visual timeline cards show:

* 1 month
* 3 months
* 6 months
* 12 months

Each card includes:

* Expected outcome
* Key physiological changes
* Phase label (habits, visible change, baseline, etc.)

This sets **realistic expectations**, an important UX decision.

---

## Progress Dashboard

### Metrics Tracked

* Workouts logged
* Average calorie intake
* Weekly consistency
* Hydration
* Body weight & measurements

### Visual Elements

* Progress bars
* Trend indicators (up/down)
* Activity feed
* Recent workout table

Dashboard updates **reactively** after each log event.

---

## Logging System

### Workout Logs

* Type (Push, Pull, Legs, etc.)
* Duration
* Intensity
* Auto‑timestamped

### Meal Logs

* Meal name
* Calories
* Protein

### Measurements

* Weight
* Chest
* Waist
* Arms
* Legs

Each log:

* Updates stats
* Adds to activity feed
* Persists per user

---

## UI & Design System

### Visual Style

* Dark‑first, glassmorphism UI
* Soft gradients and glow accents
* Rounded components for modern feel

### Responsiveness

* Mobile‑first breakpoints
* Grid collapses gracefully
* Touch‑friendly controls

### Accessibility Considerations

* Readable font sizes
* Clear contrast
* Logical content flow

---

## Theme System

* Dark mode (default)
* Light mode toggle
* Preference saved in localStorage

Demonstrates global state handling.

---

## Contact Section

* Mock contact form
* No backend submission
* Included for completeness and realism

Designed to be easily wired to:

* Email service
* REST API
* Serverless function

---

## Extensibility

This project is intentionally structured so it can be extended into a full product:

* Replace localStorage with real backend APIs
* Swap encryption layer for server‑side auth
* Add charts (Chart.js, Recharts)
* Add PWA support
* Multi‑device sync

---

## Who This Project Is For

* Recruiters evaluating frontend depth
* Interviewers reviewing architecture thinking
* Demonstration of non‑trivial JS logic
* Proof of UX + engineering balance

---

## Author Notes

Forge Fit was built to answer the question:

> "Can a single HTML file demonstrate real‑world application thinking?"

The answer is **yes** — when structure, clarity, and intent are done right.
