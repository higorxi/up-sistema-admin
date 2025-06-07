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
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    state: "RJ",
    city: "Rio de Janeiro",
    district: "Copacabana",
    street: "Av. Atlântica",
    number: "456",
    complement: null,
    zipCode: "22070-011",
    createdAt: "2024-01-16T14:20:00Z",
    updatedAt: "2024-01-16T14:20:00Z",
  },
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const search = searchParams.get("search")
  const state = searchParams.get("state")
  const city = searchParams.get("city")

  let filteredAddresses = addresses

  if (search) {
    filteredAddresses = filteredAddresses.filter(
      (addr) =>
        addr.street.toLowerCase().includes(search.toLowerCase()) ||
        addr.city.toLowerCase().includes(search.toLowerCase()) ||
        addr.state.toLowerCase().includes(search.toLowerCase()) ||
        addr.district.toLowerCase().includes(search.toLowerCase()),
    )
  }

  if (state) {
    filteredAddresses = filteredAddresses.filter((addr) => addr.state === state)
  }

  if (city) {
    filteredAddresses = filteredAddresses.filter((addr) => addr.city === city)
  }

  return NextResponse.json(filteredAddresses)
}

export async function POST(request: NextRequest) {
  const data = await request.json()

  const newAddress = {
    id: Date.now().toString(),
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  addresses.push(newAddress)
  return NextResponse.json(newAddress, { status: 201 })
}
