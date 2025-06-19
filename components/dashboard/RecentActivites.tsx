// components/dashboard/RecentActivities.tsx
"use client"

import { RecentActivity } from "@/app/admin/dashboard/types/dashboard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface RecentActivitiesProps {
  activities: RecentActivity[]
}

export function RecentActivities({ activities }: RecentActivitiesProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "success":
        return "🟢"
      case "warning":
        return "🟡"
      case "info":
        return "🔵"
      case "error":
        return "🔴"
      default:
        return "⚪"
    }
  }

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white">Atividades Recentes</CardTitle>
        <CardDescription className="text-slate-400">
          Últimas ações realizadas no sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-48 overflow-y-auto custom-scrollbar">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start space-x-3 p-2 rounded-lg hover:bg-slate-700/50 transition-colors"
            >
              <span className="text-lg">{getActivityIcon(activity.type)}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-300 font-medium">{activity.action}</p>
                <p className="text-xs text-slate-400">{activity.user}</p>
                <p className="text-xs text-slate-500">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}