// pages/dashboard/index.tsx - Main Dashboard Page
"use client"

import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import { EventsCard } from "@/components/dashboard/EventsCards"
import { MonthlyGrowthChart } from "@/components/dashboard/MonthlyGrowthChart"
import { PointsCard } from "@/components/dashboard/PointsCard"
import { RecentActivities } from "@/components/dashboard/RecentActivites"
import { StatsCards } from "@/components/dashboard/StatsCards"
import { UserDistributionChart } from "@/components/dashboard/UserDistributionChart"
import { useDashboardData } from "@/hooks/useDashboardData"

export default function DashboardPage() {
  const {
    stats,
    activities,
    monthlyGrowth,
    userDistribution,
    pointsBreakdown,
    loading,
    error
  } = useDashboardData()

  if (loading) {
    return (
      <div className="flex-1 space-y-6 p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-700 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-slate-700 rounded w-1/2"></div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-slate-700 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex-1 space-y-6 p-6">
        <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
          <h2 className="text-red-400 font-semibold">Erro ao carregar dashboard</h2>
          <p className="text-red-300 text-sm mt-1">{error}</p>
        </div>
      </div>
    )
  }

  if (!stats || !pointsBreakdown) {
    return null
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <DashboardHeader />
      
      <StatsCards stats={stats} />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <EventsCard 
          totalEvents={stats.totalEvents} 
          completedEvents={stats.completedEvents} 
        />
        <PointsCard points={pointsBreakdown} />
        <RecentActivities activities={activities} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <MonthlyGrowthChart data={monthlyGrowth} />
        <UserDistributionChart data={userDistribution} />
      </div>
    </div>
  )
}