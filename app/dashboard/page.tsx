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
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) { router.push('/login'); return }

  const { error } = await supabase
    .from('notes')
    .insert({ title, content, user_id: user.id })
  
  if (!error) {
    setTitle('')
    setContent('')
    fetchNotes()
  } else {
    console.log('Insert error:', error)
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

  if (loading) return <p>Loading...</p>

  return (
    <div style={{ padding: '40px' }}>
      <h1>My Notes</h1>
      <button onClick={logout}>Logout</button>

      <div style={{ marginTop: '20px' }}>
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <br />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <br />
        <button onClick={addNote}>Add Note</button>
      </div>

      <div style={{ marginTop: '30px' }}>
        {notes.length === 0 ? (
          <p>No notes yet.</p>
        ) : (
          notes.map((note) => (
            <div key={note.id} style={{ border: '1px solid gray', margin: '10px', padding: '10px' }}>
              <h3>{note.title}</h3>
              <p>{note.content}</p>
              <button onClick={() => deleteNote(note.id)}>Delete</button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}