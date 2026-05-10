"use client"

import { useEffect, useState } from "react"
import { Search, Filter, Calendar, Clock, Globe, User, Mail, Phone, Check, X, Video } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Booking {
  id: string
  name: string
  email: string
  phone?: string
  date: string
  time: string
  timezone?: string
  message?: string
  answers?: Record<string, any> | null
  status: "scheduled" | "confirmed" | "completed" | "cancelled" | "no_show" | "rescheduled"
}

const statusColors = {
  scheduled: "bg-blue-100 text-blue-800",
  confirmed: "bg-indigo-100 text-indigo-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-gray-100 text-gray-800",
  no_show: "bg-red-100 text-red-800",
  rescheduled: "bg-amber-100 text-amber-800",
}

const statusLabels = {
  scheduled: "Scheduled",
  confirmed: "Confirmed",
  completed: "Completed",
  cancelled: "Cancelled",
  no_show: "No Show",
  rescheduled: "Rescheduled",
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [dateFilter, setDateFilter] = useState<string>("all")

  useEffect(() => {
    let mounted = true

    fetch("/api/bookings")
      .then((response) => response.json())
      .then((payload) => {
        if (!mounted) return

        const apiBookings = payload?.data?.bookings || payload?.bookings || []
        const normalizedBookings = apiBookings.map((booking: any) => ({
          id: booking.id,
          name: booking.name || booking.full_name || "Unknown",
          email: booking.email || "",
          phone: booking.phone || "",
          date: booking.date || booking.booking_date || "",
          time: booking.time || booking.booking_time || "",
          timezone: booking.timezone || "",
          message: booking.message || booking.notes || booking.post_call_notes || "",
          answers: booking.answers || booking.form_responses || null,
          status: booking.status || "scheduled",
        }))

        setBookings(normalizedBookings)
        setError(null)
      })
      .catch((err) => {
        if (!mounted) return
        console.error("[admin] fetch bookings failed", err)
        setError("Failed to load bookings")
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [])

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || booking.status === statusFilter
    
    let matchesDate = true
    if (dateFilter === "today") {
      matchesDate = booking.date === new Date().toISOString().split("T")[0]
    } else if (dateFilter === "upcoming") {
      matchesDate = new Date(booking.date) >= new Date()
    } else if (dateFilter === "past") {
      matchesDate = new Date(booking.date) < new Date()
    }
    
    return matchesSearch && matchesStatus && matchesDate
  })

  const updateBookingStatus = async (id: string, status: Booking["status"]) => {
    try {
      const response = await fetch("/api/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      })

      const payload = await response.json()
      if (!response.ok || payload?.success === false) {
        throw new Error(payload?.error || "Failed to update booking")
      }

      setBookings((current) => current.map((booking) => (booking.id === id ? { ...booking, status } : booking)))
    } catch (err) {
      console.error("[admin] update booking status failed", err)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const stats = {
    total: bookings.length,
    upcoming: bookings.filter((b) => b.status === "scheduled" || b.status === "confirmed").length,
    completed: bookings.filter((b) => b.status === "completed").length,
    noShow: bookings.filter((b) => b.status === "no_show").length,
  }

  const todayBookings = bookings.filter(
    (b) => b.date === new Date().toISOString().split("T")[0] && (b.status === "scheduled" || b.status === "confirmed")
  )

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Bookings</h1>
        <p className="mt-1 text-sm text-muted-foreground sm:text-base">
          Manage scheduled calls and appointments
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Bookings</p>
            <p className="mt-1 text-2xl font-bold text-foreground">{stats.total}</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Upcoming</p>
            <p className="mt-1 text-2xl font-bold text-blue-600">{stats.upcoming}</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Completed</p>
            <p className="mt-1 text-2xl font-bold text-green-600">{stats.completed}</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">No Shows</p>
            <p className="mt-1 text-2xl font-bold text-red-600">{stats.noShow}</p>
          </CardContent>
        </Card>
      </div>

      {/* Today's Calls */}
      {todayBookings.length > 0 && (
        <Card className="border-primary bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-primary">
              <Calendar className="h-5 w-5" />
              Today&apos;s Calls
            </CardTitle>
            <CardDescription>You have {todayBookings.length} call(s) scheduled today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {todayBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex flex-col gap-3 rounded-lg border border-primary/20 bg-background p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary">
                      <User className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{booking.name}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{booking.time}</span>
                        <Globe className="h-3 w-3" />
                        <span>{booking.timezone}</span>
                      </div>
                    </div>
                  </div>
                  <Button className="gap-2">
                    <Video className="h-4 w-4" />
                    Start Call
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-border pl-10"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-border bg-background px-3 py-2 text-foreground"
        >
          <option value="all">All Status</option>
          <option value="upcoming">Upcoming</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
          <option value="no_show">No Show</option>
        </select>
        <select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="rounded-lg border border-border bg-background px-3 py-2 text-foreground"
        >
          <option value="all">All Dates</option>
          <option value="today">Today</option>
          <option value="upcoming">Upcoming</option>
          <option value="past">Past</option>
        </select>
      </div>

      {/* Bookings List */}
      {loading && (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">Loading bookings...</p>
        </div>
      )}

      {!loading && error && (
        <div className="py-12 text-center">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <div className="space-y-3">
        {filteredBookings.map((booking) => (
          <Card key={booking.id} className="border-border bg-card">
            <CardContent className="p-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                {/* Booking Info */}
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <span className="text-sm font-bold text-primary">
                      {booking.name.split(" ").map((n) => n[0]).join("")}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-foreground">{booking.name}</p>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          statusColors[booking.status] || statusColors.scheduled
                        }`}
                      >
                        {statusLabels[booking.status] || "Scheduled"}
                      </span>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(booking.date)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{booking.time}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Globe className="h-3 w-3" />
                        <span>{booking.timezone}</span>
                      </div>
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        <span>{booking.email}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        <span>{booking.phone}</span>
                      </div>
                    </div>
                    {booking.message && (
                      <p className="mt-2 text-sm italic text-muted-foreground">
                        &quot;{booking.message}&quot;
                      </p>
                    )}

                    {booking.answers && Object.keys(booking.answers).length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm font-medium">Answers</p>
                        <ul className="mt-1 text-sm text-muted-foreground space-y-1">
                          {Object.entries(booking.answers).map(([key, value]) => (
                            <li key={key} className="flex items-start gap-2">
                              <span className="font-medium">{key}:</span>
                              <span className="break-words">{typeof value === 'object' ? JSON.stringify(value) : String(value)}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                {(booking.status === "scheduled" || booking.status === "confirmed") && (
                  <div className="flex shrink-0 gap-2">
                    <Button
                      size="sm"
                      onClick={() => updateBookingStatus(booking.id, "completed")}
                      className="gap-1"
                    >
                      <Check className="h-3 w-3" />
                      Complete
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateBookingStatus(booking.id, "no_show")}
                      className="gap-1"
                    >
                      <X className="h-3 w-3" />
                      No Show
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {!loading && filteredBookings.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">
            {bookings.length === 0 ? "No bookings have been submitted yet." : "No bookings found"}
          </p>
        </div>
      )}
    </div>
  )
}
