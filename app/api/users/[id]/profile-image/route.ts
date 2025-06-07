import { type NextRequest, NextResponse } from "next/server"

const users = [
  {
    id: "1",
    email: "admin@connection.com",
    profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
  },
]

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const data = await request.json()
  const index = users.findIndex((u) => u.id === params.id)

  if (index === -1) {
    return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 })
  }

  users[index] = {
    ...users[index],
    profileImage: data.profileImage,
    updatedAt: new Date().toISOString(),
  }

  return NextResponse.json(users[index])
}
