// form-fields/RelationField.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { 
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Loader2, Search, X, ChevronDown, Check } from 'lucide-react';
import { cn } from "@/lib/utils";
import type { FieldConfig } from "@/lib/crud-config";

interface RelationFieldProps {
  field: FieldConfig;
  value: any;
  isChanged: boolean;
  error?: string;
  relationData: any[];
  relationLoading: boolean;
  relationSearch: string;
  onChange: (fieldKey: string, value: any) => void;
  onRelationSearch: (field: FieldConfig, searchTerm: string) => void;
  setRelationSearch: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  renderLabel: () => React.ReactNode;
  renderError: () => React.ReactNode;
  renderDescription: () => React.ReactNode;
}

export function RelationField({
  field,
  value,
  isChanged,
  error,
  relationData,
  relationLoading,
  relationSearch,
  onChange,
  onRelationSearch,
  setRelationSearch,
  renderLabel,
  renderError,
  renderDescription
}: RelationFieldProps) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  
  const valueField = field.relationConfig?.valueField || "id";
  const displayField = field.relationConfig?.displayField || "name";
  
  // Encontrar o item selecionado
  const selectedItem = relationData.find(
    item => item[valueField]?.toString() === value?.toString()
  );

  // Filtrar opções baseado na busca local
  const filteredOptions = relationData.filter(item => {
    if (!searchValue) return true;
    const searchTerm = searchValue.toLowerCase();
    return item[displayField]?.toLowerCase().includes(searchTerm) ||
           item[valueField]?.toString().toLowerCase().includes(searchTerm);
  });

  const handleSearchChange = (search: string) => {
    setSearchValue(search);
    // Se há configuração de busca remota, usar ela
    if (field.relationConfig?.searchFields?.length) {
      onRelationSearch(field, search);
    }
  };

  const handleSelect = (selectedValue: string) => {
    onChange(field.key, selectedValue);
    setOpen(false);
    setSearchValue("");
  };

  const handleClear = () => {
    onChange(field.key, "");
    setSearchValue("");
    setRelationSearch(prev => ({ ...prev, [field.key]: "" }));
  };

  // Se há poucas opções, usar Select simples. Se há muitas, usar Combobox com busca
  const useSimpleSelect = relationData.length <= 10 && !field.relationConfig?.searchFields?.length;

  if (useSimpleSelect) {
    return (
      <div className="space-y-2">
        {renderLabel()}
        <Select
          value={value?.toString() || ""}
          onValueChange={(newValue) => onChange(field.key, newValue)}
        >
          <SelectTrigger className={cn(
            "bg-connection-primary/30 border-connection-primary/50 text-white",
            isChanged && "border-connection-accent/50"
          )}>
            <SelectValue placeholder={field.placeholder || "Selecione..."} />
          </SelectTrigger>
          <SelectContent className="bg-connection-dark border-connection-primary/50 max-h-60">
            <SelectItem value="" className="text-connection-light/50">
              {field.placeholder || "Selecione..."}
            </SelectItem>
            {relationData.map((item) => (
              <SelectItem
                key={item[valueField]}
                value={item[valueField]?.toString()}
                className="text-white hover:bg-connection-secondary/50 focus:bg-connection-secondary/50"
              >
                {item[displayField]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {renderError()}
        {renderDescription()}
      </div>
    );
  }

  // Combobox para muitas opções ou com busca
  return (
    <div className="space-y-2">
      {renderLabel()}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full justify-between bg-connection-primary/30 border-connection-primary/50 text-white hover:bg-connection-primary/50",
              isChanged && "border-connection-accent/50",
              !value && "text-connection-light/50"
            )}
          >
            {selectedItem ? selectedItem[displayField] : (field.placeholder || "Selecione...")}
            <div className="flex items-center gap-2">
              {value && (
                <X
                  className="h-4 w-4 opacity-50 hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClear();
                  }}
                />
              )}
              <ChevronDown className="h-4 w-4 opacity-50" />
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0 bg-connection-dark border-connection-primary/50" align="start">
          <Command className="bg-connection-dark">
            <div className="relative">
              <CommandInput
                placeholder={`Buscar ${field.label.toLowerCase()}...`}
                value={searchValue}
                onValueChange={handleSearchChange}
                className="bg-connection-primary/30 border-connection-primary/50 text-white placeholder:text-connection-light/50"
              />
              {relationLoading && (
                <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin text-connection-light/50" />
              )}
            </div>
            <CommandEmpty className="py-6 text-center text-sm text-connection-light/50">
              {relationLoading ? "Carregando..." : "Nenhum resultado encontrado."}
            </CommandEmpty>
            <CommandGroup className="max-h-60 overflow-auto">
              {filteredOptions.map((item) => (
                <CommandItem
                  key={item[valueField]}
                  value={item[valueField]?.toString()}
                  onSelect={() => handleSelect(item[valueField]?.toString())}
                  className="text-white hover:bg-connection-secondary/50 cursor-pointer"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value?.toString() === item[valueField]?.toString()
                        ? "opacity-100 text-connection-accent"
                        : "opacity-0"
                    )}
                  />
                  {item[displayField]}
                  {item.subtitle && (
                    <span className="ml-2 text-xs text-connection-light/50">
                      {item.subtitle}
                    </span>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      {renderError()}
      {renderDescription()}
    </div>
  );
}