"use client"

import { useState } from "react"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface QualificationFormProps {
  onComplete: (data: FormData) => void
  onDisqualified: () => void
  onClose: () => void
}

interface FormData {
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
}

const questions = [
  {
    id: 1,
    question: "What is your current trading experience?*",
    type: "choice",
    field: "experience",
    options: [
      { label: "A", value: "Complete Beginner - Never traded before" },
      { label: "B", value: "Some Experience - Traded a little" },
      { label: "C", value: "Intermediate - Trade regularly" },
      { label: "D", value: "Advanced - Profitable trader" },
    ],
  },
  {
    id: 2,
    question: "What is your #1 goal with trading right now?*",
    subtitle: "Be specific - income targets, lifestyle changes, financial freedom, etc.",
    type: "text",
    field: "goal",
    placeholder: "Financial freedom, replace my job income...",
  },
  {
    id: 3,
    question: "Are you ready to commit to a 90-day intensive program?*",
    type: "choice",
    field: "commitment",
    options: [
      { label: "A", value: "Yes, I'm fully committed" },
      { label: "B", value: "I need to think about it" },
      { label: "C", value: "No, not right now" },
    ],
    disqualifyOn: ["I need to think about it", "No, not right now"],
  },
  {
    id: 4,
    question: "This program is designed for serious people ready to invest in their trading education and career. It's a hands-on, high-level program that delivers world-class results and requires a financial commitment to succeed.\n\nHow much are you able to invest in your trading education right now?*",
    type: "choice",
    field: "investment",
    options: [
      { label: "A", value: "$0-$999" },
      { label: "B", value: "$1,000-$2,999" },
      { label: "C", value: "$3,500-$4,999" },
      { label: "D", value: "$5,000+" },
    ],
    disqualifyOn: ["$0-$999"],
  },
  {
    id: 5,
    question: "What is your current annual income?*",
    type: "choice",
    field: "income",
    options: [
      { label: "A", value: "Unemployed" },
      { label: "B", value: "$10,000-$20,000" },
      { label: "C", value: "$20,000-$40,000" },
      { label: "D", value: "$50,000+" },
      { label: "E", value: "Retired" },
    ],
  },
  {
    id: 6,
    question: "What is your name?*",
    type: "name",
    field: "name",
  },
  {
    id: 7,
    question: "What is your best email address?*",
    type: "email",
    field: "email",
    placeholder: "name@example.com",
  },
  {
    id: 8,
    question: "What is your best mobile number?*",
    type: "phone",
    field: "phone",
    placeholder: "692 438 585",
  },
]

const countryCodes = [
  { code: "+1", flag: "🇺🇸", country: "US" },
  { code: "+44", flag: "🇬🇧", country: "UK" },
  { code: "+255", flag: "🇹🇿", country: "TZ" },
  { code: "+254", flag: "🇰🇪", country: "KE" },
  { code: "+234", flag: "🇳🇬", country: "NG" },
  { code: "+27", flag: "🇿🇦", country: "ZA" },
  { code: "+91", flag: "🇮🇳", country: "IN" },
  { code: "+61", flag: "🇦🇺", country: "AU" },
  { code: "+49", flag: "🇩🇪", country: "DE" },
  { code: "+33", flag: "🇫🇷", country: "FR" },
  { code: "+86", flag: "🇨🇳", country: "CN" },
  { code: "+81", flag: "🇯🇵", country: "JP" },
  { code: "+82", flag: "🇰🇷", country: "KR" },
  { code: "+971", flag: "🇦🇪", country: "UAE" },
]

