// hooks/useRelationData.ts
import { useState, useEffect } from 'react';
import type { CrudConfig, FieldConfig } from "@/lib/crud-config";

export function useRelationData(config: CrudConfig) {
  const [relationData, setRelationData] = useState<Record<string, any[]>>({});
  const [relationLoading, setRelationLoading] = useState<Record<string, boolean>>({});
  const [relationSearch, setRelationSearch] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadRelationData = async () => {
      const relationFields = config.fields.filter(
        (field) => field.type === "relation"
      );

      for (const field of relationFields) {
        if (field.relationConfig?.endpoint) {
          try {
            setRelationLoading((prev) => ({ ...prev, [field.key]: true }));
            const response = await fetch(field.relationConfig.endpoint, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
              },
            });
            if (response.ok) {
              const data = await response.json();
              setRelationData((prev) => ({
                ...prev,
                [field.key]: data,
              }));
            }
          } catch (error) {
            console.error(
              `Erro ao carregar dados de relação para ${field.key}:`,
              error
            );
          } finally {
            setRelationLoading((prev) => ({ ...prev, [field.key]: false }));
          }
        }
      }
    };

    loadRelationData();
  }, [config.fields]);

  const handleRelationSearch = async (
    field: FieldConfig,
    searchTerm: string
  ) => {
    if (!field.relationConfig?.endpoint || !field.relationConfig.searchFields)
      return;

    setRelationSearch((prev) => ({ ...prev, [field.key]: searchTerm }));

    if (searchTerm.length < 2) return;

    try {
      setRelationLoading((prev) => ({ ...prev, [field.key]: true }));

      const queryParams = new URLSearchParams();
      queryParams.append("search", searchTerm);

      field.relationConfig.searchFields.forEach((searchField) => {
        queryParams.append("searchFields", searchField);
      });

      const url = `${field.relationConfig.endpoint}?${queryParams.toString()}`;
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setRelationData((prev) => ({
          ...prev,
          [field.key]: data,
        }));
      }
    } catch (error) {
      console.error(
        `Erro ao buscar dados de relação para ${field.key}:`,
        error
      );
    } finally {
      setRelationLoading((prev) => ({ ...prev, [field.key]: false }));
    }
  };

  return {
    relationData,
    relationLoading,
    relationSearch,
    setRelationSearch,
    handleRelationSearch
  };
}