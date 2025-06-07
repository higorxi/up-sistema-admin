import { type NextRequest, NextResponse } from "next/server"

// Mock data - substitua pela sua implementação com banco de dados
const partnerSuppliers = [
  {
    id: "1",
    tradeName: "Padaria Victor Bom",
    companyName: "Padaria Victor Bom LTDA",
    document: "52.352.368/0001-92",
    stateRegistration: "123456789",
    contact: "www.padariavictorbom.com.br",
    accessPending: false,
  },
]

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const data = await request.json()
  const index = partnerSuppliers.findIndex((s) => s.id === params.id)

  if (index === -1) {
    return NextResponse.json({ error: "Fornecedor não encontrado" }, { status: 404 })
  }

  partnerSuppliers[index] = { ...partnerSuppliers[index], ...data }
  return NextResponse.json(partnerSuppliers[index])
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const index = partnerSuppliers.findIndex((s) => s.id === params.id)

  if (index === -1) {
    return NextResponse.json({ error: "Fornecedor não encontrado" }, { status: 404 })
  }

  partnerSuppliers.splice(index, 1)
  return NextResponse.json({ success: true })
}
