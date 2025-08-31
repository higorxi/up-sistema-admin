import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { FieldConfig } from "@/lib/crud-config";

interface ObjectFieldProps {
  field: FieldConfig;
  value: any;
  isChanged: boolean;
  onChange: (fieldKey: string, value: any) => void;
  renderLabel: () => React.ReactNode;
}

export function ObjectField({
  field,
  value,
  isChanged,
  onChange,
  renderLabel
}: ObjectFieldProps) {
  if (!field.fields) return null;

  return (
    <div className="space-y-4 border border-connection-primary/50 p-4 rounded-md">
      <h3 className="text-connection-light font-medium">
        {field.label}
        {isChanged && <span className="text-connection-accent ml-1">•</span>}
      </h3>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        {field.fields.map((subField) => (
          <div key={subField.key} className="space-y-2">
            <Label
              htmlFor={`${field.key}.${subField.key}`}
              className="text-connection-light"
            >
              {subField.label}
              {subField.required && (
                <span className="text-red-400 ml-1">*</span>
              )}
            </Label>
            <Input
              id={`${field.key}.${subField.key}`}
              type={subField.type === "phone" ? "text" : subField.type}
              value={value?.[subField.key] || ""}
              onChange={(e) =>
                onChange(field.key, {
                  ...value,
                  [subField.key]: e.target.value,
                })
              }
              className="bg-connection-primary/30 border-connection-primary/50 text-white"
              placeholder={subField.placeholder}
            />
          </div>
        ))}
      </div>
    </div>
  );
}