import { type NextRequest, NextResponse } from "next/server"

// Mock data baseado na estrutura do NestJS
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
  {
    id: "2",
    email: "joao@arquitetura.com",
    profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    createdAt: "2024-01-16T14:20:00Z",
    updatedAt: "2024-01-16T14:20:00Z",
    partnerSupplier: null,
    professional: {
      id: "1",
      name: "João Silva",
      level: "GOLD",
    },
    loveDecoration: null,
    address: {
      id: "2",
      state: "RJ",
      city: "Rio de Janeiro",
      district: "Copacabana",
      street: "Av. Atlântica",
      number: "456",
      complement: null,
      zipCode: "22070-011",
    },
  },
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const search = searchParams.get("search")

  let filteredUsers = users

  if (search) {
    filteredUsers = users.filter((user) => user.email.toLowerCase().includes(search.toLowerCase()))
  }

  return NextResponse.json(filteredUsers)
}

export async function POST(request: NextRequest) {
  const data = await request.json()

  const newUser = {
    id: Date.now().toString(),
    email: data.email,
    profileImage: data.profileImage || null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    partnerSupplier: null,
    professional: null,
    loveDecoration: null,
    address: data.address
      ? {
          id: Date.now().toString(),
          ...data.address,
        }
      : null,
  }

  users.push(newUser)
  return NextResponse.json(newUser, { status: 201 })
}
