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

export async function GET() {
  return NextResponse.json(partnerSuppliers)
}

export async function POST(request: NextRequest) {
  const data = await request.json()
  const newSupplier = {
    id: Date.now().toString(),
    ...data,
  }
  partnerSuppliers.push(newSupplier)
  return NextResponse.json(newSupplier, { status: 201 })
}
