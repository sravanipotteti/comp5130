# **SafeNotes**

## **Overview**

SafeNotes is a **Secure Note Sharing Application** that allows users to **create**, **share**, and **manage self-destructing notes** with encryption and customizable options. Inspired by Privnote, this application ensures the **privacy**, **security**, and **integrity** of shared notes.

---

## **Key Features**

- **Encrypted Notes**:  
   All notes are securely encrypted before storage using strong encryption algorithms.

- **Self-Destruction**:  
   Notes are destroyed automatically:  
   - Upon being read ("After Reading").  
   - Based on custom expiration times: **"1 Hour," "24 Hours," "7 Days," or "30 Days."**

- **Password Protection**:  
   Optional password-based protection for added security.

- **Notification System**:  
   Send email notifications when a note is accessed.

- **Audit Logging**:  
   Log note creation, access, and deletion activities for monitoring purposes.

- **Unique Note Links**:  
   Each note generates a **unique URL** for easy and secure sharing.

- **HTTPS Security**:  
   End-to-end encryption is ensured through **HTTPS protocols**.

---

## **Technologies Used**

### **Frontend**
- **React.js**: For building an interactive and responsive user interface.  
- **Material UI**: For modern and clean UI components.

### **Backend**
- **Node.js** and **Express.js**: For building a RESTful API.  
- **MongoDB**: As the database to store encrypted note content.  
- **Mongoose**: For MongoDB schema management.

### **Security**
- **Encryption**: AES-based encryption for securing note content.  
- **JWT (JSON Web Tokens)**: For user authentication and route protection.  
- **Nodemailer**: For email notifications.

---

## **Project Structure**

```bash
root/
│── backend/           # Node.js Backend
│    ├── routes/       # API routes
│    ├── models/       # Mongoose models
│    ├── middleware/   # JWT and Auth middleware
│    ├── utils/        # Encryption utilities
│    └── server.js     # Backend entry point
│
│── frontend/          # React.js Frontend
│    ├── public/       # Static assets
│    ├── src/          # React components and pages
│    └── App.js        # Main React app
│
│── package.json       # Project configuration
└── README.md          # Project documentation

```
---

## **Installation**

### **Prerequisites**
Before starting, ensure you have the following installed:
- **Node.js** and **npm** on your machine.
- **MongoDB** set up locally or via a cloud provider.

---
---

### **Steps to Setup**

1. **Clone the Repository**
   Open your terminal and run the following commands:

   ```bash
   git clone https://github.com/your-username/comp5130.git
   cd comp5130
    ```
2. **Backend Setup**
    Navigate to the backend folder and install the dependencies:
   ```bash
   cd backend
   npm install
   ```
3. **Frontend Setup**
    Navigate to the frontend folder and install the dependencies:
   ```bash
   cd frontend
   npm install
   ```
4. **Configure Environment Variables**

   **Backend Configuration:**
   Create a .env file in the backend folder and add the following:
    ```bash

   MONGO_URI=mongodb+srv://sravanipotteti0203:Malathi%40s07@cluster0.5gykw.mongodb.net/myDatabase?retryWrites=true&w=majority
   JWT_SECRET=7adb8f29bc314c1583ebbd5b0fd17104e0c4e35c425f5c7a6276d1f02018996a9081ca588c9fcf1013cb1dc76fdf9052663d1e90e2459470b446b596792ab077
     ```
5. **Run The Application**
   ***for frontend***
   ```bash
   npm start
   ```
   ***for backend***
   ```bash
   node server.js
   ```
   

   ***The backend server will run on:***
   ```bash
   https://localhost:5000
   ```
   ***The frontend server will run on:***
   ```bash
   https://localhost:3000
   ```

6. ## **API Documentation**

| **Method** | **Endpoint**       | **Description**                  | **Auth Required** |
|------------|--------------------|----------------------------------|-------------------|
| **POST**   | `/api/auth/login`  | Logs in the user and returns a JWT | No                |
| **POST**   | `/api/note`        | Creates a new encrypted note      | Yes               |
| **GET**    | `/api/note/:id`    | Fetches and deletes the note      | Yes               |
| **DELETE** | `/api/note/:id`    | Deletes the note explicitly       | Yes               |
