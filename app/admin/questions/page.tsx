"use client"

import { useState } from "react"
import { Plus, Edit2, Trash2, GripVertical, ChevronDown, ChevronUp, Save, X } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface Option {
  label: string
  value: string
}

interface Question {
  id: string
  question: string
  type: "choice" | "text" | "name" | "email" | "phone"
  options?: Option[]
  placeholder?: string
  disqualifyOn?: string[]
  required: boolean
}

const initialQuestions: Question[] = [
  {
    id: "1",
    question: "What is your current trading experience?",
    type: "choice",
    options: [
      { label: "A", value: "Complete Beginner - Never traded before" },
      { label: "B", value: "Some Experience - Traded a little" },
      { label: "C", value: "Intermediate - Trade regularly" },
      { label: "D", value: "Advanced - Profitable trader" },
    ],
    required: true,
  },
  {
    id: "2",
    question: "What is your #1 goal with trading right now?",
    type: "text",
    placeholder: "Financial freedom, replace my job income...",
    required: true,
  },
  {
    id: "3",
    question: "Are you ready to commit to a 90-day intensive program?",
    type: "choice",
    options: [
      { label: "A", value: "Yes, I'm fully committed" },
      { label: "B", value: "I need to think about it" },
      { label: "C", value: "No, not right now" },
    ],
    disqualifyOn: ["I need to think about it", "No, not right now"],
    required: true,
  },
  {
    id: "4",
    question: "How much are you able to invest in your trading education right now?",
    type: "choice",
    options: [
      { label: "A", value: "$0-$999" },
      { label: "B", value: "$1,000-$2,999" },
      { label: "C", value: "$3,500-$4,999" },
      { label: "D", value: "$5,000+" },
    ],
    disqualifyOn: ["$0-$999"],
    required: true,
  },
  {
    id: "5",
    question: "What is your current annual income?",
    type: "choice",
    options: [
      { label: "A", value: "Unemployed" },
      { label: "B", value: "$10,000-$20,000" },
      { label: "C", value: "$20,000-$40,000" },
      { label: "D", value: "$50,000+" },
      { label: "E", value: "Retired" },
    ],
    required: true,
  },
]

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>(initialQuestions)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newQuestion, setNewQuestion] = useState<Partial<Question>>({
    question: "",
    type: "choice",
    options: [{ label: "A", value: "" }],
    required: true,
  })

  const handleAddQuestion = () => {
    if (!newQuestion.question) return

    const question: Question = {
      id: Date.now().toString(),
      question: newQuestion.question,
      type: newQuestion.type || "choice",
      options: newQuestion.type === "choice" ? newQuestion.options : undefined,
      placeholder: newQuestion.type === "text" ? newQuestion.placeholder : undefined,
      required: true,
    }

    setQuestions([...questions, question])
    setShowAddForm(false)
    setNewQuestion({
      question: "",
      type: "choice",
      options: [{ label: "A", value: "" }],
      required: true,
    })
  }

  const handleDeleteQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id))
  }

  const addOption = () => {
    const labels = "ABCDEFGHIJ"
    const currentOptions = newQuestion.options || []
    const nextLabel = labels[currentOptions.length] || String(currentOptions.length + 1)
    setNewQuestion({
      ...newQuestion,
      options: [...currentOptions, { label: nextLabel, value: "" }],
    })
  }

  const updateOption = (index: number, value: string) => {
    const options = [...(newQuestion.options || [])]
    options[index] = { ...options[index], value }
    setNewQuestion({ ...newQuestion, options })
  }

  const removeOption = (index: number) => {
    const options = (newQuestion.options || []).filter((_, i) => i !== index)
    // Relabel options
    const labels = "ABCDEFGHIJ"
    const relabeled = options.map((opt, i) => ({
      ...opt,
      label: labels[i] || String(i + 1),
    }))
    setNewQuestion({ ...newQuestion, options: relabeled })
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Questions</h1>
          <p className="mt-1 text-sm text-muted-foreground sm:text-base">
            Manage your qualification form questions
          </p>
        </div>
        <Button
          onClick={() => setShowAddForm(true)}
          className="gap-2 bg-primary text-primary-foreground"
        >
          <Plus className="h-4 w-4" />
          Add Question
        </Button>
      </div>

      {/* Add Question Form */}
      {showAddForm && (
        <Card className="border-primary bg-card">
          <CardHeader>
            <CardTitle className="text-lg">Add New Question</CardTitle>
            <CardDescription>Create a new qualification question</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Question Text
              </label>
              <Input
                value={newQuestion.question}
                onChange={(e) =>
                  setNewQuestion({ ...newQuestion, question: e.target.value })
                }
                placeholder="Enter your question..."
                className="border-border"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Question Type
              </label>
              <select
                value={newQuestion.type}
                onChange={(e) =>
                  setNewQuestion({
                    ...newQuestion,
                    type: e.target.value as Question["type"],
                  })
                }
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground"
              >
                <option value="choice">Multiple Choice</option>
                <option value="text">Text Input</option>
                <option value="name">Name Input</option>
                <option value="email">Email Input</option>
                <option value="phone">Phone Input</option>
              </select>
            </div>

            {newQuestion.type === "choice" && (
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Options
                </label>
                <div className="space-y-2">
                  {newQuestion.options?.map((option, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border text-sm font-medium">
                        {option.label}
                      </span>
                      <Input
                        value={option.value}
                        onChange={(e) => updateOption(index, e.target.value)}
                        placeholder="Option value..."
                        className="flex-1 border-border"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeOption(index)}
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addOption}
                    className="mt-2"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Option
                  </Button>
                </div>
              </div>
            )}

            {newQuestion.type === "text" && (
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Placeholder
                </label>
                <Input
                  value={newQuestion.placeholder || ""}
                  onChange={(e) =>
                    setNewQuestion({ ...newQuestion, placeholder: e.target.value })
                  }
                  placeholder="Enter placeholder text..."
                  className="border-border"
                />
              </div>
            )}

            <div className="flex gap-3">
              <Button onClick={handleAddQuestion} className="gap-2">
                <Save className="h-4 w-4" />
                Save Question
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Questions List */}
      <div className="space-y-4">
        {questions.map((question, index) => (
          <Card key={question.id} className="border-border bg-card">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
                  {index + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="mb-2 font-medium text-foreground">{question.question}</h3>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
                      {question.type}
                    </span>
                    {question.required && (
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                        Required
                      </span>
                    )}
                    {question.disqualifyOn && question.disqualifyOn.length > 0 && (
                      <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">
                        Has disqualifiers
                      </span>
                    )}
                  </div>

                  {question.options && (
                    <div className="mt-3 space-y-1">
                      {question.options.map((option) => (
                        <div
                          key={option.label}
                          className={cn(
                            "flex items-center gap-2 text-sm",
                            question.disqualifyOn?.includes(option.value)
                              ? "text-red-600"
                              : "text-muted-foreground"
                          )}
                        >
                          <span className="flex h-5 w-5 items-center justify-center rounded border border-current text-xs">
                            {option.label}
                          </span>
                          <span>{option.value}</span>
                          {question.disqualifyOn?.includes(option.value) && (
                            <span className="text-xs">(disqualifies)</span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex shrink-0 gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteQuestion(question.id)}
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
