import { API_BASE_URL } from "@/utils/api"

export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  ENDPOINTS: {
    USERS: "/users",
    PROFESSIONALS: "/professionals",
    PARTNER_SUPPLIERS: "/partner-suppliers",
    ADMIN_PARTNER_SUPPLIERS: "/admin/partner-suppliers",
    ADMIN_PARTNER_SUPPLIERS_PENDING: "/admin/partner-suppliers/pending",
    LOVE_DECORATIONS: "/love-decorations",
    ADDRESSES: "/addresses",
    STORES: "/stores",
    PRODUCTS: "/products",
    EVENTS: "/events",
    EVENT_REGISTRATIONS: "/event-registrations",
    POINT_HISTORY: "/point-history",
    WORKSHOPS: "/workshops",
    WORKSHOP_MODULES: "/workshop-modules",
    COUPONS: "/coupons",
    RECOMMENDED_PROFESSIONALS: "/recommended-professionals",
    COMMUNITIES: "/communities",
    POSTS: "/posts",
    HASHTAGS: "/hashtags",
    LIKES: "/likes",
    COMMENTS: "/comments",
    NOTIFICATIONS: "/notifications",
    REPORTS: "/reports",
    PROFESSIONS: "/professions",
    SOCIAL_MEDIA: "/social-media",
    AVAILABLE_DAYS: "/available-days",
  },
}

// Helper para construir URLs completas
export const buildApiUrl = (endpoint: string) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`
}
