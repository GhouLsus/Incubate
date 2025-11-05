# 🍬 Sweet Bliss – Online Sweet Shop

Sweet Bliss is a full-stack web application for managing and purchasing sweets online.  
It’s designed with a beautiful UI and follows a clean backend architecture using **FastAPI** and a **React + TypeScript** frontend.

Users can browse, search, and purchase sweets, while admins can manage the sweet inventory (add, delete, or restock sweets).  
This project demonstrates clean coding practices, frontend-backend integration, authentication, and responsible AI-assisted development.

---

## 🧠 Project Overview

| Feature | Description |
|----------|-------------|
| 👤 **Authentication System** | Login & Registration with JWT-based security. |
| 🏪 **User Dashboard** | Displays all available sweets, includes search, filtering, and purchase buttons. |
| 🧁 **Admin Panel** | Admins can add, delete, and restock sweets with an intuitive UI. |
| 🎨 **Modern UI/UX** | Built using Tailwind CSS with gradient backgrounds and sparkle animations. |
| 🔒 **Backend API** | Developed with FastAPI, SQLAlchemy ORM, and JWT authentication. |
| ⚙️ **Database** | SQLite (default) – easily replaceable with PostgreSQL/MySQL. |
| 💻 **Frontend Framework** | React + TypeScript with Axios integration for API calls. |

---

## 🧰 Tech Stack

### 🖥️ Frontend
- React (TypeScript)
- Vite
- Axios
- Tailwind CSS

### ⚙️ Backend
- FastAPI
- SQLAlchemy
- Pydantic
- Passlib (bcrypt)
- Python-Jose (JWT handling)

---

## ⚡ Setup Instructions

### 🪄 Prerequisites
Ensure you have:
- Python 3.10 or higher  
- Node.js 18+  
- npm or yarn  
- Git

---

### 🧱 Backend Setup (FastAPI)

1. Clone the repository:
   ```bash
   git clone https://github.com/GhouLsus/Incubate.git
   cd Incubate
Create and activate a virtual environment:

python -m venv venv
venv\Scripts\activate   # Windows
# or
source venv/bin/activate  # macOS/Linux


Install dependencies:

pip install -r requirements.txt


Run database migrations (creates tables):

python -m app.models.base


(Optional) Seed initial admin and user accounts:

python seed_user.py


Start the FastAPI server:

uvicorn app.main:app --reload


The backend will run on:
👉 http://127.0.0.1:8000

---

🎨 Frontend Setup (React + TypeScript)

Move into the frontend directory:

cd frontend


Install frontend dependencies:

npm install


Create a .env file:

VITE_API_URL=http://127.0.0.1:8000


Start the frontend:

npm run dev


The frontend will run on:
👉 http://127.0.0.1:5173

---

📸 Screenshots
🏠 Dashboard Page

Displays all sweets with search, filters, purchase buttons, and sparkle animation.


⚙️ Admin Panel

Admins can add, delete, and restock sweets.


🔐 Login Page

Simple yet beautiful login interface with gradients.

---

## 💡 API Endpoints Summary

| Method | Endpoint | Description | Access |
|---------|-----------|-------------|--------|
| **POST** | `/api/auth/register` | Register a new user | Public |
| **POST** | `/api/auth/login` | Login and get token | Public |
| **GET** | `/api/sweets/` | Get all sweets | Authenticated |
| **POST** | `/api/sweets/` | Add new sweet | Admin |
| **POST** | `/api/sweets/restock` | Restock a sweet | Admin |
| **POST** | `/api/sweets/purchase` | Purchase a sweet | User |
| **DELETE** | `/api/sweets/{id}` | Delete a sweet | Admin |

---

## 🤖 My AI Usage


🤖 My AI Usage
🧩 Tools Used

ChatGPT (GPT-5) – for planning, debugging, and improving code structure.

GitHub Copilot (limited use) – for code autocompletions and repetitive snippets.

🧠 How I Used AI

I used ChatGPT for:

Debugging backend authentication issues (JWT decoding, bcrypt errors).

Writing structured API logic in FastAPI (register/login routes and dependencies).

Beautifying frontend UI with Tailwind gradients, shadows, and transitions.

Adding sparkle hover animations to sweet cards.

Building Axios API calls with authentication headers.

Writing and formatting this comprehensive README file.

I used GitHub Copilot to:

Auto-complete repetitive React JSX and TypeScript interfaces.

Generate initial structure for forms and UI input handling.

💬 Reflection on AI Impact

Using AI significantly boosted productivity in:

Fixing complex backend logic faster.

Improving UI creativity and design consistency.

Maintaining project flow and preventing context switching.

But every AI suggestion was:

Reviewed manually for accuracy.

Tested in a local development environment.

Modified for clarity, maintainability, and security.

💡 AI enhanced efficiency, but human reasoning ensured correctness.

🧪 Testing (Optional)

You can test the backend API directly at:

http://127.0.0.1:8000/docs


Or via Postman / cURL requests.

---

🏁 Conclusion

Sweet Bliss combines a secure backend, aesthetic frontend, and AI-assisted development workflow.
It showcases clean code, functional design, and modern development practices across the stack.

✨ Author

Hardik Garg
