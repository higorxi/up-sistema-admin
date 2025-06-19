// components/dashboard/UserDistributionChart.tsx
"use client"

import { UserDistribution } from "@/app/admin/dashboard/types/dashboard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface UserDistributionChartProps {
  data: UserDistribution[]
}

export function UserDistributionChart({ data }: UserDistributionChartProps) {
  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white">Distribuição por Tipo</CardTitle>
        <CardDescription className="text-slate-400">
          Usuários por categoria
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((item, index) => (
            <div key={index}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 ${item.color} rounded-full`}></div>
                  <span className="text-slate-300">{item.category}</span>
                </div>
                <span className="text-white font-semibold">{item.percentage}%</span>
              </div>
              <Progress value={item.percentage} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