export function QualificationForm({ onComplete, onDisqualified, onClose }: QualificationFormProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<FormData>({
    experience: "",
    goal: "",
    commitment: "",
    investment: "",
    income: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    countryCode: "+255",
  })
  const [selectedOption, setSelectedOption] = useState<string | null>(null)

  const currentQuestion = questions[currentStep]
  const progress = ((currentStep + 1) / questions.length) * 100

  const handleOptionSelect = (value: string) => {
    setSelectedOption(value)
    setFormData((prev) => ({ ...prev, [currentQuestion.field]: value }))
  }

  const handleNext = () => {
    // Check for disqualification
    if (currentQuestion.disqualifyOn?.includes(selectedOption || "")) {
      onDisqualified()
      return
    }

    if (currentStep < questions.length - 1) {
      setCurrentStep((prev) => prev + 1)
      setSelectedOption(null)
    } else {
      onComplete(formData)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
      setSelectedOption(null)
    }
  }

  const isNextDisabled = () => {
    switch (currentQuestion.type) {
      case "choice":
        return !selectedOption
      case "text":
        return !formData[currentQuestion.field as keyof FormData]
      case "name":
        return !formData.firstName || !formData.lastName
      case "email":
        return !formData.email || !formData.email.includes("@")
      case "phone":
        return !formData.phone
      default:
        return true
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background">
      {/* Progress Bar */}
      <div className="h-1 w-full bg-border">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Header */}
      <div className="flex items-center justify-end px-3 py-2 sm:px-4 sm:py-3">
        <button
          onClick={onClose}
          className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground sm:p-2"
          aria-label="Close"
        >
          <X className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col px-4 pb-20 pt-4 sm:px-6 sm:pb-24 sm:pt-8 md:px-12">
        <div className="mx-auto w-full max-w-lg">
          {/* Question Number */}
          <div className="mb-3 flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-xs font-medium text-primary-foreground sm:mb-4 sm:h-8 sm:w-8 sm:text-sm">
            {currentQuestion.id}
          </div>

          {/* Question */}
          <h2 className="mb-2 whitespace-pre-line text-base font-semibold leading-relaxed text-foreground sm:text-xl md:text-2xl">
            {currentQuestion.question}
          </h2>

          {currentQuestion.subtitle && (
            <p className="mb-4 text-xs text-muted-foreground sm:mb-6 sm:text-sm">{currentQuestion.subtitle}</p>
          )}

          {/* Input based on type */}
          <div className="mt-4 sm:mt-6">
            {currentQuestion.type === "choice" && (
              <div className="space-y-2 sm:space-y-3">
                {currentQuestion.options?.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleOptionSelect(option.value)}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-xl border-2 px-3 py-3 text-left transition-all sm:gap-3 sm:px-4 sm:py-4",
                      selectedOption === option.value
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border bg-card text-foreground hover:border-primary/50"
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border-2 text-xs font-medium sm:h-8 sm:w-8 sm:text-sm",
                        selectedOption === option.value
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border text-muted-foreground"
                      )}
                    >
                      {option.label}
                    </span>
                    <span className="text-sm font-medium sm:text-base">{option.value}</span>
                  </button>
                ))}
              </div>
            )}

            {currentQuestion.type === "text" && (
              <Input
                type="text"
                placeholder={currentQuestion.placeholder}
                value={formData[currentQuestion.field as keyof FormData] || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    [currentQuestion.field]: e.target.value,
                  }))
                }
                className="h-10 border-0 border-b-2 border-primary bg-transparent text-sm text-primary placeholder:text-primary/50 focus-visible:ring-0 sm:h-12 sm:text-lg"
              />
            )}

            {currentQuestion.type === "name" && (
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <label className="mb-1 block text-xs font-medium text-foreground sm:mb-2 sm:text-sm">
                    First name*
                  </label>
                  <Input
                    type="text"
                    placeholder="Jane"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, firstName: e.target.value }))
                    }
                    className="h-10 border-0 border-b-2 border-primary bg-transparent text-sm text-primary placeholder:text-primary/50 focus-visible:ring-0 sm:h-12 sm:text-lg"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-foreground sm:mb-2 sm:text-sm">
                    Last name
                  </label>
                  <Input
                    type="text"
                    placeholder="Smith"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, lastName: e.target.value }))
                    }
                    className="h-10 border-0 border-b-2 border-primary bg-transparent text-sm text-primary placeholder:text-primary/50 focus-visible:ring-0 sm:h-12 sm:text-lg"
                  />
                </div>
              </div>
            )}

            {currentQuestion.type === "email" && (
              <Input
                type="email"
                placeholder={currentQuestion.placeholder}
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                className="h-10 border-0 border-b-2 border-primary bg-transparent text-sm text-primary placeholder:text-primary/50 focus-visible:ring-0 sm:h-12 sm:text-lg"
              />
            )}

            {currentQuestion.type === "phone" && (
              <div className="flex items-center gap-2 sm:gap-3">
                <select
                  value={formData.countryCode}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, countryCode: e.target.value }))
                  }
                  className="h-10 rounded-lg border-2 border-primary/30 bg-transparent px-2 text-sm focus:border-primary focus:outline-none sm:h-12 sm:px-3 sm:text-lg"
                >
                  {countryCodes.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.flag} {country.code}
                    </option>
                  ))}
                </select>
                <Input
                  type="tel"
                  placeholder={currentQuestion.placeholder}
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  className="h-10 flex-1 border-0 border-b-2 border-primary bg-transparent text-sm text-primary placeholder:text-primary/50 focus-visible:ring-0 sm:h-12 sm:text-lg"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="fixed bottom-0 left-0 right-0 flex items-center gap-2 bg-background px-4 py-3 sm:gap-3 sm:px-6 sm:py-4 md:px-12">
        <Button
          variant="outline"
          size="lg"
          onClick={handleBack}
          disabled={currentStep === 0}
          className="h-11 w-11 shrink-0 rounded-xl border-2 p-0 sm:h-14 sm:w-14"
        >
          <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
        </Button>
        <Button
          size="lg"
          onClick={handleNext}
          disabled={isNextDisabled()}
          className="h-11 flex-1 rounded-xl bg-primary text-base font-semibold text-primary-foreground shadow-lg shadow-primary/30 disabled:opacity-50 sm:h-14 sm:text-lg"
        >
          {currentStep === questions.length - 1 ? "Submit" : "OK"}
          {currentStep < questions.length - 1 && <ChevronRight className="ml-1 h-4 w-4 sm:ml-2 sm:h-5 sm:w-5" />}
        </Button>
      </div>
    </div>
  )
}
