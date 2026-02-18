'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'

export default function AddBookmarkForm({ userId, onBookmarkAdded }) {
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const supabase = createClient()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    onBookmarkAdded?.()
    try {
      new URL(url)
    } catch {
      setError('Please enter a valid URL')
      return
    }
    if (!title.trim()) {
      setError('Please enter a title')
      return
    }
    setLoading(true)

    try {
      const { error: insertError } = await supabase
        .from('bookmarks')
        .insert([
          {
            user_id: userId,
            url: url.trim(),
            title: title.trim(),
          },
        ])

      if (insertError) throw insertError

      // Clear form
      setUrl('')
      setTitle('')
    } catch (err) {
      console.error('Error adding bookmark:', err)
      setError('Failed to add bookmark. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
          URL
        </label>
        <input
          type="text"
          id="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          className="w-full px-4 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          disabled={loading}
        />
      </div>

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Title
        </label>
        <input  type="text"  id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="My awesome website"
          className="w-full px-4 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          disabled={loading}
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-medium py-3 px-4 rounded-lg transition-colors"
      >
        {loading ? 'Adding...' : '+ Add Bookmark'}
      </button>
    </form>
  )
}