## API

- Auth: `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me` (protected)
- Resources: `GET /api/resources`, `GET /api/resources/:id` (protected), `POST /api/resources`, `PUT /api/resources/:id`, `DELETE /api/resources/:id` (admin only)
- Bookings: `POST /api/bookings`, `GET /api/bookings/me`, `GET /api/bookings/resource/:id?date=YYYY-MM-DD`, `DELETE /api/bookings/:id` (cancel), `GET /api/bookings` (admin only)

## Features

- Register and login with JWT, role based access (employee, admin)
- Browse desks and meeting rooms with type filter, floor filter and search
- Book a time slot with double booking prevention
- My Bookings with upcoming and history tabs, cancel with confirmation
- Admin dashboard: add, edit, remove resources and view or cancel all bookings

## Seed data

```bash
cd server
node src/seed.js
```

## Progress

- [x] Module 1: Project setup, responsive UI, database connection and schemas
- [x] Module 2: Authentication (register, login, JWT, protected routes, admin role)
- [x] Module 3: Resource and booking APIs, booking UI, My Bookings, admin dashboard
- [ ] Module 4: Polish and deployment