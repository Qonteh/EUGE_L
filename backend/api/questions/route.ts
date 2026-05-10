import { NextResponse } from "next/server"
import { readFile, writeFile, mkdir } from "fs/promises"
import path from "path"
import { randomUUID } from "crypto"
import type { ApiResponse } from "@/backend/types"
import {
  getQualificationQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} from "@/lib/db-queries"

function normalizeQuestionType(type: unknown) {
  if (type === "choice") return "select"
  if (type === "name") return "text"
  if (type === "text" || type === "select" || type === "multi-select" || type === "number" || type === "email" || type === "phone" || type === "textarea") {
    return type
  }
  return "text"
}

async function nextDisplayOrder() {
  const questions = await getQualificationQuestions()
  return questions.length + 1
}

const localStorePath = path.join(process.cwd(), "data", "qualification-questions.json")

async function readLocalQuestions() {
  try {
    const raw = await readFile(localStorePath, "utf-8")
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

async function writeLocalQuestions(questions: any[]) {
  await mkdir(path.dirname(localStorePath), { recursive: true })
  await writeFile(localStorePath, JSON.stringify(questions, null, 2), "utf-8")
}

async function getQuestionsWithFallback() {
  try {
    const questions = await getQualificationQuestions()
    return questions.map((q) => ({
      id: q.id,
      text: q.question_text,
      type: q.question_type,
      options: q.options,
      placeholder: q.placeholder,
      required: q.is_required,
      isDisqualifying: q.is_disqualifying,
      disqualifyingAnswers: q.disqualifying_answers,
      order: q.display_order,
    }))
  } catch (error) {
    console.warn("[v0] Falling back to local question store:", error)
    return await readLocalQuestions()
  }
}

async function createQuestionWithFallback(body: any) {
  try {
    const displayOrder = Number.isFinite(Number(body.order)) ? Number(body.order) : await nextDisplayOrder()
    const question = await createQuestion({
      question_text: body.text,
      question_type: normalizeQuestionType(body.type),
      options: body.options,
      placeholder: body.placeholder,
      is_required: body.required ?? true,
      is_disqualifying: body.isDisqualifying ?? false,
      disqualifying_answers: body.disqualifyingAnswers,
      display_order: displayOrder,
    })
    return {
      id: question.id,
      text: question.question_text,
      type: question.question_type,
      options: question.options,
      placeholder: question.placeholder,
      required: question.is_required,
      isDisqualifying: question.is_disqualifying,
      disqualifyingAnswers: question.disqualifying_answers,
      order: question.display_order,
    }
  } catch (error) {
    console.warn("[v0] Falling back to local question create:", error)
    const questions = await readLocalQuestions()
    const nextOrder = Number.isFinite(Number(body.order)) ? Number(body.order) : questions.length + 1
    const created = {
      id: randomUUID(),
      text: body.text,
      type: normalizeQuestionType(body.type),
      options: body.options,
      placeholder: body.placeholder,
      required: body.required ?? true,
      isDisqualifying: body.isDisqualifying ?? false,
      disqualifyingAnswers: body.disqualifyingAnswers,
      order: nextOrder,
    }
    await writeLocalQuestions([...questions, created])
    return created
  }
}

async function updateQuestionWithFallback(id: string, data: any) {
  try {
    const updated = await updateQuestion(id, {
      question_text: data.text,
      question_type: normalizeQuestionType(data.type),
      options: data.options,
      placeholder: data.placeholder,
      is_required: data.required,
      is_disqualifying: data.isDisqualifying,
      disqualifying_answers: data.disqualifyingAnswers,
      display_order: data.order,
      is_active: data.isActive,
    })
    return updated
  } catch (error) {
    console.warn("[v0] Falling back to local question update:", error)
    const questions = await readLocalQuestions()
    const next = questions.map((question) =>
      question.id === id
        ? {
            ...question,
            text: data.text ?? question.text,
            type: normalizeQuestionType(data.type ?? question.type),
            options: data.options ?? question.options,
            placeholder: data.placeholder ?? question.placeholder,
            required: data.required ?? question.required,
            isDisqualifying: data.isDisqualifying ?? question.isDisqualifying,
            disqualifyingAnswers: data.disqualifyingAnswers ?? question.disqualifyingAnswers,
            order: data.order ?? question.order,
            isActive: data.isActive ?? question.isActive,
          }
        : question
    )
    await writeLocalQuestions(next)
    return next.find((question) => question.id === id) || null
  }
}

async function deleteQuestionWithFallback(id: string) {
  try {
    await deleteQuestion(id)
  } catch (error) {
    console.warn("[v0] Falling back to local question delete:", error)
    const questions = await readLocalQuestions()
    await writeLocalQuestions(questions.filter((question) => question.id !== id))
  }
}

export async function GET() {
  try {
    const formattedQuestions = await getQuestionsWithFallback()

    return NextResponse.json<ApiResponse<typeof formattedQuestions>>({
      success: true,
      data: formattedQuestions,
    })
  } catch (error) {
    console.error("[v0] Error fetching questions:", error)
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Failed to fetch questions" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const question = await createQuestionWithFallback(body)

    return NextResponse.json<ApiResponse<{ id: string }>>({
      success: true,
      data: { id: question.id },
      message: "Question created successfully",
    })
  } catch (error) {
    console.error("[v0] Error creating question:", error)
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Failed to create question" },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { id, ...data } = body

    if (!id) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Missing question id" },
        { status: 400 }
      )
    }

    const updated = await updateQuestionWithFallback(id, data)

    if (!updated) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Question not found" },
        { status: 404 }
      )
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "Question updated successfully",
    })
  } catch (error) {
    console.error("[v0] Error updating question:", error)
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Failed to update question" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Missing question id" },
        { status: 400 }
      )
    }

    await deleteQuestionWithFallback(id)

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "Question deleted successfully",
    })
  } catch (error) {
    console.error("[v0] Error deleting question:", error)
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Failed to delete question" },
      { status: 500 }
    )
  }
}
