"use client"

import { Users, Calendar, FileQuestion, Video, TrendingUp, Clock } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const stats = [
  {
    title: "Total Applications",
    value: "1,284",
    change: "+12%",
    changeType: "positive",
    icon: Users,
  },
  {
    title: "Bookings This Week",
    value: "48",
    change: "+8%",
    changeType: "positive",
    icon: Calendar,
  },
  {
    title: "Questions",
    value: "8",
    change: "0%",
    changeType: "neutral",
    icon: FileQuestion,
  },
  {
    title: "Active Videos",
    value: "12",
    change: "+2",
    changeType: "positive",
    icon: Video,
  },
]

const recentApplications = [
  { name: "John Smith", email: "john@email.com", status: "Qualified", date: "2 hours ago" },
  { name: "Sarah Johnson", email: "sarah@email.com", status: "Booked", date: "3 hours ago" },
  { name: "Michael Brown", email: "mike@email.com", status: "Disqualified", date: "5 hours ago" },
  { name: "Emily Davis", email: "emily@email.com", status: "Qualified", date: "6 hours ago" },
  { name: "James Wilson", email: "james@email.com", status: "Booked", date: "8 hours ago" },
]

const upcomingBookings = [
  { name: "Sarah Johnson", date: "Today, 2:00 PM", timezone: "EST" },
  { name: "David Lee", date: "Today, 4:00 PM", timezone: "PST" },
  { name: "Anna Martinez", date: "Tomorrow, 10:00 AM", timezone: "GMT" },
  { name: "Robert Taylor", date: "Tomorrow, 3:00 PM", timezone: "EAT" },
]

export default function AdminDashboard() {
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground sm:text-base">
          Welcome back! Here&apos;s an overview of your mentorship funnel.
        </p>
      </div>

      {/* Stats Grid */}
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
              <p
                className={`mt-1 text-xs ${
                  stat.changeType === "positive"
                    ? "text-green-600"
                    : stat.changeType === "negative"
                    ? "text-red-600"
                    : "text-muted-foreground"
                }`}
              >
                {stat.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Applications */}
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
              {recentApplications.map((app, index) => (
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
          </CardContent>
        </Card>

        {/* Upcoming Bookings */}
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

      {/* Quick Actions */}
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
