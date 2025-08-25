# DTA-Osmose CRM

This application consists of:

* **Backend** (Node.js + Express + Prisma) containerized with Docker
* **Database** PostgreSQL containerized with Docker
* **Frontend** Next.js (runs locally outside Docker)

---

## Prerequisites

* [Docker](https://www.docker.com/) & Docker Compose installed
* [Node.js](https://nodejs.org/) (>=18) and npm
* Prisma CLI (`npx prisma …`)

---

## Configuration

### 1. Environment Variables

#### Backend (`.env`)

Create a `backend/.env` file:

```env
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/osmose
PORT=5003
```

#### Frontend (`.env.local`)

Create a `dta-osmose-crm/dta-osmose-ui/.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:5003
```

---

## Running the Application

### 1. Start the containers (backend + DB)

From the project root:

```bash
docker compose up -d
```

Check if containers are running:

```bash
docker ps
```

### 2. Apply Prisma migrations

```bash
docker exec -it dta-osmose-core-backend-1 npx prisma migrate deploy
```

### 3. Seed the database

```bash
docker exec -it dta-osmose-core-backend-1 npm run seed
```

### 4. Run the frontend

In another terminal:

```bash
cd dta-osmose-crm/dta-osmose-ui
npm install
npm run dev
```

Frontend available at: [http://localhost:3000](http://localhost:3000)
Backend available at: [http://localhost:5003](http://localhost:5003)

---

## Useful Commands

### Reset the database (deletes all data)

```bash
docker exec -it dta-osmose-core-backend-1 npx prisma migrate reset --force
docker exec -it dta-osmose-core-backend-1 npm run seed
```

### Backend logs

```bash
docker logs -f dta-osmose-core-backend-1
```

### Postgres logs

```bash
docker logs -f dta-osmose-core-postgres-1
```

---

## Project Structure

```
.
├── backend/          # API Node.js + Prisma
│   ├── prisma/       # Migrations + seed
│   ├── src/          # Server code
│   └── Dockerfile
├── frontend/         # Next.js app
│   └── pages/        # UI React
├── docker-compose.yml
└── README.md
```

---

## Quick Check

* Visit [http://localhost:3000](http://localhost:3000) → frontend should load
* Visit [http://localhost:5003/api/products](http://localhost:5003/api/products) → backend should return JSON

---

