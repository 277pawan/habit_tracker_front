# Welcome to Habit_tracker project

## Project info

## How can I edit this code?

There are several ways of editing your application.

**Use Habit_tracker**

Simply visit the [Habit_tracker Project](https://lovable.dev/projects/041a9c53-c420-4a7a-9525-693f51859787) and start prompting.

Changes made via Habit_tracker will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Habit_tracker.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## 🚀 Features

### ✅ 1. User Authentication

- Register, Login, Logout
- JWT token stored in localStorage
- Protected routes
- Auto-login across sessions

---

### 🎭 2. Identity Selection

Users choose a **Primary Identity** (e.g., Learner, Athlete).  
This identity personalizes:

- Habit categories
- Boost system
- Weekly reflections
- AI summary context

---

### 📝 3. Habit Management

- Create/Edit/Delete habits
- Set difficulty (easy/medium/hard)
- Add reminder time
- Weekly schedule (Sun → Sat)
- Track streaks
- Mark complete/uncomplete daily

Each habit includes:

### 🔔 4. Email Reminder Notifications

If a habit has a reminder time and today is a scheduled day:  
✔ User receives an **email notification** at that exact time.

Handled automatically using backend cron + your scheduled settings.

---

### 🎯 5. Habit Completion Tracking

- Track completed habits per day
- Calculate streak
- See progress in reports

---

### 🔥 6. Boost System

Users can:

- Send motivational **boosts**
- Receive boosts
- Improve engagement and consistency

---

### 📊 7. Reports & Analytics

- Weekly performance
- Completed habits count
- Missed habits count
- Active streaks

---

### 📓 8. Reflection Journal

Users can write:

- Daily reflections
- Weekly thoughts
- Mood check-ins

All reflections are tied to user identity.

---

### 🤖 9. AI-Powered Weekly Summary

The app includes a **free AI summarization feature**:

Users write a weekly reflection →  
AI summarizes it into:

- Main highlights
- Areas of improvement
- Identity-based analysis
- Suggestions for next week

This uses a **free external AI summarization API** from frontend.

---

### 💻 10. Clean Modern UI

- Built with React + TypeScript
- Modular API client
- Clean reusable components
- Full responsive design

---
