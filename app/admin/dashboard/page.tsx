"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, UserCheck, Store, Clock, TrendingUp, Calendar, Award, Activity } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface DashboardStats {
  totalProfessionals: number
  activeUsers: number
  totalStores: number
  pendingApprovals: number
  monthlyGrowth: number
  totalEvents: number
  completedEvents: number
  totalPoints: number
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState<DashboardStats>({
    totalProfessionals: 120,
    activeUsers: 2350,
    totalStores: 85,
    pendingApprovals: 8,
    monthlyGrowth: 12.5,
    totalEvents: 24,
    completedEvents: 18,
    totalPoints: 15420,
  })

  const [recentActivities] = useState([
    {
      id: 1,
      action: "Novo profissional cadastrado",
      user: "João Silva",
      time: "2 minutos atrás",
      type: "success",
    },
    {
      id: 2,
      action: "Loja aprovada",
      user: "Loja Central",
      time: "15 minutos atrás",
      type: "info",
    },
    {
      id: 3,
      action: "Evento criado",
      user: "Ana Costa",
      time: "1 hora atrás",
      type: "warning",
    },
    {
      id: 4,
      action: "Usuário verificado",
      user: "Pedro Santos",
      time: "2 horas atrás",
      type: "success",
    },
    {
      id: 5,
      action: "Produto adicionado",
      user: "Marcos Pereira",
      time: "3 horas atrás",
      type: "info",
    },
  ])

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Bom dia"
    if (hour < 18) return "Boa tarde"
    return "Boa noite"
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "success":
        return "🟢"
      case "warning":
        return "🟡"
      case "info":
        return "🔵"
      default:
        return "⚪"
    }
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header com saudação */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            {getGreeting()}, {user?.email?.split("@")[0]}!
          </h1>
          <p className="text-slate-400 mt-1">Aqui está um resumo das atividades do seu sistema hoje.</p>
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

      {/* Cards de estatísticas principais */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Total de Profissionais</CardTitle>
            <Users className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.totalProfessionals}</div>
            <p className="text-xs text-green-400 flex items-center mt-1">
              <TrendingUp className="w-3 h-3 mr-1" />
              +5 no último mês
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Usuários Ativos</CardTitle>
            <UserCheck className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.activeUsers.toLocaleString()}</div>
            <p className="text-xs text-green-400 flex items-center mt-1">
              <TrendingUp className="w-3 h-3 mr-1" />+{stats.monthlyGrowth}% no último mês
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Lojas Cadastradas</CardTitle>
            <Store className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.totalStores}</div>
            <p className="text-xs text-green-400 flex items-center mt-1">
              <TrendingUp className="w-3 h-3 mr-1" />
              +12 no último mês
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Pendentes de Aprovação</CardTitle>
            <Clock className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.pendingApprovals}</div>
            <p className="text-xs text-red-400 flex items-center mt-1">
              <Clock className="w-3 h-3 mr-1" />
              Requer atenção
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Cards secundários */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
              <span className="text-white font-semibold">{stats.totalEvents}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Concluídos</span>
              <span className="text-green-400 font-semibold">{stats.completedEvents}</span>
            </div>
            <Progress value={(stats.completedEvents / stats.totalEvents) * 100} className="h-2" />
            <p className="text-xs text-slate-400">
              {Math.round((stats.completedEvents / stats.totalEvents) * 100)}% de conclusão
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Award className="w-5 h-5 mr-2 text-yellow-400" />
              Sistema de Pontos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">{stats.totalPoints.toLocaleString()}</div>
              <p className="text-slate-400 text-sm">Total de pontos distribuídos</p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-lg font-semibold text-yellow-400">156</div>
                <p className="text-xs text-slate-400">Este mês</p>
              </div>
              <div>
                <div className="text-lg font-semibold text-green-400">89</div>
                <p className="text-xs text-slate-400">Esta semana</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Atividades Recentes</CardTitle>
            <CardDescription className="text-slate-400">Últimas ações realizadas no sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-48 overflow-y-auto custom-scrollbar">
              {recentActivities.map((activity) => (
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
      </div>

      {/* Gráfico de visão geral melhorado */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Crescimento Mensal</CardTitle>
            <CardDescription className="text-slate-400">Novos usuários nos últimos 6 meses</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[200px] flex items-end justify-center space-x-2">
              {[
                { month: "Jan", value: 45, height: "h-16" },
                { month: "Fev", value: 52, height: "h-20" },
                { month: "Mar", value: 78, height: "h-32" },
                { month: "Abr", value: 65, height: "h-24" },
                { month: "Mai", value: 89, height: "h-40" },
                { month: "Jun", value: 95, height: "h-44" },
              ].map((data, index) => (
                <div key={index} className="flex flex-col items-center space-y-2">
                  <div className="text-xs text-slate-400">{data.value}</div>
                  <div
                    className={`bg-gradient-to-t from-connection-accent to-connection-secondary w-8 ${data.height} rounded-t transition-all hover:opacity-80`}
                  ></div>
                  <div className="text-xs text-slate-400">{data.month}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Distribuição por Tipo</CardTitle>
            <CardDescription className="text-slate-400">Usuários por categoria</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                  <span className="text-slate-300">Profissionais</span>
                </div>
                <span className="text-white font-semibold">45%</span>
              </div>
              <Progress value={45} className="h-2" />

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span className="text-slate-300">Amantes de Decoração</span>
                </div>
                <span className="text-white font-semibold">35%</span>
              </div>
              <Progress value={35} className="h-2" />

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                  <span className="text-slate-300">Fornecedores</span>
                </div>
                <span className="text-white font-semibold">20%</span>
              </div>
              <Progress value={20} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
