'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleLogin = async () => {
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setMessage('Error: ' + error.message)
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center px-6">
      <div className="w-full max-w-sm">

        <h1 className="text-2xl font-semibold text-center mb-1">Welcome back</h1>
        <p className="text-zinc-500 text-sm text-center mb-8">Log in to your notes</p>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
          <div>
            <label className="text-xs text-zinc-500 mb-1 block">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm placeholder-zinc-600 outline-none focus:border-zinc-600 transition"
            />
          </div>

          <div>
            <label className="text-xs text-zinc-500 mb-1 block">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm placeholder-zinc-600 outline-none focus:border-zinc-600 transition"
            />
          </div>

          <button
            onClick={handleLogin}
            className="w-full bg-zinc-100 text-zinc-900 text-sm font-medium py-2.5 rounded-lg hover:bg-white transition"
          >
            Login
          </button>

          {message && (
            <p className="text-sm text-center text-red-400">{message}</p>
          )}
        </div>

        <p className="text-center text-sm text-zinc-500 mt-6">
          Don't have an account?{' '}
          <a href="/signup" className="text-zinc-300 hover:text-white underline">
            Sign up
          </a>
        </p>

      </div>
    </div>
  )
}