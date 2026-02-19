'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'

const supabase = createClient()

export default function BookmarkList({ userId }) {
  const [bookmarks, setBookmarks] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchBookmarks = async () => {
    try {
      const { data, error } = await supabase
        .from('bookmarks')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setBookmarks(data || [])
    } catch (err) {
      console.error('Error fetching bookmarks:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!userId) return
    fetchBookmarks()
    const interval = setInterval(() => { fetchBookmarks() }, 1000)
    return () => clearInterval(interval)
  }, [userId])

  useEffect(() => {
    if (!userId) return
    fetchBookmarks()
    const channel = supabase
      .channel('bookmarks-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'bookmarks', filter: `user_id=eq.${userId}`, },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setBookmarks((prev) => [payload.new, ...prev])
          }
          if (payload.eventType === 'DELETE') {
            setBookmarks((prev) =>
              prev.filter((b) => b.id !== payload.old.id)
            )
          }
        }
      )
      .subscribe((status) => {
        console.log("Subscription status:", status)
      })
    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId])




  const handleDelete = async (id) => {
    try {
      const { error } = await supabase.from('bookmarks').delete().eq('id', id)
      fetchBookmarks()
      if (error) throw error
    } catch (err) {
      console.error('Error deleting bookmark:', err)
      alert('Failed to delete bookmark')
    }
  }

  // if (loading) {
  //   return (
  //     <div className="bg-white rounded-lg shadow-xl p-6">
  //       <div className="text-center text-gray-500">Loading bookmarks...</div>
  //     </div>
  //   )
  // }
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-xl p-6">
        <div className="h-7 w-48 bg-gray-200 rounded animate-pulse mb-4"></div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 border border-gray-200 rounded-lg">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded animate-pulse w-1/4"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (bookmarks.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-xl p-12 text-center">
        <div className="text-6xl mb-4">🔖</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No bookmarks yet</h3>
        <p className="text-gray-500">Add your first bookmark above to get started!</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-xl p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        Your Bookmarks ({bookmarks.length})
      </h2>
      <div className="space-y-3">
        {bookmarks.map((bookmark) => (
          <div key={bookmark.id} className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all  "
          >
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-800 mb-1 truncate">
                {bookmark.title}
              </h3>
              <a href={bookmark.url} target="_blank" rel="noopener noreferrer" className="md:text-sm text-xs text-blue-600 w-fit hover:text-blue-800 hover:underline   "  >
                {bookmark.url}
              </a>
              <p className="text-xs text-gray-500 mt-1">
                Added {new Date(bookmark.created_at).toLocaleDateString()}
              </p>
            </div>
            <button onClick={() => handleDelete(bookmark.id)} className="flex-shrink-0 text-red-500 hover:text-red-700 cursor-pointer hover:bg-red-50 p-2 rounded-lg " title="Delete bookmark"   >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"  >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}