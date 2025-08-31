"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { cn, flattenFormData } from "@/lib/utils";
import type { CrudConfig, FieldConfig } from "@/lib/crud-config";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FormField } from "./form-fields/FormField";
import { useFormValidation } from "@/hooks/useFormValidation";
import { transformFormDataWithStructure } from "@/utils/formDataTransform";
import { useRelationData } from "@/hooks/useRelationData";


interface CrudFormProps {
  config: CrudConfig;
  initialData?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

export function CrudForm({
  config,
  initialData,
  onSuccess,
  onCancel,
}: CrudFormProps) {
  const [formData, setFormData] = useState<any>({});
  const [originalData, setOriginalData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState("general");
  const { toast } = useToast();

  // Custom hooks
  const { errors, validateForm, validateField } = useFormValidation(config);
  const { relationData, relationLoading, relationSearch, setRelationSearch, handleRelationSearch } = useRelationData(config);

  // Função para verificar se dois valores são diferentes
  const areValuesDifferent = (original: any, current: any): boolean => {
    const normalizeValue = (val: any) => {
      if (val === null || val === undefined || val === '') return '';
      if (typeof val === 'object' && val instanceof Date) return val.toISOString();
      return val;
    };

    return normalizeValue(original) !== normalizeValue(current);
  };

  // Função para obter apenas os campos alterados com estrutura personalizada
  const getChangedFields = (): any => {
    if (!initialData) {
      // Se não há dados iniciais, é uma criação - enviar todos os campos preenchidos
      const cleanData = { ...formData };
      Object.keys(cleanData).forEach(key => {
        if (cleanData[key] === '' || cleanData[key] === null || cleanData[key] === undefined) {
          delete cleanData[key];
        }
      });
      return transformFormDataWithStructure(cleanData, config.submitStructure);
    }

    // Para edição, comparar com dados originais
    const changedFields: any = {};
    
    config.fields.forEach((field) => {
      const currentValue = formData[field.key];
      const originalValue = originalData[field.key];
      
      if (areValuesDifferent(originalValue, currentValue)) {
        changedFields[field.key] = currentValue;
      }
    });

    return transformFormDataWithStructure(changedFields, config.submitStructure);
  };

  // Agrupar campos em abas
  const fieldGroups = config.fields.reduce(
    (groups: Record<string, FieldConfig[]>, field) => {
      const group = (field as any).group || "general";
      if (!groups[group]) {
        groups[group] = [];
      }
      groups[group].push(field);
      return groups;
    },
    {}
  );

  if (!fieldGroups.general) {
    fieldGroups.general = [];
  }

  const tabNames: Record<string, string> = {
    general: "Geral",
    address: "Endereço",
    contact: "Contato",
    social: "Redes Sociais",
    details: "Detalhes",
    settings: "Configurações",
    ...config.customTabNames
  };

  useEffect(() => {
    if (initialData) {
      const flattenedData = { ...initialData }
      setFormData(flattenedData);
      setOriginalData(flattenedData);
    } else {
      const defaultData: any = {};
      config.fields.forEach((field) => {
        if (field.type === "boolean") {
          defaultData[field.key] =
            field.defaultValue !== undefined ? field.defaultValue : false;
        } else if (field.defaultValue !== undefined) {
          defaultData[field.key] = field.defaultValue;
        } else {
          defaultData[field.key] = "";
        }
      });
      setFormData(defaultData);
      setOriginalData({});
    }
  }, [initialData, config.fields]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm(formData, touched, setTouched)) {
      toast({
        title: "Erro de validação",
        description: "Por favor, corrija os erros no formulário",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const url = initialData
        ? `${config.endpoint}/${initialData.id}`
        : config.endpoint;
      const method = initialData ? "PATCH" : "POST";

      const changedData = getChangedFields();

      if (initialData && Object.keys(changedData).length === 0) {
        toast({
          title: "Nenhuma alteração",
          description: "Não há campos alterados para salvar",
          variant: "default",
        });
        setLoading(false);
        return;
      }

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(changedData),
      });

      if (response.ok) {
        toast({
          title: "Sucesso",
          description: initialData 
            ? `Campos atualizados com sucesso`
            : "Item criado com sucesso",
          variant: "default",
        });
        onSuccess();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao salvar");
      }
    } catch (error) {
      toast({
        title: "Erro",
        description:
          error instanceof Error ? error.message : "Erro ao salvar item",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBlur = (field: FieldConfig) => {
    setTouched((prev) => ({ ...prev, [field.key]: true }));
    validateField(field, formData[field.key]);
  };

  const handleFieldChange = (fieldKey: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [fieldKey]: value }));
  };

  // Verificar se há campos alterados
  const hasChanges = initialData ? Object.keys(getChangedFields()).length > 0 : true;
  
  // Verificar se precisamos de abas
  const needsTabs = Object.keys(fieldGroups).length > 1 || config.fields.length > 6;

  return (
    <form onSubmit={handleSubmit}>
      <ScrollArea className="max-h-[60vh] overflow-y-auto pr-4">
        <div className="p-1">
          {needsTabs ? (
            <Tabs
              defaultValue="general"
              value={activeTab}
              onValueChange={setActiveTab}
            >
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
                  <FormFields 
                    fields={fields}
                    formData={formData}
                    originalData={originalData}
                    initialData={initialData}
                    errors={errors}
                    touched={touched}
                    relationData={relationData}
                    relationLoading={relationLoading}
                    relationSearch={relationSearch}
                    onFieldChange={handleFieldChange}
                    onFieldBlur={handleBlur}
                    onRelationSearch={handleRelationSearch}
                    setRelationSearch={setRelationSearch}
                    areValuesDifferent={areValuesDifferent}
                  />
                </TabsContent>
              ))}
            </Tabs>
          ) : (
            <FormFields 
              fields={config.fields}
              formData={formData}
              originalData={originalData}
              initialData={initialData}
              errors={errors}
              touched={touched}
              relationData={relationData}
              relationLoading={relationLoading}
              relationSearch={relationSearch}
              onFieldChange={handleFieldChange}
              onFieldBlur={handleBlur}
              onRelationSearch={handleRelationSearch}
              setRelationSearch={setRelationSearch}
              areValuesDifferent={areValuesDifferent}
            />
          )}
        </div>
      </ScrollArea>

