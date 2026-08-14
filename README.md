# 🗺️ TripVault — Travel Memory & Trip Management Application

![TripVault Banner](https://img.shields.io/badge/TripVault-Full%20Stack%20MERN-blue?style=for-the-badge&logo=react)
![CodGen Internship](https://img.shields.io/badge/CodGen-Virtual%20Internship-purple?style=for-the-badge)
![Status](https://img.shields.io/badge/Week%204-Completed%20%F0%9F%8E%93-brightgreen?style=for-the-badge)

> **TripVault** is a full-stack MERN (MongoDB, Express, React, Node.js) web application designed for travelers to record, organize, and share their travel journeys. Features include JWT authentication, interactive location verification via OpenStreetMap, Cloudinary photo gallery uploads, and public traveler profile pages.

---

## 🚀 Live Demos

* **Frontend App (Vercel)**: `http://localhost:5000`
* **Backend API (Render)**: http://localhost:5173/

---

## 🌟 Deliverables & Feature Highlights

### 🔐 Week 1: Authentication & User Accounts
- **User Registration & Login**: Password hashing with `bcryptjs` and stateless session handling via JSON Web Tokens (`jwt`).
- **Protected Routes**: React Router guards preventing unauthorized access to personal dashboards.
- **Dynamic User Avatars**: Auto-generated initials avatar badges for logged-in travelers.

### 🗺️ Week 2: Trip Management (Full CRUD)
- **Create & Edit Trips**: Record trip title, destination, start/end dates, star rating (1–5), and personal journal notes.
- **Geocoding Validation**: Integrated OpenStreetMap (Nominatim API) to verify destinations exist on world maps.
- **Delete Trips**: Confirmed deletion workflow for removing obsolete trip entries.
- **User Isolation**: Server-side authorization rules ensuring users can only edit or delete their own trips.

### 📸 Week 3: Cloud Media Storage & Public Profiles
- **Cloudinary Storage**: Direct media file upload integration using `multer` and `multer-storage-cloudinary`.
- **Photo Galleries**: High-resolution image galleries attached to individual trip memory logs.
- **Public Profile Showcase**: Shareable public profile route (`/profile/:username`) displaying traveler bio and public trip cards without requiring authentication.
- **Editable Traveler Bio**: Custom bio updating from the main dashboard.

### 🎨 Week 4: UI Polish, Mobile Responsiveness & Deployment (Final Week)
- **Loading & Skeleton States**: Animated pulse skeletons (`SkeletonCard`) and loading spinners (`Spinner`) during async API calls.
- **Toast Notifications**: Interactive toast alerts (`react-toastify`) for login, register, trip CRUD, bio updates, and photo uploads.
- **Empty States**: Custom fallback UI (`EmptyState`) featuring call-to-action buttons when zero trips exist.
- **Mobile Responsive (375px+)**: Fully adapted CSS Flexbox & Grid system working smoothly across mobile (iPhone SE), tablet, and desktop screens without horizontal scroll.
- **Collapsible Hamburger Menu**: Smooth mobile drawer navigation toggle.
- **Production Deployment Configuration**: Vercel SPA rewrite rules (`vercel.json`), central API environment handling (`VITE_API_URL`), and Render API health check endpoints (`/health`).

---

## 🛠️ Tech Stack

| Domain | Technology |
| :--- | :--- |
| **Frontend** | React 19, React Router DOM v7, Axios, React Toastify, Vanilla CSS3 |
| **Backend** | Node.js, Express.js (v5), Mongoose, JWT, BcryptJS |
| **Database** | MongoDB Atlas (Cloud Database) |
| **Media Hosting** | Cloudinary CDN SDK & Multer Storage |
| **Geocoding** | OpenStreetMap (Nominatim API) |
| **Deployment** | Vercel (Client SPA) & Render (Server Web Service) |

---

## 🔌 API Documentation

| Method | Endpoint | Auth | Description |
| :--- | :--- | :---: | :--- |
| **GET** | `/health` | No | API health check for hosting monitoring |
| **POST** | `/api/auth/register` | No | Registers new account |
| **POST** | `/api/auth/login` | No | Authenticates user & returns JWT token |
| **GET** | `/api/auth/me` | Yes | Retrieves authenticated user profile |
| **GET** | `/api/trips` | Yes | Fetches all trips owned by logged-in user |
| **POST** | `/api/trips` | Yes | Creates a new trip entry |
| **GET** | `/api/trips/:id` | Yes | Retrieves single trip details & photos |
| **PUT** | `/api/trips/:id` | Yes | Updates existing trip details |
| **DELETE** | `/api/trips/:id` | Yes | Deletes trip entry |
| **POST** | `/api/trips/:id/upload` | Yes | Uploads photo to Cloudinary & attaches to trip |
| **GET** | `/api/users/:username/profile` | No | Public profile & trips for username |
| **PUT** | `/api/users/profile` | Yes | Updates logged-in user bio |

---

## 💻 Local Development Setup

To run **TripVault** locally in VS Code:

### 1. Clone & Navigate to Project
```powershell
PS C:\Users\Manjunatha K\Codegenproject> git clone https://github.com/manjunathak/TripVault.git
PS C:\Users\Manjunatha K\Codegenproject> cd TripVault
```

### 2. Configure Backend Server (`/server`)
```powershell
PS C:\Users\Manjunatha K\Codegenproject> cd server
PS C:\Users\Manjunatha K\Codegenproject\server> npm install
```

Create a `.env` file in the `server` directory using `.env.example`:
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/tripvault?retryWrites=true&w=majority
JWT_SECRET=your_secret_key_123

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Start backend development server:
```powershell
PS C:\Users\Manjunatha K\Codegenproject\server> npm start

```
*(Backend runs on `http://localhost:5000`)*

### 3. Configure Frontend Client (`/client`)
Open a new VS Code terminal tab:
```powershell
PS C:\Users\Manjunatha K\Codegenproject> cd client
PS C:\Users\Manjunatha K\Codegenproject\client> npm run dev
```

Create a `.env` file in the `client` directory using `.env.example`:
```env
VITE_API_URL=http://localhost:5000
```

Start frontend development server:
```powershell
PS C:\Users\Manjunatha K\Codegenproject\client> npm run dev
```
*(Client runs on `http://localhost:5173`)*

---

## 🚀 Deployment Instructions

### Step 1: MongoDB Atlas Connection
1. Log into [MongoDB Atlas](https://cloud.mongodb.com).
2. Go to **Network Access** → Add IP Address → Click **Allow Access from Anywhere** (`0.0.0.0/0`).

### Step 2: Render Backend Deployment
1. Log into [Render](https://render.com) and click **New Web Service**.
2. Connect your GitHub repository (`TripVault`).
3. Set **Root Directory** to `server`.
4. Set **Build Command** to `npm install`.
5. Set **Start Command** to `node index.js`.
6. Under **Environment Variables**, add:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
7. Click **Deploy Web Service** and copy your live Render URL (e.g. `https://tripvault-api.onrender.com`).

### Step 3: Vercel Frontend Deployment
1. Log into [Vercel](https://vercel.com) and click **Add New Project**.
2. Import your `TripVault` GitHub repo.
3. Set **Root Directory** to `client`.
4. Under **Environment Variables**, add:
   - `VITE_API_URL` = `https://tripvault-api.onrender.com` (Your Render URL).
5. Click **Deploy**. Vercel will build and provide your live application link!

---

## 👨‍💻 Author & Acknowledgments

- **Developer**: **Manjunatha K**
- **GitHub**: [github.com/manjunathak](https://github.com/manjunathak)
- **Program**: CodGen Virtual Internship Program — Full Stack (MERN)
- **Platform**: [CodGen (codgen.in)](https://codgen.in)