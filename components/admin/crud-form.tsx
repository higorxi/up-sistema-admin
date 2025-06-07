"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CalendarIcon, Loader2, Search, X } from "lucide-react"
import { cn } from "@/lib/utils"
import type { CrudConfig, FieldConfig } from "@/lib/crud-config"
import { useToast } from "@/hooks/use-toast"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface CrudFormProps {
  config: CrudConfig
  initialData?: any
  onSuccess: () => void
  onCancel: () => void
}

export function CrudForm({ config, initialData, onSuccess, onCancel }: CrudFormProps) {
  const [formData, setFormData] = useState<any>({})
  const [loading, setLoading] = useState(false)
  const [relationData, setRelationData] = useState<Record<string, any[]>>({})
  const [relationLoading, setRelationLoading] = useState<Record<string, boolean>>({})
  const [relationSearch, setRelationSearch] = useState<Record<string, string>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [activeTab, setActiveTab] = useState("general")
  const { toast } = useToast()

  // Agrupar campos em abas para formulários grandes
  const fieldGroups = config.fields.reduce((groups: Record<string, FieldConfig[]>, field) => {
    const group = (field as any).group || "general"
    if (!groups[group]) {
      groups[group] = []
    }
    groups[group].push(field)
    return groups
  }, {})

  if (!fieldGroups.general) {
    fieldGroups.general = []
  }

  const tabNames: Record<string, string> = {
    general: "Geral",
    address: "Endereço",
    contact: "Contato",
    social: "Redes Sociais",
    details: "Detalhes",
    settings: "Configurações",
  }

  useEffect(() => {
    if (initialData) {
      setFormData(initialData)
    } else {
      const defaultData: any = {}
      config.fields.forEach((field) => {
        if (field.type === "boolean") {
          defaultData[field.key] = field.defaultValue !== undefined ? field.defaultValue : false
        } else if (field.defaultValue !== undefined) {
          defaultData[field.key] = field.defaultValue
        } else {
          defaultData[field.key] = ""
        }
      })
      setFormData(defaultData)
    }
  }, [initialData, config.fields])

  useEffect(() => {
    const loadRelationData = async () => {
      const relationFields = config.fields.filter((field) => field.type === "relation")

      for (const field of relationFields) {
        if (field.relationConfig?.endpoint) {
          try {
            setRelationLoading((prev) => ({ ...prev, [field.key]: true }))
            const response = await fetch(field.relationConfig.endpoint, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
              },
            })
            if (response.ok) {
              const data = await response.json()
              setRelationData((prev) => ({
                ...prev,
                [field.key]: data,
              }))
            }
          } catch (error) {
            console.error(`Erro ao carregar dados de relação para ${field.key}:`, error)
          } finally {
            setRelationLoading((prev) => ({ ...prev, [field.key]: false }))
          }
        }
      }
    }

    loadRelationData()
  }, [config.fields])

  const validateField = (field: FieldConfig, value: any): string => {
    if (field.required && (value === undefined || value === null || value === "")) {
      return `${field.label} é obrigatório`
    }

    if (field.validation) {
      if (field.validation.pattern && value) {
        const regex = new RegExp(field.validation.pattern)
        if (!regex.test(value)) {
          return field.validation.message || `${field.label} está em formato inválido`
        }
      }

      if (field.type === "number" || field.type === "currency") {
        const numValue = Number(value)
        if (field.validation.min !== undefined && numValue < field.validation.min) {
          return `${field.label} deve ser maior ou igual a ${field.validation.min}`
        }
        if (field.validation.max !== undefined && numValue > field.validation.max) {
          return `${field.label} deve ser menor ou igual a ${field.validation.max}`
        }
      }

      if ((field.type === "text" || field.type === "textarea") && typeof value === "string") {
        if (field.validation.minLength !== undefined && value.length < field.validation.minLength) {
          return `${field.label} deve ter pelo menos ${field.validation.minLength} caracteres`
        }
        if (field.validation.maxLength !== undefined && value.length > field.validation.maxLength) {
          return `${field.label} deve ter no máximo ${field.validation.maxLength} caracteres`
        }
      }
    }

    return ""
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}
    let isValid = true

    config.fields.forEach((field) => {
      const error = validateField(field, formData[field.key])
      if (error) {
        newErrors[field.key] = error
        isValid = false
      }
    })

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast({
        title: "Erro de validação",
        description: "Por favor, corrija os erros no formulário",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const url = initialData ? `${config.endpoint}/${initialData.id}` : config.endpoint
      const method = initialData ? "PATCH" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        onSuccess()
      } else {
        const errorData = await response.json()
        throw new Error(errorData.message || "Erro ao salvar")
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao salvar item",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleBlur = (field: FieldConfig) => {
    setTouched((prev) => ({ ...prev, [field.key]: true }))
    const error = validateField(field, formData[field.key])
    setErrors((prev) => ({ ...prev, [field.key]: error }))
  }

  const handleRelationSearch = async (field: FieldConfig, searchTerm: string) => {
    if (!field.relationConfig?.endpoint || !field.relationConfig.searchFields) return

    setRelationSearch((prev) => ({ ...prev, [field.key]: searchTerm }))

    if (searchTerm.length < 2) return

    try {
      setRelationLoading((prev) => ({ ...prev, [field.key]: true }))

      const queryParams = new URLSearchParams()
      queryParams.append("search", searchTerm)

      field.relationConfig.searchFields.forEach((searchField) => {
        queryParams.append("searchFields", searchField)
      })

      const url = `${field.relationConfig.endpoint}?${queryParams.toString()}`
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        const data = await response.json()
        setRelationData((prev) => ({
          ...prev,
          [field.key]: data,
        }))
      }
    } catch (error) {
      console.error(`Erro ao buscar dados de relação para ${field.key}:`, error)
    } finally {
      setRelationLoading((prev) => ({ ...prev, [field.key]: false }))
    }
  }

  const renderField = (field: FieldConfig) => {
    const value = formData[field.key] || ""
    const fieldError = touched[field.key] && errors[field.key]

    switch (field.type) {
      case "textarea":
        return (
          <div className="space-y-2">
            <Label htmlFor={field.key} className="text-connection-light">
              {field.label}
              {field.required && <span className="text-red-400 ml-1">*</span>}
            </Label>
            <Textarea
              id={field.key}
              value={value}
              onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
              onBlur={() => handleBlur(field)}
              className="bg-connection-primary/30 border-connection-primary/50 text-white"
              placeholder={field.placeholder}
              rows={4}
            />
            {fieldError && <p className="text-red-400 text-sm">{fieldError}</p>}
            {field.description && <p className="text-connection-light/50 text-xs">{field.description}</p>}
          </div>
        )

      case "boolean":
        return (
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor={field.key} className="text-connection-light">
                {field.label}
                {field.required && <span className="text-red-400 ml-1">*</span>}
              </Label>
              {field.description && <p className="text-connection-light/50 text-xs">{field.description}</p>}
            </div>
            <Switch
              id={field.key}
              checked={value}
              onCheckedChange={(checked) => setFormData({ ...formData, [field.key]: checked })}
            />
          </div>
        )

      case "select":
        return (
          <div className="space-y-2">
            <Label htmlFor={field.key} className="text-connection-light">
              {field.label}
              {field.required && <span className="text-red-400 ml-1">*</span>}
            </Label>
            <Select
              value={value.toString()}
              onValueChange={(newValue) => setFormData({ ...formData, [field.key]: newValue })}
            >
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
            {fieldError && <p className="text-red-400 text-sm">{fieldError}</p>}
            {field.description && <p className="text-connection-light/50 text-xs">{field.description}</p>}
          </div>
        )

      case "date":
        return (
          <div className="space-y-2">
            <Label htmlFor={field.key} className="text-connection-light">
              {field.label}
              {field.required && <span className="text-red-400 ml-1">*</span>}
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal bg-connection-primary/30 border-connection-primary/50 text-white",
                    !value && "text-connection-light/50",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {value ? format(new Date(value), "PPP", { locale: ptBR }) : field.placeholder || "Selecione uma data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-connection-dark border-connection-primary/50">
                <Calendar
                  mode="single"
                  selected={value ? new Date(value) : undefined}
                  onSelect={(date) => setFormData({ ...formData, [field.key]: date?.toISOString() })}
                  initialFocus
                  locale={ptBR}
                />
              </PopoverContent>
            </Popover>
            {fieldError && <p className="text-red-400 text-sm">{fieldError}</p>}
            {field.description && <p className="text-connection-light/50 text-xs">{field.description}</p>}
          </div>
        )

      case "relation":
        const relationOptions = relationData[field.key] || []
        const isLoading = relationLoading[field.key]
        const searchTerm = relationSearch[field.key] || ""

        return (
          <div className="space-y-2">
            <Label htmlFor={field.key} className="text-connection-light">
              {field.label}
              {field.required && <span className="text-red-400 ml-1">*</span>}
            </Label>
            <div className="relative">
              <Input
                type="text"
                value={searchTerm}
                onChange={(e) => handleRelationSearch(field, e.target.value)}
                className="bg-connection-primary/30 border-connection-primary/50 text-white pr-8"
                placeholder={`Buscar ${field.label.toLowerCase()}...`}
              />
              {isLoading ? (
                <Loader2 className="absolute right-2 top-2.5 h-4 w-4 animate-spin text-connection-light/50" />
              ) : searchTerm ? (
                <X
                  className="absolute right-2 top-2.5 h-4 w-4 cursor-pointer text-connection-light/50"
                  onClick={() => {
                    setRelationSearch((prev) => ({ ...prev, [field.key]: "" }))
                  }}
                />
              ) : (
                <Search className="absolute right-2 top-2.5 h-4 w-4 text-connection-light/50" />
              )}
            </div>
            <div className="max-h-40 overflow-y-auto bg-connection-primary/30 border border-connection-primary/50 rounded-md">
              {relationOptions.length === 0 ? (
                <div className="p-2 text-center text-connection-light/50">
                  {isLoading ? "Carregando..." : "Nenhum resultado encontrado"}
                </div>
              ) : (
                relationOptions.map((option) => (
                  <div
                    key={option[field.relationConfig?.valueField || "id"]}
                    className={cn(
                      "p-2 cursor-pointer hover:bg-connection-secondary/50",
                      value === option[field.relationConfig?.valueField || "id"] &&
                        "bg-connection-accent/50 text-white",
                    )}
                    onClick={() =>
                      setFormData({
                        ...formData,
                        [field.key]: option[field.relationConfig?.valueField || "id"],
                      })
                    }
                  >
                    {option[field.relationConfig?.displayField || "name"]}
                  </div>
                ))
              )}
            </div>
            {fieldError && <p className="text-red-400 text-sm">{fieldError}</p>}
            {field.description && <p className="text-connection-light/50 text-xs">{field.description}</p>}
          </div>
        )

      case "object":
        if (!field.fields) return null
        return (
          <div className="space-y-4 border border-connection-primary/50 p-4 rounded-md">
            <h3 className="text-connection-light font-medium">{field.label}</h3>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              {field.fields.map((subField) => (
                <div key={subField.key} className="space-y-2">
                  <Label htmlFor={`${field.key}.${subField.key}`} className="text-connection-light">
                    {subField.label}
                    {subField.required && <span className="text-red-400 ml-1">*</span>}
                  </Label>
                  <Input
                    id={`${field.key}.${subField.key}`}
                    type={subField.type === "phone" ? "text" : subField.type}
                    value={formData[field.key]?.[subField.key] || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        [field.key]: {
                          ...formData[field.key],
                          [subField.key]: e.target.value,
                        },
                      })
                    }
                    className="bg-connection-primary/30 border-connection-primary/50 text-white"
                    placeholder={subField.placeholder}
                  />
                </div>
              ))}
            </div>
          </div>
        )

      default:
        return (
          <div className="space-y-2">
            <Label htmlFor={field.key} className="text-connection-light">
              {field.label}
              {field.required && <span className="text-red-400 ml-1">*</span>}
            </Label>
            <Input
              id={field.key}
              type={
                field.type === "phone" || field.type === "cpf" || field.type === "cnpj" || field.type === "cep"
                  ? "text"
                  : field.type
              }
              value={value}
              onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
              onBlur={() => handleBlur(field)}
              className="bg-connection-primary/30 border-connection-primary/50 text-white"
              placeholder={field.placeholder}
              required={field.required}
            />
            {fieldError && <p className="text-red-400 text-sm">{fieldError}</p>}
            {field.description && <p className="text-connection-light/50 text-xs">{field.description}</p>}
          </div>
        )
    }
  }

  // Verificar se precisamos de abas (mais de um grupo ou muitos campos)
  const needsTabs = Object.keys(fieldGroups).length > 1 || config.fields.length > 6

  return (
    <form onSubmit={handleSubmit}>
      <ScrollArea className="max-h-[60vh] overflow-y-auto pr-4">
        <div className="p-1">
          {needsTabs ? (
            <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="bg-connection-primary/30 mb-4">
                {Object.keys(fieldGroups).map((group) => (
                  <TabsTrigger
                    key={group}
                    value={group}
                    className="data-[state=active]:bg-connection-accent data-[state=active]:text-white"
                  >
                    {tabNames[group] || group}
                  </TabsTrigger>
                ))}
              </TabsList>
              {Object.entries(fieldGroups).map(([group, fields]) => (
                <TabsContent key={group} value={group} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {fields.map((field) => (
                      <div
                        key={field.key}
                        className={cn(
                          field.width === "full" ? "col-span-1 md:col-span-2" : "",
                          field.width === "half" ? "col-span-1" : "",
                          field.width === "third" ? "col-span-1 md:col-span-1" : "",
                        )}
                      >
                        {renderField(field)}
                      </div>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {config.fields.map((field) => (
                <div
                  key={field.key}
                  className={cn(
                    field.width === "full" ? "col-span-1 md:col-span-2" : "",
                    field.width === "half" ? "col-span-1" : "",
                    field.width === "third" ? "col-span-1 md:col-span-1" : "",
                  )}
                >
                  {renderField(field)}
                </div>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="flex justify-end space-x-2 pt-4 mt-4 border-t border-connection-primary/50">
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
              Salvando...
            </>
          ) : (
            "Salvar"
          )}
        </Button>
      </div>
    </form>
  )
}
