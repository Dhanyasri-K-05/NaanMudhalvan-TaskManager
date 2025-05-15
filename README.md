# TaskMaster - Modern Task Management Application

A beautiful, feature-rich task management application built with React, Node.js, and MongoDB. TaskMaster helps you organize your daily tasks with an intuitive calendar interface and priority-based task management.



## Features

- 📅 Interactive Calendar View
  - Visual task indicators with priority-based colors
  - Easy task management by date
  - Intuitive date selection

- ✨ Task Management
  - Create, edit, and delete tasks
  - Set task priorities (Low, Medium, High)
  - Add detailed descriptions
  - Mark tasks as complete

- 🔒 User Authentication
  - Secure user registration and login
  - Protected routes
  - Personal task workspace

- 🎨 Modern UI/UX
  - Clean and responsive design
  - Priority-based color coding
  - Smooth animations
  - Intuitive task organization

## Tech Stack

- **Frontend**
  - React 
  - Vite
  - Tailwind CSS
  - React Router DOM
  - Lucide React Icons
  - React Hot Toast

- **Backend**
  - Node.js
  - Express.js
  - MongoDB
  - JSON Web Tokens

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/taskmaster.git
   cd taskmaster
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your environment variables:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open in your browser.

## Project Structure

```
taskmaster/
├── src/
│   ├── components/     # Reusable UI components
│   ├── context/       # React context providers
│   ├── pages/         # Application pages/routes
│   └── main.tsx       # Application entry point
├── server/
│   ├── models/        # Database models
│   ├── routes/        # API routes
│   └── index.js       # Server entry point
└── public/            # Static assets
```
