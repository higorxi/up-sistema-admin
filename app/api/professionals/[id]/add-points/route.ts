import { type NextRequest, NextResponse } from "next/server"

const professionals = [
  {
    id: "1",
    name: "João Silva",
    points: 1500,
  },
]

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const data = await request.json()
  const index = professionals.findIndex((p) => p.id === params.id)

  if (index === -1) {
    return NextResponse.json({ error: "Profissional não encontrado" }, { status: 404 })
  }

  professionals[index].points += data.points

  return NextResponse.json({
    message: "Pontos adicionados com sucesso",
    newPoints: professionals[index].points,
  })
}
