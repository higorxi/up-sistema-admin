"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"

interface FormField {
  key: string
  label: string
  type: string
  required?: boolean
  placeholder?: string
  options?: { value: string; label: string }[]
}

interface DynamicFormProps {
  fields: FormField[]
  onSubmit: (data: Record<string, any>) => void
  onCancel: () => void
  loading?: boolean
}

export function DynamicForm({ fields, onSubmit, onCancel, loading = false }: DynamicFormProps) {
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validação básica
    const newErrors: Record<string, string> = {}
    let isValid = true

    fields.forEach((field) => {
      if (field.required && !formData[field.key]) {
        newErrors[field.key] = `${field.label} é obrigatório`
        isValid = false
      }
    })

    setErrors(newErrors)

    if (isValid) {
      onSubmit(formData)
    }
  }

  const handleChange = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }))

    // Limpar erro quando o campo é preenchido
    if (errors[key] && value) {
      setErrors((prev) => ({ ...prev, [key]: "" }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {fields.map((field) => (
        <div key={field.key} className="space-y-2">
          <Label htmlFor={field.key} className="text-connection-light">
            {field.label}
            {field.required && <span className="text-red-400 ml-1">*</span>}
          </Label>

          {field.type === "textarea" ? (
            <Textarea
              id={field.key}
              value={formData[field.key] || ""}
              onChange={(e) => handleChange(field.key, e.target.value)}
              className="bg-connection-primary/30 border-connection-primary/50 text-white"
              placeholder={field.placeholder}
            />
          ) : field.type === "select" ? (
            <Select value={formData[field.key] || ""} onValueChange={(value) => handleChange(field.key, value)}>
              <SelectTrigger className="bg-connection-primary/30 border-connection-primary/50 text-white">
                <SelectValue placeholder={field.placeholder || "Selecione..."} />
              </SelectTrigger>
              <SelectContent className="bg-connection-dark border-connection-primary/50">
                {field.options?.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="text-white">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Input
              id={field.key}
              type={field.type}
              value={formData[field.key] || ""}
              onChange={(e) => handleChange(field.key, e.target.value)}
              className="bg-connection-primary/30 border-connection-primary/50 text-white"
              placeholder={field.placeholder}
            />
          )}

          {errors[field.key] && <p className="text-red-400 text-sm">{errors[field.key]}</p>}
        </div>
      ))}

      <div className="flex justify-end space-x-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="border-connection-light/20 text-connection-light hover:bg-connection-secondary hover:text-white"
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={loading} className="bg-connection-accent hover:bg-connection-accent/80">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processando...
            </>
          ) : (
            "Confirmar"
          )}
        </Button>
      </div>
    </form>
  )
}
