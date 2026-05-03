"use client"

import { useState } from "react"
import { Save, User, Mail, Globe, Video, Calendar, Bell, Shield, Palette } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    // Profile
    mentorName: "Eugene L",
    mentorTitle: "Head Coach & Professional Trader",
    programName: "Traders Accelerator Program",
    contactEmail: "eugene@tradersaccelerator.com",
    
    // Branding
    primaryColor: "#7C3AED",
    accentColor: "#6D28D9",
    
    // Landing Page
    heroHeadline: "Your Trading Skills Could Be Generating $2K-$10K Profit Monthly",
    heroSubheadline: "(In Just 90 Days, Guaranteed)",
    rating: "4.9",
    reviewCount: "300+",
    
    // Booking Settings
    callDuration: "60",
    bufferTime: "15",
    availableDays: ["mon", "tue", "wed", "thu", "fri"],
    startTime: "09:00",
    endTime: "18:00",
    defaultTimezone: "EAT",
    
    // Notifications
    emailNotifications: true,
    smsNotifications: false,
    reminderHours: "24",
    
    // Disqualification
    minBudget: "$1,000-$2,999",
    requireCommitment: true,
  })

  const handleSave = () => {
    // Save settings
    alert("Settings saved!")
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Settings</h1>
          <p className="mt-1 text-sm text-muted-foreground sm:text-base">
            Configure your funnel and preferences
          </p>
        </div>
        <Button onClick={handleSave} className="gap-2">
          <Save className="h-4 w-4" />
          Save Changes
        </Button>
      </div>

      {/* Profile Settings */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <User className="h-5 w-5 text-primary" />
            Profile Settings
          </CardTitle>
          <CardDescription>Your mentor profile information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Mentor Name
              </label>
              <Input
                value={settings.mentorName}
                onChange={(e) =>
                  setSettings({ ...settings, mentorName: e.target.value })
                }
                className="border-border"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Title
              </label>
              <Input
                value={settings.mentorTitle}
                onChange={(e) =>
                  setSettings({ ...settings, mentorTitle: e.target.value })
                }
                className="border-border"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Program Name
              </label>
              <Input
                value={settings.programName}
                onChange={(e) =>
                  setSettings({ ...settings, programName: e.target.value })
                }
                className="border-border"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Contact Email
              </label>
              <Input
                type="email"
                value={settings.contactEmail}
                onChange={(e) =>
                  setSettings({ ...settings, contactEmail: e.target.value })
                }
                className="border-border"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Landing Page Settings */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Globe className="h-5 w-5 text-primary" />
            Landing Page
          </CardTitle>
          <CardDescription>Customize your landing page content</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Hero Headline
            </label>
            <Input
              value={settings.heroHeadline}
              onChange={(e) =>
                setSettings({ ...settings, heroHeadline: e.target.value })
              }
              className="border-border"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Hero Sub-headline
            </label>
            <Input
              value={settings.heroSubheadline}
              onChange={(e) =>
                setSettings({ ...settings, heroSubheadline: e.target.value })
              }
              className="border-border"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Rating (out of 5)
              </label>
              <Input
                value={settings.rating}
                onChange={(e) =>
                  setSettings({ ...settings, rating: e.target.value })
                }
                className="border-border"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Review Count Display
              </label>
              <Input
                value={settings.reviewCount}
                onChange={(e) =>
                  setSettings({ ...settings, reviewCount: e.target.value })
                }
                className="border-border"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Branding Settings */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Palette className="h-5 w-5 text-primary" />
            Branding
          </CardTitle>
          <CardDescription>Customize your brand colors</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Primary Color
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={settings.primaryColor}
                  onChange={(e) =>
                    setSettings({ ...settings, primaryColor: e.target.value })
                  }
                  className="h-10 w-10 cursor-pointer rounded-lg border border-border"
                />
                <Input
                  value={settings.primaryColor}
                  onChange={(e) =>
                    setSettings({ ...settings, primaryColor: e.target.value })
                  }
                  className="flex-1 border-border"
                />
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Accent Color
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={settings.accentColor}
                  onChange={(e) =>
                    setSettings({ ...settings, accentColor: e.target.value })
                  }
                  className="h-10 w-10 cursor-pointer rounded-lg border border-border"
                />
                <Input
                  value={settings.accentColor}
                  onChange={(e) =>
                    setSettings({ ...settings, accentColor: e.target.value })
                  }
                  className="flex-1 border-border"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Booking Settings */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calendar className="h-5 w-5 text-primary" />
            Booking Settings
          </CardTitle>
          <CardDescription>Configure your calendar and availability</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Call Duration (minutes)
              </label>
              <select
                value={settings.callDuration}
                onChange={(e) =>
                  setSettings({ ...settings, callDuration: e.target.value })
                }
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground"
              >
                <option value="30">30 minutes</option>
                <option value="45">45 minutes</option>
                <option value="60">60 minutes</option>
                <option value="90">90 minutes</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Buffer Time (minutes)
              </label>
              <select
                value={settings.bufferTime}
                onChange={(e) =>
                  setSettings({ ...settings, bufferTime: e.target.value })
                }
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground"
              >
                <option value="0">No buffer</option>
                <option value="5">5 minutes</option>
                <option value="10">10 minutes</option>
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Default Timezone
              </label>
              <select
                value={settings.defaultTimezone}
                onChange={(e) =>
                  setSettings({ ...settings, defaultTimezone: e.target.value })
                }
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground"
              >
                <option value="EAT">East Africa Time (EAT)</option>
                <option value="GMT">Greenwich Mean Time (GMT)</option>
                <option value="EST">Eastern Standard Time (EST)</option>
                <option value="PST">Pacific Standard Time (PST)</option>
                <option value="IST">India Standard Time (IST)</option>
              </select>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Start Time
              </label>
              <Input
                type="time"
                value={settings.startTime}
                onChange={(e) =>
                  setSettings({ ...settings, startTime: e.target.value })
                }
                className="border-border"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                End Time
              </label>
              <Input
                type="time"
                value={settings.endTime}
                onChange={(e) =>
                  setSettings({ ...settings, endTime: e.target.value })
                }
                className="border-border"
              />
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Available Days
            </label>
            <div className="flex flex-wrap gap-2">
              {["mon", "tue", "wed", "thu", "fri", "sat", "sun"].map((day) => (
                <button
                  key={day}
                  onClick={() => {
                    const days = settings.availableDays.includes(day)
                      ? settings.availableDays.filter((d) => d !== day)
                      : [...settings.availableDays, day]
                    setSettings({ ...settings, availableDays: days })
                  }}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    settings.availableDays.includes(day)
                      ? "bg-primary text-primary-foreground"
                      : "border border-border bg-background text-muted-foreground hover:bg-secondary"
                  }`}
                >
                  {day.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Bell className="h-5 w-5 text-primary" />
            Notifications
          </CardTitle>
          <CardDescription>Configure notification preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) =>
                  setSettings({ ...settings, emailNotifications: e.target.checked })
                }
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
              />
              <span className="text-sm font-medium text-foreground">
                Email notifications for new applications
              </span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.smsNotifications}
                onChange={(e) =>
                  setSettings({ ...settings, smsNotifications: e.target.checked })
                }
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
              />
              <span className="text-sm font-medium text-foreground">
                SMS notifications for bookings
              </span>
            </label>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Send reminder before call (hours)
            </label>
            <select
              value={settings.reminderHours}
              onChange={(e) =>
                setSettings({ ...settings, reminderHours: e.target.value })
              }
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground sm:w-auto"
            >
              <option value="1">1 hour</option>
              <option value="2">2 hours</option>
              <option value="24">24 hours</option>
              <option value="48">48 hours</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Qualification Settings */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Shield className="h-5 w-5 text-primary" />
            Qualification Rules
          </CardTitle>
          <CardDescription>Configure disqualification criteria</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Minimum Investment Budget
            </label>
            <select
              value={settings.minBudget}
              onChange={(e) =>
                setSettings({ ...settings, minBudget: e.target.value })
              }
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground sm:w-auto"
            >
              <option value="$0-$999">$0-$999 (disqualify below this)</option>
              <option value="$1,000-$2,999">$1,000-$2,999 (disqualify below this)</option>
              <option value="$3,500-$4,999">$3,500-$4,999 (disqualify below this)</option>
              <option value="$5,000+">$5,000+ (disqualify below this)</option>
            </select>
          </div>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={settings.requireCommitment}
              onChange={(e) =>
                setSettings({ ...settings, requireCommitment: e.target.checked })
              }
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
            />
            <span className="text-sm font-medium text-foreground">
              Require &quot;fully committed&quot; answer to proceed
            </span>
          </label>
        </CardContent>
      </Card>

      {/* Save Button (Bottom) */}
      <div className="flex justify-end">
        <Button onClick={handleSave} size="lg" className="gap-2">
          <Save className="h-4 w-4" />
          Save All Changes
        </Button>
      </div>
    </div>
  )
}
