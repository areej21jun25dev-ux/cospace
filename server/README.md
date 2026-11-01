# CoSpace: Desk & Meeting Room Booking System

A full-stack MERN application for booking desks and meeting rooms.

## Tech Stack

- **Frontend:** React (Vite), Tailwind CSS, React Router
- **Backend:** Node.js, Express
- **Database:** MongoDB, Mongoose

## Project Structure

```
cospace/
├── client/    # React frontend
└── server/    # Express backend
    └── src/
        ├── config/   # Database connection
        ├── models/   # User, Resource, Booking schemas
        └── index.js
```

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/areej21jun25dev-ux/cospace.git
cd cospace
```

### 2. Server

```bash
cd server
npm install
```

Create a `.env` file in `server/`:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/cospace
JWT_SECRET=your_secret_here
```

Run:

```bash
npm run dev
```

Health check: `http://localhost:5000/api/health`

### 3. Client

```bash
cd client
npm install
npm run dev
```

App runs at `http://localhost:5173`

## Database Schemas

- **User:** name, email, password, role (`employee` | `admin`)
- **Resource:** name, type (`desk` | `room`), floor, capacity, amenities, isActive
- **Booking:** user, resource, startTime, endTime, status (`confirmed` | `cancelled`)

## Progress

- [x] Module 1: Project setup, responsive UI, database connection and schemas
- [ ] Module 2: Authentication
- [ ] Module 3: Resource and booking APIs
- [ ] Module 4: Admin panel and deployment