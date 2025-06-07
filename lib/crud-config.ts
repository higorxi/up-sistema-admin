export interface FieldConfig {
  key: string
  label: string
  type:
    | "text"
    | "email"
    | "number"
    | "boolean"
    | "select"
    | "textarea"
    | "date"
    | "relation"
    | "multiselect"
    | "file"
    | "phone"
    | "currency"
    | "cpf"
    | "cnpj"
    | "cep"
  required?: boolean
  placeholder?: string
  description?: string
  defaultValue?: any
  validation?: {
    pattern?: string
    min?: number
    max?: number
    minLength?: number
    maxLength?: number
    message?: string
  }
  options?: { value: string; label: string }[]
  relationConfig?: {
    endpoint: string
    displayField: string
    valueField: string
    filters?: Record<string, any>
    searchFields?: string[]
    dependsOn?: string // Campo que este campo depende
    dependencyMap?: Record<string, any> // Mapeamento de valores do campo dependente para filtros
  }
  conditionalDisplay?: {
    field: string
    operator: "eq" | "neq" | "gt" | "lt" | "contains"
    value: any
  }
  width?: "full" | "half" | "third"
}

export interface TableColumn {
  key: string
  label: string
  type?:
    | "text"
    | "boolean"
    | "badge"
    | "rating"
    | "date"
    | "currency"
    | "relation"
    | "image"
    | "actions"
    | "relation-display"
    | "custom"
  sortable?: boolean
  filterable?: boolean
  width?: string
  relationKey?: string // Para campos de relacionamento que precisam mostrar um campo específico
  customType?: string // Para tipos customizados como "spots"
  badgeConfig?: {
    trueValue: { label: string; className: string }
    falseValue: { label: string; className: string }
  }
  relationConfig?: {
    endpoint: string
    displayField: string
  }
  format?: (value: any, item: any) => any
}

export interface FilterOption {
  key: string
  label: string
  type: "select" | "date" | "boolean" | "text" | "number" | "relation"
  options?: { value: string; label: string }[]
  relationConfig?: {
    endpoint: string
    displayField: string
    valueField: string
  }
}

export interface CrudConfig {
  name: string
  endpoint: string
  displayField: string
  searchFields: string[]
  defaultSort?: { field: string; direction: "asc" | "desc" }
  fields: FieldConfig[]
  tableColumns: TableColumn[]
  filterOptions?: FilterOption[]
  batchActions?: boolean
  permissions?: {
    create?: boolean
    read?: boolean
    update?: boolean
    delete?: boolean
  }
}

