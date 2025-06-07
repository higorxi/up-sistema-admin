import { type NextRequest, NextResponse } from "next/server"

const professionals = [
  {
    id: "1",
    name: "João Silva",
    document: "123.456.789-00",
    phone: "(11) 99999-9999",
    generalRegister: "123456789",
    registrationAgency: "CREA-SP",
    description: "Arquiteto especializado em design de interiores",
    experience: "10 anos de experiência",
    officeName: "Silva Arquitetura",
    verified: true,
    featured: false,
    level: "GOLD",
    points: 1500,
    professionId: "1",
  },
]

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const professional = professionals.find((p) => p.id === params.id)

  if (!professional) {
    return NextResponse.json({ error: "Profissional não encontrado" }, { status: 404 })
  }

  return NextResponse.json(professional)
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const data = await request.json()
  const index = professionals.findIndex((p) => p.id === params.id)

  if (index === -1) {
    return NextResponse.json({ error: "Profissional não encontrado" }, { status: 404 })
  }

  professionals[index] = { ...professionals[index], ...data }
  return NextResponse.json(professionals[index])
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const index = professionals.findIndex((p) => p.id === params.id)

  if (index === -1) {
    return NextResponse.json({ error: "Profissional não encontrado" }, { status: 404 })
  }

  professionals.splice(index, 1)
  return NextResponse.json({ success: true })
}
