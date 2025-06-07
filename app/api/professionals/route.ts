import { type NextRequest, NextResponse } from "next/server"

const professionals = [
  {
    id: "1",
    name: "João Silva",
    document: "123.456.789-00",
    phone: "(11) 99999-9999",
    generalRegister: "123456789",
    registrationAgency: "CREA-SP",
    description: "Arquiteto especializado em design de interiores com mais de 10 anos de experiência",
    experience: "10 anos de experiência em projetos residenciais e comerciais",
    officeName: "Silva Arquitetura",
    verified: true,
    featured: false,
    level: "GOLD",
    points: 1500,
    professionId: "1",
    createdAt: "2024-01-10T08:00:00Z",
    updatedAt: "2024-01-15T16:30:00Z",
    profession: {
      id: "1",
      name: "Arquiteto",
    },
    user: {
      id: "2",
      email: "joao@arquitetura.com",
    },
  },
  {
    id: "2",
    name: "Maria Santos",
    document: "987.654.321-00",
    phone: "(11) 88888-8888",
    generalRegister: "987654321",
    registrationAgency: "CAU-SP",
    description: "Designer de interiores focada em projetos sustentáveis",
    experience: "8 anos de experiência em design sustentável",
    officeName: "Santos Design",
    verified: true,
    featured: true,
    level: "PLATINUM",
    points: 2500,
    professionId: "2",
    createdAt: "2024-01-12T10:15:00Z",
    updatedAt: "2024-01-16T09:45:00Z",
    profession: {
      id: "2",
      name: "Designer de Interiores",
    },
    user: {
      id: "3",
      email: "maria@santosdesign.com",
    },
  },
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const search = searchParams.get("search")
  const verified = searchParams.get("verified")
  const level = searchParams.get("level")

  let filteredProfessionals = professionals

  if (search) {
    filteredProfessionals = filteredProfessionals.filter(
      (prof) =>
        prof.name.toLowerCase().includes(search.toLowerCase()) ||
        prof.document.includes(search) ||
        prof.phone.includes(search),
    )
  }

  if (verified !== null) {
    filteredProfessionals = filteredProfessionals.filter((prof) => prof.verified === (verified === "true"))
  }

  if (level) {
    filteredProfessionals = filteredProfessionals.filter((prof) => prof.level === level)
  }

  return NextResponse.json(filteredProfessionals)
}

export async function POST(request: NextRequest) {
  const data = await request.json()

  const newProfessional = {
    id: Date.now().toString(),
    ...data,
    points: data.points || 0,
    verified: data.verified || false,
    featured: data.featured || false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  professionals.push(newProfessional)
  return NextResponse.json(newProfessional, { status: 201 })
}
