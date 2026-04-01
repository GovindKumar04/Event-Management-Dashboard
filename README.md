# Event Management Dashboard

A full-stack Event Management Dashboard where **organizers** can create and manage events, and **users** can browse and register for them.  
The project supports **cookie-based authentication**, **role-based access control**, **real-time registration updates**, and **email notifications** on successful registration.

---

## Features

### Authentication
- User registration
- User login
- Logout
- Cookie-based authentication using **HTTP-only cookies**
- Persistent session check with `/auth/me`

### Role-Based Access
- **Organizer**
  - Create events
  - View created events
  - Track registrations on their events
- **User**
  - Browse all events
  - View event details
  - Register for events
  - View registered events

### Event Management
- Create new events
- View all events
- View single event details
- Prevent duplicate event registration

### Real-Time Updates
- Live registration count updates using **Socket.io**
- Registration count updates instantly across pages

### Notifications
- Email confirmation sent after successful event registration

---

## Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS
- Redux Toolkit
- React Router DOM
- Axios
- Socket.io Client

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Cookie Parser
- Socket.io
- Nodemailer

---

## Project Structure

## Frontend

```text
event-dashboard-frontend/
├── src/
│   ├── api/
│   │   ├── axios.js
│   │   ├── auth.api.js
│   │   └── event.api.js
│   ├── app/
│   │   ├── App.jsx
│   │   └── routes.jsx
│   ├── components/
│   │   ├── EventCard.jsx
│   │   ├── Navbar.jsx
│   │   └── ProtectedRoute.jsx
│   ├── pages/
│   │   ├── CreateEvent.jsx
│   │   ├── Dashboard.jsx
│   │   ├── EventDetails.jsx
│   │   ├── Events.jsx
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   ├── redux/
│   │   ├── authSlice.js
│   │   ├── eventSlice.js
│   │   └── store.js
│   ├── socket/
│   │   └── socket.js
│   ├── index.css
│   └── main.jsx