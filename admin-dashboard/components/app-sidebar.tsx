"use client"

import * as React from "react"
import {
  IconChartBar,
  IconDashboard,
  IconHeartHandshake,
  IconInnerShadowTop,
  IconReceipt,
  IconUsers,
} from "@tabler/icons-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useAdminMe } from "@/hooks/queries/use-admin-me"
import { useAuthStatus } from "@/hooks/queries/use-auth-status"

const fallbackUser = {
  name: "Admin",
  email: "admin@wedding-invitation.id",
  avatar: "/avatars/shadcn.jpg",
}

const navMain = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: IconDashboard,
  },
  {
    title: "Undangan",
    url: "/invitations",
    icon: IconHeartHandshake,
  },
  {
    title: "Pembayaran",
    url: "/payments",
    icon: IconReceipt,
  },
  {
    title: "Pelanggan",
    url: "/customers",
    icon: IconUsers,
  },
  {
    title: "Analitik",
    url: "/analytics",
    icon: IconChartBar,
  },
]

const formatNameFromEmail = (value: string) => {
  const prefix = value.split("@")[0] || "Admin"
  const cleaned = prefix.replace(/[._-]+/g, " ").trim()
  if (!cleaned) return "Admin"
  return cleaned
    .split(/\s+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: isAuthed } = useAuthStatus()
  const { data } = useAdminMe(Boolean(isAuthed))

  const user = isAuthed && data
    ? {
        name: formatNameFromEmail(data.email),
        email: data.email,
        avatar: fallbackUser.avatar,
      }
    : fallbackUser

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/dashboard">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Undangan Pernikahan</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
