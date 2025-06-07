"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import type { ModuleAction } from "@/lib/module-config"
import { Loader2 } from "lucide-react"
import { DynamicForm } from "./dynamic-form"

interface ModuleActionsProps {
  actions: ModuleAction[]
  selectedItems: string[]
  onActionComplete: () => void
}

export function ModuleActions({ actions, selectedItems, onActionComplete }: ModuleActionsProps) {
  const [currentAction, setCurrentAction] = useState<ModuleAction | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [formOpen, setFormOpen] = useState(false)
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleActionClick = (action: ModuleAction) => {
    setCurrentAction(action)

    if (action.requiresSelection && selectedItems.length === 0) {
      toast({
        title: "Seleção necessária",
        description: "Selecione pelo menos um item para realizar esta ação",
        variant: "destructive",
      })
      return
    }

    if (action.requiresConfirmation) {
      setConfirmOpen(true)
    } else if (action.requiresForm) {
      setFormOpen(true)
    } else {
      executeAction(action)
    }
  }

  const executeAction = async (action: ModuleAction, data?: Record<string, any>) => {
    setLoading(true)

    try {
      // Substituir {id} no endpoint pelo ID selecionado
      const endpoint = selectedItems.length === 1 ? action.endpoint.replace("{id}", selectedItems[0]) : action.endpoint

      const response = await fetch(endpoint, {
        method: action.method,
        headers: {
          "Content-Type": "application/json",
        },
        body:
          action.method !== "GET"
            ? JSON.stringify({
                ...data,
                ids: selectedItems.length > 1 ? selectedItems : undefined,
              })
            : undefined,
      })

      if (response.ok) {
        toast({
          title: "Sucesso",
          description: action.successMessage || "Ação executada com sucesso",
        })
        onActionComplete()
      } else {
        const errorData = await response.json()
        throw new Error(errorData.message || "Erro ao executar ação")
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: action.errorMessage || "Erro ao executar ação",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
      setConfirmOpen(false)
      setFormOpen(false)
      setCurrentAction(null)
    }
  }

  const handleFormSubmit = (data: Record<string, any>) => {
    if (currentAction) {
      executeAction(currentAction, data)
    }
  }

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {actions.map((action) => (
          <Button
            key={action.name}
            id={`action-${action.name.replace(/\s+/g, "-").toLowerCase()}`}
            variant="outline"
            size="sm"
            onClick={() => handleActionClick(action)}
            className="border-connection-light/20 text-connection-light hover:bg-connection-secondary hover:text-white"
            disabled={action.requiresSelection && selectedItems.length === 0}
          >
            {action.name}
          </Button>
        ))}
      </div>

      {/* Diálogo de confirmação */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="bg-connection-dark border-connection-primary/50">
          <DialogHeader>
            <DialogTitle className="text-white">Confirmar ação</DialogTitle>
          </DialogHeader>
          <p className="text-connection-light/70">
            {currentAction?.confirmationMessage || "Tem certeza que deseja executar esta ação?"}
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmOpen(false)}
              className="border-connection-light/20 text-connection-light hover:bg-connection-secondary hover:text-white"
            >
              Cancelar
            </Button>
            <Button
              onClick={() => currentAction && executeAction(currentAction)}
              className="bg-connection-accent hover:bg-connection-accent/80"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processando...
                </>
              ) : (
                "Confirmar"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo de formulário */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="bg-connection-dark border-connection-primary/50">
          <DialogHeader>
            <DialogTitle className="text-white">{currentAction?.name}</DialogTitle>
          </DialogHeader>
          {currentAction?.formFields && (
            <DynamicForm
              fields={currentAction.formFields}
              onSubmit={handleFormSubmit}
              onCancel={() => setFormOpen(false)}
              loading={loading}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
