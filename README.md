# AI-Based Scholarship and Educational Loan Recommendation System

A full-stack MERN application with a Python (Flask + scikit-learn) AI
microservice that recommends scholarships and education loans to
students based on their academic and financial profile.

## Tech Stack

- **Frontend:** React 18, Redux Toolkit, React Router, Material UI, Chart.js, Formik + Yup, Framer Motion
- **Backend:** Node.js, Express.js, MongoDB (Mongoose), JWT auth, bcrypt, Multer, Nodemailer
- **AI Service:** Python, Flask, scikit-learn (Random Forest / Decision Tree / Gradient Boosting)

## Project Structure

```
project/
├── client/          # React frontend (Vite)
├── server/          # Express backend (REST API)
└── ai/              # Flask AI microservice + ML training pipeline
```

## 1. Prerequisites

- Node.js 18+
- Python 3.10+
- MongoDB (local or Atlas)

## 2. Backend Setup

```bash
cd server
npm install
cp .env.example .env
# edit .env with your MongoDB URI, JWT secret, SMTP credentials, etc.
npm run seed     # populates sample admin account, scholarships and banks
npm run dev      # starts on http://localhost:5000
```

Default admin login created by the seed script:
- Email: `admin@scholarloan.com`
- Password: `Admin@123`

## 3. AI Microservice Setup

```bash
cd ai
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt

python generate_dataset.py    # creates 6000-row synthetic training datasets
python train_model.py         # trains & compares RandomForest / DecisionTree / GradientBoosting, saves best model.pkl

python app.py                 # starts Flask AI service on http://localhost:8000
```

> The Node backend (`server/utils/aiService.js`) automatically calls this
> service. If the Flask service is not running, the backend transparently
> falls back to a deterministic rule-based scoring engine, so the app
> still works end-to-end without the AI service being up — useful for
> quick demos.

## 4. Frontend Setup

```bash
cd client
npm install
npm run dev      # starts on http://localhost:5173
```

## 5. Environment Variables (server/.env)

| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used to sign JWTs |
| `JWT_EXPIRE` | Token expiry (e.g. `7d`) |
| `SMTP_HOST/PORT/USER/PASS` | Email credentials for OTP & notifications |
| `AI_SERVICE_URL` | URL of the Flask AI service (default `http://127.0.0.1:8000`) |
| `CLIENT_URL` | Frontend URL for CORS + password reset links |

## 6. Core Features Implemented

- JWT authentication with OTP email verification, forgot/reset password, profile photo upload
- Student dashboard with application stats and status chart
- AI-driven scholarship recommendation with eligibility scoring & reasons
- AI-driven loan recommendation with bank comparison, approval probability, interest rate, and EMI calculation
- Admin dashboard: manage scholarships & banks (CRUD), approve/reject applications, student management, analytics with monthly charts
- Notifications on application approval/rejection
- Trained scikit-learn models (Random Forest / Decision Tree / Gradient Boosting) with accuracy comparison, served via a Flask REST API
- Rule-based fallback scoring so the app degrades gracefully if the AI service is offline

## 7. Deployment Notes

- **Backend:** Deploy to Render/Railway/EC2; set all env vars; ensure MongoDB Atlas whitelist includes your server IP.
- **AI Service:** Deploy as a separate service (Render/Railway); set `AI_SERVICE_URL` on the backend to point to it.
- **Frontend:** Build with `npm run build` in `client/` and deploy the `dist/` folder to Vercel/Netlify; set the API base URL/proxy accordingly for production (update `vite.config.js` proxy or use an env-based API base URL).
- **Uploads:** In production, consider swapping local disk storage (Multer) for S3/Cloudinary.

## 8. API Overview

See `postman_collection.json` for a ready-to-import Postman collection covering auth, scholarships, loans, predictions, and admin endpoints.

Base routes:
- `/api/auth` — register, login, OTP verify, forgot/reset password
- `/api/users` — profile get/update
- `/api/scholarships` — CRUD + apply + my applications
- `/api/loans` — bank CRUD + apply + my applications
- `/api/prediction` — `/predictScholarship`, `/predictLoan`
- `/api/admin` — students, applications, analytics
- `/api/notifications` — list + mark as read

## 9. Notes on Scope

This is a complete, runnable end-to-end implementation of the core
system (auth, profiles, AI-backed recommendations for both
scholarships and loans, admin management, analytics, notifications).
Some of the more exhaustive items from an extended spec (PDF/Excel
report export, dataset upload + one-click retrain from the admin UI,
dark/light mode toggle, drag-and-drop file management) are natural
next additions on top of this foundation — the architecture
(REST API + service layer + Flask microservice) is built to support
them without structural changes.
