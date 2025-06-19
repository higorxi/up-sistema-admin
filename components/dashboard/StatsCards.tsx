// components/dashboard/StatsCards.tsx
"use client"

import { DashboardStats } from "@/app/admin/dashboard/types/dashboard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, UserCheck, Store, Clock, TrendingUp } from "lucide-react"

interface StatsCardsProps {
  stats: DashboardStats
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: "Total de Profissionais",
      value: stats.totalProfessionals,
      icon: Users,
      iconColor: "text-blue-400",
      trend: "+5 no último mês",
      trendColor: "text-green-400"
    },
    {
      title: "Usuários Ativos",
      value: stats.activeUsers.toLocaleString(),
      icon: UserCheck,
      iconColor: "text-green-400",
      trend: `+${stats.monthlyGrowth}% no último mês`,
      trendColor: "text-green-400"
    },
    {
      title: "Lojas Cadastradas",
      value: stats.totalStores,
      icon: Store,
      iconColor: "text-purple-400",
      trend: "+12 no último mês",
      trendColor: "text-green-400"
    },
    {
      title: "Pendentes de Aprovação",
      value: stats.pendingApprovals,
      icon: Clock,
      iconColor: "text-yellow-400",
      trend: "Requer atenção",
      trendColor: "text-red-400"
    }
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => (
        <Card 
          key={index}
          className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 hover:shadow-lg transition-shadow"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">
              {card.title}
            </CardTitle>
            <card.icon className={`h-4 w-4 ${card.iconColor}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{card.value}</div>
            <p className={`text-xs ${card.trendColor} flex items-center mt-1`}>
              <TrendingUp className="w-3 h-3 mr-1" />
              {card.trend}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
