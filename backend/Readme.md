# Blog Post Management System — Backend

A scalable and production-ready backend for a Blog Management System built using Node.js, Express, and MongoDB. This system provides full CRUD functionality, authentication, search, pagination, and CSV export.

---

# Features

## Authentication & Authorization

* User Signup
* User Login using JWT
* Forgot Password with email-based reset flow
* Secure password reset using token
* Password hashing using bcrypt

## Blog Management

* Create blog post
* Update blog post
* Delete blog post
* Get all posts with pagination
* Get single post

## Advanced Functionalities

* Search posts by:

  * Title
  * Author
  * Category
  * Tags
* Combined filtering and pagination
* Export posts to CSV (all or filtered results)

## Additional Features

* Input validation using Joi
* Centralized error handling
* Clean architecture (Controller-Service pattern)
* Environment-based configuration
* Consistent API response structure

---

# Tech Stack

* Backend: Node.js, Express.js
* Database: MongoDB with Mongoose
* Authentication: JWT, bcrypt
* Validation: Joi
* Email Service: Nodemailer
* CSV Export: json2csv

---

# Project Structure

```
backend/
│
├── src/
│   ├── config/          
│   │   └── db.js
│   │
│   ├── controllers/     
│   │   ├── post.controller.js
│   │   └── auth.controller.js
│   │
│   ├── middlewares/     
│   │   ├── error.middleware.js
│   │   └── validate.middleware.js
│   │
│   ├── models/          
│   │   ├── post.model.js
│   │   └── user.model.js
│   │
│   ├── routes/          
│   │   ├── post.routes.js
│   │   └── auth.routes.js
│   │
│   ├── services/        
│   │   ├── post.service.js
│   │   └── auth.service.js
│   │
│   ├── utils/           
│   │   ├── csvExporter.js
│   │   ├── sendEmail.js
│   │   └── token.js
│   │
│   ├── validations/     
│   │   └── post.validation.js
│   │
│   └── app.js
│
├── server.js
├── .env
├── package.json
```

---

# Installation and Setup

## Prerequisites

* Node.js installed
* MongoDB installed locally or a cloud instance

## Steps

1. Clone the repository

```
git clone <repository-url>
cd backend
```

2. Install dependencies

```
npm install
```

3. Create a `.env` file

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/blog-system

JWT_SECRET=your_jwt_secret
JWT_EXPIRE=1d

EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

CLIENT_URL=http://localhost:3000
```

4. Run the server

```
npm run dev
```

Server will start at:

```
http://localhost:5000
```

---

# API Endpoints

## Authentication APIs

### Signup

POST /api/auth/signup

Request body:

```
{
  "name": "Harsh Kumar",
  "email": "harsh@example.com",
  "password": "123456"
}
```

---

### Login

POST /api/auth/login

Request body:

```
{
  "email": "harsh@example.com",
  "password": "123456"
}
```

---

### Forgot Password

POST /api/auth/forgot-password

Request body:

```
{
  "email": "harsh@example.com"
}
```

---

### Reset Password

PUT /api/auth/reset-password/:token

Request body:

```
{
  "password": "newpassword123"
}
```

---

## Blog APIs

### Create Post

POST /api/posts

Request body:

```
{
  "title": "Mastering React",
  "shortDescription": "A quick guide",
  "content": "Full content here...",
  "author": "Harsh Kumar",
  "category": "Technology",
  "tags": "react, javascript",
  "imageUrl": "https://example.com/image.png",
  "status": "on"
}
```

---

### Get All Posts (Pagination + Search)

GET /api/posts

Query parameters:

```
?page=1
&limit=10
&search=react
&author=Harsh
&category=Technology
&tags=react,javascript
```

---

### Get Single Post

GET /api/posts/:id

---

### Update Post

PUT /api/posts/:id

---

### Delete Post

DELETE /api/posts/:id

---

### Export Posts to CSV

GET /api/posts/export

Optional query parameters:

```
?author=Harsh&category=Technology
```

---

# Data Model

## Post Schema

* title: String
* shortDescription: String
* content: String
* author: String
* category: String
* tags: Array of strings
* imageUrl: String
* status: on | off
* createdAt, updatedAt: timestamps

## User Schema

* name: String
* email: String (unique)
* password: String (hashed)
* resetPasswordToken: String
* resetPasswordExpire: Date

---

# Security Practices

* Passwords are hashed using bcrypt
* JWT used for authentication
* Reset tokens are hashed before storing
* Token expiry implemented
* Input validation on all endpoints

---

# Error Handling

* Centralized error middleware
* Proper HTTP status codes
* Consistent error response format

Example:

```
{
  "success": false,
  "message": "Error message"
}
```

---

# Future Improvements

* Role-based access control
* Image upload via Cloudinary
* Rich text editor integration
* Comments and likes system
* Rate limiting and API security
* Refresh token implementation
