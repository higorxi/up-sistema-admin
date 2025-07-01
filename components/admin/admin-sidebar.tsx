"use client"
import {
  BarChart3,
  Users,
  Store,
  Heart,
  GraduationCap,
  Calendar,
  Gift,
  Settings,
  ChevronDown,
  LogOut,
  MapPin,
  Bell,
  Flag,
  Mail,
  Home,
  User,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const navigationItems = [
  {
    title: "Dashboard",
    url: "/admin/dashboard",
    icon: BarChart3,
  },
  {
    title: "Usuários",
    url: "/admin/users",
    icon: User,
  },
  {
    title: "Profissionais",
    icon: Users,
    items: [
      {
        title: "Profissionais",
        url: "/admin/professionals",
      },
      {
        title: "Profissionais Indicados",
        url: "/admin/recommended-professionals",
      },
      {
        title: "Profissões",
        url: "/admin/professions",
      },
      {
        title: "Histórico de Pontos",
        url: "/admin/point-history",
        disabled: true, 
      },
    ],
  },
  {
    title: "Parceiros",
    icon: Store,
    items: [
      {
        title: "Fornecedores",
        url: "/admin/partner-suppliers",
      },
      {
        title: "Lojas",
        url: "/admin/stores",
      },
      {
        title: "Produtos",
        url: "/admin/products",
        disabled: true, 
      },
    ],
  },
  {
    title: "Amantes de Decoração",
    url: "/admin/love-decorations",
    icon: Heart,
  },
  {
    title: "Eventos",
    icon: Calendar,
    items: [
      {
        title: "Eventos",
        url: "/admin/events",
      },
      {
        title: "Inscrições",
        url: "/admin/event-registrations",
      },
    ],
  },
  {
    title: "Workshops",
    icon: GraduationCap,
    items: [
      {
        title: "Workshops",
        url: "/admin/workshops",
      },
      {
        title: "Módulos",
        url: "/admin/workshop-modules",
      },
    ],
  },
  {
    title: "Comunidade",
    icon: Home,
    items: [
      {
        title: "Comunidades",
        url: "/admin/communities",
        disabled: false, 
      },
      {
        title: "Posts",
        url: "/admin/posts",
        disabled: true, 
      },
      {
        title: "Comentários",
        url: "/admin/comments",
        disabled: true, 
      },
      {
        title: "Likes",
        url: "/admin/likes",
        disabled: true, 
      },
      {
        title: "Hashtags",
        url: "/admin/hashtags",
        disabled: true, 
      },
    ],
  },
  {
    title: "Endereços",
    url: "/admin/addresses",
    icon: MapPin,
    disabled: true, 
  },
  {
    title: "Notificações",
    url: "/admin/notifications",
    icon: Bell,
    disabled: true, 
  },
  {
    title: "Denúncias",
    url: "/admin/reports",
    icon: Flag,
    disabled: true, 
  },
  {
    title: "E-mails",
    url: "/admin/mail",
    icon: Mail,
    disabled: true, 
  },
  {
    title: "Configurações",
    url: "/admin/settings",
    icon: Settings,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const { logout, user } = useAuth()

  const renderMenuItem = (item: any) => {
    if (item.disabled) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="w-full">
              <SidebarMenuButton
                disabled
                className="text-connection-light/40 cursor-not-allowed opacity-50"
              >
                <item.icon className="h-4 w-4" />
                <span>{item.title}</span>
              </SidebarMenuButton>
            </div>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Em desenvolvimento</p>
          </TooltipContent>
        </Tooltip>
      )
    }

    return (
      <SidebarMenuButton
        asChild
        isActive={pathname === item.url}
        className="text-connection-light/80 hover:bg-connection-secondary hover:text-white data-[active=true]:bg-connection-accent data-[active=true]:text-white"
      >
        <Link href={item.url}>
          <item.icon className="h-4 w-4" />
          <span>{item.title}</span>
        </Link>
      </SidebarMenuButton>
    )
  }

  const renderDropdownItem = (item: any) => {
    if (item.disabled) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="w-full">
              <SidebarMenuButton
                disabled
                className="text-connection-light/40 cursor-not-allowed opacity-50"
              >
                <item.icon className="h-4 w-4" />
                <span>{item.title}</span>
                <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
              </SidebarMenuButton>
            </div>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Em desenvolvimento</p>
          </TooltipContent>
        </Tooltip>
      )
    }

    return (
      <CollapsibleTrigger asChild>
        <SidebarMenuButton className="text-connection-light/80 hover:bg-connection-secondary hover:text-white">
          <item.icon className="h-4 w-4" />
          <span>{item.title}</span>
          <ChevronDown className="ml-auto h-4 w-4" />
        </SidebarMenuButton>
      </CollapsibleTrigger>
    )
  }

  const renderSubMenuItem = (subItem: any) => {
    if (subItem.disabled) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="w-full">
              <SidebarMenuSubButton
                className="text-connection-light/40 cursor-not-allowed opacity-50"
              >
                <span>{subItem.title}</span>
              </SidebarMenuSubButton>
            </div>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Em desenvolvimento</p>
          </TooltipContent>
        </Tooltip>
      )
    }

    return (
      <SidebarMenuSubButton
        asChild
        isActive={pathname === subItem.url}
        className="text-connection-light/70 hover:bg-connection-secondary/50 hover:text-white data-[active=true]:bg-connection-accent/70 data-[active=true]:text-white"
      >
        <Link href={subItem.url}>
          <span>{subItem.title}</span>
        </Link>
      </SidebarMenuSubButton>
    )
  }

  return (
    <TooltipProvider>
      <Sidebar className="border-r border-connection-dark/20 bg-connection-primary">
        <SidebarHeader className="border-b border-connection-dark/20 p-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white">
              <span className="text-sm font-bold text-connection-primary">UP</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-white">UPConnection</p>
              <p className="text-xs text-connection-light/70">Painel de Admin</p>
            </div>
          </div>
          {user && (
            <div className="mt-3 p-2 bg-connection-secondary/30 rounded-lg">
              <p className="text-xs text-connection-light/70">Logado como:</p>
              <p className="text-sm text-white font-medium truncate">{user.email}</p>
            </div>
          )}
        </SidebarHeader>
        <SidebarContent className="overflow-y-auto custom-scrollbar">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {navigationItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    {item.items ? (
                      item.disabled ? (
                        renderDropdownItem(item)
                      ) : (
                        <Collapsible>
                          {renderDropdownItem(item)}
                          <CollapsibleContent>
                            <SidebarMenuSub>
                              {item.items.map((subItem: any) => (
                                <SidebarMenuSubItem key={subItem.title}>
                                  {renderSubMenuItem(subItem)}
                                </SidebarMenuSubItem>
                              ))}
                            </SidebarMenuSub>
                          </CollapsibleContent>
                        </Collapsible>
                      )
                    ) : (
                      renderMenuItem(item)
                    )}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <div className="border-t border-connection-dark/20 p-4">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={logout}
                className="text-connection-light/80 hover:bg-connection-secondary hover:text-white cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                <span>Sair</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
        <SidebarRail />
      </Sidebar>
    </TooltipProvider>
  )
}