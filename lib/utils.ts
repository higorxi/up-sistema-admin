import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function transformFormData(formData) {
  const result = {};

  for (const [key, value] of Object.entries(formData)) {
    if (key.includes(".")) {
      const [parentKey, childKey] = key.split(".");
      if (!result[parentKey]) {
        result[parentKey] = {};
      }
      if (value !== "" && value !== null && value !== undefined) {
        result[parentKey][childKey] = value;
      }
    } else {
      result[key] = value;
    }
  }

  // Limpar objetos vazios
  Object.keys(result).forEach((key) => {
    if (
      typeof result[key] === "object" &&
      result[key] !== null &&
      !Array.isArray(result[key])
    ) {
      if (Object.keys(result[key]).length === 0) {
        delete result[key];
      }
    }
  });

  return result;
}

export function flattenFormData(data: any): any {
  const flattened: any = {};

  const flattenObject = (obj: any, prefix = "") => {
    for (const [key, value] of Object.entries(obj)) {
      const newKey = prefix ? `${prefix}.${key}` : key;

      if (
        value &&
        typeof value === "object" &&
        !Array.isArray(value) &&
        !(value instanceof Date)
      ) {
        flattenObject(value, newKey);
      } else {
        flattened[newKey] = value;
      }
    }
  };

  flattenObject(data);
  return flattened;
}
