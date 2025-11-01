# Sweet Shop Management System

## Overview
Sweet Shop Management System is a full-stack platform for confectionery management. Customers can register, browse sweets, and make purchases, while administrators have a dedicated dashboard to add, edit, restock, or delete sweets. The system uses JWT authentication, FastAPI services, and a responsive Next.js frontend.

## Tech Stack
- **Backend:** FastAPI, SQLAlchemy, Alembic, PostgreSQL, Passlib, python-jose
- **Frontend:** Next.js (TypeScript), React Query, React Hook Form, Tailwind CSS, Axios, react-hot-toast
- **Authentication:** JWT access + refresh tokens
- **Testing:** pytest, httpx, Cypress
- **Tooling:** Docker Compose, Alembic migrations

## Setup Instructions
1. **Clone the repository** and ensure Python 3.11+, Node 18+, and Docker are installed.
2. **Backend setup**
   ```bash
   cd backend  # adjust if backend lives at repo root
   python -m venv .venv
   source .venv/bin/activate
   pip install -r requirements.txt
   cp .env.example .env
   alembic upgrade head
   uvicorn app.main:app --reload
   ```
3. **Frontend setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
4. **Docker (optional)**
   ```bash
   docker-compose up -d
   ```

## Running Tests
- **Backend unit/API tests**
  ```bash
  cd backend
  pytest
  ```
- **Frontend E2E tests (requires backend + frontend running)**
  ```bash
  cd frontend
  npm run cypress:open   # interactive
  # or
  npm run cypress:run    # headless
  ```

## API Documentation
- Swagger UI lives at: `http://localhost:8000/docs`

## Screenshots
Add screenshots of customer and admin dashboards here.