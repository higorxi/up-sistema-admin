import { type NextRequest, NextResponse } from "next/server"

const professionals = [
  {
    id: "1",
    name: "João Silva",
    verified: false,
  },
]

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const index = professionals.findIndex((p) => p.id === params.id)

  if (index === -1) {
    return NextResponse.json({ error: "Profissional não encontrado" }, { status: 404 })
  }

  professionals[index].verified = true

  return NextResponse.json({
    message: "Profissional verificado com sucesso",
    professional: professionals[index],
  })
}
