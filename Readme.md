# MERN Multi-Tenant SaaS Notes Application

## Description  
This is a full-stack multi-tenant SaaS web application built using the MERN stack (MongoDB, Express, React, Node.js) with subscription-based feature gating, role-based access control, and user management. The app allows multiple tenant organizations to securely manage their notes with Admin and Member roles. Free tenants have a limited note quota, while Pro tenants enjoy unlimited usage and Admins can invite users or upgrade their subscriptions.

---
## Deployment

- Frontend URL: [https://multi-tenant-saas-frontend.vercel.app/](Frontend Link)  
- Backend URL: [https://multi-tenant-saas-notes-application-two.vercel.app/](Backend Link)

---

## Features  
- Multi-tenant architecture with strict data isolation.  
- JWT-based user authentication with email/password.  
- Role-based access control for Admin and Member.  
- Tenant subscription plans: Free and Pro with note limits.  
- User invitation system by Admins.  
- Real-time UI updates with React and Axios.  
- Production ready with environment-based configuration.

---

## Technologies  
- **MongoDB** for flexible, scalable NoSQL data storage.  
- **Express.js** REST API backend with Node.js.  
- **React & Vite** for fast, modular frontend development.  
- **JWT + bcrypt** for secure user authentication and password protection.  
- **Vercel** for easy cloud deployment of frontend and backend.

---

