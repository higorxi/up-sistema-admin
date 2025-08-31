// utils/formDataTransform.ts

export function transformFormDataWithStructure(formData: Record<string, any>, structure?: any): any {
  if (!structure) {
    // Se não há estrutura definida, usar transformação automática
    return transformFlatToNested(formData);
  }

  const result: any = {};

  // Processar cada chave da estrutura
  for (const [targetKey, mapping] of Object.entries(structure)) {
    if (Array.isArray(mapping)) {
      // Se é um array, mapear cada campo diretamente
      const targetObject: any = {};
      for (const fieldKey of mapping) {
        if (typeof fieldKey === 'string' && formData.hasOwnProperty(fieldKey)) {
          // Extrair o nome do campo sem o prefixo
          const fieldName = fieldKey.split('.').pop();
          if (fieldName) {
            targetObject[fieldName] = formData[fieldKey];
          }
        }
      }
      if (Object.keys(targetObject).length > 0) {
        result[targetKey] = targetObject;
      }
    } else if (typeof mapping === 'object') {
      // Se é um objeto, processar recursivamente
      result[targetKey] = transformNestedStructure(formData, mapping);
    } else if (typeof mapping === 'string') {
      // Se é uma string simples, mapear diretamente
      if (formData.hasOwnProperty(mapping)) {
        result[targetKey] = formData[mapping];
      }
    }
  }

  return result;
}

function transformNestedStructure(formData: Record<string, any>, structure: any): any {
  const result: any = {};

  for (const [targetKey, mapping] of Object.entries(structure)) {
    if (Array.isArray(mapping)) {
      // Se é um array, criar um objeto com os campos mapeados
      const nestedObject: any = {};
      for (const fieldKey of mapping) {
        if (typeof fieldKey === 'string' && formData.hasOwnProperty(fieldKey)) {
          const fieldName = fieldKey.split('.').pop();
          if (fieldName) {
            nestedObject[fieldName] = formData[fieldKey];
          }
        }
      }
      if (Object.keys(nestedObject).length > 0) {
        result[targetKey] = nestedObject;
      }
    } else if (typeof mapping === 'string') {
      // Mapeamento direto
      if (formData.hasOwnProperty(mapping)) {
        result[targetKey] = formData[mapping];
      }
    } else if (typeof mapping === 'object') {
      // Recursão para objetos aninhados
      const nested = transformNestedStructure(formData, mapping);
      if (Object.keys(nested).length > 0) {
        result[targetKey] = nested;
      }
    }
  }

  return result;
}

function transformFlatToNested(flatData: Record<string, any>): any {
  const result: any = {};
  
  for (const [key, value] of Object.entries(flatData)) {
    if (key.includes('.')) {
      // Chave com notação de ponto - criar estrutura aninhada
      const parts = key.split('.');
      let current = result;
      
      // Navegar pela estrutura criando objetos conforme necessário
      for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i];
        if (!(part in current)) {
          current[part] = {};
        }
        current = current[part];
      }
      
      // Definir o valor na última chave
      const lastPart = parts[parts.length - 1];
      current[lastPart] = value;
    } else {
      // Chave simples - adicionar diretamente
      result[key] = value;
    }
  }
  
  return result;
}

// Exemplo de uso:
// const formData = {
//   "partnerSupplier.tradeName": "Test",
//   "partnerSupplier.document": "123",
//   "user.email": "test@test.com",
//   "user.address.state": "GO"
// };
//
// const structure = {
//   partnerSupplier: ['partnerSupplier.tradeName', 'partnerSupplier.document'],
//   user: {
//     email: 'user.email',
//     address: ['user.address.state']
//   }
// };
//
// Result: {
//   partnerSupplier: { tradeName: "Test", document: "123" },
//   user: { email: "test@test.com", address: { state: "GO" } }
// }