// import { createBrowserClient } from '@supabase/ssr'

// export function createClient() {
//   return createBrowserClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
//   )
// }

// import { createBrowserClient } from '@supabase/ssr'

// let client = null

// export function createClient() {
//   if (!client) {
//     client = createBrowserClient(
//       process.env.NEXT_PUBLIC_SUPABASE_URL,
//       process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
//     )
//   }
//   return client
// }


// lib/supabase.js
import { createBrowserClient } from '@supabase/ssr'

let client = null

export function createClient() {
  if (client) return client  // ← return existing client, don't create new one
  client = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
  return client
}