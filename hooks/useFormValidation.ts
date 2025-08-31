// hooks/useFormValidation.ts
import { useState } from 'react';
import type { CrudConfig, FieldConfig } from "@/lib/crud-config";

export function useFormValidation(config: CrudConfig) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = (field: FieldConfig, value: any): string => {
    if (
      field.required &&
      (value === undefined || value === null || value === "")
    ) {
      const error = `${field.label} é obrigatório`;
      setErrors(prev => ({ ...prev, [field.key]: error }));
      return error;
    }

    if (field.validation) {
      if (field.validation.pattern && value) {
        const regex = new RegExp(field.validation.pattern);
        if (!regex.test(value)) {
          const error = field.validation.message || `${field.label} está em formato inválido`;
          setErrors(prev => ({ ...prev, [field.key]: error }));
          return error;
        }
      }

      if (field.type === "number" || field.type === "currency") {
        const numValue = Number(value);
        if (
          field.validation.min !== undefined &&
          numValue < field.validation.min
        ) {
          const error = `${field.label} deve ser maior ou igual a ${field.validation.min}`;
          setErrors(prev => ({ ...prev, [field.key]: error }));
          return error;
        }
        if (
          field.validation.max !== undefined &&
          numValue > field.validation.max
        ) {
          const error = `${field.label} deve ser menor ou igual a ${field.validation.max}`;
          setErrors(prev => ({ ...prev, [field.key]: error }));
          return error;
        }
      }

      if (
        (field.type === "text" || field.type === "textarea") &&
        typeof value === "string"
      ) {
        if (
          field.validation.minLength !== undefined &&
          value.length < field.validation.minLength
        ) {
          const error = `${field.label} deve ter pelo menos ${field.validation.minLength} caracteres`;
          setErrors(prev => ({ ...prev, [field.key]: error }));
          return error;
        }
        if (
          field.validation.maxLength !== undefined &&
          value.length > field.validation.maxLength
        ) {
          const error = `${field.label} deve ter no máximo ${field.validation.maxLength} caracteres`;
          setErrors(prev => ({ ...prev, [field.key]: error }));
          return error;
        }
      }
    }

    // Remove error if validation passes
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field.key];
      return newErrors;
    });
    return "";
  };

  const validateForm = (
    formData: any, 
    touched: Record<string, boolean>,
    setTouched: React.Dispatch<React.SetStateAction<Record<string, boolean>>>
  ): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    config.fields.forEach((field) => {
      setTouched(prev => ({ ...prev, [field.key]: true }));
      const error = validateField(field, formData[field.key]);
      if (error) {
        newErrors[field.key] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  return {
    errors,
    validateField,
    validateForm,
    setErrors
  };
}