      <div className="flex justify-between items-center pt-4 mt-4 border-t border-connection-primary/50">
        {initialData && (
          <div className="text-sm text-connection-light/50">
            {hasChanges ? (
              <span className="text-connection-accent">
                • Campos alterados
              </span>
            ) : (
              "Nenhuma alteração"
            )}
          </div>
        )}
        <div className="flex space-x-2 ml-auto">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="border-connection-light/20 text-connection-light hover:bg-connection-secondary hover:text-white"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={loading || (initialData && !hasChanges)}
            className="bg-connection-accent hover:bg-connection-accent/80 disabled:opacity-50"
          >
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
      </div>
    </form>
  );
}

// Componente para renderizar os campos
interface FormFieldsProps {
  fields: FieldConfig[];
  formData: any;
  originalData: any;
  initialData?: any;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  relationData: Record<string, any[]>;
  relationLoading: Record<string, boolean>;
  relationSearch: Record<string, string>;
  onFieldChange: (fieldKey: string, value: any) => void;
  onFieldBlur: (field: FieldConfig) => void;
  onRelationSearch: (field: FieldConfig, searchTerm: string) => void;
  setRelationSearch: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  areValuesDifferent: (original: any, current: any) => boolean;
}

function FormFields({
  fields,
  formData,
  originalData,
  initialData,
  errors,
  touched,
  relationData,
  relationLoading,
  relationSearch,
  onFieldChange,
  onFieldBlur,
  onRelationSearch,
  setRelationSearch,
  areValuesDifferent
}: FormFieldsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {fields.map((field) => (
        <div
          key={field.key}
          className={cn(
            field.width === "full" ? "col-span-1 md:col-span-2" : "",
            field.width === "half" ? "col-span-1" : "",
            field.width === "third" ? "col-span-1 md:col-span-1" : ""
          )}
        >
          <FormField
            field={field}
            value={formData[field.key] || ""}
            originalValue={originalData[field.key]}
            hasInitialData={!!initialData}
            error={touched[field.key] && errors[field.key]}
            relationData={relationData[field.key] || []}
            relationLoading={relationLoading[field.key] || false}
            relationSearch={relationSearch[field.key] || ""}
            onChange={onFieldChange}
            onBlur={onFieldBlur}
            onRelationSearch={onRelationSearch}
            setRelationSearch={setRelationSearch}
            areValuesDifferent={areValuesDifferent}
          />
        </div>
      ))}
    </div>
  );
}