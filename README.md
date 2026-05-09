# Intern App Setup Guide

# Project Overview

Intern App is a simple CRUD application built using:

- Next.js
- TypeScript
- Tailwind CSS
- MySQL
- JWT Authentication
- Role Based Access Control

Features:
- User Registration
- User Login
- JWT Authentication
- Admin/User Roles
- Product CRUD
- Protected API Routes
- Floating Modals
- Responsive Dashboard

---

# Requirements

Install these first:

- Node.js v20+
- MySQL Server
- npm

Check versions:

```bash
node -v
npm -v
mysql --version
```

---

# Create Project

```bash
npx create-next-app@latest intern-app
```

Choose:
- TypeScript → Yes
- ESLint → Yes
- Tailwind CSS → Yes
- App Router → Yes

Move into project:

```bash
cd intern-app
```

---

# Install Packages

```bash
npm install mysql2 bcryptjs jsonwebtoken jwt-decode
```

Install type packages:

```bash
npm install -D @types/jsonwebtoken
```

---

# Run Development Server

```bash
npm run dev
```

Open:

```txt
http://localhost:3000
```

---

# MySQL Database Setup

Login to MySQL:

```bash
mysql -u root -p
```

Create database:

```sql
CREATE DATABASE intern_app;
```

Use database:

```sql
USE intern_app;
```

---

# Create Users Table

```sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    password TEXT,
    role ENUM('admin', 'user') DEFAULT 'user'
);
```

---

# Create Products Table

```sql
CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255),
    description TEXT,
    price DECIMAL(10,2)
);
```

---

# Insert Sample Products

```sql
INSERT INTO products (
    title,
    description,
    price
)
VALUES
(
    'Laptop',
    'Gaming laptop',
    50000
),
(
    'Phone',
    'Android smartphone',
    20000
),
(
    'Keyboard',
    'Mechanical keyboard',
    2500
);
```

---

# Make Admin User

After registering normally:

```sql
UPDATE users
SET role = 'admin'
WHERE email = 'admin@example.com';
```

---

# Environment Variables

Create:

```txt
.env
```

Add:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=intern_app

JWT_SECRET=your_super_secret_key
```

---

# Project Structure

```txt
app/
│
├── api/
│   ├── auth/
│   │   ├── login/
│   │   └── register/
│   │
│   └── products/
│       └── [id]/
│
├── dashboard/
├── login/
├── register/
│
├── lib/
│   ├── api.ts
│   ├── auth.ts
│   └── db.ts
│
└── components/
    └── Button.tsx
```

---

# Database Connection

Create:

```txt
app/lib/db.ts
```

Example:

```ts
import mysql from "mysql2/promise";

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

export default pool;
```

---

# JWT Authentication

Token contains:

```json
{
  "userId": 1,
  "name": "Vignesh",
  "email": "user@example.com",
  "role": "admin"
}
```

The frontend stores token in:

```txt
localStorage
```

Requests use:

```http
Authorization: Bearer <token>
```

---

# API Helper

Create:

```txt
app/lib/api.ts
```

Example:

```ts
export async function apiFetch(
    url: string,
    options: RequestInit = {}
) {
    const token =
        localStorage.getItem("token");

    return fetch(url, {
        ...options,
        headers: {
            "Content-Type":
                "application/json",
            Authorization:
                `Bearer ${token}`,
            ...options.headers,
        },
    });
}
```

---

# Middleware Helpers

Create:

```txt
app/lib/auth.ts
```

Functions:
- verifyToken()
- requireAuth()
- requireAdmin()

Used for:
- route protection
- admin checks
- JWT validation

---

# Run Application

```bash
npm run dev
```

Open:

```txt
http://localhost:3000
```

---

# User Flow

## Register

```txt
/register
```

Creates:
- normal user account

---

## Login

```txt
/login
```

Returns:
- JWT token

---

## Dashboard

```txt
/dashboard
```

User:
- view products only

Admin:
- add products
- edit products
- delete products

---

# CRUD Operations

## Create Product
Admin only

## Read Products
Everyone

## Update Product
Admin only

## Delete Product
Admin only

---

# Floating Modals

The app uses floating modal UI for:
- Add Product
- Edit Product

No separate pages needed.

---

# Button Component

Reusable button supports:
- loading state
- animations
- full width
- custom styles

Used everywhere in the app.

---

# Common Errors

## JSON Parse Error

Cause:
- empty request body

Fix:
- wrap `req.json()` inside try/catch

Example:

```ts
try {
    body = await req.json();
} catch {
    return NextResponse.json({
        success: false,
        message: "Invalid data"
    });
}
```

---

## JWT Type Error

Install types:

```bash
npm install -D @types/jsonwebtoken
```

---

## Turbopack Crash

Use:

```bash
next dev
```

instead of experimental turbopack.

---

# Build Production

```bash
npm run build
```

Start production:

```bash
npm start
```

---

# Technologies Used

- Next.js
- React
- TypeScript
- Tailwind CSS
- MySQL
- JWT
- bcryptjs

---

# Completed Features

- Authentication
- Role Based Access
- CRUD APIs
- Product Dashboard
- Floating Modals
- Loading Buttons
- JWT Protection
- MySQL Integration
- API Helpers
- Admin Protection

---

# Future Improvements

- Search products
- Pagination
- Image upload
- Profile page
- Refresh tokens
- Server-side auth
- Better form validation
- Toast notifications
- Dark mode