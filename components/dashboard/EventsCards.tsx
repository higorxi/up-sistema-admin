// components/dashboard/EventsCard.tsx
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Calendar } from "lucide-react"

interface EventsCardProps {
  totalEvents: number
  completedEvents: number
}

export function EventsCard({ totalEvents, completedEvents }: EventsCardProps) {
  const completionPercentage = Math.round((completedEvents / totalEvents) * 100)

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Calendar className="w-5 h-5 mr-2 text-blue-400" />
          Eventos
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-slate-300">Total de Eventos</span>
          <span className="text-white font-semibold">{totalEvents}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-300">Concluídos</span>
          <span className="text-green-400 font-semibold">{completedEvents}</span>
        </div>
        <Progress value={completionPercentage} className="h-2" />
        <p className="text-xs text-slate-400">
          {completionPercentage}% de conclusão
        </p>
      </CardContent>
    </Card>
  )
}