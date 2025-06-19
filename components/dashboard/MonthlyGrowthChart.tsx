// components/dashboard/MonthlyGrowthChart.tsx
"use client"

import { MonthlyGrowth } from "@/app/admin/dashboard/types/dashboard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface MonthlyGrowthChartProps {
  data: MonthlyGrowth[]
}

export function MonthlyGrowthChart({ data }: MonthlyGrowthChartProps) {
  const maxValue = Math.max(...data.map(d => d.value))
  
  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white">Crescimento Mensal</CardTitle>
        <CardDescription className="text-slate-400">
          Novos usuários nos últimos 6 meses
        </CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <div className="h-[200px] flex items-end justify-center space-x-2">
          {data.map((item, index) => {
            const heightPercentage = (item.value / maxValue) * 100
            const heightClass = `h-${Math.max(16, Math.round(heightPercentage * 0.4))}`
            
            return (
              <div key={index} className="flex flex-col items-center space-y-2">
                <div className="text-xs text-slate-400">{item.value}</div>
                <div
                  className={`bg-gradient-to-t from-connection-accent to-connection-secondary w-8 ${heightClass} rounded-t transition-all hover:opacity-80`}
                  style={{ height: `${heightPercentage}%` }}
                ></div>
                <div className="text-xs text-slate-400">{item.month}</div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}