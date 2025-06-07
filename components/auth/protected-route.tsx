"use client"

import type React from "react"
import { useAuth } from "@/contexts/auth-context"
import { Loader2 } from "lucide-react"

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-connection-primary">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-white mx-auto mb-4" />
          <p className="text-connection-light">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // O redirecionamento é feito no AuthProvider
  }

  return <>{children}</>
}
