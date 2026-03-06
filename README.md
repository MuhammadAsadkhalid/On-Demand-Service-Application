# Brand Spark: On-Demand Service Application 🛠️

Sparking your home and office with premium on-demand services. This is a comprehensive full-stack ecosystem designed to connect users with professional service providers seamlessly.

## 🚀 Project Overview
Brand Spark is a modern, high-performance platform for booking on-demand home services. From electrical fixes to professional cleaning, the application provides a smooth experience for users, a management portal for service providers, and a powerful dashboard for administrators to monitor the entire business.

## 🛠️ Tech Stack Explanation

### 🌐 Backend (Server)
- **Node.js & TypeScript**: Core runtime for a scalable, type-safe API.
- **Express**: Fast, unopinionated web framework for routing.
- **MySQL & Sequelize**: Relational database with a powerful ORM for complex data modeling.
- **JWT (JSON Web Tokens)**: Secure, stateless authentication.
- **Bcrypt.js**: Industry-standard password hashing.

### 💻 Admin Panel (Web)
- **Next.js**: Hybrid static & server rendering for SEO-optimized management tools.
- **Tailwind CSS**: Utility-first styling for a sleek, premium design.
- **Lucide React**: Beautiful, consistent iconography.
- **React Query**: Advanced data-fetching and caching for real-time dashboard updates.

### 📱 Mobile App (Cross-Platform)
- **React Native & Expo**: Single codebase for high-quality iOS and Android apps.
- **Lucide React Native**: Mobile-optimized icons.
- **React Navigation**: Intuitive tab and stack-based user journeys.
- **Axios**: Robust HTTP client for API communication.

## ⚙️ Setup Instructions

### 1. Backend Setup
```bash
cd backend
npm install
npm run dev
```
*The server will start on `http://localhost:5000`. The database will automatically synchronize and seed default data.*

### 2. Admin Panel Setup
```bash
cd admin-panel
npm install
npm run dev
```
*Access the dashboard at `http://localhost:3000`. Make sure the backend is running first.*

### 3. Mobile App (Expo)
```bash
cd mobile-app
npm install
npx expo start
```
*Use the Expo Go app on your phone or an emulator to scan the QR code.*

## 🔑 Sample Credentials
Use these pre-seeded accounts to explore the platform:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@spark.com` | `admin123` |
| **Provider** | `provider@example.com` | `password123` |
| **User/Client** | `user@example.com` | `password123` |

## 📊 Database Entities
- **Roles**: Manages access levels (Admin, Provider, User).
- **Users**: Secured profiles with Base64 image support.
- **Categories**: Hierarchical grouping for service discoverability.
- **Services**: Dynamic service listings with pricing and status.
- **Bookings**: Real-time transaction flow (Pending -> Accepted -> Completed).
- **Notifications**: Instant feedback for booking status changes.

---
Built with hardwork ✨ for the Assessment.
