import { type NextRequest, NextResponse } from "next/server"

const loveDecorations = [
  {
    id: "1",
    name: "Ana Costa",
    contact: "(11) 97777-7777",
    instagram: "@anacosta_decor",
    tiktok: "@anacosta_decor",
    createdAt: "2024-01-14T12:00:00Z",
    updatedAt: "2024-01-14T12:00:00Z",
    user: {
      id: "4",
      email: "ana@decoracao.com",
    },
  },
  {
    id: "2",
    name: "Carlos Mendes",
    contact: "(11) 96666-6666",
    instagram: "@carlosmendes_home",
    tiktok: "@carlosmendes_home",
    createdAt: "2024-01-13T15:30:00Z",
    updatedAt: "2024-01-13T15:30:00Z",
    user: {
      id: "5",
      email: "carlos@homedecor.com",
    },
  },
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const search = searchParams.get("search")

  let filteredLoveDecorations = loveDecorations

  if (search) {
    filteredLoveDecorations = loveDecorations.filter(
      (love) =>
        love.name.toLowerCase().includes(search.toLowerCase()) ||
        love.contact.includes(search) ||
        love.instagram.toLowerCase().includes(search.toLowerCase()),
    )
  }

  return NextResponse.json(filteredLoveDecorations)
}

export async function POST(request: NextRequest) {
  const data = await request.json()

  const newLoveDecoration = {
    id: Date.now().toString(),
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  loveDecorations.push(newLoveDecoration)
  return NextResponse.json(newLoveDecoration, { status: 201 })
}
