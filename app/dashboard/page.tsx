'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function DashboardPage() {
  const [notes, setNotes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const fetchNotes = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) { router.push('/login'); return }

    const { data, error } = await supabase.from('notes').select('*')
    if (!error) setNotes(data)
    setLoading(false)
  }

  useEffect(() => { fetchNotes() }, [])

  const addNote = async () => {
    if (!title) return
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    const { error } = await supabase
      .from('notes')
      .insert({ title, content, user_id: user.id })

    if (!error) {
      setTitle('')
      setContent('')
      fetchNotes()
    }
  }

  const deleteNote = async (id: string) => {
    await supabase.from('notes').delete().eq('id', id)
    fetchNotes()
  }

  const logout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <p className="text-zinc-400">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="max-w-2xl mx-auto px-6 py-10">

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold">My Notes</h1>
          <button
            onClick={logout}
            className="text-sm text-zinc-400 hover:text-zinc-100 transition"
          >
            Logout
          </button>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 mb-8">
          <input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-transparent text-lg font-medium placeholder-zinc-500 outline-none mb-3"
          />
          <textarea
            placeholder="Write something..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
            className="w-full bg-transparent text-sm text-zinc-300 placeholder-zinc-500 outline-none resize-none mb-4"
          />
          <button
            onClick={addNote}
            className="bg-zinc-100 text-zinc-900 text-sm font-medium px-4 py-2 rounded-lg hover:bg-white transition"
          >
            Add Note
          </button>
        </div>

        <div className="space-y-3">
          {notes.length === 0 ? (
            <p className="text-zinc-500 text-sm text-center py-10">
              No notes yet. Write your first one above.
            </p>
          ) : (
            notes.map((note) => (
              <div
                key={note.id}
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 group hover:border-zinc-700 transition"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-medium text-zinc-100">{note.title}</h3>
                    {note.content && (
                      <p className="text-sm text-zinc-400 mt-1">{note.content}</p>
                    )}
                  </div>
                  <button
                    onClick={() => deleteNote(note.id)}
                    className="text-xs text-zinc-600 hover:text-red-400 transition opacity-0 group-hover:opacity-100"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  )
}