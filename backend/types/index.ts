export interface ApplicationData {
  experience: string
  goal: string
  commitment: string
  investment: string
  income: string
  firstName: string
  lastName: string
  email: string
  phone: string
  countryCode: string
  createdAt: string
  qualified: boolean
}

export interface BookingData {
  date: string
  time: string
  timezone: string
  name: string
  email: string
  message: string
  phone: string
  createdAt: string
}

export interface LeadData extends ApplicationData {
  id: string
  booking?: BookingData
  status: "new" | "contacted" | "scheduled" | "completed" | "disqualified"
}

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}
