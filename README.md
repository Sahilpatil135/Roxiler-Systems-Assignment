# Roxiler Systems Assignment - Store Review Platform

A full-stack web application for store ratings and reviews. The application features role-based access control, secure authentication, and a modern, responsive user interface built with React, Express, and PostgreSQL.

## 🚀 Features

- **Role-Based Access Control (RBAC):** Supports three distinct roles with tailored permissions:
  - **Admin:** Global oversight over all stores and users. Can manage the entire platform.
  - **Store Owner:** Can create and manage their own store details.
  - **Normal User:** Can browse stores, view ratings, and submit their own ratings.
- **Comprehensive Rating System:** Users can easily rate stores. The system dynamically calculates and displays store scores.
- **Secure Authentication:** Robust user login and registration system utilizing JWT (JSON Web Tokens) for session management and bcrypt for secure password hashing.
- **Interactive Dashboards:** Dedicated, feature-rich dashboards for Admins, Store Owners, and Users, providing role-specific tools and metrics.
- **Modern UI/UX:** A visually stunning and responsive frontend built with React, Tailwind CSS, and Lucide React icons, ensuring a premium user experience across all devices.
- **RESTful API:** A well-structured backend API built with Express.js and Node.js.
- **Database Management:** Utilizes Prisma ORM for type-safe database queries and seamless integration with PostgreSQL.

---

## ⚙️ Full Setup Instructions

Follow these steps to get the project up and running on your local machine.

### Prerequisites
- Node.js (v18 or higher recommended)
- PostgreSQL database

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Roxiler-Systems-Assignment
```

### 2. Server Setup (Backend)

Open a terminal and navigate to the `server` directory:

```bash
cd server
```

Install the required dependencies:

```bash
npm install
```

Set up your environment variables:
Create a `.env` file in the root of the `server` directory and add the following variables:

```env
# Database connection string (PostgreSQL)
DATABASE_URL="postgresql://username:password@localhost:5432/roxiler_db?schema=public"

# JWT Secret for authentication
JWT_SECRET="your_super_secret_jwt_key"

# Port for the Express server
PORT=5000
```

Initialize the database:
Run the following command to push the Prisma schema to your PostgreSQL database.

```bash
npx prisma db push
```

Start the development server:

```bash
npm run dev
```
The server should now be running on `http://localhost:5000`.

### 3. Client Setup (Frontend)

Open a new terminal window and navigate to the `client` directory:

```bash
cd client
```

Install the frontend dependencies:

```bash
npm install
```

Start the Vite development server:

```bash
npm run dev
```

The frontend application should now be accessible in your browser (typically at `http://localhost:5173`).

---

## 🛠️ Technologies Used

**Frontend:**
- React (v19)
- Vite
- Tailwind CSS
- React Router DOM
- React Hook Form
- React Hot Toast

**Backend:**
- Node.js
- Express.js
- Prisma ORM
- PostgreSQL
- JWT & bcryptjs