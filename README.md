# Task Manager

A full-stack Task Manager application built using Next.js (App Router).
Link : https://task-manager-gamma-eight-61.vercel.app/
## Features

**Frontend**:
- Add new tasks
- Toggle task completion status
- Delete tasks
- Double-click to edit an existing task's title
- Filter tasks out by 'ALL', 'ACTIVE', or 'COMPLETED'
- A beautiful, responsive, modern dark-themed UI built with Tailwind CSS
- Loading and Error states gracefully handled

**Backend**:
- Built into Next.js using `app/api/tasks/route.js`
- Endpoints setup and validation logic written for standard REST interactions:
  - `GET /api/tasks` — Fetch all tasks
  - `POST /api/tasks` — Add a new task
  - `PATCH /api/tasks` — Toggle task autocomplete or edit task title text
  - `DELETE /api/tasks` — Delete a task
- Utilizes simple server-side in-memory storage (resets whenever the dev server is restarted).

## Getting Started

Follow these instructions to get the project running on your local machine.

### Prerequisites
- [Node.js](https://nodejs.org/) installed on your machine.

### Setup and execution

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```

3. **View the Application Setup**
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Technologies Used
- Next.js (App Router, API Routes)
- React
- Tailwind CSS
