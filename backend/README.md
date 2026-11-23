# LASU Navigator Backend API

Node.js + Express + MySQL backend for LASU Navigator PWA.
Firebase Authentication is kept on the frontend — this API verifies Firebase ID tokens server-side.

## Files

| File | Purpose |
|---|---|
| server.js | Main Express API server |
| schema.sql | MySQL database schema |
| api.js | Frontend API client (paste into your PWA project) |
| .env.example | Environment variables template |

## API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | / | None | Health check |
| POST | /api/users/sync | Student/Admin | Sync Firebase user to MySQL |
| GET | /api/users/me | Student/Admin | Get own profile |
| GET | /api/users | Admin only | Get all students |
| GET | /api/announcements | Student/Admin | Get all announcements |
| POST | /api/announcements | Admin only | Post new announcement |
| DELETE | /api/announcements/:id | Admin only | Delete announcement |
| GET | /api/schedules | Student/Admin | Get all schedules |
| POST | /api/schedules | Admin only | Add class schedule |
| DELETE | /api/schedules/:id | Admin only | Delete schedule |
| GET | /api/notifications | Student | Get my notifications |
| GET | /api/notifications/unread-count | Student | Get unread count |
| PATCH | /api/notifications/:id/read | Student | Mark as read |
| PATCH | /api/notifications/read-all | Student | Mark all my notifications as read |

When an admin posts an announcement, the API creates an unread inbox entry for each
student profile in Firestore and for each student registered in MySQL. It also sends
Firebase Cloud Messaging alerts to students who enabled browser notifications and
have a saved messaging token. The frontend displays announcements from the authenticated
student notification API, rather than a separate Firestore announcements collection.

The PWA uses `sw.js` as its single root-scope service worker for both offline caching
and Firebase background push messages. The Firebase web push public key is optional
as `window.__FIREBASE_VAPID_KEY`; set it in the frontend before `firebase/firebase.js`
loads if the Firebase project requires a custom VAPID key.

## Deployment on Railway (Step by Step)

### Step 1 — Create Railway account
Go to railway.app → Sign up with GitHub

### Step 2 — Create new project
Click "New Project" → "Deploy from GitHub repo" → select your backend repo

### Step 3 — Add MySQL database
In your Railway project → click "+ New" → "Database" → "Add MySQL"
Railway automatically sets: MYSQLHOST, MYSQLUSER, MYSQLPASSWORD, MYSQLDATABASE, MYSQLPORT

### Step 4 — Import schema
In Railway MySQL dashboard → click "Connect" → open Query tab →
paste the contents of schema.sql → Run

### Step 5 — Add Firebase Service Account
Go to Firebase Console → Project Settings → Service Accounts →
Generate new private key → download the JSON file
In Railway → your web service → Variables → add:
FIREBASE_SERVICE_ACCOUNT = (paste entire JSON as one line)

### Step 6 — Deploy
Railway auto-deploys when you push to GitHub.
Your API URL will be: https://your-app-name.railway.app

### Step 7 — Update frontend
In api.js → replace API_BASE with your Railway URL:
const API_BASE = 'https://your-app-name.railway.app';

## Local Development

```bash
npm install
cp .env.example .env
# fill in your .env values
node schema.sql  # run in phpMyAdmin instead
npm run dev
```
