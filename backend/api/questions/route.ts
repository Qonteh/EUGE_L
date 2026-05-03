import { NextResponse } from "next/server"
import type { ApiResponse } from "@/backend/types"
import {
  getQualificationQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} from "@/lib/db-queries"

export async function GET() {
  try {
    const questions = await getQualificationQuestions()

    // Transform to frontend format
    const formattedQuestions = questions.map((q) => ({
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

    const question = await createQuestion({
      question_text: body.text,
      question_type: body.type,
      options: body.options,
      placeholder: body.placeholder,
      is_required: body.required ?? true,
      is_disqualifying: body.isDisqualifying ?? false,
      disqualifying_answers: body.disqualifyingAnswers,
      display_order: body.order,
    })

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

    const updated = await updateQuestion(id, {
      question_text: data.text,
      question_type: data.type,
      options: data.options,
      placeholder: data.placeholder,
      is_required: data.required,
      is_disqualifying: data.isDisqualifying,
      disqualifying_answers: data.disqualifyingAnswers,
      display_order: data.order,
      is_active: data.isActive,
    })

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

    await deleteQuestion(id)

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
