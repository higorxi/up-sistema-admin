import React from 'react';
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FieldConfig } from "@/lib/crud-config";

interface DateFieldProps {
  field: FieldConfig;
  value: any;
  isChanged: boolean;
  error?: string;
  onChange: (fieldKey: string, value: any) => void;
  renderLabel: () => React.ReactNode;
  renderError: () => React.ReactNode;
  renderDescription: () => React.ReactNode;
}

export function DateField({
  field,
  value,
  isChanged,
  error,
  onChange,
  renderLabel,
  renderError,
  renderDescription
}: DateFieldProps) {
  return (
    <div className="space-y-2">
      {renderLabel()}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal bg-connection-primary/30 border-connection-primary/50 text-white",
              !value && "text-connection-light/50",
              isChanged && "border-connection-accent/50"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value
              ? format(new Date(value), "PPP", { locale: ptBR })
              : field.placeholder || "Selecione uma data"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-connection-dark border-connection-primary/50">
          <Calendar
            mode="single"
            selected={value ? new Date(value) : undefined}
            onSelect={(date) =>
              onChange(field.key, date?.toISOString())
            }
            initialFocus
            locale={ptBR}
          />
        </PopoverContent>
      </Popover>
      {renderError()}
      {renderDescription()}
    </div>
  );
}