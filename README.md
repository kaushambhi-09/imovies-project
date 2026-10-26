# iMovies – Movie Ticket Booking (MERN)

React (Vite) + Node/Express + MongoDB (Mongoose) with JWT auth, MVC backend, live seat map, and bookings.

---

## 🚀 Features
- **Authentication**: JWT-based user & admin auth with protected routes and role verification.
- **Seat Map & Live Booking**: Atomic seat booking prevents race conditions and duplicate claims.
- **Admin Management**: Dedicated admin portal to create theatres, schedule shows, and manage movies.
- **Reviews & Favorites**: Users can leave reviews and toggle watchlist/favorites.
- **Production-Ready**: Configured for seamless deployment on **Render** (via Blueprint or individual services) and **MongoDB Atlas**.

---

## 🛠️ Project Structure
```text
imovies/
├── client/                     # Vite + React Frontend
│   ├── public/_redirects       # SPA redirect rule for Render/Netlify
│   ├── src/                    # Components, pages, context, api
│   ├── package.json
│   └── vite.config.js
├── server/                     # Node.js + Express Backend
│   ├── config/                 # DB connection (MongoDB / Mongoose)
│   ├── controllers/            # Route controllers
│   ├── middleware/             # Auth and error middleware
│   ├── models/                 # Mongoose schemas
│   ├── routes/                 # Express API routes
│   ├── utils/                  # Seed data, seat generator, helpers
│   ├── server.js
│   └── package.json
├── package.json                # Root package for unified build and scripts
└── render.yaml                 # Render Blueprint configuration
```

---

## 💻 Local Development

### 1. Prerequisites
- **Node.js** 18+ and **npm**
- **MongoDB** running locally or a **MongoDB Atlas URI**

### 2. Quick Start
```bash
# Clone the repository
git clone <your-repo-url>
cd imovies

# Install dependencies for both client and server
npm run install:all

# Configure Server Environment
cd server
cp .env.example .env
# Edit server/.env and provide:
# PORT=8000
# MONGO_URI=mongodb://127.0.0.1:27017/imovies  (or your Atlas connection string)
# JWT_SECRET=your_super_secret_key
# CLIENT_URL=http://localhost:5173
# ADMIN_REGISTER_KEY=your_admin_secret_key

# (Optional) Seed the database with sample movies, theatres, and shows:
npm run seed
# Default Admin credentials: admin@imovies.com / admin12345

# Start backend server
npm run dev

# In another terminal, start client:
cd ../client
cp .env.example .env
npm run dev
```

Frontend runs at `http://localhost:5173` and backend runs at `http://localhost:8000`.

---

## 🌐 Deploying to MongoDB Atlas

1. **Sign up / Log in** to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. **Create a Free Cluster**:
   - Choose the **M0 Free Tier** cluster (Shared).
   - Select your preferred cloud provider and closest region, then click **Create Deployment**.
3. **Set up Security**:
   - **Database Access**: Click **Database Access** -> **Add New Database User**. Choose *Password Authentication*, create a username and password (e.g. `imovies_admin` / `<secure-password>`), and grant **Read and write to any database**.
   - **Network Access**: Click **Network Access** -> **Add IP Address** -> Select **Allow Access from Anywhere** (`0.0.0.0/0`) -> Click **Confirm**. (Required for cloud services like Render).
4. **Get Connection String**:
   - Go to **Database** -> Click **Connect** on your cluster.
   - Choose **Drivers** (Node.js).
   - Copy the connection string URI. It will look like:
     ```
     mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/imovies?retryWrites=true&w=majority
     ```
   - Replace `<username>` and `<password>` with your database user credentials.

---

## 🚢 Deploying to Render

You can deploy the app to Render in either of two ways:

### Option A: Render Blueprint (Easiest - 1 Click)
1. Push your repository to **GitHub**.
2. Go to your [Render Dashboard](https://dashboard.render.com/).
3. Click **New +** -> **Blueprint**.
4. Connect your GitHub repository.
5. Render will automatically detect `render.yaml` and configure both the backend web service and the frontend static site.
6. Provide your **`MONGO_URI`** and **`ADMIN_REGISTER_KEY`** in the prompt and click **Apply**.

### Option B: Manual Setup on Render

#### 1. Backend Web Service
- In Render Dashboard, click **New +** -> **Web Service**.
- Connect your GitHub repo.
- Configure:
  - **Name**: `imovies-api`
  - **Root Directory**: `server`
  - **Runtime**: `Node`
  - **Build Command**: `npm install`
  - **Start Command**: `npm start`
- Add **Environment Variables**:
  - `NODE_ENV`: `production`
  - `MONGO_URI`: `<your-mongodb-atlas-uri>`
  - `JWT_SECRET`: `<generate-a-random-secret>`
  - `ADMIN_REGISTER_KEY`: `<your-custom-admin-key>`
  - `CLIENT_URL`: `https://imovies-client.onrender.com` (your client frontend URL)
- Click **Deploy Web Service**.

#### 2. Frontend Static Site
- In Render Dashboard, click **New +** -> **Static Site**.
- Connect the same GitHub repo.
- Configure:
  - **Name**: `imovies-client`
  - **Root Directory**: `client`
  - **Build Command**: `npm install && npm run build`
  - **Publish Directory**: `dist`
- Add **Environment Variable**:
  - `VITE_API_URL`: `https://imovies-api.onrender.com/api` (your backend service URL + `/api`)
- Under **Redirects/Rewrites**:
  - Render will automatically use `client/public/_redirects` (`/* -> /index.html 200`) so React Router routes work smoothly on page refreshes.
- Click **Deploy Static Site**.

---

## 📡 API Endpoints

| Area | Endpoints |
|---|---|
| **Health** | `GET /api/health` |
| **Auth** | `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/admin/register`, `POST /api/auth/admin/login`, `GET /api/auth/me` |
| **Movies** | `GET /api/movies?search=&genre=&language=`, `GET /api/movies/:id`, `POST/PUT/DELETE /api/movies` (Admin) |
| **Theatres** | `GET /api/theatres`, `POST/DELETE /api/theatres` (Admin) |
| **Shows** | `GET /api/shows/movie/:movieId`, `GET /api/shows/:id` (seat map), `POST/DELETE /api/shows` (Admin) |
| **Bookings** | `POST /api/bookings`, `GET /api/bookings/mine`, `PUT /api/bookings/:id/cancel`, `GET /api/bookings` (Admin) |
| **Watchlist** | `GET /api/favorites`, `POST /api/favorites/:movieId` (toggle) |
| **Reviews** | `GET /api/reviews/movie/:id`, `POST /api/reviews/movie/:id`, `DELETE /api/reviews/:id` (Admin) |

---

## 🛡️ License
ISC
