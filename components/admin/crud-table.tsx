"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Filter,
  X,
  Download,
  Loader2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import type { CrudConfig, FilterOption } from "@/lib/crud-config";
import { CrudForm } from "./crud-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { ModuleActions } from "./module-actions";
import { moduleConfigs } from "@/lib/module-config";
import {
  ImageIcon,
  PlusIcon,
  CheckCircleIcon,
  CheckIcon,
  UsersIcon,
  BellIcon,
} from "lucide-react";

interface CrudTableProps {
  config: CrudConfig;
}

export function CrudTable({ config }: CrudTableProps) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [viewingItem, setViewingItem] = useState<any>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    field: string;
    direction: "asc" | "desc";
  } | null>(config.defaultSort || null);
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [relationData, setRelationData] = useState<Record<string, any[]>>({});
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const { toast } = useToast();

  // Encontrar o módulo atual para ações específicas
  const currentModule = Object.values(moduleConfigs).find(
    (module) => module.crudConfig.endpoint === config.endpoint
  );
  const moduleActions = currentModule?.actions || [];

  const fetchData = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();

      if (sortConfig) {
        queryParams.append("sort", sortConfig.field);
        queryParams.append("order", sortConfig.direction);
      }

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          queryParams.append(key, String(value));
        }
      });

      const url = `${config.endpoint}${
        queryParams.toString() ? `?${queryParams.toString()}` : ""
      }`;
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Adicionar token JWT se necessário
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const result = await response.json();
        setData(result);
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      toast({
        title: "Erro",
        description: "Erro ao carregar dados",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchRelationData = async () => {
    if (!config.filterOptions) return;

    const relationFilters = config.filterOptions.filter(
      (filter) => filter.type === "relation"
    );

    for (const filter of relationFilters) {
      if (filter.relationConfig) {
        try {
          const response = await fetch(filter.relationConfig.endpoint, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          });
          if (response.ok) {
            const data = await response.json();
            setRelationData((prev) => ({
              ...prev,
              [filter.key]: data,
            }));
          }
        } catch (error) {
          console.error(
            `Erro ao carregar dados de relação para ${filter.key}:`,
            error
          );
        }
      }
    }
  };

  useEffect(() => {
    fetchData();
    if (config.filterOptions) {
      fetchRelationData();
    }
  }, [config.endpoint, sortConfig, filters]);

  const handleSort = (field: string) => {
    setSortConfig((current) => {
      if (current?.field === field) {
        return {
          field,
          direction: current.direction === "asc" ? "desc" : "asc",
        };
      }
      return { field, direction: "asc" };
    });
  };

  const handleDelete = async (id: string) => {
    setItemToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      const response = await fetch(`${config.endpoint}/${itemToDelete}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        toast({
          title: "Sucesso",
          description: "Item excluído com sucesso",
        });
        fetchData();
      } else {
        throw new Error("Erro ao excluir");
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao excluir item",
        variant: "destructive",
      });
    } finally {
      setDeleteConfirmOpen(false);
      setItemToDelete(null);
    }
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setEditingItem(null);
    fetchData();
    toast({
      title: "Sucesso",
      description: editingItem
        ? "Item atualizado com sucesso"
        : "Item criado com sucesso",
    });
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedItems([]);
    } else {
      setSelectedItems(data.map((item) => item.id));
    }
    setIsAllSelected(!isAllSelected);
  };

  const handleSelectItem = (id: string, singleSelect = false) => {
    setSelectedItems((prev) => {
      if (singleSelect) {
        return [id];
      }

      if (prev.includes(id)) {
        return prev.filter((itemId) => itemId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleBatchDelete = async () => {
    if (selectedItems.length === 0) return;

    try {
      for (const id of selectedItems) {
        await fetch(`${config.endpoint}/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        });
      }

      toast({
        title: "Sucesso",
        description: `${selectedItems.length} itens excluídos com sucesso`,
      });
      fetchData();
      setSelectedItems([]);
      setIsAllSelected(false);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao excluir itens",
        variant: "destructive",
      });
    }
  };

  const exportData = () => {
    const csvContent = [
      config.tableColumns.map((col) => col.label).join(","),
      ...filteredData.map((item) =>
        config.tableColumns
          .map((col) => {
            const value = item[col.key];
            if (value === null || value === undefined) return "";
            if (typeof value === "string")
              return `"${value.replace(/"/g, '""')}"`;
            return value;
          })
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `${config.name.toLowerCase().replace(/\s+/g, "-")}-${
        new Date().toISOString().split("T")[0]
      }.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredData = useMemo(() => {
    return data.filter((item) =>
      config.searchFields.some((field) =>
        item[field]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [data, searchTerm, config.searchFields]);

  const renderFilterValue = (filter: FilterOption) => {
    const value = filters[filter.key];

    if (value === undefined || value === null || value === "") {
      return null;
    }

    switch (filter.type) {
      case "boolean":
        return value ? "Sim" : "Não";
      case "select":
        const option = filter.options?.find((opt) => opt.value === value);
        return option?.label || value;
      case "relation":
        if (relationData[filter.key]) {
          const relatedItem = relationData[filter.key].find(
            (item) => item[filter.relationConfig?.valueField || "id"] === value
          );
          return relatedItem
            ? relatedItem[filter.relationConfig?.displayField || "name"]
            : value;
        }
        return value;
      case "date":
        return format(new Date(value), "dd/MM/yyyy");
      default:
        return value;
    }
  };

  const renderFilters = () => {
    if (!config.filterOptions) return null;
  
    return (
      <Popover open={filterMenuOpen} onOpenChange={setFilterMenuOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="border-connection-light/20 text-connection-light hover:bg-connection-secondary hover:text-white"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 bg-connection-dark border-connection-primary/50">
          <div className="space-y-4">
            <h4 className="font-medium text-connection-light">Filtrar por</h4>
            {config.filterOptions.map((filter) => (
              <div key={filter.key} className="space-y-2">
                <label className="text-sm text-connection-light/70">
                  {filter.label}
                </label>
  
                {filter.type === "select" && (
                  <Select
                    value={filters[filter.key] || "default"}
                    onValueChange={(value) =>
                      handleFilterChange(filter.key, value)
                    }
                  >
                    <SelectTrigger className="bg-connection-primary/30 border-connection-primary/50 text-connection-light">
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent className="bg-connection-dark border-connection-primary/50">
                      <SelectItem value="default">Todos</SelectItem>
                      {filter.options?.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
  
                {filter.type === "boolean" && (
                  <Select
                    value={filters[filter.key]?.toString() || "default"}
                    onValueChange={(value) => {
                      if (value === "default") {
                        handleFilterChange(filter.key, undefined);
                      } else {
                        handleFilterChange(filter.key, value === "true");
                      }
                    }}
                  >
                    <SelectTrigger className="bg-connection-primary/30 border-connection-primary/50 text-connection-light">
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent className="bg-connection-dark border-connection-primary/50">
                      <SelectItem value="default">Todos</SelectItem>
                      <SelectItem value="true">Sim</SelectItem>
                      <SelectItem value="false">Não</SelectItem>
                    </SelectContent>
                  </Select>
                )}
  
                {filter.type === "relation" && (
                  <Select
                    value={filters[filter.key] || "default"}
                    onValueChange={(value) =>
                      handleFilterChange(filter.key, value)
                    }
                  >
                    <SelectTrigger className="bg-connection-primary/30 border-connection-primary/50 text-connection-light">
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent className="bg-connection-dark border-connection-primary/50">
                      <SelectItem value="default">Todos</SelectItem>
                      {relationData[filter.key]?.map((item) => (
                        <SelectItem
                          key={
                            item[filter.relationConfig?.valueField || "id"]
                          }
                          value={
                            item[filter.relationConfig?.valueField || "id"]
                          }
                        >
                          {item[filter.relationConfig?.displayField || "name"]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
  
                {filter.type === "date" && (
                  <div className="grid gap-2">
                    <Calendar
                      mode="single"
                      selected={
                        filters[filter.key]
                          ? new Date(filters[filter.key])
                          : undefined
                      }
                      onSelect={(date) =>
                        handleFilterChange(filter.key, date?.toISOString())
                      }
                      className="bg-connection-dark border-connection-primary/50"
                      locale={ptBR}
                    />
                  </div>
                )}
  
                {filter.type === "text" && (
                  <Input
                    value={filters[filter.key] || ""}
                    onChange={(e) =>
                      handleFilterChange(filter.key, e.target.value)
                    }
                    className="bg-connection-primary/30 border-connection-primary/50 text-connection-light"
                  />
                )}
              </div>
            ))}
  
            <div className="flex justify-between pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="border-connection-light/20 text-connection-light hover:bg-connection-secondary hover:text-white"
              >
                Limpar
              </Button>
              <Button
                size="sm"
                onClick={() => setFilterMenuOpen(false)}
                className="bg-connection-accent hover:bg-connection-accent/80"
              >
                Aplicar
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    );
  };
  

  const renderFilterBadges = () => {
    if (!config.filterOptions) return null;

    const activeFilters = Object.keys(filters).filter(
      (key) =>
        filters[key] !== undefined &&
        filters[key] !== null &&
        filters[key] !== ""
    );

    if (activeFilters.length === 0) return null;

    return (
      <div className="flex flex-wrap gap-2 mt-2">
        {activeFilters.map((key) => {
          const filterConfig = config.filterOptions?.find((f) => f.key === key);
          if (!filterConfig) return null;

          const displayValue = renderFilterValue(filterConfig);

          return (
            <Badge
              key={key}
              variant="outline"
              className="bg-connection-light/10 text-connection-light border-connection-light/20 flex items-center gap-1"
            >
              {filterConfig.label}: {displayValue}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleFilterChange(key, undefined)}
              />
            </Badge>
          );
        })}

        {activeFilters.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-6 text-xs text-connection-light/70 hover:text-connection-light hover:bg-connection-secondary/20"
          >
            Limpar filtros
          </Button>
        )}
      </div>
    );
  };

  const renderModuleActions = () => {
    return (
      <>
        {moduleActions.length > 0 && (
          <div
            className="mb-4 p-3 bg-connection-primary/20 border border-connection-primary/30 rounded-md"
            style={{ display: "none" }}
          >
            <h4 className="text-sm font-medium text-connection-light mb-2">
              Ações específicas:
            </h4>
            <ModuleActions
              actions={moduleActions}
              selectedItems={
                selectedItems.length > 0
                  ? selectedItems
                  : filteredData.length > 0
                  ? [filteredData[0].id]
                  : []
              }
              onActionComplete={fetchData}
            />
          </div>
        )}
      </>
    );
  };

  const renderSortIcon = (field: string) => {
    if (sortConfig?.field !== field) {
      return <ArrowUpDown className="ml-1 h-4 w-4" />;
    }

    return sortConfig.direction === "asc" ? (
      <ArrowUp className="ml-1 h-4 w-4" />
    ) : (
      <ArrowDown className="ml-1 h-4 w-4" />
    );
  };

  if (loading && data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-connection-accent" />
        <span className="ml-2 text-connection-light">Carregando...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="bg-connection-dark border-connection-dark/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white">{config.name}</CardTitle>
              <CardDescription className="text-connection-light/70">
                Gerencie os {config.name.toLowerCase()} cadastrados no sistema.
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setIsFormOpen(true)}
                className="bg-connection-accent hover:bg-connection-accent/80"
              >
                <Plus className="h-4 w-4 mr-2" />
                Novo registro
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-connection-light/50" />
              <Input
                placeholder={`Buscar ${config.name.toLowerCase()}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 bg-connection-primary/30 border-connection-primary/50 text-white placeholder:text-connection-light/50"
              />
            </div>

            {/*renderFilters() */}
          </div>

          {renderFilterBadges()}

          {renderModuleActions()}

          <div className="rounded-md border border-connection-primary/50 mt-4">
            <Table>
              <TableHeader>
                <TableRow className="border-connection-primary/50 hover:bg-connection-primary/30">
                  {config.batchActions && (
                    <TableHead className="w-[40px]">
                      <Checkbox
                        checked={isAllSelected}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                  )}
                  {config.tableColumns.map((column) => (
                    <TableHead
                      key={column.key}
                      className="text-connection-light"
                      style={{ width: column.width }}
                    >
                      {column.sortable ? (
                        <button
                          className="flex items-center focus:outline-none"
                          onClick={() => handleSort(column.key)}
                        >
                          {column.label}
                          {renderSortIcon(column.key)}
                        </button>
                      ) : (
                        column.label
                      )}
                    </TableHead>
                  ))}
                  <TableHead className="text-connection-light w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={
                        config.tableColumns.length +
                        1 +
                        (config.batchActions ? 1 : 0)
                      }
                      className="h-24 text-center text-connection-light/70"
                    >
                      Nenhum resultado encontrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredData.map((item) => (
                    <TableRow
                      key={item.id}
                      className={`border-connection-primary/50 hover:bg-connection-primary/30 cursor-pointer ${
                        selectedItems.includes(item.id)
                          ? "bg-connection-primary/40"
                          : ""
                      }`}
                      onClick={(e) => {
                        // Evitar seleção quando clicar em botões ou checkboxes
                        if (
                          e.target instanceof HTMLElement &&
                          !e.target.closest("button") &&
                          !e.target.closest('input[type="checkbox"]')
                        ) {
                          handleSelectItem(item.id, e.ctrlKey ? false : true);
                        }
                      }}
                    >
                      {config.batchActions && (
                        <TableCell>
                          <Checkbox
                            checked={selectedItems.includes(item.id)}
                            onCheckedChange={() => handleSelectItem(item.id)}
                          />
                        </TableCell>
                      )}
                      {config.tableColumns.map((column) => (
                        <TableCell
                          key={column.key}
                          className="text-connection-light"
                        >
                          {(() => {
                            const value = item[column.key];

                            if (column.type === "badge" && column.badgeConfig) {
                              const badgeInfo = value
                                ? column.badgeConfig.trueValue
                                : column.badgeConfig.falseValue;
                              return (
                                <span
                                  className={`px-2 py-1 rounded-full text-xs ${badgeInfo.className}`}
                                >
                                  {badgeInfo.label}
                                </span>
                              );
                            }

                            if (column.type === "boolean") {
                              return value ? "Sim" : "Não";
                            }

                            if (column.type === "date" && value) {
                              return format(new Date(value), "dd/MM/yyyy", {
                                locale: ptBR,
                              });
                            }

                            if (column.type === "relation-display") {
                              if (value && column.relationKey) {
                                return value[column.relationKey] || "-";
                              }
                              return "-";
                            }

                            if (
                              column.key === "spots" &&
                              column.customType === "spots"
                            ) {
                              return `${item.filledSpots}/${item.totalSpots}`;
                            }

                            if (
                              column.type === "rating" &&
                              value !== undefined
                            ) {
                              return (
                                <div className="flex items-center">
                                  <span className="text-yellow-400 mr-1">
                                    ★
                                  </span>
                                  <span>{Number(value).toFixed(1)}</span>
                                </div>
                              );
                            }

                            if (column.type === "image" && value) {
                              return (
                                <img
                                  src={value || "/placeholder.svg"}
                                  alt="Imagem"
                                  className="w-8 h-8 rounded-full object-cover"
                                />
                              );
                            }

                            if (
                              column.type === "currency" &&
                              value !== undefined
                            ) {
                              return new Intl.NumberFormat("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                              }).format(Number(value));
                            }

                            return value || "-";
                          })()}
                        </TableCell>
                      ))}
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              className="h-8 w-8 p-0 text-connection-light/70 hover:text-white"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="bg-connection-dark border-connection-primary/50"
                          >
                            <DropdownMenuItem
                              onClick={() => setViewingItem(item)}
                              className="text-connection-light hover:bg-connection-primary/30"
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              Ver detalhes
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                console.log('item', item);
                                setEditingItem(item);
                                setIsFormOpen(true);
                              }}
                              className="text-connection-light hover:bg-connection-primary/30"
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-connection-primary/50" />
                            <DropdownMenuItem
                              onClick={() => handleDelete(item.id)}
                              className="text-red-400 hover:bg-connection-primary/30"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        {moduleActions.length > 0 && (
                          <div className="flex ml-2">
                            {moduleActions.map((action) => (
                              <Button
                                key={action.name}
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 p-0 text-connection-light/70 hover:text-white hover:bg-connection-primary/30"
                                title={action.name}
                                onClick={() => {
                                  setSelectedItems([item.id]);
                                  // Simular clique na ação correspondente
                                  document
                                    .getElementById(
                                      `action-${action.name
                                        .replace(/\s+/g, "-")
                                        .toLowerCase()}`
                                    )
                                    ?.click();
                                }}
                              >
                                {action.icon === "Image" && (
                                  <ImageIcon className="h-4 w-4" />
                                )}
                                {action.icon === "Plus" && (
                                  <PlusIcon className="h-4 w-4" />
                                )}
                                {action.icon === "CheckCircle" && (
                                  <CheckCircleIcon className="h-4 w-4" />
                                )}
                                {action.icon === "Check" && (
                                  <CheckIcon className="h-4 w-4" />
                                )}
                                {action.icon === "Users" && (
                                  <UsersIcon className="h-4 w-4" />
                                )}
                                {action.icon === "Bell" && (
                                  <BellIcon className="h-4 w-4" />
                                )}
                              </Button>
                            ))}
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {config.batchActions && selectedItems.length > 0 && (
            <div className="flex items-center justify-between mt-4 p-2 bg-connection-primary/30 border border-connection-primary/50 rounded-md">
              <span className="text-connection-light">
                {selectedItems.length}{" "}
                {selectedItems.length === 1
                  ? "item selecionado"
                  : "itens selecionados"}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedItems([])}
                  className="border-connection-light/20 text-connection-light hover:bg-connection-secondary hover:text-white"
                >
                  Cancelar
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleBatchDelete}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Excluir selecionados
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="bg-connection-dark border-connection-primary/50 max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-white">
              {editingItem ? "Editar" : "Novo"}
            </DialogTitle>
          </DialogHeader>
          <CrudForm
            config={config}
            initialData={editingItem}
            onSuccess={handleFormSuccess}
            onCancel={() => {
              setIsFormOpen(false);
              setEditingItem(null);
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={!!viewingItem} onOpenChange={() => setViewingItem(null)}>
  <DialogContent className="bg-connection-dark border-connection-primary/50 max-w-4xl max-h-[85vh]">
    <DialogHeader>
      <DialogTitle className="text-white">
        Detalhes do {config.name.slice(0, -1)}
      </DialogTitle>
    </DialogHeader>

    {viewingItem && (
      <div className="overflow-y-auto max-h-[70vh] pr-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Usar todas as propriedades do objeto, não apenas config.fields */}
          {Object.entries(viewingItem)
            .filter(([key]) => key !== 'id') // Excluir ID se não quiser mostrar
            .map(([key, value]) => {
              // Encontrar configuração do campo se existir
              const fieldConfig = config.fields?.find(f => f.key === key) || 
                                 config.tableColumns?.find(c => c.key === key);
              
              const label = fieldConfig?.label || key.charAt(0).toUpperCase() + key.slice(1);
              
              return (
                <div
                  key={key}
                  className="bg-connection-dark/50 p-3 rounded border border-connection-primary/20"
                >
                  <label className="text-xs font-medium text-connection-light block mb-1 uppercase tracking-wide">
                    {label}
                  </label>
                  <div className="text-connection-light/80 text-sm break-words">
                    {(() => {
                      // Tratamento baseado no tipo do campo
                      const fieldType = fieldConfig?.type;
                      
                      if (fieldType === "boolean" || typeof value === "boolean") {
                        return (
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                              value
                                ? "bg-green-900/50 text-green-300"
                                : "bg-red-900/50 text-red-300"
                            }`}
                          >
                            {value ? "Sim" : "Não"}
                          </span>
                        );
                      }
                      
                      if (fieldType === "date" && value) {
                        try {
                          return format(new Date(value), "dd/MM/yyyy HH:mm", { locale: ptBR });
                        } catch {
                          return value;
                        }
                      }
                      
                      if (fieldType === "currency" && typeof value === "number") {
                        return new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(value);
                      }
                      
                      if (fieldType === "image" && value) {
                        return (
                          <img
                            src={value}
                            alt="Imagem"
                            className="w-16 h-16 rounded object-cover"
                            onError={(e) => {
                              e.target.src = "/placeholder.svg";
                            }}
                          />
                        );
                      }
                      
                      // Se é um objeto (relacionamento), tentar mostrar propriedades úteis
                      if (typeof value === "object" && value !== null) {
                        // Tentar mostrar name, title, ou primeira propriedade string
                        const displayValue = value.name || value.title || value.description ||
                          Object.values(value).find(v => typeof v === "string");
                        return displayValue || JSON.stringify(value, null, 2);
                      }
                      
                      if (Array.isArray(value)) {
                        return value.length > 0 ? `${value.length} itens` : "Nenhum item";
                      }
                      
                      return (
                        <span className="whitespace-pre-wrap">
                          {value || (
                            <span className="text-connection-light/50 italic">
                              Não informado
                            </span>
                          )}
                        </span>
                      );
                    })()}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    )}
  </DialogContent>
</Dialog>

      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="bg-connection-dark border-connection-primary/50">
          <DialogHeader>
            <DialogTitle className="text-white">Confirmar exclusão</DialogTitle>
            <DialogDescription className="text-connection-light/70">
              Tem certeza que deseja excluir este item? Esta ação não pode ser
              desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteConfirmOpen(false)}
              className="border-connection-light/20 text-connection-light hover:bg-connection-secondary hover:text-white"
            >
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
