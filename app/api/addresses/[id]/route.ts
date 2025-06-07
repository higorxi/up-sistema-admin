import { type NextRequest, NextResponse } from "next/server"

const addresses = [
  {
    id: "1",
    state: "SP",
    city: "São Paulo",
    district: "Centro",
    street: "Rua das Flores",
    number: "123",
    complement: "Sala 45",
    zipCode: "01234-567",
  },
]

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const address = addresses.find((a) => a.id === params.id)

  if (!address) {
    return NextResponse.json({ error: "Endereço não encontrado" }, { status: 404 })
  }

  return NextResponse.json(address)
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const data = await request.json()
  const index = addresses.findIndex((a) => a.id === params.id)

  if (index === -1) {
    return NextResponse.json({ error: "Endereço não encontrado" }, { status: 404 })
  }

  addresses[index] = { ...addresses[index], ...data }
  return NextResponse.json(addresses[index])
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const index = addresses.findIndex((a) => a.id === params.id)

  if (index === -1) {
    return NextResponse.json({ error: "Endereço não encontrado" }, { status: 404 })
  }

  addresses.splice(index, 1)
  return NextResponse.json({ success: true })
}
