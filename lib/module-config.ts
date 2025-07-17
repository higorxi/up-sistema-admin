import type { CrudConfig } from "./crud-config";
import { API_CONFIG, buildApiUrl } from "./api-config";

export interface ModuleAction {
  name: string;
  endpoint: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  requiresConfirmation?: boolean;
  confirmationMessage?: string;
  requiresSelection?: boolean;
  requiresForm?: boolean;
  formFields?: any[];
  icon?: string;
  successMessage?: string;
  errorMessage?: string;
}

export interface ModuleConfig {
  name: string;
  path: string;
  crudConfig: CrudConfig;
  actions?: ModuleAction[];
}

export const moduleConfigs: Record<string, ModuleConfig> = {
  users: {
    name: "Usuários",
    path: "/admin/users",
    crudConfig: {
      name: "Usuários",
      endpoint: buildApiUrl(API_CONFIG.ENDPOINTS.USERS),
      displayField: "email",
      searchFields: ["email"],
      defaultSort: { field: "createdAt", direction: "desc" },
      fields: [
        {
          key: "email",
          label: "Email",
          type: "email",
          required: true,
          placeholder: "email@exemplo.com",
          width: "half",
        },
        {
          key: "password",
          label: "Senha",
          type: "text",
          required: true,
          placeholder: "********",
          width: "half",
        },
        {
          key: "profileImage",
          label: "Imagem de Perfil",
          type: "text",
          placeholder: "URL da imagem",
          width: "full",
        },
        {
          key: "address",
          label: "Endereço",
          type: "object",
          width: "full",
          fields: [
            {
              key: "state",
              label: "Estado",
              type: "text",
              required: true,
              placeholder: "Ex: SP",
            },
            {
              key: "city",
              label: "Cidade",
              type: "text",
              required: true,
              placeholder: "Ex: São Paulo",
            },
            {
              key: "district",
              label: "Bairro",
              type: "text",
              required: true,
              placeholder: "Ex: Centro",
            },
            {
              key: "street",
              label: "Rua",
              type: "text",
              placeholder: "Nome da rua",
            },
            {
              key: "number",
              label: "Número",
              type: "text",
              placeholder: "123",
            },
            {
              key: "complement",
              label: "Complemento",
              type: "text",
              placeholder: "Apto 45",
            },
            {
              key: "zipCode",
              label: "CEP",
              type: "text",
              placeholder: "00000-000",
            },
          ],
        },
      ],
      tableColumns: [
        { key: "email", label: "Email", sortable: true },
        {
          key: "createdAt",
          label: "Criado em",
          type: "date",
          sortable: true,
        },
        {
          key: "profileImage",
          label: "Foto",
          type: "image",
        },
        {
          key: "partnerSupplier",
          label: "Fornecedor",
          type: "relation-display",
          relationKey: "tradeName",
        },
        {
          key: "professional",
          label: "Profissional",
          type: "relation-display",
          relationKey: "name",
        },
        {
          key: "loveDecoration",
          label: "Amante Decoração",
          type: "relation-display",
          relationKey: "name",
        },
      ],
      filterOptions: [
        {
          key: "createdAt",
          label: "Data de criação",
          type: "date",
        },
      ],
      customEndpoints: {
        create: buildApiUrl(API_CONFIG.ENDPOINTS.USERS), // Será usado pelo createUserWithRelation
        update: buildApiUrl(API_CONFIG.ENDPOINTS.USERS), // PATCH /:id
        delete: buildApiUrl(API_CONFIG.ENDPOINTS.USERS), // DELETE /:id
        list: buildApiUrl(API_CONFIG.ENDPOINTS.USERS), // GET /
        get: buildApiUrl(API_CONFIG.ENDPOINTS.USERS), // GET /:id
      },
    },
    actions: [
      {
        name: "Atualizar Foto de Perfil",
        endpoint: buildApiUrl(
          `${API_CONFIG.ENDPOINTS.USERS}/{id}/profile-image`
        ),
        method: "PATCH",
        requiresForm: true,
        formFields: [
          {
            key: "profileImage",
            label: "URL da Imagem",
            type: "text",
            required: true,
            placeholder: "https://...",
          },
        ],
        successMessage: "Foto de perfil atualizada com sucesso",
        errorMessage: "Erro ao atualizar foto de perfil",
        icon: "Image",
      },
    ],
  },

  professionals: {
    name: "Profissionais",
    path: "/admin/professionals",
    crudConfig: {
      name: "Profissionais",
      endpoint: buildApiUrl(API_CONFIG.ENDPOINTS.PROFESSIONALS),
      displayField: "name",
      searchFields: ["name", "document", "phone"],
      defaultSort: { field: "name", direction: "asc" },
      fields: [
        {
          key: "name",
          label: "Nome",
          type: "text",
          required: true,
          placeholder: "Nome completo",
          width: "half",
        },
        {
          key: "document",
          label: "CPF/CNPJ",
          type: "text",
          placeholder: "000.000.000-00",
          width: "half",
        },
        {
          key: "phone",
          label: "Telefone",
          type: "phone",
          required: true,
          placeholder: "(00) 00000-0000",
          width: "half",
        },
        {
          key: "generalRegister",
          label: "Registro Geral",
          type: "text",
          placeholder: "Número do registro",
          width: "half",
        },
        {
          key: "registrationAgency",
          label: "Órgão de Registro",
          type: "text",
          placeholder: "Ex: CREA, CAU",
          width: "half",
        },
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
        {
          key: "verified",
          label: "Verificado",
          type: "boolean",
          defaultValue: false,
          width: "third",
        },
        {
          key: "featured",
          label: "Destaque",
          type: "boolean",
          defaultValue: false,
          width: "third",
        },
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
            endpoint: buildApiUrl(API_CONFIG.ENDPOINTS.PROFESSIONS),
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
            trueValue: {
              label: "Verificado",
              className: "bg-green-100 text-green-800",
            },
            falseValue: {
              label: "Não Verificado",
              className: "bg-gray-100 text-gray-800",
            },
          },
        },
        { key: "points", label: "Pontos", sortable: true },
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
      ],
    },
    actions: [
      {
        name: "Adicionar Pontos",
        endpoint: buildApiUrl(
          `${API_CONFIG.ENDPOINTS.PROFESSIONALS}/{id}/add-points`
        ),
        method: "POST",
        requiresForm: true,
        formFields: [
          { key: "points", label: "Pontos", type: "number", required: true },
          { key: "source", label: "Fonte", type: "text", required: true },
        ],
        successMessage: "Pontos adicionados com sucesso",
        errorMessage: "Erro ao adicionar pontos",
        icon: "Plus",
      },
      {
        name: "Verificar Profissional",
        endpoint: buildApiUrl(
          `${API_CONFIG.ENDPOINTS.PROFESSIONALS}/{id}/verify`
        ),
        method: "POST",
        requiresConfirmation: true,
        confirmationMessage:
          "Tem certeza que deseja verificar este profissional?",
        successMessage: "Profissional verificado com sucesso",
        errorMessage: "Erro ao verificar profissional",
        icon: "CheckCircle",
      },
    ],
  },

  "partner-suppliers": {
    name: "Fornecedores Parceiros",
    path: "/admin/partner-suppliers",
    crudConfig: {
      name: "Fornecedores Parceiros",
      endpoint: buildApiUrl(API_CONFIG.ENDPOINTS.PARTNER_SUPPLIERS),
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
        {
          key: "contact",
          label: "Contato",
          type: "phone",
          placeholder: "(00) 00000-0000",
          width: "half",
        },
        {
          key: "accessPending",
          label: "Acesso Pendente",
          type: "boolean",
          defaultValue: true,
          width: "half",
        },
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
            trueValue: {
              label: "Pendente",
              className: "bg-yellow-100 text-yellow-800",
            },
            falseValue: {
              label: "Liberado",
              className: "bg-green-100 text-green-800",
            },
          },
        },
      ],
      filterOptions: [
        {
          key: "accessPending",
          label: "Status",
          type: "boolean",
        },
      ],
    },
    actions: [
      {
        name: "Aprovar Acesso",
        endpoint: buildApiUrl(
          `${API_CONFIG.ENDPOINTS.PARTNER_SUPPLIERS}/pending/{id}`
        ),
        method: "PUT",
        requiresConfirmation: true,
        confirmationMessage: "Aprovar acesso para este fornecedor?",
        successMessage: "Acesso aprovado com sucesso",
        errorMessage: "Erro ao aprovar acesso",
        icon: "Check",
      },
    ],
  },

  addresses: {
    name: "Endereços",
    path: "/admin/addresses",
    crudConfig: {
      name: "Endereços",
      endpoint: buildApiUrl(API_CONFIG.ENDPOINTS.ADDRESSES),
      displayField: "street",
      searchFields: ["street", "city", "state", "district"],
      defaultSort: { field: "city", direction: "asc" },
      fields: [
        {
          key: "state",
          label: "Estado",
          type: "text",
          required: true,
          placeholder: "Ex: SP",
          width: "third",
        },
        {
          key: "city",
          label: "Cidade",
          type: "text",
          required: true,
          placeholder: "Ex: São Paulo",
          width: "third",
        },
        {
          key: "district",
          label: "Bairro",
          type: "text",
          required: true,
          placeholder: "Ex: Centro",
          width: "third",
        },
        {
          key: "street",
          label: "Rua",
          type: "text",
          placeholder: "Nome da rua",
          width: "half",
        },
        {
          key: "number",
          label: "Número",
          type: "text",
          placeholder: "123",
          width: "third",
        },
        {
          key: "complement",
          label: "Complemento",
          type: "text",
          placeholder: "Apto 45",
          width: "third",
        },
        {
          key: "zipCode",
          label: "CEP",
          type: "cep",
          placeholder: "00000-000",
          width: "third",
        },
      ],
      tableColumns: [
        { key: "street", label: "Rua", sortable: true },
        { key: "city", label: "Cidade", sortable: true },
        { key: "state", label: "Estado", sortable: true },
        { key: "zipCode", label: "CEP" },
      ],
      filterOptions: [
        {
          key: "state",
          label: "Estado",
          type: "text",
        },
        {
          key: "city",
          label: "Cidade",
          type: "text",
        },
      ],
    },
  },

  stores: {
    name: "Lojas",
    path: "/admin/stores",
    crudConfig: {
      name: "Lojas",
      endpoint: buildApiUrl(API_CONFIG.ENDPOINTS.STORES),
      displayField: "name",
      searchFields: ["name", "description"],
      defaultSort: { field: "name", direction: "asc" },
      fields: [
        {
          key: "name",
          label: "Nome",
          type: "text",
          required: true,
          placeholder: "Nome da loja",
          width: "half",
        },
        {
          key: "description",
          label: "Descrição",
          type: "textarea",
          placeholder: "Descrição da loja",
          width: "full",
        },
        {
          key: "website",
          label: "Website",
          type: "text",
          placeholder: "https://www.exemplo.com.br",
          width: "half",
        },
        {
          key: "openingHours",
          label: "Horário de Funcionamento",
          type: "text",
          placeholder: "Seg-Sex: 9h às 18h",
          width: "half",
        },
        {
          key: "rating",
          label: "Avaliação",
          type: "number",
          placeholder: "0.0",
          width: "half",
        },
        {
          key: "addressId",
          label: "Endereço",
          type: "relation",
          required: true,
          width: "full",
          relationConfig: {
            endpoint: buildApiUrl(API_CONFIG.ENDPOINTS.ADDRESSES),
            displayField: "fullAddress",
            valueField: "id",
            searchFields: ["street", "city", "state"],
          },
        },
        {
          key: "partnerId",
          label: "Fornecedor Parceiro",
          type: "relation",
          required: true,
          width: "full",
          relationConfig: {
            endpoint: buildApiUrl(API_CONFIG.ENDPOINTS.PARTNER_SUPPLIERS),
            displayField: "tradeName",
            valueField: "id",
            searchFields: ["tradeName", "companyName"],
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
      filterOptions: [
        {
          key: "rating",
          label: "Avaliação mínima",
          type: "number",
        },
      ],
    },
  },

  products: {
    name: "Produtos",
    path: "/admin/products",
    crudConfig: {
      name: "Produtos",
      endpoint: buildApiUrl(API_CONFIG.ENDPOINTS.PRODUCTS),
      displayField: "name",
      searchFields: ["name", "description"],
      defaultSort: { field: "name", direction: "asc" },
      fields: [
        {
          key: "name",
          label: "Nome",
          type: "text",
          required: true,
          placeholder: "Nome do produto",
          width: "half",
        },
        {
          key: "description",
          label: "Descrição",
          type: "textarea",
          placeholder: "Descrição do produto",
          width: "full",
        },
        {
          key: "price",
          label: "Preço",
          type: "currency",
          required: true,
          placeholder: "0,00",
          width: "third",
        },
        {
          key: "link",
          label: "Link",
          type: "text",
          placeholder: "https://...",
          width: "half",
        },
        {
          key: "featured",
          label: "Destaque",
          type: "boolean",
          defaultValue: false,
          width: "third",
        },
        {
          key: "promotion",
          label: "Promoção",
          type: "boolean",
          defaultValue: false,
          width: "third",
        },
        {
          key: "storeId",
          label: "Loja",
          type: "relation",
          required: true,
          width: "full",
          relationConfig: {
            endpoint: buildApiUrl(API_CONFIG.ENDPOINTS.STORES),
            displayField: "name",
            valueField: "id",
            searchFields: ["name"],
          },
        },
      ],
      tableColumns: [
        { key: "name", label: "Nome", sortable: true },
        { key: "price", label: "Preço", type: "currency", sortable: true },
        {
          key: "featured",
          label: "Destaque",
          type: "badge",
          badgeConfig: {
            trueValue: { label: "Sim", className: "bg-blue-100 text-blue-800" },
            falseValue: {
              label: "Não",
              className: "bg-gray-100 text-gray-800",
            },
          },
        },
        {
          key: "promotion",
          label: "Promoção",
          type: "badge",
          badgeConfig: {
            trueValue: { label: "Sim", className: "bg-red-100 text-red-800" },
            falseValue: {
              label: "Não",
              className: "bg-gray-100 text-gray-800",
            },
          },
        },
      ],
      filterOptions: [
        {
          key: "featured",
          label: "Em destaque",
          type: "boolean",
        },
        {
          key: "promotion",
          label: "Em promoção",
          type: "boolean",
        },
        {
          key: "storeId",
          label: "Loja",
          type: "relation",
          relationConfig: {
            endpoint: buildApiUrl(API_CONFIG.ENDPOINTS.STORES),
            displayField: "name",
            valueField: "id",
          },
        },
      ],
    },
  },

  events: {
    name: "Eventos",
    path: "/admin/events",
    crudConfig: {
      name: "Eventos",
      endpoint: buildApiUrl(API_CONFIG.ENDPOINTS.EVENTS),
      displayField: "name",
      searchFields: ["name", "description", "type"],
      defaultSort: { field: "date", direction: "desc" },
      fields: [
        {
          key: "name",
          label: "Nome",
          type: "text",
          required: true,
          width: "half",
        },
        {
          key: "description",
          label: "Descrição",
          type: "textarea",
          required: true,
          width: "full",
        },
        {
          key: "date",
          label: "Data",
          type: "date",
          required: true,
          width: "half",
        },
        {
          key: "type",
          label: "Tipo",
          type: "text",
          required: true,
          width: "half",
        },
        {
          key: "points",
          label: "Pontos",
          type: "number",
          defaultValue: 0,
          width: "third",
        },
        {
          key: "totalSpots",
          label: "Total de Vagas",
          type: "number",
          required: true,
          width: "third",
        },
        {
          key: "filledSpots",
          label: "Vagas Preenchidas",
          type: "number",
          defaultValue: 0,
          width: "third",
        },
        {
          key: "addressId",
          label: "Endereço",
          type: "relation",
          required: true,
          width: "full",
          relationConfig: {
            endpoint: buildApiUrl(API_CONFIG.ENDPOINTS.ADDRESSES),
            displayField: "fullAddress",
            valueField: "id",
            searchFields: ["street", "city", "state"],
          },
        },
        {
          key: "storeId",
          label: "Loja",
          type: "relation",
          required: true,
          width: "full",
          relationConfig: {
            endpoint: buildApiUrl(API_CONFIG.ENDPOINTS.STORES),
            displayField: "name",
            valueField: "id",
            searchFields: ["name"],
          },
        },
      ],
      tableColumns: [
        { key: "name", label: "Nome", sortable: true },
        {
          key: "date",
          label: "Data",
          type: "date",
          sortable: true,
        },
        { key: "type", label: "Tipo", sortable: true },
        { key: "points", label: "Pontos", sortable: true },
        {
          key: "spots",
          label: "Vagas",
          type: "custom",
          customType: "spots",
        },
      ],
      filterOptions: [
        {
          key: "type",
          label: "Tipo",
          type: "text",
        },
        {
          key: "date",
          label: "Data",
          type: "date",
        },
      ],
    },
    actions: [
      {
        name: "Ver Participantes",
        endpoint: buildApiUrl(
          `${API_CONFIG.ENDPOINTS.EVENTS}/{id}/participants`
        ),
        method: "GET",
        icon: "Users",
      },
      {
        name: "Enviar Lembrete",
        endpoint: buildApiUrl(
          `${API_CONFIG.ENDPOINTS.EVENTS}/{id}/send-reminder`
        ),
        method: "POST",
        requiresConfirmation: true,
        confirmationMessage: "Enviar lembrete para todos os participantes?",
        successMessage: "Lembretes enviados com sucesso",
        errorMessage: "Erro ao enviar lembretes",
        icon: "Bell",
      },
    ],
  },

  "event-registrations": {
    name: "Inscrições em Eventos",
    path: "/admin/event-registrations",
    crudConfig: {
      name: "Inscrições em Eventos",
      endpoint: buildApiUrl(API_CONFIG.ENDPOINTS.EVENT_REGISTRATIONS),
      displayField: "id",
      searchFields: [],
      defaultSort: { field: "registeredAt", direction: "desc" },
      fields: [
        {
          key: "professionalId",
          label: "Profissional",
          type: "relation",
          required: true,
          width: "half",
          relationConfig: {
            endpoint: buildApiUrl(API_CONFIG.ENDPOINTS.PROFESSIONALS),
            displayField: "name",
            valueField: "id",
            searchFields: ["name"],
          },
        },
        {
          key: "eventId",
          label: "Evento",
          type: "relation",
          required: true,
          width: "half",
          relationConfig: {
            endpoint: buildApiUrl(API_CONFIG.ENDPOINTS.EVENTS),
            displayField: "name",
            valueField: "id",
            searchFields: ["name"],
          },
        },
      ],
      tableColumns: [
        {
          key: "professionalId",
          label: "Profissional",
          type: "relation",
          relationConfig: {
            endpoint: buildApiUrl(API_CONFIG.ENDPOINTS.PROFESSIONALS),
            displayField: "name",
          },
        },
        {
          key: "eventId",
          label: "Evento",
          type: "relation",
          relationConfig: {
            endpoint: buildApiUrl(API_CONFIG.ENDPOINTS.EVENTS),
            displayField: "name",
          },
        },
        {
          key: "registeredAt",
          label: "Data de Inscrição",
          type: "date",
          sortable: true,
        },
      ],
      filterOptions: [
        {
          key: "eventId",
          label: "Evento",
          type: "relation",
          relationConfig: {
            endpoint: buildApiUrl(API_CONFIG.ENDPOINTS.EVENTS),
            displayField: "name",
            valueField: "id",
          },
        },
      ],
    },
  },

  "point-history": {
    name: "Histórico de Pontos",
    path: "/admin/point-history",
    crudConfig: {
      name: "Histórico de Pontos",
      endpoint: buildApiUrl(API_CONFIG.ENDPOINTS.POINT_HISTORY),
      displayField: "source",
      searchFields: ["source"],
      defaultSort: { field: "createdAt", direction: "desc" },
      fields: [
        {
          key: "operation",
          label: "Operação",
          type: "select",
          required: true,
          width: "third",
          options: [
            { value: "ADD", label: "Adicionar" },
            { value: "REMOVE", label: "Remover" },
          ],
        },
        {
          key: "value",
          label: "Valor",
          type: "number",
          required: true,
          width: "third",
        },
        {
          key: "source",
          label: "Fonte",
          type: "text",
          required: true,
          placeholder: "Motivo da operação",
          width: "third",
        },
        {
          key: "professionalId",
          label: "Profissional",
          type: "relation",
          required: true,
          width: "full",
          relationConfig: {
            endpoint: buildApiUrl(API_CONFIG.ENDPOINTS.PROFESSIONALS),
            displayField: "name",
            valueField: "id",
            searchFields: ["name"],
          },
        },
      ],
      tableColumns: [
        {
          key: "professionalId",
          label: "Profissional",
          type: "relation",
          relationConfig: {
            endpoint: buildApiUrl(API_CONFIG.ENDPOINTS.PROFESSIONALS),
            displayField: "name",
          },
        },
        {
          key: "operation",
          label: "Operação",
          type: "badge",
          badgeConfig: {
            trueValue: {
              label: "Adicionar",
              className: "bg-green-100 text-green-800",
            },
            falseValue: {
              label: "Remover",
              className: "bg-red-100 text-red-800",
            },
          },
        },
        { key: "value", label: "Valor", sortable: true },
        { key: "source", label: "Fonte" },
        {
          key: "createdAt",
          label: "Data",
          type: "date",
          sortable: true,
        },
      ],
      filterOptions: [
        {
          key: "operation",
          label: "Operação",
          type: "select",
          options: [
            { value: "ADD", label: "Adicionar" },
            { value: "REMOVE", label: "Remover" },
          ],
        },
      ],
    },
  },

  workshops: {
    name: "Workshops",
    path: "/admin/workshops",
    crudConfig: {
      name: "Workshops",
      endpoint: buildApiUrl(API_CONFIG.ENDPOINTS.WORKSHOPS),
      displayField: "name",
      searchFields: ["name", "description"],
      defaultSort: { field: "name", direction: "asc" },
      fields: [
        {
          key: "name",
          label: "Nome",
          type: "text",
          required: true,
          placeholder: "Nome do workshop",
          width: "half",
        },
        {
          key: "description",
          label: "Descrição",
          type: "textarea",
          required: true,
          placeholder: "Descrição do workshop",
          width: "full",
        },
        {
          key: "duration",
          label: "Duração",
          type: "text",
          required: true,
          placeholder: "Ex: 2 horas",
          width: "third",
        },
        {
          key: "points",
          label: "Pontos",
          type: "number",
          required: true,
          width: "third",
        },
        {
          key: "type",
          label: "Tipo",
          type: "select",
          required: true,
          width: "third",
          options: [
            { value: "ONLINE", label: "Online" },
            { value: "PRESENTIAL", label: "Presencial" },
            { value: "HYBRID", label: "Híbrido" },
          ],
        },
        {
          key: "professionalId",
          label: "Profissional",
          type: "relation",
          required: true,
          width: "full",
          relationConfig: {
            endpoint: buildApiUrl(API_CONFIG.ENDPOINTS.PROFESSIONALS),
            displayField: "name",
            valueField: "id",
            searchFields: ["name"],
          },
        },
      ],
      tableColumns: [
        { key: "name", label: "Nome", sortable: true },
        { key: "duration", label: "Duração" },
        { key: "points", label: "Pontos", sortable: true },
        { key: "type", label: "Tipo", sortable: true },
        {
          key: "professionalId",
          label: "Profissional",
          type: "relation",
          relationConfig: {
            endpoint: buildApiUrl(API_CONFIG.ENDPOINTS.PROFESSIONALS),
            displayField: "name",
          },
        },
      ],
      filterOptions: [
        {
          key: "type",
          label: "Tipo",
          type: "select",
          options: [
            { value: "ONLINE", label: "Online" },
            { value: "PRESENTIAL", label: "Presencial" },
            { value: "HYBRID", label: "Híbrido" },
          ],
        },
      ],
    },
  },

  "workshop-modules": {
    name: "Módulos de Workshop",
    path: "/admin/workshop-modules",
    crudConfig: {
      name: "Módulos de Workshop",
      endpoint: buildApiUrl(API_CONFIG.ENDPOINTS.WORKSHOP_MODULES),
      displayField: "name",
      searchFields: ["name", "content"],
      defaultSort: { field: "name", direction: "asc" },
      fields: [
        {
          key: "name",
          label: "Nome",
          type: "text",
          required: true,
          placeholder: "Nome do módulo",
          width: "half",
        },
        {
          key: "content",
          label: "Conteúdo",
          type: "textarea",
          required: true,
          placeholder: "Conteúdo do módulo",
          width: "full",
        },
        {
          key: "workshopId",
          label: "Workshop",
          type: "relation",
          required: true,
          width: "half",
          relationConfig: {
            endpoint: buildApiUrl(API_CONFIG.ENDPOINTS.WORKSHOPS),
            displayField: "name",
            valueField: "id",
            searchFields: ["name"],
          },
        },
      ],
      tableColumns: [
        { key: "name", label: "Nome", sortable: true },
        {
          key: "workshopId",
          label: "Workshop",
          type: "relation",
          relationConfig: {
            endpoint: buildApiUrl(API_CONFIG.ENDPOINTS.WORKSHOPS),
            displayField: "name",
          },
        },
      ],
      filterOptions: [
        {
          key: "workshopId",
          label: "Workshop",
          type: "relation",
          relationConfig: {
            endpoint: buildApiUrl(API_CONFIG.ENDPOINTS.WORKSHOPS),
            displayField: "name",
            valueField: "id",
          },
        },
      ],
    },
  },

  coupons: {
    name: "Cupons",
    path: "/admin/coupons",
    crudConfig: {
      name: "Cupons",
      endpoint: buildApiUrl(API_CONFIG.ENDPOINTS.COUPONS),
      displayField: "name",
      searchFields: ["name", "code"],
      defaultSort: { field: "createdAt", direction: "desc" },
      fields: [
        {
          key: "name",
          label: "Nome",
          type: "text",
          required: true,
          placeholder: "Nome do cupom",
          width: "half",
        },
        {
          key: "code",
          label: "Código",
          type: "text",
          required: true,
          placeholder: "CUPOM2024",
          width: "half",
        },
        {
          key: "quantity",
          label: "Quantidade",
          type: "number",
          required: true,
          placeholder: "100",
          width: "half",
        },
      ],
      tableColumns: [
        { key: "name", label: "Nome", sortable: true },
        { key: "code", label: "Código", sortable: true },
        { key: "quantity", label: "Quantidade", sortable: true },
        {
          key: "createdAt",
          label: "Criado em",
          type: "date",
          sortable: true,
        },
      ],
    },
  },

  "recommended-professionals": {
    name: "Profissionais Recomendados",
    path: "/admin/recommended-professionals",
    crudConfig: {
      name: "Profissionais Recomendados",
      endpoint: buildApiUrl(API_CONFIG.ENDPOINTS.RECOMMENDED_PROFESSIONALS),
      displayField: "name",
      searchFields: ["name", "profession", "phone", "email"],
      defaultSort: { field: "name", direction: "asc" },
      fields: [
        {
          key: "name",
          label: "Nome",
          type: "text",
          required: true,
          placeholder: "Nome completo",
          width: "half",
        },
        {
          key: "profession",
          label: "Profissão",
          type: "text",
          required: true,
          placeholder: "Ex: Arquiteto",
          width: "half",
        },
        {
          key: "description",
          label: "Descrição",
          type: "textarea",
          placeholder: "Descrição profissional",
          width: "full",
        },
        {
          key: "phone",
          label: "Telefone",
          type: "phone",
          required: true,
          placeholder: "(00) 00000-0000",
          width: "half",
        },
        {
          key: "email",
          label: "Email",
          type: "email",
          placeholder: "email@exemplo.com",
          width: "half",
        },
        {
          key: "profileImage",
          label: "Imagem de Perfil",
          type: "file",
          width: "full",
        },

        // Campos de endereço
        {
          key: "address.street",
          label: "Rua",
          type: "text",
          required: true,
          placeholder: "Rua, número",
          width: "half",
        },
        {
          key: "address.city",
          label: "Cidade",
          type: "text",
          required: true,
          placeholder: "Cidade",
          width: "half",
        },
        {
          key: "address.state",
          label: "Estado",
          type: "text",
          required: true,
          placeholder: "Estado",
          width: "half",
        },
        {
          key: "address.zipCode",
          label: "CEP",
          type: "cep",
          required: true,
          placeholder: "00000-000",
          width: "half",
        },
        {
          key: "address.district",
          label: "Bairro",
          type: "text",
          required: true,
          placeholder: "Bairro",
          width: "half",
        }, // Mudança aqui
        {
          key: "address.complement",
          label: "Complemento",
          type: "text",
          placeholder: "Complemento",
          width: "half",
        },

        // Campos de redes sociais
        {
          key: "socialMedia.instagram",
          label: "Instagram",
          type: "text",
          placeholder: "https://instagram.com/usuario",
          width: "third",
        },
        {
          key: "socialMedia.linkedin",
          label: "LinkedIn",
          type: "text",
          placeholder: "https://linkedin.com/in/usuario",
          width: "third",
        },
        {
          key: "socialMedia.whatsapp",
          label: "WhatsApp",
          type: "phone",
          placeholder: "(00) 00000-0000",
          width: "third",
        },

        // Dias disponíveis
        {
          key: "availableDays",
          label: "Dias Disponíveis",
          type: "multiselect",
          width: "full",
          options: [
            { value: "MONDAY", label: "Segunda-feira" },
            { value: "TUESDAY", label: "Terça-feira" },
            { value: "WEDNESDAY", label: "Quarta-feira" },
            { value: "THURSDAY", label: "Quinta-feira" },
            { value: "FRIDAY", label: "Sexta-feira" },
            { value: "SATURDAY", label: "Sábado" },
            { value: "SUNDAY", label: "Domingo" },
          ],
        },

        {
          key: "isActive",
          label: "Ativo",
          type: "boolean",
          defaultValue: true,
          width: "half",
        },
      ],
      tableColumns: [
        { key: "name", label: "Nome", sortable: true },
        { key: "profession", label: "Profissão", sortable: true },
        { key: "phone", label: "Telefone" },
        { key: "email", label: "Email" },
        { key: "address.city", label: "Cidade", type: "relation-display" },
        {
          key: "isActive",
          label: "Status",
          type: "badge",
          sortable: true,
          badgeConfig: {
            trueValue: {
              label: "Ativo",
              className: "bg-green-100 text-green-800",
            },
            falseValue: {
              label: "Inativo",
              className: "bg-gray-100 text-gray-800",
            },
          },
        },
      ],
      filterOptions: [
        {
          key: "isActive",
          label: "Status",
          type: "boolean",
        },
        {
          key: "profession",
          label: "Profissão",
          type: "text",
        },
        {
          key: "address.city",
          label: "Cidade",
          type: "text",
        },
      ],
    },
  },

  "love-decorations": {
    name: "Amantes de Decoração",
    path: "/admin/love-decorations",
    crudConfig: {
      name: "Amantes de Decoração",
      endpoint: buildApiUrl(API_CONFIG.ENDPOINTS.LOVE_DECORATIONS),
      displayField: "name",
      searchFields: ["name", "contact", "instagram"],
      defaultSort: { field: "name", direction: "asc" },
      fields: [
        {
          key: "name",
          label: "Nome",
          type: "text",
          required: true,
          placeholder: "Nome completo",
          width: "half",
        },
        {
          key: "contact",
          label: "Contato",
          type: "phone",
          required: true,
          placeholder: "(00) 00000-0000",
          width: "half",
        },
        {
          key: "instagram",
          label: "Instagram",
          type: "text",
          required: true,
          placeholder: "@usuario",
          width: "half",
        },
        {
          key: "tiktok",
          label: "TikTok",
          type: "text",
          required: true,
          placeholder: "@usuario",
          width: "half",
        },
      ],
      tableColumns: [
        { key: "name", label: "Nome", sortable: true },
        { key: "contact", label: "Contato" },
        { key: "instagram", label: "Instagram" },
        { key: "tiktok", label: "TikTok" },
      ],
    },
  },

  communities: {
    name: "Comunidades",
    path: "/admin/communities",
    crudConfig: {
      name: "Comunidades",
      endpoint: buildApiUrl(API_CONFIG.ENDPOINTS.COMMUNITIES),
      displayField: "name",
      searchFields: ["name", "description"],
      defaultSort: { field: "name", direction: "asc" },
      fields: [
        {
          key: "name",
          label: "Nome",
          type: "text",
          required: true,
          placeholder: "Nome da comunidade",
          width: "half",
        },
        {
          key: "description",
          label: "Descrição",
          type: "textarea",
          placeholder: "Descrição da comunidade",
          width: "full",
        },
        {
          key: "color",
          label: "Cor",
          type: "text",
          required: true,
          placeholder: "#FF0000",
          width: "half",
        },
        {
          key: "icon",
          label: "Ícone",
          type: "text",
          required: true,
          placeholder: "home",
          width: "half",
        },
      ],
      tableColumns: [
        { key: "name", label: "Nome", sortable: true },
        { key: "description", label: "Descrição" },
        { key: "color", label: "Cor" },
        { key: "icon", label: "Ícone" },
      ],
    },
  },

  posts: {
    name: "Posts",
    path: "/admin/posts",
    crudConfig: {
      name: "Posts",
      endpoint: buildApiUrl(API_CONFIG.ENDPOINTS.POSTS),
      displayField: "title",
      searchFields: ["title", "content"],
      defaultSort: { field: "createdAt", direction: "desc" },
      fields: [
        {
          key: "title",
          label: "Título",
          type: "text",
          required: true,
          placeholder: "Título do post",
          width: "half",
        },
        {
          key: "content",
          label: "Conteúdo",
          type: "textarea",
          required: true,
          placeholder: "Conteúdo do post",
          width: "full",
        },
        {
          key: "authorId",
          label: "Autor",
          type: "relation",
          required: true,
          width: "half",
          relationConfig: {
            endpoint: buildApiUrl(API_CONFIG.ENDPOINTS.USERS),
            displayField: "email",
            valueField: "id",
            searchFields: ["email"],
          },
        },
        {
          key: "communityId",
          label: "Comunidade",
          type: "relation",
          required: true,
          width: "half",
          relationConfig: {
            endpoint: buildApiUrl(API_CONFIG.ENDPOINTS.COMMUNITIES),
            displayField: "name",
            valueField: "id",
            searchFields: ["name"],
          },
        },
      ],
      tableColumns: [
        { key: "title", label: "Título", sortable: true },
        {
          key: "authorId",
          label: "Autor",
          type: "relation",
          relationConfig: {
            endpoint: buildApiUrl(API_CONFIG.ENDPOINTS.USERS),
            displayField: "email",
          },
        },
        {
          key: "communityId",
          label: "Comunidade",
          type: "relation",
          relationConfig: {
            endpoint: buildApiUrl(API_CONFIG.ENDPOINTS.COMMUNITIES),
            displayField: "name",
          },
        },
        {
          key: "createdAt",
          label: "Criado em",
          type: "date",
          sortable: true,
        },
      ],
      filterOptions: [
        {
          key: "communityId",
          label: "Comunidade",
          type: "relation",
          relationConfig: {
            endpoint: buildApiUrl(API_CONFIG.ENDPOINTS.COMMUNITIES),
            displayField: "name",
            valueField: "id",
          },
        },
      ],
    },
  },

  hashtags: {
    name: "Hashtags",
    path: "/admin/hashtags",
    crudConfig: {
      name: "Hashtags",
      endpoint: buildApiUrl(API_CONFIG.ENDPOINTS.HASHTAGS),
      displayField: "name",
      searchFields: ["name"],
      defaultSort: { field: "name", direction: "asc" },
      fields: [
        {
          key: "name",
          label: "Nome",
          type: "text",
          required: true,
          placeholder: "#hashtag",
          width: "full",
        },
      ],
      tableColumns: [{ key: "name", label: "Nome", sortable: true }],
    },
  },

  likes: {
    name: "Curtidas",
    path: "/admin/likes",
    crudConfig: {
      name: "Curtidas",
      endpoint: buildApiUrl(API_CONFIG.ENDPOINTS.LIKES),
      displayField: "id",
      searchFields: [],
      defaultSort: { field: "createdAt", direction: "desc" },
      fields: [
        {
          key: "userId",
          label: "Usuário",
          type: "relation",
          required: true,
          width: "half",
          relationConfig: {
            endpoint: buildApiUrl(API_CONFIG.ENDPOINTS.USERS),
            displayField: "email",
            valueField: "id",
            searchFields: ["email"],
          },
        },
        {
          key: "postId",
          label: "Post",
          type: "relation",
          required: true,
          width: "half",
          relationConfig: {
            endpoint: buildApiUrl(API_CONFIG.ENDPOINTS.POSTS),
            displayField: "title",
            valueField: "id",
            searchFields: ["title"],
          },
        },
      ],
      tableColumns: [
        {
          key: "userId",
          label: "Usuário",
          type: "relation",
          relationConfig: {
            endpoint: buildApiUrl(API_CONFIG.ENDPOINTS.USERS),
            displayField: "email",
          },
        },
        {
          key: "postId",
          label: "Post",
          type: "relation",
          relationConfig: {
            endpoint: buildApiUrl(API_CONFIG.ENDPOINTS.POSTS),
            displayField: "title",
          },
        },
        {
          key: "createdAt",
          label: "Data",
          type: "date",
          sortable: true,
        },
      ],
    },
  },

  comments: {
    name: "Comentários",
    path: "/admin/comments",
    crudConfig: {
      name: "Comentários",
      endpoint: buildApiUrl(API_CONFIG.ENDPOINTS.COMMENTS),
      displayField: "content",
      searchFields: ["content"],
      defaultSort: { field: "createdAt", direction: "desc" },
      fields: [
        {
          key: "content",
          label: "Conteúdo",
          type: "textarea",
          required: true,
          placeholder: "Conteúdo do comentário",
          width: "full",
        },
        {
          key: "userId",
          label: "Usuário",
          type: "relation",
          required: true,
          width: "half",
          relationConfig: {
            endpoint: buildApiUrl(API_CONFIG.ENDPOINTS.USERS),
            displayField: "email",
            valueField: "id",
            searchFields: ["email"],
          },
        },
        {
          key: "postId",
          label: "Post",
          type: "relation",
          required: true,
          width: "half",
          relationConfig: {
            endpoint: buildApiUrl(API_CONFIG.ENDPOINTS.POSTS),
            displayField: "title",
          },
        },
      ],
      tableColumns: [
        { key: "content", label: "Conteúdo", sortable: true },
        {
          key: "userId",
          label: "Usuário",
          type: "relation",
          relationConfig: {
            endpoint: buildApiUrl(API_CONFIG.ENDPOINTS.USERS),
            displayField: "email",
          },
        },
        {
          key: "postId",
          label: "Post",
          type: "relation",
          relationConfig: {
            endpoint: buildApiUrl(API_CONFIG.ENDPOINTS.POSTS),
            displayField: "title",
          },
        },
        {
          key: "createdAt",
          label: "Criado em",
          type: "date",
          sortable: true,
        },
      ],
    },
  },

  notifications: {
    name: "Notificações",
    path: "/admin/notifications",
    crudConfig: {
      name: "Notificações",
      endpoint: buildApiUrl(API_CONFIG.ENDPOINTS.NOTIFICATIONS),
      displayField: "title",
      searchFields: ["title", "message"],
      defaultSort: { field: "createdAt", direction: "desc" },
      fields: [
        {
          key: "type",
          label: "Tipo",
          type: "select",
          required: true,
          width: "third",
          options: [
            { value: "LIKE", label: "Curtida" },
            { value: "COMMENT", label: "Comentário" },
          ],
        },
        {
          key: "title",
          label: "Título",
          type: "text",
          required: true,
          placeholder: "Título da notificação",
          width: "half",
        },
        {
          key: "message",
          label: "Mensagem",
          type: "textarea",
          required: true,
          placeholder: "Mensagem da notificação",
          width: "full",
        },
        {
          key: "isRead",
          label: "Lida",
          type: "boolean",
          defaultValue: false,
          width: "third",
        },
        {
          key: "userId",
          label: "Usuário",
          type: "relation",
          required: true,
          width: "half",
          relationConfig: {
            endpoint: buildApiUrl(API_CONFIG.ENDPOINTS.USERS),
            displayField: "email",
            valueField: "id",
            searchFields: ["email"],
          },
        },
        {
          key: "postId",
          label: "Post",
          type: "relation",
          width: "half",
          relationConfig: {
            endpoint: buildApiUrl(API_CONFIG.ENDPOINTS.POSTS),
            displayField: "title",
            valueField: "id",
            searchFields: ["title"],
          },
        },
      ],
      tableColumns: [
        { key: "title", label: "Título", sortable: true },
        { key: "type", label: "Tipo", sortable: true },
        {
          key: "isRead",
          label: "Status",
          type: "badge",
          sortable: true,
          badgeConfig: {
            trueValue: {
              label: "Lida",
              className: "bg-green-100 text-green-800",
            },
            falseValue: {
              label: "Não lida",
              className: "bg-yellow-100 text-yellow-800",
            },
          },
        },
        {
          key: "createdAt",
          label: "Criada em",
          type: "date",
          sortable: true,
        },
      ],
      filterOptions: [
        {
          key: "type",
          label: "Tipo",
          type: "select",
          options: [
            { value: "LIKE", label: "Curtida" },
            { value: "COMMENT", label: "Comentário" },
          ],
        },
        {
          key: "isRead",
          label: "Status",
          type: "boolean",
        },
      ],
    },
  },

  reports: {
    name: "Denúncias",
    path: "/admin/reports",
    crudConfig: {
      name: "Denúncias",
      endpoint: buildApiUrl(API_CONFIG.ENDPOINTS.REPORTS),
      displayField: "reason",
      searchFields: ["reason", "description"],
      defaultSort: { field: "createdAt", direction: "desc" },
      fields: [
        {
          key: "reason",
          label: "Motivo",
          type: "text",
          required: true,
          placeholder: "Motivo da denúncia",
          width: "half",
        },
        {
          key: "description",
          label: "Descrição",
          type: "textarea",
          placeholder: "Descrição detalhada",
          width: "full",
        },
        {
          key: "targetId",
          label: "ID do Alvo",
          type: "text",
          required: true,
          placeholder: "ID do item denunciado",
          width: "half",
        },
        {
          key: "targetType",
          label: "Tipo do Alvo",
          type: "text",
          required: true,
          placeholder: "Ex: post, user",
          width: "half",
        },
        {
          key: "userId",
          label: "Usuário",
          type: "relation",
          required: true,
          width: "full",
          relationConfig: {
            endpoint: buildApiUrl(API_CONFIG.ENDPOINTS.USERS),
            displayField: "email",
            valueField: "id",
            searchFields: ["email"],
          },
        },
      ],
      tableColumns: [
        { key: "reason", label: "Motivo", sortable: true },
        { key: "targetType", label: "Tipo", sortable: true },
        {
          key: "userId",
          label: "Denunciante",
          type: "relation",
          relationConfig: {
            endpoint: buildApiUrl(API_CONFIG.ENDPOINTS.USERS),
            displayField: "email",
          },
        },
        {
          key: "createdAt",
          label: "Data",
          type: "date",
          sortable: true,
        },
      ],
      filterOptions: [
        {
          key: "targetType",
          label: "Tipo do Alvo",
          type: "text",
        },
      ],
    },
  },

  professions: {
    name: "Profissões",
    path: "/admin/professions",
    crudConfig: {
      name: "Profissões",
      endpoint: buildApiUrl(API_CONFIG.ENDPOINTS.PROFESSIONS),
      displayField: "name",
      searchFields: ["name", "description"],
      defaultSort: { field: "name", direction: "asc" },
      fields: [
        {
          key: "name",
          label: "Nome",
          type: "text",
          required: true,
          placeholder: "Nome da profissão",
          width: "half",
        },
        {
          key: "description",
          label: "Descrição",
          type: "textarea",
          placeholder: "Descrição da profissão",
          width: "full",
        },
      ],
      tableColumns: [
        { key: "name", label: "Nome", sortable: true },
        { key: "description", label: "Descrição" },
      ],
    },
  },

  "social-media": {
    name: "Redes Sociais",
    path: "/admin/social-media",
    crudConfig: {
      name: "Redes Sociais",
      endpoint: buildApiUrl(API_CONFIG.ENDPOINTS.SOCIAL_MEDIA),
      displayField: "id",
      searchFields: ["linkedin", "instagram", "whatsapp"],
      defaultSort: { field: "id", direction: "desc" },
      fields: [
        {
          key: "linkedin",
          label: "LinkedIn",
          type: "text",
          placeholder: "URL do LinkedIn",
          width: "third",
        },
        {
          key: "instagram",
          label: "Instagram",
          type: "text",
          placeholder: "URL do Instagram",
          width: "third",
        },
        {
          key: "whatsapp",
          label: "WhatsApp",
          type: "phone",
          placeholder: "(00) 00000-0000",
          width: "third",
        },
      ],
      tableColumns: [
        { key: "linkedin", label: "LinkedIn" },
        { key: "instagram", label: "Instagram" },
        { key: "whatsapp", label: "WhatsApp" },
      ],
    },
  },

  "available-days": {
    name: "Dias Disponíveis",
    path: "/admin/available-days",
    crudConfig: {
      name: "Dias Disponíveis",
      endpoint: buildApiUrl(API_CONFIG.ENDPOINTS.AVAILABLE_DAYS),
      displayField: "dayOfWeek",
      searchFields: [],
      defaultSort: { field: "dayOfWeek", direction: "asc" },
      fields: [
        {
          key: "dayOfWeek",
          label: "Dia da Semana",
          type: "select",
          required: true,
          width: "half",
          options: [
            { value: "MONDAY", label: "Segunda-feira" },
            { value: "TUESDAY", label: "Terça-feira" },
            { value: "WEDNESDAY", label: "Quarta-feira" },
            { value: "THURSDAY", label: "Quinta-feira" },
            { value: "FRIDAY", label: "Sexta-feira" },
            { value: "SATURDAY", label: "Sábado" },
            { value: "SUNDAY", label: "Domingo" },
          ],
        },
        {
          key: "recommendedProfessionalId",
          label: "Profissional Recomendado",
          type: "relation",
          required: true,
          width: "half",
          relationConfig: {
            endpoint: buildApiUrl(
              API_CONFIG.ENDPOINTS.RECOMMENDED_PROFESSIONALS
            ),
            displayField: "name",
            valueField: "id",
            searchFields: ["name"],
          },
        },
      ],
      tableColumns: [
        { key: "dayOfWeek", label: "Dia da Semana", sortable: true },
        {
          key: "recommendedProfessionalId",
          label: "Profissional",
          type: "relation",
          relationConfig: {
            endpoint: buildApiUrl(
              API_CONFIG.ENDPOINTS.RECOMMENDED_PROFESSIONALS
            ),
            displayField: "name",
          },
        },
      ],
      filterOptions: [
        {
          key: "dayOfWeek",
          label: "Dia da Semana",
          type: "select",
          options: [
            { value: "MONDAY", label: "Segunda-feira" },
            { value: "TUESDAY", label: "Terça-feira" },
            { value: "WEDNESDAY", label: "Quarta-feira" },
            { value: "THURSDAY", label: "Quinta-feira" },
            { value: "FRIDAY", label: "Sexta-feira" },
            { value: "SATURDAY", label: "Sábado" },
            { value: "SUNDAY", label: "Domingo" },
          ],
        },
      ],
    },
  },
};
