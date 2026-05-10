"use client"

import { useEffect, useState } from "react"
import { useRouter } from 'next/navigation'
import { Users, Calendar, FileQuestion, Video } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

function timeAgo(iso: string) {
  try {
    const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
    if (diff < 60) return `${diff}s ago`
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
    return `${Math.floor(diff / 86400)}d ago`
  } catch {
    return "recent"
  }
}


export default function AdminDashboard() {
  const router = useRouter()
  const [adminName, setAdminName] = useState('Admin')
  const [totalApplications, setTotalApplications] = useState("0")
  const [bookingsThisWeek, setBookingsThisWeek] = useState("0")
  const [questionsCount, setQuestionsCount] = useState("0")
  const [activeVideosCount, setActiveVideosCount] = useState("0")
  const [showAllApplications, setShowAllApplications] = useState(false)

  const [recentApplications, setRecentApplications] = useState<any[]>([])
  const [upcomingBookings, setUpcomingBookings] = useState<any[]>([])

  useEffect(() => {
    let mounted = true

    ;(async () => {
      try {
        const me = await fetch('/api/admin/me', { credentials: 'same-origin' })
        if (me.status === 401) {
          router.replace('/admin/login')
          return
        }

        const meJson = await me.json()
        if (mounted && meJson?.admin?.name) {
          setAdminName(meJson.admin.name)
        }
      } catch (err) {
        router.replace('/admin/login')
        return
      }
    })()

    async function load() {
      try {
        const appsRes = await fetch('/api/applications?limit=5')
        const appsJson = await appsRes.json()
        if (!mounted) return
        const total = appsJson?.data?.total ?? 0
        setTotalApplications(String(total))
        const recent = (appsJson?.data?.applications || []).map((a: any) => ({
          name: `${a.firstName} ${a.lastName}`.trim(),
          email: a.email,
          status: (a.status || 'pending').charAt(0).toUpperCase() + (a.status || 'pending').slice(1),
          date: a.createdAt ? timeAgo(a.createdAt) : 'recent',
        }))
        setRecentApplications(recent)

        const today = new Date()
        const start = today.toISOString().slice(0, 10)
        const endDate = new Date()
        endDate.setDate(today.getDate() + 7)
        const end = endDate.toISOString().slice(0, 10)
        const bookingsRes = await fetch(`/api/bookings?from_date=${start}&to_date=${end}&limit=1`)
        const bookingsJson = await bookingsRes.json()
        const bookingsTotal = bookingsJson?.data?.total ?? 0
        setBookingsThisWeek(String(bookingsTotal))

        const upEnd = new Date()
        upEnd.setDate(today.getDate() + 3)
        const upRes = await fetch(`/api/bookings?from_date=${start}&to_date=${upEnd.toISOString().slice(0,10)}&limit=5`)
        const upJson = await upRes.json()
        const upcoming = (upJson?.data?.bookings || []).map((b: any) => ({
          name: b.name,
          date: b.date && b.time ? `${b.date}, ${b.time}` : b.date || 'TBD',
          timezone: b.timezone || '',
        }))
        setUpcomingBookings(upcoming)

        const qRes = await fetch('/api/questions')
        const qJson = await qRes.json()
        setQuestionsCount(String((qJson?.data || []).length || 0))

        const vRes = await fetch('/api/videos')
        const vJson = await vRes.json()
        const vids = vJson?.data || []
        setActiveVideosCount(String(vids.filter((v: any) => v.isActive !== false).length || vids.length))
      } catch (err) {
        console.error('[admin] load dashboard failed', err)
      }
    }

    load()

    return () => { mounted = false }
  }, [])

  const stats = [
    { title: 'Total Applications', value: totalApplications, change: '', changeType: 'neutral', icon: Users },
    { title: 'Bookings This Week', value: bookingsThisWeek, change: '', changeType: 'neutral', icon: Calendar },
    { title: 'Questions', value: questionsCount, change: '', changeType: 'neutral', icon: FileQuestion },
    { title: 'Active Videos', value: activeVideosCount, change: '', changeType: 'neutral', icon: Video },
  ]

  const visibleApplications = showAllApplications ? recentApplications : recentApplications.slice(0, 3)
  const canToggleApplications = recentApplications.length > 3

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground sm:text-base">
          Welcome back, <span className="font-bold text-foreground">{adminName}</span>! Here&apos;s an overview of your mentorship funnel.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className="mt-1 text-xs text-muted-foreground">Live data</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="h-5 w-5 text-primary" />
              Recent Applications
            </CardTitle>
            <CardDescription>Latest applicants to your program</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {visibleApplications.map((app, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-foreground">{app.name}</p>
                    <p className="truncate text-sm text-muted-foreground">{app.email}</p>
                  </div>
                  <div className="ml-4 text-right">
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                        app.status === "Booked"
                          ? "bg-green-100 text-green-800"
                          : app.status === "Qualified"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {app.status}
                    </span>
                    <p className="mt-1 text-xs text-muted-foreground">{app.date}</p>
                  </div>
                </div>
              ))}
            </div>
            {canToggleApplications && (
              <div className="mt-4 flex justify-center">
                <button
                  type="button"
                  onClick={() => setShowAllApplications((value) => !value)}
                  className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary hover:bg-secondary"
                >
                  {showAllApplications ? 'See less' : 'See more'}
                </button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calendar className="h-5 w-5 text-primary" />
              Upcoming Bookings
            </CardTitle>
            <CardDescription>Scheduled calls for the next few days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingBookings.map((booking, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <span className="text-sm font-bold text-primary">
                        {booking.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{booking.name}</p>
                      <p className="text-sm text-muted-foreground">{booking.date}</p>
                    </div>
                  </div>
                  <span className="rounded-lg bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground">
                    {booking.timezone}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
          <CardDescription>Common tasks you might want to perform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Add Question", href: "/admin/questions", icon: FileQuestion },
              { label: "Upload Video", href: "/admin/videos", icon: Video },
              { label: "View Applications", href: "/admin/applications", icon: Users },
              { label: "Manage Bookings", href: "/admin/bookings", icon: Calendar },
            ].map((action) => (
              <a
                key={action.label}
                href={action.href}
                className="flex items-center gap-3 rounded-xl border border-border bg-background p-4 transition-all hover:border-primary hover:shadow-sm"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <action.icon className="h-5 w-5 text-primary" />
                </div>
                <span className="font-medium text-foreground">{action.label}</span>
              </a>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
