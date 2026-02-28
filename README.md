
# SkillSwap Universe

### Run the Application

### 🔹 Frontend
```bash
cd client
npm install
npm run dev

### Backend
cd server
npm install
node servjs
=======
# SkillSwap - Skill Exchange Platform

## How It Works

### User Flow:

**1. Registration & Login**
- Users register with name, email, and password at `/register`
- Login at `/login` returns JWT token stored in localStorage
- Google OAuth also supported for quick login
- **Online status** is automatically tracked when user logs in

**2. Profile Setup**
- Go to **Profile** page
- Add skills you can **TEACH** (e.g., React, Python, Design)
- Add skills you want to **LEARN** (e.g., Data Science, Marketing)
- This creates the "skill exchange" opportunity

**3. Finding Mentors**
- Browse **Browse Skills** page to see all available mentors
- **Real-time online/offline status** shown on each mentor card:
  - 🟢 Green dot = Online (available for session)
  - ⚪ Gray dot = Offline
- Only online mentors can receive session requests
- Search by skill name or mentor name
- Click on any mentor card to view their profile

**4. Session Request**
- On a mentor's card (only when online), click **"Request Session"**
- Fill out the modal:
  - Select skill you want to learn
  - Choose preferred date
  - Choose preferred time
- Click "Send Request"

**5. Session Acceptance**
- As a teacher, go to **Sessions** page
- You'll see pending session requests from learners
- Click **"Accept & Generate Link"**
- System creates a free Jitsi meeting link automatically
- Session status changes to "accepted"

**6. Live Session**
- Both teacher and learner can see the session
- Click **"Join Session"** button
- Opens Jitsi video call in new tab (free, no account needed)
- Start learning/teaching!

**7. Completion & Rating**
- After the session ends
- Rate the session (1-5 stars)
- Leave feedback
- Teacher's trust score updates

---

## New Feature: Online Status

### How it Works:
1. When a user logs in, the socket automatically emits `user_online` event
2. Server updates the user's `isOnline` status in MongoDB to `true`
3. All clients receive real-time updates via `user_status_change` event
4. **Browse Skills** page shows green (online) or gray (offline) status dot
5. Session requests can only be sent to online mentors
6. When user logs out or closes browser, status changes to offline

### Technical Implementation:
- **Backend**: Socket.io connection tracking with userId mapping
- **Database**: User model has `isOnline` boolean field
- **Real-time**: Events `user_online`, `user_offline`, `user_status_change`

---

## Running the Project

### Prerequisites:
- Node.js installed
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup:
```
bash
cd server
npm install
# Create .env file with:
# MONGO_URI=your_mongodb_connection_string
# JWT_SECRET=your_jwt_secret
# PORT=5000
npm run dev
```

### Frontend Setup:
```
bash
cd client
npm install
npm run dev
```

### Access:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login user |
| POST | /api/auth/google-login | Google OAuth login |
| GET | /api/users/me | Get current user profile |
| GET | /api/users/mentors | Get all mentors with online status |
| PUT | /api/users/update | Update profile/skills |
| GET | /api/session | Get user's sessions |
| POST | /api/session | Create session request |
| PUT | /api/session/accept | Accept & generate meeting link |

---

## Tech Stack

- **Frontend**: React, Tailwind CSS, Vite
- **Backend**: Node.js, Express
- **Database**: MongoDB (Mongoose)
- **Auth**: JWT, bcrypt
- **Video**: Jitsi Meet
- **Real-time**: Socket.io (online status, chat)

---

## Phase 2 (Future)

- AI-powered skill matching
- Real-time chat between users
- Zoom/Google Meet integration
- Skill recommendations
- Trust score algorithm
>>>>>>> d6c434d (updated files)
