🚧 Challenges Faced & How I Solved Them
1️⃣ Learning and Adapting to Next.js
🔹 Problem

• Next.js was new to me at the beginning of this project.
• I had prior experience with React.js and Node.js (MERN stack), but not with Next.js App Router.
• I faced challenges in understanding:
• App Router folder structure
• Difference between Server Components and Client Components
• Proper usage of environment variables
• Authentication flow using API routes
• Server-side rendering concepts

🔹 Solution

• Utilized my strong foundation in:
• React component architecture
• React Hooks (useEffect, useState)
• Node.js backend development
• REST API handling

• Actions taken to overcome the challenge:
• Studied Next.js App Router documentation and project structure
• Clearly understood when to use 'use client' in interactive components
• Implemented Supabase authentication properly:
• Used createServerClient() inside /auth/callback route
• Used createBrowserClient() inside client components
• Practiced working with layouts, routing, and server-side logic
• Tested authentication flow thoroughly (login → callback → session creation)

• Result:
• Successfully adapted to Next.js in a short time
• Built a fully functional Smart Bookmark application using App Router

2️⃣ Implementing Real-Time Updates with Supabase (Without Page Refresh)
🔹 Problem

• The main requirement was:
• When a user adds or deletes a bookmark in one browser tab,
the change should automatically reflect in another tab
without refreshing the page.

• Initial challenges:
• UI updated only after manual refresh
• Real-time synchronization across tabs was not working
• State was not automatically updating

🔹 Solution

• Implemented Supabase Realtime using postgres_changes subscription.

• Key steps taken:
• Enabled Realtime replication for the bookmarks table in Supabase Dashboard
• Configured Row Level Security (RLS) policies correctly
• Subscribed to database changes using a channel listener
• Filtered events using user_id to ensure user-specific updates

• Handled specific events:
• INSERT → Instantly added new bookmark to UI state
• DELETE → Removed bookmark from UI state immediately
• UPDATE → Updated bookmark dynamically in UI

• Removed unnecessary manual fetch() calls after each action
• Optimized state updates for performance and efficiency

✅ Final Outcome

• Real-time bookmark updates across multiple browser tabs
• No page refresh required
• Improved user experience with instant UI synchronization
• Efficient state management using real-time event handling
• Clean and scalable implementation
• Proper user-based data isolation using Row Level Security (RLS)
• Each user can view only their own bookmarks
• One user cannot see another user’s bookmark list
• Users can delete only their own bookmarks securely