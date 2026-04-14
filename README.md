# SSMU MCQs (Production-Grade Monorepo)

This repository contains a scalable 3-layer system for **SSMU MCQs**:

- **mobile-app/**: React Native Android app (student experience).
- **backend/**: Node.js + Express REST API + MongoDB.
- **admin-panel/**: React web admin console.

## Core Product Coverage

- Google/Gmail login flow (`POST /auth/google-login`) with JWT session.
- 90-day subscription activation from verified payment (`INR 49`).
- Strict learning hierarchy: Course → Subject → Module → Topic → Task Type → MCQs.
- One-question-at-a-time MCQ engine with instant correct/incorrect + explanation.
- Offline-friendly behavior with cached course/content fallback.
- Admin content and import workflow for PDF/DOCX: upload → preview → validate/edit → publish.
- Seeded 6-course structure from the provided university curriculum.

---

## Project Structure

```txt
/backend
  /src
    /config
    /controllers
    /middlewares
    /models
    /routes
    /services
    /seed
    server.js
/mobile-app
  /src
    /components
    /navigation
    /screens
    /services
    /store
    /utils
/admin-panel
  /src
    /pages
    /services
```

---

## API Endpoints (Implemented)

### Auth
- `POST /auth/google-login`

### User
- `GET /user/profile`
- `GET /user/subscription-status`

### Payment
- `POST /payment/create-order`
- `POST /payment/verify`

### Content
- `GET /courses`
- `GET /subjects/:course_id`
- `GET /modules/:subject_id`
- `GET /topics/:module_id`
- `GET /task-types/:topic_id`
- `GET /mcqs/:task_type_id`

### MCQ
- `POST /mcq/attempt`
- `GET /mcq/history`
- `POST /mcq/bookmark`
- `GET /mcq/bookmarks`

### Admin
- `POST /admin/course`
- `POST /admin/subject`
- `POST /admin/module`
- `POST /admin/topic`
- `POST /admin/task-type`
- `POST /admin/mcq`
- `POST /admin/upload`
- `GET /admin/users`
- `GET /admin/payments`
- `GET /admin/analytics`

---

## Payment & Subscription

- Gateway: Razorpay integration service with secure signature verification.
- UPI settlement target: merchant UPI **mrx4u@ybl**.
- Subscription starts **only after verified payment**.
- Duration: exactly **90 days server-side** (`subscription_start` + 90 days).

---

## Offline Behavior

- Mobile app caches course/content payloads using `AsyncStorage`.
- If API fails offline, cached content is shown.
- MCQ explanation always uses stored DB explanation; optional enhancement can be layered online later.

---

## Setup

### 1) Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Create `.env` with:

```env
PORT=4000
MONGO_URI=mongodb://127.0.0.1:27017/ssmu_mcqs
JWT_SECRET=replace_in_production
JWT_EXPIRY=7d
RAZORPAY_KEY_ID=rzp_xxx
RAZORPAY_KEY_SECRET=xxx
FRONTEND_URL=http://localhost:5173
ADMIN_URL=http://localhost:5174
```

### 2) Seed initial 6-course data

```bash
cd backend
npm run seed
```

### 3) Mobile app (Android)

```bash
cd mobile-app
npm install
npm run android
```

### 4) Admin panel

```bash
cd admin-panel
npm install
npm run dev
```

---

## Production Hardening Checklist

- Replace mock Google sign-in in mobile/admin with official SDK + ID token verification.
- Enable webhook-based payment verification in addition to callback signature checks.
- Add refresh tokens, device binding, and secure key vault storage.
- Add pagination/search + audit export in admin panel.
- Add test suites (unit/integration/e2e) and CI pipelines.
- Deploy with Docker/Kubernetes + managed MongoDB + centralized logging.

