"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = React.useState(false)

  // Evitar problemas de hidratação renderizando o conteúdo apenas após a montagem no cliente
  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Renderizar um placeholder durante a renderização do servidor ou antes da montagem no cliente
  if (!mounted) {
    return <>{children}</>
  }

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
