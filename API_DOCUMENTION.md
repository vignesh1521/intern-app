# Intern App API Documentation

## Base URL

```txt
http://localhost:3000
```

---

# Authentication

The application uses JWT authentication.

The token is sent using:

```http
Authorization: Bearer <token>
```

Some endpoints require:
- authenticated user
- admin role

---

# Auth Endpoints

## Register User

### Endpoint

```http
POST /api/auth/register
```

### Request Body

```json
{
  "name": "Vignesh",
  "email": "vignesh@example.com",
  "password": "123456"
}
```

### Success Response

```json
{
  "success": true,
  "message": "Registration successful"
}
```

### Error Responses

#### Missing Fields

```json
{
  "success": false,
  "message": "All fields are required"
}
```

#### User Already Exists

```json
{
  "success": false,
  "message": "User already exists"
}
```

---

## Login User

### Endpoint

```http
POST /api/auth/login
```

### Request Body

```json
{
  "email": "vignesh@example.com",
  "password": "123456"
}
```

### Success Response

```json
{
  "success": true,
  "message": "Login successful",
  "token": "JWT_TOKEN"
}
```

### Error Response

```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

---

# Product Endpoints

# Get All Products

### Endpoint

```http
GET /api/products
```

### Authentication

Not required

### Success Response

```json
{
  "success": true,
  "products": [
    {
      "id": 1,
      "title": "Laptop",
      "description": "Gaming laptop",
      "price": 50000
    }
  ]
}
```

---

# Create Product

### Endpoint

```http
POST /api/products
```

### Authentication

Admin only

### Headers

```http
Authorization: Bearer <token>
```

### Request Body

```json
{
  "title": "Keyboard",
  "description": "Mechanical keyboard",
  "price": 2500
}
```

### Success Response

```json
{
  "success": true,
  "message": "Product created",
  "product": {
    "id": 5,
    "title": "Keyboard",
    "description": "Mechanical keyboard",
    "price": 2500
  }
}
```

### Error Response

```json
{
  "success": false,
  "message": "All fields are required"
}
```

# Update Product

### Endpoint

```http
PUT /api/products/:id
```

### Authentication

Admin only

### Headers

```http
Authorization: Bearer <token>
```

### Request Body

```json
{
  "title": "Updated Laptop",
  "description": "Updated description",
  "price": 60000
}
```

### Success Response

```json
{
  "success": true,
  "message": "Product updated"
}
```

### Error Response

```json
{
  "success": false,
  "message": "Product not found"
}
```

---

# Delete Product

### Endpoint

```http
DELETE /api/products/:id
```

### Authentication

Admin only

### Headers

```http
Authorization: Bearer <token>
```

### Example

```http
DELETE /api/products/1
```

### Success Response

```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

### Error Response

```json
{
  "success": false,
  "message": "Product not found"
}
```

---

# Roles

## User Role

Allowed actions:
- View dashboard
- View products

Cannot:
- Create products
- Update products
- Delete products

---

## Admin Role

Allowed actions:
- View dashboard
- Create products
- Update products
- Delete products

---

# Database Tables

# Users Table

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

# Products Table

```sql
CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255),
    description TEXT,
    price DECIMAL(10,2)
);
```

---

# Sample Product Data

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

# Authentication Helper Functions

## requireAuth()

Used for:
- protected routes
- validating JWT token

---

## requireAdmin()

Used for:
- admin-only routes
- checking admin role

---

# Frontend Features

- Login
- Register
- JWT Authentication
- Role Based Access
- Product CRUD
- Add Product Modal
- Edit Product Modal
- Delete Product
- Loading Buttons
- Tailwind UI

---

# Technologies Used

- Next.js
- React
- TypeScript
- Tailwind CSS
- MySQL
- JWT
- bcryptjs