"use client"

import { useEffect, useState, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select } from "@/components/ui/select"

export default function AdminHeroPage() {
  const [hero, setHero] = useState<any>(null)
  const [videos, setVideos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const fileRef = useRef<HTMLInputElement | null>(null)

  const [form, setForm] = useState({
    pre_headline: "",
    headline: "",
    sub_headline: "",
    description: "",
    hero_initials: "",
    mentor_name: "",
    mentor_title: "",
    cta_text: "",
    cta_link: "",
    video_id: "",
  })

  useEffect(() => {
    let mounted = true
    async function load() {
      setLoading(true)
      try {
        const [hRes, vRes] = await Promise.all([
          fetch('/api/landing-hero'),
          fetch('/api/videos?category=hero')
        ])

        const hJson = await hRes.json()
        const vJson = await vRes.json()

        if (!mounted) return
        if (hJson?.success && hJson.data) {
          setHero(hJson.data)
          setForm((f) => ({ ...f, ...hJson.data }))
        }
        if (vJson?.success && Array.isArray(vJson.data)) {
          setVideos(vJson.data)
        }
      } catch (err) {
        console.error(err)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    load()
    return () => { mounted = false }
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      // If a file was selected, upload it first to /api/videos
      const file = fileRef.current?.files?.[0]
      let videoId = form.video_id || null

      if (file) {
        const fd = new FormData()
        fd.append('title', file.name)
        fd.append('description', 'Uploaded from admin hero')
        fd.append('category', 'hero')
        fd.append('video', file)
        const resp = await fetch('/api/videos', { method: 'POST', body: fd })
        const payload = await resp.json()
        if (!resp.ok || !payload?.success) throw new Error(payload?.error || 'Failed upload')
        videoId = payload.data?.id
      }

      const body = { ...form, video_id: videoId }

      const method = hero?.id ? 'PATCH' : 'POST'
      if (method === 'PATCH') body.id = hero.id

      const res = await fetch('/api/landing-hero', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const json = await res.json()
      if (!res.ok || !json?.success) throw new Error(json?.error || 'Failed saving')
      setHero(json.data)
      setForm((f) => ({ ...f, ...json.data }))
      alert('Saved')
    } catch (err) {
      alert(err instanceof Error ? err.message : String(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Landing Hero</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Hero Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Pre-headline</label>
            <Input value={form.pre_headline} onChange={(e) => setForm({ ...form, pre_headline: e.target.value })} />
          </div>

          <div>
            <label className="block text-sm font-medium">Headline</label>
            <Input value={form.headline} onChange={(e) => setForm({ ...form, headline: e.target.value })} />
          </div>

          <div>
            <label className="block text-sm font-medium">Sub-headline</label>
            <Input value={form.sub_headline} onChange={(e) => setForm({ ...form, sub_headline: e.target.value })} />
          </div>

          <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full rounded-lg border px-3 py-2" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium">Hero Initials</label>
              <Input value={form.hero_initials} onChange={(e) => setForm({ ...form, hero_initials: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium">Mentor Name</label>
              <Input value={form.mentor_name} onChange={(e) => setForm({ ...form, mentor_name: e.target.value })} />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium">Mentor Title</label>
              <Input value={form.mentor_title} onChange={(e) => setForm({ ...form, mentor_title: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium">CTA Text</label>
              <Input value={form.cta_text} onChange={(e) => setForm({ ...form, cta_text: e.target.value })} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium">CTA Link</label>
            <Input value={form.cta_link} onChange={(e) => setForm({ ...form, cta_link: e.target.value })} />
          </div>

          <div>
            <label className="block text-sm font-medium">Choose existing hero video</label>
            <select value={form.video_id || ""} onChange={(e) => setForm({ ...form, video_id: e.target.value })} className="w-full rounded-lg border px-3 py-2">
              <option value="">-- select a video --</option>
              {videos.map((v) => (
                <option key={v.id} value={v.id}>{v.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Or upload a new hero video</label>
            <input ref={fileRef} type="file" accept="video/*" className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">If you upload a file it will be created as a `training_videos` record and attached to the hero.</p>
          </div>

          <div className="flex gap-3">
            <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
            <Button variant="outline" onClick={() => { setForm({ pre_headline: '', headline: '', sub_headline: '', description: '', hero_initials: '', mentor_name: '', mentor_title: '', cta_text: '', cta_link: '', video_id: '' }); setHero(null) }}>Reset</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
