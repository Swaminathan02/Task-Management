# 📝 Task Management System

A full-stack **Task Management Application** built using **Node.js, Express, MongoDB, and Postman for API documentation**, with frontend served via Express static build.  
The app allows users to **sign up, log in, and manage their tasks (CRUD operations)** with authentication using **JWT**.

🚀 Deployed on **Render**: [Live Demo](https://task-management-deployment.onrender.com/)  
📽️ Watch the **Demo Video**: [Video Link](https://www.loom.com/share/01d5da5c5f354a6f91cd26be648fc772?sid=93a1d29a-946b-4044-9bf4-dda605ed7564)  
📖 API Documentation: [Postman Docs]()

---

## ✨ Features

### 🔐 User Authentication & Authorization
- New users can sign up with a username, email, and password.  
- Secure login using **JWT-based authentication**.  
- Passwords are hashed using **bcrypt** before storing in MongoDB.  
- Protected routes: Only logged-in users (with valid JWT) can access task APIs.  

### 📝 Task Management (CRUD Operations)
- **Create**: Users can add new tasks with title, description, and status.  
- **Read**: Fetch all tasks created by the logged-in user.  
- **Update**: Edit task details (e.g., mark as completed).  
- **Delete**: Remove tasks permanently.  

### 👤 User-Specific Data
- Each task is linked to the user who created it.  
- Users can only manage **their own tasks** (authorization layer).  

### 📦 MongoDB Integration
- Database hosted on **MongoDB Atlas** for cloud access.  
- Mongoose models for **User** and **Task** with schema validation.  

### 🎨 Frontend (React + Express Static Build)
- React frontend bundled and served directly by Express backend.  
- Simple and clean UI for signup, login, and managing tasks.  
- Responsive design for easy use on different devices.  

### 🛡️ Security
- Encrypted password storage.  
- CORS configured to allow only safe domains.  
- JWT tokens ensure secure access to protected routes.  

### 🌍 Deployment on Render
- Full-stack app deployed on **Render** with one-click setup.  
- Both frontend and backend served under the same domain → No CORS issues in production.  
- HTTPS enabled automatically by Render.  

### 📖 API Documentation
- API endpoints tested and documented with **Postman**.  
- Postman Collection included in repo for developers.  
- Public Postman Docs link for easy access.  

### Demo Video
- A walkthrough video explaining project flow, features, and usage.
---

## 📂 Project Structure