export const crudConfigs: Record<string, CrudConfig> = {
  "partner-suppliers": {
    name: "Fornecedores Parceiros",
    endpoint: "/api/partner-suppliers",
    displayField: "tradeName",
    searchFields: ["tradeName", "companyName", "document"],
    defaultSort: { field: "tradeName", direction: "asc" },
    fields: [
      {
        key: "tradeName",
        label: "Nome Fantasia",
        type: "text",
        required: true,
        placeholder: "Nome fantasia da empresa",
        width: "half",
      },
      {
        key: "companyName",
        label: "Razão Social",
        type: "text",
        required: true,
        placeholder: "Razão social completa",
        width: "half",
      },
      {
        key: "document",
        label: "CNPJ",
        type: "cnpj",
        required: true,
        placeholder: "00.000.000/0000-00",
        width: "half",
      },
      {
        key: "stateRegistration",
        label: "Inscrição Estadual",
        type: "text",
        placeholder: "Inscrição estadual",
        width: "half",
      },
      { key: "contact", label: "Contato", type: "phone", placeholder: "(00) 00000-0000", width: "half" },
      {
        key: "storeId",
        label: "Loja",
        type: "relation",
        width: "half",
        relationConfig: {
          endpoint: "/api/stores",
          displayField: "name",
          valueField: "id",
          searchFields: ["name"],
        },
      },
      { key: "accessPending", label: "Acesso Pendente", type: "boolean", defaultValue: true, width: "half" },
    ],
    tableColumns: [
      { key: "tradeName", label: "Fornecedor", sortable: true },
      { key: "companyName", label: "Razão Social", sortable: true },
      { key: "document", label: "CNPJ" },
      { key: "contact", label: "Contato" },
      {
        key: "accessPending",
        label: "Status",
        type: "badge",
        sortable: true,
        filterable: true,
        badgeConfig: {
          trueValue: { label: "Pendente", className: "bg-yellow-100 text-yellow-800" },
          falseValue: { label: "Liberado", className: "bg-green-100 text-green-800" },
        },
      },
    ],
    filterOptions: [
      {
        key: "accessPending",
        label: "Status",
        type: "boolean",
      },
      {
        key: "storeId",
        label: "Loja",
        type: "relation",
        relationConfig: {
          endpoint: "/api/stores",
          displayField: "name",
          valueField: "id",
        },
      },
    ],
  },
  professionals: {
    name: "Profissionais",
    endpoint: "/api/professionals",
    displayField: "name",
    searchFields: ["name", "document", "phone"],
    defaultSort: { field: "name", direction: "asc" },
    fields: [
      { key: "name", label: "Nome", type: "text", required: true, placeholder: "Nome completo", width: "half" },
      { key: "document", label: "CPF/CNPJ", type: "text", placeholder: "000.000.000-00", width: "half" },
      { key: "phone", label: "Telefone", type: "phone", required: true, placeholder: "(00) 00000-0000", width: "half" },
      {
        key: "description",
        label: "Descrição",
        type: "textarea",
        placeholder: "Descrição profissional",
        width: "full",
      },
      {
        key: "experience",
        label: "Experiência",
        type: "textarea",
        placeholder: "Experiência profissional",
        width: "full",
      },
      {
        key: "officeName",
        label: "Nome do Escritório",
        type: "text",
        placeholder: "Nome do escritório",
        width: "half",
      },
      { key: "verified", label: "Verificado", type: "boolean", defaultValue: false, width: "third" },
      { key: "featured", label: "Destaque", type: "boolean", defaultValue: false, width: "third" },
      {
        key: "level",
        label: "Nível",
        type: "select",
        width: "third",
        options: [
          { value: "BRONZE", label: "Bronze" },
          { value: "SILVER", label: "Prata" },
          { value: "GOLD", label: "Ouro" },
          { value: "PLATINUM", label: "Platina" },
        ],
      },
      {
        key: "professionId",
        label: "Profissão",
        type: "relation",
        width: "half",
        relationConfig: {
          endpoint: "/api/professions",
          displayField: "name",
          valueField: "id",
          searchFields: ["name"],
        },
      },
    ],
    tableColumns: [
      { key: "name", label: "Nome", sortable: true },
      { key: "phone", label: "Telefone" },
      { key: "level", label: "Nível", sortable: true, filterable: true },
      {
        key: "verified",
        label: "Status",
        type: "badge",
        sortable: true,
        filterable: true,
        badgeConfig: {
          trueValue: { label: "Verificado", className: "bg-green-100 text-green-800" },
          falseValue: { label: "Não Verificado", className: "bg-gray-100 text-gray-800" },
        },
      },
    ],
    filterOptions: [
      {
        key: "verified",
        label: "Status",
        type: "boolean",
      },
      {
        key: "level",
        label: "Nível",
        type: "select",
        options: [
          { value: "BRONZE", label: "Bronze" },
          { value: "SILVER", label: "Prata" },
          { value: "GOLD", label: "Ouro" },
          { value: "PLATINUM", label: "Platina" },
        ],
      },
      {
        key: "professionId",
        label: "Profissão",
        type: "relation",
        relationConfig: {
          endpoint: "/api/professions",
          displayField: "name",
          valueField: "id",
        },
      },
    ],
  },
  users: {
    name: "Usuários",
    endpoint: "/api/users",
    displayField: "email",
    searchFields: ["email"],
    defaultSort: { field: "createdAt", direction: "desc" },
    fields: [
      { key: "email", label: "Email", type: "email", required: true, placeholder: "email@exemplo.com", width: "half" },
      { key: "password", label: "Senha", type: "text", required: true, placeholder: "********", width: "half" },
      { key: "profileImage", label: "Imagem de Perfil", type: "file", width: "full" },
    ],
    tableColumns: [
      { key: "email", label: "Email", sortable: true },
      {
        key: "createdAt",
        label: "Criado em",
        type: "date",
        sortable: true,
      },
    ],
  },
  stores: {
    name: "Lojas",
    endpoint: "/api/stores",
    displayField: "name",
    searchFields: ["name", "description"],
    defaultSort: { field: "name", direction: "asc" },
    fields: [
      { key: "name", label: "Nome", type: "text", required: true, placeholder: "Nome da loja", width: "half" },
      { key: "description", label: "Descrição", type: "textarea", placeholder: "Descrição da loja", width: "full" },
      { key: "website", label: "Website", type: "text", placeholder: "https://www.exemplo.com.br", width: "half" },
      {
        key: "openingHours",
        label: "Horário de Funcionamento",
        type: "text",
        placeholder: "Seg-Sex: 9h às 18h",
        width: "half",
      },
      {
        key: "addressId",
        label: "Endereço",
        type: "relation",
        width: "full",
        relationConfig: {
          endpoint: "/api/addresses",
          displayField: "fullAddress",
          valueField: "id",
          searchFields: ["street", "city", "state"],
        },
      },
    ],
    tableColumns: [
      { key: "name", label: "Nome", sortable: true },
      { key: "description", label: "Descrição" },
      { key: "website", label: "Website" },
      {
        key: "rating",
        label: "Avaliação",
        type: "rating",
        sortable: true,
      },
    ],
  },
}
