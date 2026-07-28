import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  DashboardSquare01Icon,
  FolderCheckIcon,
  UserGroupIcon,
  Task01Icon,
  Flag01Icon,
  GitBranchIcon,
  FileCodeIcon,
  FolderCodeIcon,
  Clock01Icon,
  Settings01Icon,
  Folder01Icon,
  MoneyBagIcon,
  Tag01Icon,
  ShieldKeyIcon,
  RocketIcon,
  Notification01Icon,
} from "@hugeicons/core-free-icons"
import { NavMain } from "./nav-main"
import { NavProjects, type NavProjectItem } from "./nav-projects"
import { NavUser } from "./nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "./ui/sidebar"
import type { ViewMode } from "../types"
import { AppLogo } from "./ui/AppLogo"
import { useProjects } from "../modules/projects/hooks/useProjects"
import { useProfileSettings } from "../modules/settings/hooks/useSettings"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  currentView: ViewMode
  onSelectView: (view: ViewMode) => void
  onOpenCreateProject?: () => void
  onLogout?: () => void
}

export function AppSidebar({
  currentView,
  onSelectView,
  onOpenCreateProject,
  onLogout,
  ...props
}: AppSidebarProps) {
  const { data: profile } = useProfileSettings()

  const user = {
    name: profile?.fullName || "Eswar Chinthakayala",
    email: profile?.email || "eswarchinthakayala2004@gmail.com",
    avatar: profile?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
  }

  // Fetch real projects live from Supabase database
  const { data: projectsResult } = useProjects()

  const activeProjects: NavProjectItem[] = React.useMemo(() => {
    const raw =
      (projectsResult as any)?.projects ||
      (Array.isArray(projectsResult) ? projectsResult : [])

    return raw.map((p: any) => ({
      id: String(p.id),
      name: p.name || "Untitled Project",
      view: "projects" as ViewMode,
      icon: <HugeiconsIcon icon={Folder01Icon} size={16} />,
    }))
  }, [projectsResult])

  const navMain = [
    {
      title: "Dashboard Overview",
      view: "dashboard" as ViewMode,
      icon: <HugeiconsIcon icon={DashboardSquare01Icon} size={16} />,
      isActive: currentView === "dashboard",
      items: [
        {
          title: "Developer Telemetry",
          view: "dashboard" as ViewMode,
        },
        {
          title: "Revenue & Billing",
          view: "dashboard" as ViewMode,
        },
      ],
    },
    {
      title: "Client Projects",
      view: "projects" as ViewMode,
      icon: <HugeiconsIcon icon={FolderCheckIcon} size={16} />,
      isActive: currentView === "projects",
      items: [
        {
          title: "Active Contracts",
          view: "projects" as ViewMode,
        },
        {
          title: "Deliverables Table",
          view: "projects" as ViewMode,
        },
      ],
    },
    {
      title: "Client Directory",
      view: "clients" as ViewMode,
      icon: <HugeiconsIcon icon={UserGroupIcon} size={16} />,
      isActive: currentView === "clients",
    },
    {
      title: "Tasks & Kanban",
      view: "tasks" as ViewMode,
      icon: <HugeiconsIcon icon={Task01Icon} size={16} />,
      isActive: currentView === "tasks",
    },
    {
      title: "Milestones & Roadmap",
      view: "milestones" as ViewMode,
      icon: <HugeiconsIcon icon={Flag01Icon} size={16} />,
      isActive: currentView === "milestones",
    },
    {
      title: "GitHub Repositories",
      view: "github" as ViewMode,
      icon: <HugeiconsIcon icon={GitBranchIcon} size={16} />,
      isActive: currentView === "github",
      items: [
        {
          title: "Live Activity Feed",
          view: "github" as ViewMode,
        },
        {
          title: "Repository Sync",
          view: "github" as ViewMode,
        },
      ],
    },
    {
      title: "Documentation & Specs",
      view: "docs" as ViewMode,
      icon: <HugeiconsIcon icon={FileCodeIcon} size={16} />,
      isActive: currentView === "docs",
      items: [
        {
          title: "Architecture Diagrams",
          view: "docs" as ViewMode,
        },
        {
          title: "API Specifications",
          view: "docs" as ViewMode,
        },
      ],
    },
    {
      title: "Files & Vault",
      view: "files" as ViewMode,
      icon: <HugeiconsIcon icon={FolderCodeIcon} size={16} />,
      isActive: currentView === "files",
    },
    {
      title: "Timelines & Roadmap",
      view: "timeline" as ViewMode,
      icon: <HugeiconsIcon icon={Clock01Icon} size={16} />,
      isActive: currentView === "timeline",
    },
    {
      title: "Share Links & Access",
      view: "share-links" as ViewMode,
      icon: <HugeiconsIcon icon={Folder01Icon} size={16} />,
      isActive: currentView === "share-links",
    },
    {
      title: "Payments & Delivery",
      view: "payments" as ViewMode,
      icon: <HugeiconsIcon icon={MoneyBagIcon} size={16} />,
      isActive: currentView === "payments",
    },
    {
      title: "Changelog & Releases",
      view: "changelog" as ViewMode,
      icon: <HugeiconsIcon icon={Tag01Icon} size={16} />,
      isActive: currentView === "changelog",
    },
    {
      title: "Private Admin Notes",
      view: "notes" as ViewMode,
      icon: <HugeiconsIcon icon={ShieldKeyIcon} size={16} />,
      isActive: currentView === "notes",
    },
    {
      title: "Deployments & Envs",
      view: "deployments" as ViewMode,
      icon: <HugeiconsIcon icon={RocketIcon} size={16} />,
      isActive: currentView === "deployments",
    },
    {
      title: "Notification Center",
      view: "notifications" as ViewMode,
      icon: <HugeiconsIcon icon={Notification01Icon} size={16} />,
      isActive: currentView === "notifications",
    },
    {
      title: "Settings & API",
      view: "settings" as ViewMode,
      icon: <HugeiconsIcon icon={Settings01Icon} size={16} />,
      isActive: currentView === "settings",
    },
  ]

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="border-b border-zinc-800/80 px-3.5 py-3 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:justify-center">
        <div className="flex items-center group-data-[collapsible=icon]:justify-center w-full">
          <AppLogo size={28} showText={true} />
        </div>
      </SidebarHeader>
      
      <SidebarContent className="custom-scrollbar">
        <NavMain items={navMain} onSelectView={onSelectView} />
        <NavProjects 
          projects={activeProjects} 
          onSelectView={onSelectView}
          onOpenCreateProject={onOpenCreateProject} 
        />
      </SidebarContent>

      <SidebarFooter className="border-t border-zinc-800/80 pt-2">
        <NavUser user={user} onLogout={onLogout} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}

export default AppSidebar
