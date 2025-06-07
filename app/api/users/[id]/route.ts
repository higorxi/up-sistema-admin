import { type NextRequest, NextResponse } from "next/server"

const users = [
  {
    id: "1",
    email: "admin@connection.com",
    profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
    partnerSupplier: {
      id: "1",
      tradeName: "Padaria Victor Bom",
    },
    professional: null,
    loveDecoration: null,
    address: {
      id: "1",
      state: "SP",
      city: "São Paulo",
      district: "Centro",
      street: "Rua das Flores",
      number: "123",
      complement: "Sala 45",
      zipCode: "01234-567",
    },
  },
]

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const user = users.find((u) => u.id === params.id)

  if (!user) {
    return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 })
  }

  return NextResponse.json(user)
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const data = await request.json()
  const index = users.findIndex((u) => u.id === params.id)

  if (index === -1) {
    return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 })
  }

  users[index] = {
    ...users[index],
    ...data,
    updatedAt: new Date().toISOString(),
  }

  return NextResponse.json(users[index])
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const index = users.findIndex((u) => u.id === params.id)

  if (index === -1) {
    return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 })
  }

  users.splice(index, 1)
  return NextResponse.json({ success: true })
}
