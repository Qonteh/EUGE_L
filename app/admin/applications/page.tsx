"use client"

import { useEffect, useState } from "react"
import { Search, Filter, Download, Eye, Mail, Phone, Calendar, ChevronDown } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface Application {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  experience: string
  goal: string
  commitment: string
  investment: string
  income: string
  status: "qualified" | "disqualified" | "booked" | "completed" | "no_show"
  createdAt: string
  formResponses?: Record<string, any>
}

// initialApplications removed — data now loads from the API

const statusColors = {
  qualified: "bg-blue-100 text-blue-800",
  disqualified: "bg-red-100 text-red-800",
  booked: "bg-green-100 text-green-800",
  completed: "bg-purple-100 text-purple-800",
  no_show: "bg-orange-100 text-orange-800",
}

const statusLabels = {
  qualified: "Qualified",
  disqualified: "Disqualified",
  booked: "Booked",
  completed: "Completed",
  no_show: "No Show",
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null)
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false)
  const [emailDialogOpen, setEmailDialogOpen] = useState(false)
  const [scheduleDate, setScheduleDate] = useState("")
  const [scheduleTime, setScheduleTime] = useState("")
  const [meetingLink, setMeetingLink] = useState("")
  const [scheduleMessage, setScheduleMessage] = useState("")
  const [emailSubject, setEmailSubject] = useState("")
  const [emailBody, setEmailBody] = useState("")
  const [actionMessage, setActionMessage] = useState("")
  const [actionError, setActionError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showAllApplications, setShowAllApplications] = useState(false)

  const pickField = (value: any, fallback = "Not provided") => {
    if (value === null || value === undefined) return fallback
    const text = String(value).trim()
    return text ? text : fallback
  }

  const readResponseField = (app: any, keys: string[]) => {
    const sources = [
      app,
      app?.formResponses,
      app?.form_responses,
    ].filter(Boolean)

    for (const source of sources) {
      for (const key of keys) {
        const value = source?.[key]
        if (value !== undefined && value !== null && String(value).trim() !== "") {
          return value
        }
      }
    }

    return undefined
  }

  useEffect(() => {
    let mounted = true
    fetch('/api/applications')
      .then((res) => res.json())
      .then((payload) => {
        if (!mounted) return
        const apps = (payload?.data?.applications || []).map((a: any) => ({
          id: a.id,
          firstName: a.firstName || a.full_name?.split(' ')[0] || '',
          lastName: a.lastName || a.full_name?.split(' ').slice(1).join(' '),
          email: a.email,
          phone: a.phone || '',
          experience: pickField(readResponseField(a, ['experience', 'trading_experience'])),
          goal: pickField(readResponseField(a, ['goal', 'goals', 'why_join'])),
          commitment: pickField(readResponseField(a, ['commitment'])),
          investment: pickField(readResponseField(a, ['investment', 'trading_capital'])),
          income: pickField(readResponseField(a, ['income', 'annualIncome', 'annual_income'])),
          status: a.status || 'pending',
          createdAt: a.createdAt || a.created_at,
          formResponses: a.formResponses || a.form_responses,
        }))
        setApplications(apps)
      })
      .catch((err) => console.error('[admin] fetch applications failed', err))

    return () => { mounted = false }
  }, [])

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || app.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const stats = {
    total: applications.length,
    qualified: applications.filter((a) => a.status === "qualified").length,
    booked: applications.filter((a) => a.status === "booked").length,
    completed: applications.filter((a) => a.status === "completed").length,
    disqualified: applications.filter((a) => a.status === "disqualified").length,
  }

  const visibleApplications = showAllApplications ? filteredApplications : filteredApplications.slice(0, 3)
  const canToggleApplications = filteredApplications.length > 3

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const openScheduleDialog = (app: Application) => {
    setSelectedApplication(app)
    setScheduleDate(new Date().toISOString().slice(0, 10))
    setScheduleTime("10:00")
    setMeetingLink("")
    setScheduleMessage(`Hi ${app.firstName}, I’d like to schedule your strategy call.`)
    setActionMessage("")
    setActionError("")
    setScheduleDialogOpen(true)
  }

  const openEmailDialog = (app: Application) => {
    setSelectedApplication(app)
    setEmailSubject(`Update about your application, ${app.firstName}`)
    setEmailBody(`Hi ${app.firstName},\n\nThank you for your application. I wanted to follow up with you about the next step.\n\nBest regards,\nEugene`)
    setActionMessage("")
    setActionError("")
    setEmailDialogOpen(true)
  }

  const submitScheduleCall = async () => {
    if (!selectedApplication) return
    if (!scheduleDate || !scheduleTime) {
      setActionError("Please choose a date and time")
      return
    }

    setIsSubmitting(true)
    setActionError("")
    setActionMessage("")

    try {
      const bookingResponse = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationId: selectedApplication.id,
          name: `${selectedApplication.firstName} ${selectedApplication.lastName}`.trim(),
          email: selectedApplication.email,
          phone: selectedApplication.phone,
          date: scheduleDate,
          time: scheduleTime,
          timezone: 'UTC',
          message: scheduleMessage,
        }),
      })

      const bookingJson = await bookingResponse.json().catch(() => ({}))
      if (!bookingResponse.ok || bookingJson?.success === false) {
        throw new Error(bookingJson?.error || 'Failed to schedule call')
      }

      await fetch('/api/applications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedApplication.id,
          status: 'booked',
          adminNotes: `Scheduled call for ${scheduleDate} at ${scheduleTime}`,
        }),
      })

      setApplications((current) =>
        current.map((app) =>
          app.id === selectedApplication.id ? { ...app, status: 'booked' } : app
        )
      )

      setActionMessage('Call scheduled successfully')
      setScheduleDialogOpen(false)
      setExpandedId(selectedApplication.id)
    } catch (error: any) {
      setActionError(error?.message || 'Failed to schedule call')
    } finally {
      setIsSubmitting(false)
    }
  }

  const sendEmail = () => {
    if (!selectedApplication) return

    const subject = encodeURIComponent(emailSubject)
    const body = encodeURIComponent(emailBody)
    const mailto = `mailto:${selectedApplication.email}?subject=${subject}&body=${body}`
    window.location.href = mailto
    setEmailDialogOpen(false)
    setActionMessage('Opening your email app')
  }

  const handleExportCsv = () => {
    if (filteredApplications.length === 0) return

    const rows = filteredApplications.map((app) => ({
      name: `${app.firstName} ${app.lastName}`.trim(),
      email: app.email,
      phone: app.phone,
      experience: app.experience,
      goal: app.goal,
      commitment: app.commitment,
      investment: app.investment,
      income: app.income,
      status: app.status,
      createdAt: app.createdAt,
    }))

    const headers = Object.keys(rows[0])
    const escapeCsv = (value: any) => {
      const text = value === null || value === undefined ? '' : String(value)
      return `"${text.replace(/"/g, '""')}"`
    }

    const csv = [
      headers.join(','),
      ...rows.map((row) => headers.map((header) => escapeCsv(row[header as keyof typeof row])).join(',')),
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `applications-${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Applications</h1>
          <p className="mt-1 text-sm text-muted-foreground sm:text-base">
            View and manage all funnel applications
          </p>
        </div>
        <Button variant="outline" className="gap-2" onClick={handleExportCsv} disabled={filteredApplications.length === 0}>
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {[
          { label: "Total", value: stats.total, color: "text-foreground" },
          { label: "Qualified", value: stats.qualified, color: "text-blue-600" },
          { label: "Booked", value: stats.booked, color: "text-green-600" },
          { label: "Completed", value: stats.completed, color: "text-purple-600" },
          { label: "Disqualified", value: stats.disqualified, color: "text-red-600" },
        ].map((stat) => (
          <Card key={stat.label} className="border-border bg-card">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className={`mt-1 text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

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
          <option value="qualified">Qualified</option>
          <option value="booked">Booked</option>
          <option value="completed">Completed</option>
          <option value="disqualified">Disqualified</option>
          <option value="no_show">No Show</option>
        </select>
      </div>

      {/* Applications List */}
      <div className="space-y-3">
        {visibleApplications.map((app) => (
          <Card key={app.id} className="border-border bg-card">
            <CardContent className="p-4">
              {/* Main Row */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <span className="text-sm font-bold text-primary">
                      {app.firstName.charAt(0)}{app.lastName.charAt(0)}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-foreground">
                      {app.firstName} {app.lastName}
                    </p>
                    <p className="truncate text-sm text-muted-foreground">{app.email}</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      statusColors[app.status]
                    }`}
                  >
                    {statusLabels[app.status]}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(app.createdAt)}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setExpandedId(expandedId === app.id ? null : app.id)
                    }
                    className="ml-auto h-8 gap-1 px-2 text-xs sm:ml-0"
                  >
                    <Eye className="h-3 w-3" />
                    {expandedId === app.id ? "Hide" : "View"}
                    <ChevronDown
                      className={`h-3 w-3 transition-transform ${
                        expandedId === app.id ? "rotate-180" : ""
                      }`}
                    />
                  </Button>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedId === app.id && (
                <div className="mt-4 border-t border-border pt-4">
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Contact</p>
                      <div className="mt-1 space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-3 w-3 text-primary" />
                          <span>{pickField(app.email)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-3 w-3 text-primary" />
                          <span>{pickField(app.phone)}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Experience</p>
                      <p className="mt-1 text-sm">{pickField(app.experience)}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Investment Budget</p>
                      <p className="mt-1 text-sm">{pickField(app.investment)}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Annual Income</p>
                      <p className="mt-1 text-sm">{pickField(app.income)}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Commitment</p>
                      <p className="mt-1 text-sm">{pickField(app.commitment)}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Goal</p>
                      <p className="mt-1 text-sm">{pickField(app.goal)}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button size="sm" className="gap-1" onClick={() => openScheduleDialog(app)}>
                      <Calendar className="h-3 w-3" />
                      Schedule Call
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1" onClick={() => openEmailDialog(app)}>
                      <Mail className="h-3 w-3" />
                      Send Email
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredApplications.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">No applications found</p>
        </div>
      )}

      {canToggleApplications && filteredApplications.length > 0 && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={() => {
              setShowAllApplications((value) => !value)
              setExpandedId(null)
            }}
            className="gap-2"
          >
            {showAllApplications ? 'Show less' : 'Show more'}
          </Button>
        </div>
      )}

      <Dialog open={scheduleDialogOpen} onOpenChange={setScheduleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule Call</DialogTitle>
            <DialogDescription>
              Set a real call time for {selectedApplication ? `${selectedApplication.firstName} ${selectedApplication.lastName}` : 'this applicant'}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Date</label>
                <Input type="date" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Time</label>
                <Input type="time" value={scheduleTime} onChange={(e) => setScheduleTime(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Meeting Link</label>
              <Input
                placeholder="https://meet.google.com/..."
                value={meetingLink}
                onChange={(e) => setMeetingLink(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Notes</label>
              <textarea
                className="min-h-24 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                value={scheduleMessage}
                onChange={(e) => setScheduleMessage(e.target.value)}
              />
            </div>
            {actionError && <p className="text-sm text-red-600">{actionError}</p>}
            {actionMessage && <p className="text-sm text-green-600">{actionMessage}</p>}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setScheduleDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submitScheduleCall} disabled={isSubmitting}>
              {isSubmitting ? 'Scheduling...' : 'Save and Schedule'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Email</DialogTitle>
            <DialogDescription>
              Open your email app with a prefilled message for {selectedApplication ? `${selectedApplication.firstName} ${selectedApplication.lastName}` : 'this applicant'}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Subject</label>
              <Input value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Message</label>
              <textarea
                className="min-h-40 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
              />
            </div>
            {actionError && <p className="text-sm text-red-600">{actionError}</p>}
            {actionMessage && <p className="text-sm text-green-600">{actionMessage}</p>}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEmailDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={sendEmail}>Open Email App</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
