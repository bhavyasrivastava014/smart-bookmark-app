"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export default function Home() {
  const [user, setUser] = useState<any>(null)
  const [bookmarks, setBookmarks] = useState<any[]>([])
  const [title, setTitle] = useState("")
  const [url, setUrl] = useState("")

  useEffect(() => {
    let subscription: any

    const getUserAndBookmarks = async () => {
      const { data } = await supabase.auth.getUser()
      const currentUser = data.user
      setUser(currentUser)

      if (currentUser) {
        fetchBookmarks(currentUser.id)

        subscription = supabase
          .channel("bookmarks-changes")
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: "bookmarks",
              filter: `user_id=eq.${currentUser.id}`
            },
            () => {
              fetchBookmarks(currentUser.id)
            }
          )
          .subscribe()
      }
    }

    getUserAndBookmarks()

    return () => {
      if (subscription) {
        supabase.removeChannel(subscription)
      }
    }
  }, [])


  const fetchBookmarks = async (userId: string) => {
    const { data, error } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (!error) {
      setBookmarks(data || [])
    }
  }

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "http://localhost:3000"
      }
    })
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.reload()
  }

  const handleAddBookmark = async () => {
    if (!title || !url || !user) return

    const { error } = await supabase.from("bookmarks").insert([
      {
        title,
        url,
        user_id: user.id
      }
    ])

    if (!error) {
      setTitle("")
      setUrl("")
      fetchBookmarks(user.id)
    }
  }

  const handleDelete = async (id: string) => {
    await supabase.from("bookmarks").delete().eq("id", id)
    fetchBookmarks(user.id)
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-6">
        <h1 className="text-3xl font-bold">
          Smart Bookmark App
        </h1>

        <button
          onClick={handleGoogleLogin}
          className="bg-black text-white px-6 py-3 rounded-lg hover:opacity-80"
        >
          Continue with Google
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          Welcome {user.user_metadata?.full_name || user.email}
        </h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg"
        >
          Logout
        </button>
      </div>

      {/* Add Bookmark Form */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 rounded w-1/3"
        />
        <input
          type="text"
          placeholder="URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="border p-2 rounded w-1/2"
        />
        <button
          onClick={handleAddBookmark}
          className="bg-blue-500 text-white px-4 rounded"
        >
          Add
        </button>
      </div>

      {/* Bookmark List */}
      <div className="space-y-3">
        {bookmarks.map((bookmark) => (
          <div
            key={bookmark.id}
            className="flex justify-between items-center border p-3 rounded"
          >
            <div>
              <p className="font-semibold">{bookmark.title}</p>
              <a
                href={bookmark.url}
                target="_blank"
                className="text-blue-600 text-sm"
              >
                {bookmark.url}
              </a>
            </div>
            <button
              onClick={() => handleDelete(bookmark.id)}
              className="text-red-500"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
