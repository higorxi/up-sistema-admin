"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface User {
  id: string
  email: string
  profileImage?: string
  partnerSupplier?: any
  professional?: any
  loveDecoration?: any
  address?: any
}

interface AuthContextType {
  user: User | null
  token: string | null
  role: string | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [role, setRole] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()

  const isAuthenticated = !!user && !!token

  useEffect(() => {
    // Verificar se há token armazenado ao carregar a aplicação
    const initializeAuth = () => {
      try {
        const storedToken = localStorage.getItem("token")
        const storedUser = localStorage.getItem("user")
        const storedRole = localStorage.getItem("role")

        if (storedToken && storedUser && storedRole) {
          setToken(storedToken)
          setUser(JSON.parse(storedUser))
          setRole(storedRole)
        }
      } catch (error) {
        console.error("Erro ao carregar dados de autenticação:", error)
        // Limpar dados corrompidos
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        localStorage.removeItem("role")
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [])

  // Redirecionar baseado no estado de autenticação
  useEffect(() => {
    if (!isLoading) {
      const isLoginPage = pathname === "/login"
      const isAdminRoute = pathname.startsWith("/admin")

      if (!isAuthenticated && isAdminRoute) {
        router.push("/login")
      } else if (isAuthenticated && isLoginPage) {
        router.push("/admin/dashboard")
      }
    }
  }, [isAuthenticated, isLoading, pathname, router])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true)
      const response = await fetch("http://localhost:3002/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      if (response.ok) {
        const data = await response.json()

        // Armazenar dados no localStorage
        localStorage.setItem("token", data.access_token)
        localStorage.setItem("user", JSON.stringify(data.user))
        localStorage.setItem("role", data.role)

        // Atualizar estado
        setToken(data.access_token)
        setUser(data.user)
        setRole(data.role)

        toast({
          title: "Login realizado com sucesso",
          description: `Bem-vindo, ${data.user.email}!`,
        })

        return true
      } else {
        const errorData = await response.json()
        toast({
          title: "Erro no login",
          description: errorData.message || "Credenciais inválidas",
          variant: "destructive",
        })
        return false
      }
    } catch (error) {
      toast({
        title: "Erro de conexão",
        description: "Não foi possível conectar ao servidor",
        variant: "destructive",
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    // Limpar localStorage
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    localStorage.removeItem("role")

    // Limpar estado
    setToken(null)
    setUser(null)
    setRole(null)

    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso",
    })

    router.push("/login")
  }

  return (
    <AuthContext.Provider value={{ user, token, role, login, logout, isLoading, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
