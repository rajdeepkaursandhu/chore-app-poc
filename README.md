<div align="center">

<img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
<img src="https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
<img src="https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white" />
<img src="https://img.shields.io/badge/Nginx-Alpine-009639?style=for-the-badge&logo=nginx&logoColor=white" />
<img src="https://img.shields.io/badge/Status-Live-brightgreen?style=for-the-badge" />

# 📋 ChoreBoard

### *A premium office task management dashboard — assign, schedule, and track team chores with a beautiful, Outlook-like calendar.*

</div>

---

## 🎯 Overview

**ChoreBoard** is a production-ready, fully containerized office chore management tool built with **React + Vite** and served via **Nginx inside Docker**. It demonstrates modern frontend architecture principles including component modularity, centralized state management via Context API, and localStorage-based persistence — all packaged into a single `docker compose up` command.

Designed to be deployed on an internal office screen or shared browser, it gives teams instant visibility into who is responsible for what, when, and how often.

---

## ✨ Features

| Feature | Details |
|---|---|
| 📅 **Outlook-style Calendar** | Month, Week, and Day views with chore pills, today highlighting, and click-to-add |
| 🔁 **Recurring Schedules** | Daily, Weekly, and Monthly — auto-generates future instances on creation |
| 👥 **Team Management** | Add, edit, and remove team members with avatar color customization |
| ✅ **Task State Tracking** | To Do → In Progress → Completed → Overdue (auto-resolved on mount) |
| 🔔 **Notification Center** | In-app bell with unread badge, scrollable history, and sliding toast alerts |
| 📊 **Analytics Dashboard** | Stat cards, completion ring, team activity progress bars, overdue & upcoming lists |
| 💾 **Persistent State** | All data saved to `localStorage` — survives refreshes without a backend |
| 🐳 **One-Command Docker Deploy** | Multi-stage build: Node builder → Nginx Alpine server |

---

## 🖥️ Screenshots

> **Dashboard** — stat cards, completion ring, team activity, overdue alerts, and 7-day upcoming view

> **Calendar (Month View)** — chore pills color-coded by status with member avatars

> **Team Members** — member cards with individual chore completion stats and progress bars

---

## 🚀 Quick Start

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running

### Run with Docker Compose

```bash
# Clone the repo
git clone https://github.com/rajdeepkaursandhu/chore-app.git
cd chore-app

# Build and launch (first run takes ~60s)
docker compose up -d --build

# Open in your browser
open http://localhost:8080
```

```bash
# Stop the container
docker compose down
```

> 💡 **Data persists** in the browser's `localStorage` — no database required.

---

## 🏗️ Architecture

### Tech Stack

```
Frontend:     React 18 + Vite 5
Styling:      Vanilla CSS (glassmorphism, CSS custom properties, keyframe animations)
Icons:        Lucide React
Date Logic:   date-fns
State:        React Context API + useLocalStorage hook
Persistence:  Browser localStorage (prototype-ready, backend-upgradeable)
Server:       Nginx Alpine (gzip, asset caching, SPA routing)
Container:    Docker multi-stage build
```

### Project Structure

```
chore-app/
├── Dockerfile                  # Multi-stage: Node builder → Nginx runner
├── docker-compose.yml          # Exposes on localhost:8080
├── nginx.conf                  # SPA routing, gzip, 1yr asset cache
├── .dockerignore
├── src/
│   ├── store/
│   │   └── AppStore.jsx        # Context API — global state, CRUD, seed data
│   ├── hooks/
│   │   └── useLocalStorage.js  # Generic localStorage ↔ React state sync
│   ├── utils/
│   │   └── scheduleGenerator.js # Recurring instance generator + overdue resolver
│   ├── components/
│   │   ├── Dashboard.jsx/.css       # Stats, progress ring, team activity
│   │   ├── CalendarView.jsx/.css    # Month/Week/Day calendar grid
│   │   ├── TeamManager.jsx/.css     # Member CRUD with avatar picker
│   │   ├── Sidebar.jsx/.css         # Collapsible nav + notification bell
│   │   ├── ChoreModal.jsx/.css      # Add/edit chore form
│   │   ├── MemberModal.jsx          # Add/edit member form
│   │   ├── ChoreDetailPanel.jsx/.css # Click-through chore detail
│   │   ├── NotificationCenter.jsx/.css
│   │   └── ToastContainer.jsx
│   ├── App.jsx / App.css        # Shell layout + ambient glow animations
│   ├── main.jsx
│   └── index.css                # Design system: tokens, glass, badges, buttons
```

---

## 🎨 Design System

The app uses a **custom CSS design system** with:

- **Glassmorphism**: `backdrop-filter: blur()` frosted panels throughout
- **CSS Custom Properties**: Full token system (`--accent-primary`, `--glass-bg`, `--radius-*`, etc.)
- **Animated Ambient Glows**: Floating radial blobs in the background using `@keyframes`
- **Premium Typography**: [Outfit](https://fonts.google.com/specimen/Outfit) from Google Fonts
- **Status Color Coding**: Purple (To Do) · Amber (In Progress) · Teal (Completed) · Red (Overdue)

---

## 🔧 Local Development (without Docker)

```bash
# Install dependencies
npm install

# Start dev server with HMR
npm run dev

# Build for production
npm run build
```

---

## 🗺️ Roadmap

- [ ] **Multi-user backend** — Node.js / Supabase for shared real-time state
- [ ] **Email/Slack notifications** — webhook integration for assignment alerts
- [ ] **Drag-and-drop** — reassign chores by dragging on the calendar
- [ ] **Analytics export** — CSV/PDF report of team completion stats
- [ ] **Mobile responsive** — adaptive layout for tablet/phone dashboards

---

## 📄 License

MIT License — free to use, adapt, and deploy.

---

<div align="center">

Built with ❤️ using React, Vite, and Docker · Designed for modern office teams

</div>
