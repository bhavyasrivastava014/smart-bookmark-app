📌 Smart Bookmark App

A secure, real-time bookmark manager built with Next.js (App Router) and Supabase.
Users can log in with Google, create private bookmarks, and see real-time updates across multiple tabs.

🔗 Live Demo: [https://your-vercel-url.vercel.app](https://smart-bookmark-app-seven-red.vercel.app/)

📂 GitHub Repo: https://github.com/bhavyasrivastava014/smart-bookmark-app

🚀 Tech Stack
Next.js (App Router)
Supabase
Google OAuth Authentication
PostgreSQL Database
Row Level Security (RLS)
Realtime Subscriptions
Tailwind CSS
Vercel (Deployment)

🔐 Core Features
Google OAuth login
Private, user-specific bookmarks
Add & delete bookmarks
Real-time sync across multiple tabs
Secure multi-user architecture
Production deployment

🛡 Security Design
Database Structure
bookmarks
- id (uuid, primary key)
- user_id (references auth.users)
- title (text)
- url (text)
- created_at (timestamp)

Row Level Security (RLS)
RLS is enabled on the bookmarks table.

Policies ensure:
Users can only SELECT their own bookmarks
Users can only INSERT bookmarks tied to their user_id
Users can only DELETE their own bookmarks
This guarantees strict data isolation between users.

⚡ Real-Time Architecture
Supabase Realtime is enabled for the bookmarks table.
The app subscribes to:
INSERT
DELETE
UPDATE

Filtered by:
user_id = currentUser.id

This enables instant synchronization across browser tabs without manual refresh.

🧠 Challenges & Solutions

1️⃣ Environment Variables in Production
Issue: supabaseUrl is required during Vercel deployment.
Fix: Configured environment variables in Vercel and redeployed.

2️⃣ Google OAuth Redirect Mismatch
Issue: redirect_uri_mismatch after deployment.
Fix: Updated:

Supabase Site URL & Redirect URLs
Google Cloud Authorized Origins

3️⃣ Multi-User Data Isolation
Issue: Prevent cross-user access to bookmarks.
Fix: Implemented RLS with auth.uid() policies and verified with multiple accounts.

🧪 Local Setup
git clone https://github.com/bhavyasrivastava014/smart-bookmark-app.git
cd smart-bookmark-app
npm install

Create .env.local:
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key

Run: npm run dev

📈 Possible Improvements
Edit bookmark functionality
URL validation
Loading states

Improved UI polish

Optimistic updates
