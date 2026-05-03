"use client"

import { useState } from "react"
import { Search, Filter, Download, Eye, Mail, Phone, Calendar, ChevronDown } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

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
}

const initialApplications: Application[] = [
  {
    id: "1",
    firstName: "John",
    lastName: "Smith",
    email: "john.smith@email.com",
    phone: "+1 555-0123",
    experience: "Intermediate - Trade regularly",
    goal: "Replace my 9-5 job income with trading",
    commitment: "Yes, I'm fully committed",
    investment: "$3,500-$4,999",
    income: "$50,000+",
    status: "booked",
    createdAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.j@email.com",
    phone: "+44 7700 900123",
    experience: "Some Experience - Traded a little",
    goal: "Financial freedom and early retirement",
    commitment: "Yes, I'm fully committed",
    investment: "$5,000+",
    income: "$50,000+",
    status: "qualified",
    createdAt: "2024-01-15T09:15:00Z",
  },
  {
    id: "3",
    firstName: "Michael",
    lastName: "Brown",
    email: "m.brown@email.com",
    phone: "+1 555-0456",
    experience: "Complete Beginner - Never traded before",
    goal: "Side income to support my family",
    commitment: "I need to think about it",
    investment: "$0-$999",
    income: "$20,000-$40,000",
    status: "disqualified",
    createdAt: "2024-01-15T08:45:00Z",
  },
  {
    id: "4",
    firstName: "Emily",
    lastName: "Davis",
    email: "emily.d@email.com",
    phone: "+255 692 123 456",
    experience: "Intermediate - Trade regularly",
    goal: "Become a full-time funded trader",
    commitment: "Yes, I'm fully committed",
    investment: "$3,500-$4,999",
    income: "$20,000-$40,000",
    status: "completed",
    createdAt: "2024-01-14T16:20:00Z",
  },
  {
    id: "5",
    firstName: "James",
    lastName: "Wilson",
    email: "james.w@email.com",
    phone: "+1 555-0789",
    experience: "Advanced - Profitable trader",
    goal: "Scale my trading to 6 figures",
    commitment: "Yes, I'm fully committed",
    investment: "$5,000+",
    income: "$50,000+",
    status: "no_show",
    createdAt: "2024-01-14T14:10:00Z",
  },
]

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
  const [applications] = useState<Application[]>(initialApplications)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [expandedId, setExpandedId] = useState<string | null>(null)

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
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
        <Button variant="outline" className="gap-2">
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
        {filteredApplications.map((app) => (
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
                          <span>{app.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-3 w-3 text-primary" />
                          <span>{app.phone}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Experience</p>
                      <p className="mt-1 text-sm">{app.experience}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Investment Budget</p>
                      <p className="mt-1 text-sm">{app.investment}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Annual Income</p>
                      <p className="mt-1 text-sm">{app.income}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Commitment</p>
                      <p className="mt-1 text-sm">{app.commitment}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Goal</p>
                      <p className="mt-1 text-sm">{app.goal}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button size="sm" className="gap-1">
                      <Calendar className="h-3 w-3" />
                      Schedule Call
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1">
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
    </div>
  )
}
