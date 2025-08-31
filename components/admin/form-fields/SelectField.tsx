import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { FieldConfig } from "@/lib/crud-config";

interface SelectFieldProps {
  field: FieldConfig;
  value: any;
  isChanged: boolean;
  error?: string;
  onChange: (fieldKey: string, value: any) => void;
  renderLabel: () => React.ReactNode;
  renderError: () => React.ReactNode;
  renderDescription: () => React.ReactNode;
}

export function SelectField({
  field,
  value,
  isChanged,
  error,
  onChange,
  renderLabel,
  renderError,
  renderDescription
}: SelectFieldProps) {
  return (
    <div className="space-y-2">
      {renderLabel()}
      <Select
        value={value.toString()}
        onValueChange={(newValue) => onChange(field.key, newValue)}
      >
        <SelectTrigger className={cn(
          "bg-connection-primary/30 border-connection-primary/50 text-white",
          isChanged && "border-connection-accent/50"
        )}>
          <SelectValue placeholder={field.placeholder || "Selecione..."} />
        </SelectTrigger>
        <SelectContent className="bg-connection-dark border-connection-primary/50">
          {field.options?.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className="text-white hover:bg-connection-secondary/50 focus:bg-connection-secondary/50"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {renderError()}
      {renderDescription()}
    </div>
  );
}

