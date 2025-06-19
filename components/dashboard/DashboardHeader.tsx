// components/dashboard/DashboardHeader.tsx
"use client"

import { Badge } from "@/components/ui/badge"
import { Activity } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export function DashboardHeader() {
  const { user } = useAuth()

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Bom dia"
    if (hour < 18) return "Boa tarde"
    return "Boa noite"
  }

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">
          {getGreeting()}, {user?.email?.split("@")[0]}!
        </h1>
        <p className="text-slate-400 mt-1">
          Aqui está um resumo das atividades do seu sistema hoje.
        </p>
      </div>
      <div className="flex items-center space-x-2">
        <Badge
          variant="outline"
          className="bg-connection-accent/20 text-connection-light border-connection-accent/50"
        >
          <Activity className="w-3 h-3 mr-1" />
          Sistema Online
        </Badge>
      </div>
    </div>
  )
}
