 // components/dashboard/PointsCard.tsx
"use client"

import { PointsBreakdown } from "@/app/admin/dashboard/types/dashboard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Award } from "lucide-react"

interface PointsCardProps {
  points: PointsBreakdown
}

export function PointsCard({ points }: PointsCardProps) {
  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Award className="w-5 h-5 mr-2 text-yellow-400" />
          Sistema de Pontos
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-center">
          <div className="text-3xl font-bold text-white">
            {points.totalPoints.toLocaleString()}
          </div>
          <p className="text-slate-400 text-sm">Total de pontos distribuídos</p>
        </div>
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold text-yellow-400">
              {points.monthlyPoints}
            </div>
            <p className="text-xs text-slate-400">Este mês</p>
          </div>
          <div>
            <div className="text-lg font-semibold text-green-400">
              {points.weeklyPoints}
            </div>
            <p className="text-xs text-slate-400">Esta semana</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}