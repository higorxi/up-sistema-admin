import { NextResponse } from "next/server"

// Mock data para profissões
const professions = [
  { id: "1", name: "Arquiteto", description: "Profissional de arquitetura" },
  { id: "2", name: "Designer de Interiores", description: "Especialista em design de interiores" },
  { id: "3", name: "Engenheiro Civil", description: "Engenheiro especializado em construção civil" },
  { id: "4", name: "Decorador", description: "Profissional de decoração" },
]

export async function GET() {
  return NextResponse.json(professions)
}
