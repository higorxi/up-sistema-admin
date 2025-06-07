import { type NextRequest, NextResponse } from "next/server"

const loveDecorations = [
  {
    id: "1",
    name: "Ana Costa",
    contact: "(11) 97777-7777",
    instagram: "@anacosta_decor",
    tiktok: "@anacosta_decor",
  },
]

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const loveDecoration = loveDecorations.find((l) => l.id === params.id)

  if (!loveDecoration) {
    return NextResponse.json({ error: "Amante de decoração não encontrado" }, { status: 404 })
  }

  return NextResponse.json(loveDecoration)
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const data = await request.json()
  const index = loveDecorations.findIndex((l) => l.id === params.id)

  if (index === -1) {
    return NextResponse.json({ error: "Amante de decoração não encontrado" }, { status: 404 })
  }

  loveDecorations[index] = { ...loveDecorations[index], ...data }
  return NextResponse.json(loveDecorations[index])
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const index = loveDecorations.findIndex((l) => l.id === params.id)

  if (index === -1) {
    return NextResponse.json({ error: "Amante de decoração não encontrado" }, { status: 404 })
  }

  loveDecorations.splice(index, 1)
  return NextResponse.json({ success: true })
}
