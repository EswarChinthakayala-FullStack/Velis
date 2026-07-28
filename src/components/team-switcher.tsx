import * as React from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "./ui/sidebar"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowDown01Icon, Add01Icon } from "@hugeicons/core-free-icons"

export function TeamSwitcher({
  teams,
}: {
  teams: {
    name: string
    logo: React.ReactNode
    plan: string
  }[]
}) {
  const { isMobile } = useSidebar()
  const [activeTeam, setActiveTeam] = React.useState(teams[0])

  if (!activeTeam) return null

  return (
    <SidebarMenu>
      <SidebarMenuItem className="flex justify-center group-data-[collapsible=icon]:justify-center">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-zinc-800/60 transition-colors group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:size-9"
              >
                <div className="flex items-center gap-3 min-w-0 group-data-[collapsible=icon]:justify-center">
                  <div className="flex items-center justify-center shrink-0 [&_svg]:!w-8 [&_svg]:!h-8">
                    {activeTeam.logo}
                  </div>
                  <div className="grid text-left leading-tight truncate group-data-[collapsible=icon]:hidden">
                    <span className="truncate text-xs font-bold text-white">
                      {activeTeam.name}
                    </span>
                    <span className="truncate text-[10px] text-zinc-400 font-mono">
                      {activeTeam.plan}
                    </span>
                  </div>
                </div>
                <HugeiconsIcon icon={ArrowDown01Icon} size={14} className="text-zinc-400 group-data-[collapsible=icon]:hidden" />
              </SidebarMenuButton>
            }
          />
          <DropdownMenuContent
            className="w-56 bg-[rgba(17,17,19,0.95)] backdrop-blur-2xl border border-[rgba(255,255,255,0.08)] rounded-lg text-xs text-zinc-200"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={6}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-[10px] font-mono text-zinc-500 uppercase px-2 py-1">
                Workspace Teams
              </DropdownMenuLabel>
              {teams.map((team, index) => (
                <DropdownMenuItem
                  key={team.name}
                  onClick={() => setActiveTeam(team)}
                  className="gap-2 p-2 cursor-pointer hover:bg-zinc-800/80 rounded-lg"
                >
                  <div className="flex size-5 items-center justify-center rounded bg-zinc-800 border border-zinc-700">
                    {team.logo}
                  </div>
                  <span className="truncate font-medium">{team.name}</span>
                  <DropdownMenuShortcut className="text-[10px] font-mono text-zinc-500">
                    ⌘{index + 1}
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="bg-zinc-800" />
            <DropdownMenuGroup>
              <DropdownMenuItem className="gap-2 p-2 cursor-pointer hover:bg-zinc-800/80 rounded-lg text-zinc-300">
                <HugeiconsIcon icon={Add01Icon} size={14} />
                <span>Add New Organization</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
