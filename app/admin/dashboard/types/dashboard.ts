// types/dashboard.ts
export interface DashboardStats {
    totalProfessionals: number
    activeUsers: number
    totalStores: number
    pendingApprovals: number
    monthlyGrowth: number
    totalEvents: number
    completedEvents: number
    totalPoints: number
  }
  
  export interface RecentActivity {
    id: number
    action: string
    user: string
    time: string
    type: 'success' | 'warning' | 'info' | 'error'
  }
  
  export interface MonthlyGrowth {
    month: string
    value: number
  }
  
  export interface UserDistribution {
    category: string
    percentage: number
    color: string
  }
  
  export interface PointsBreakdown {
    totalPoints: number
    monthlyPoints: number
    weeklyPoints: number
  }