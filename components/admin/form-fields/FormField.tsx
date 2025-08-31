// form-fields/FormField.tsx
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import type { FieldConfig } from "@/lib/crud-config";
import { RelationField } from './RelationField';
import { DateField } from './DateField';
import { ObjectField } from './ObjectField';
import { SelectField } from './SelectField';

interface FormFieldProps {
  field: FieldConfig;
  value: any;
  originalValue?: any;
  hasInitialData: boolean;
  error?: string;
  relationData?: any[];
  relationLoading?: boolean;
  relationSearch?: string;
  onChange: (fieldKey: string, value: any) => void;
  onBlur: (field: FieldConfig) => void;
  onRelationSearch: (field: FieldConfig, searchTerm: string) => void;
  setRelationSearch: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  areValuesDifferent: (original: any, current: any) => boolean;
}

export function FormField({
  field,
  value,
  originalValue,
  hasInitialData,
  error,
  relationData = [],
  relationLoading = false,
  relationSearch = "",
  onChange,
  onBlur,
  onRelationSearch,
  setRelationSearch,
  areValuesDifferent
}: FormFieldProps) {
  const isChanged = hasInitialData && areValuesDifferent(originalValue, value);

  const renderLabel = () => (
    <Label htmlFor={field.key} className="text-connection-light">
      {field.label}
      {field.required && <span className="text-red-400 ml-1">*</span>}
      {isChanged && <span className="text-connection-accent ml-1">•</span>}
    </Label>
  );

  const renderError = () => {
    if (!error) return null;
    return <p className="text-red-400 text-sm">{error}</p>;
  };

  const renderDescription = () => {
    if (!field.description) return null;
    return (
      <p className="text-connection-light/50 text-xs">
        {field.description}
      </p>
    );
  };

  switch (field.type) {
    case "textarea":
      return (
        <div className="space-y-2">
          {renderLabel()}
          <Textarea
            id={field.key}
            value={value}
            onChange={(e) => onChange(field.key, e.target.value)}
            onBlur={() => onBlur(field)}
            className={cn(
              "bg-connection-primary/30 border-connection-primary/50 text-white",
              isChanged && "border-connection-accent/50"
            )}
            placeholder={field.placeholder}
            rows={4}
          />
          {renderError()}
          {renderDescription()}
        </div>
      );

    case "boolean":
      return (
        <div className="flex items-center justify-between">
          <div>
            {renderLabel()}
            {renderDescription()}
          </div>
          <Switch
            id={field.key}
            checked={value}
            onCheckedChange={(checked) => onChange(field.key, checked)}
          />
        </div>
      );

    case "select":
      return (
        <SelectField
          field={field}
          value={value}
          isChanged={isChanged}
          error={error}
          onChange={onChange}
          renderLabel={renderLabel}
          renderError={renderError}
          renderDescription={renderDescription}
        />
      );

    case "date":
      return (
        <DateField
          field={field}
          value={value}
          isChanged={isChanged}
          error={error}
          onChange={onChange}
          renderLabel={renderLabel}
          renderError={renderError}
          renderDescription={renderDescription}
        />
      );

    case "relation":
      return (
        <RelationField
          field={field}
          value={value}
          isChanged={isChanged}
          error={error}
          relationData={relationData}
          relationLoading={relationLoading}
          relationSearch={relationSearch}
          onChange={onChange}
          onRelationSearch={onRelationSearch}
          setRelationSearch={setRelationSearch}
          renderLabel={renderLabel}
          renderError={renderError}
          renderDescription={renderDescription}
        />
      );

    case "object":
      return (
        <ObjectField
          field={field}
          value={value}
          isChanged={isChanged}
          onChange={onChange}
          renderLabel={renderLabel}
        />
      );

    default:
      return (
        <div className="space-y-2">
          {renderLabel()}
          <Input
            id={field.key}
            type={
              field.type === "phone" ||
              field.type === "cpf" ||
              field.type === "cnpj" ||
              field.type === "cep"
                ? "text"
                : field.type
            }
            value={value}
            onChange={(e) => onChange(field.key, e.target.value)}
            onBlur={() => onBlur(field)}
            className={cn(
              "bg-connection-primary/30 border-connection-primary/50 text-white",
              isChanged && "border-connection-accent/50"
            )}
            placeholder={field.placeholder}
            required={field.required}
          />
          {renderError()}
          {renderDescription()}
        </div>
      );
  }
}