"use client"

import { useState, useEffect } from 'react'
import { DashboardStats, MonthlyGrowth, PointsBreakdown, RecentActivity, UserDistribution } from '@/app/admin/dashboard/types/dashboard'
import { API_BASE_URL } from '@/utils/api'

export function useDashboardData() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [activities, setActivities] = useState<RecentActivity[]>([])
  const [monthlyGrowth, setMonthlyGrowth] = useState<MonthlyGrowth[]>([])
  const [userDistribution, setUserDistribution] = useState<UserDistribution[]>([])
  const [pointsBreakdown, setPointsBreakdown] = useState<PointsBreakdown | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)

        const endpoints = [
          'statistics/stats',
          'statistics/activities',
          'statistics/monthly-growth',
          'statistics/user-distribution',
          'statistics/points'
        ]

        const responses = await Promise.all(
          endpoints.map(endpoint => fetch(`${API_BASE_URL}/${endpoint}`))
        )

        responses.forEach((res, index) => {
          if (!res.ok) throw new Error(`Failed to fetch ${endpoints[index]}`)
        })

        const [
          statsData,
          activitiesData,
          growthData,
          distributionData,
          pointsData
        ] = await Promise.all(responses.map(res => res.json()))

        setStats(statsData)
        setActivities(activitiesData)
        setMonthlyGrowth(growthData)
        setUserDistribution(distributionData)
        setPointsBreakdown(pointsData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  return {
    stats,
    activities,
    monthlyGrowth,
    userDistribution,
    pointsBreakdown,
    loading,
    error,
    refetch: () => {
      // refetch could call fetchDashboardData again
    }
  }
}
