import * as React from "react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "./ui/sidebar"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowRight01Icon } from "@hugeicons/core-free-icons"
import type { ViewMode } from "../types"

interface NavItem {
  title: string
  view: ViewMode
  icon?: React.ReactNode
  isActive?: boolean
  items?: {
    title: string
    view: ViewMode
  }[]
}

interface NavMainProps {
  items: NavItem[]
  onSelectView: (view: ViewMode) => void
}

function NavMainItem({
  item,
  onSelectView
}: {
  item: NavItem
  onSelectView: (view: ViewMode) => void
}) {
  const [isOpen, setIsOpen] = React.useState(Boolean(item.isActive))

  React.useEffect(() => {
    if (item.isActive) {
      setIsOpen(true)
    }
  }, [item.isActive])

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full group-data-[collapsible=icon]:w-auto"
    >
      <SidebarMenuItem className="flex flex-col w-full group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center">
        <div className="flex items-center w-full relative group-data-[collapsible=icon]:justify-center">
          <SidebarMenuButton
            tooltip={item.title}
            onClick={() => onSelectView(item.view)}
            render={item.items && item.items.length > 0 ? <div role="button" tabIndex={0} /> : undefined}
            className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:size-9 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:mx-auto ${
              item.isActive
                ? "bg-zinc-800/90 text-white font-semibold border border-white/10 shadow-sm"
                : "text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.04]"
            }`}
          >
            <div className="flex items-center gap-3 min-w-0 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:h-full">
              <span className="shrink-0 flex items-center justify-center group-data-[collapsible=icon]:mx-auto">{item.icon}</span>
              <span className="truncate group-data-[collapsible=icon]:hidden">{item.title}</span>
            </div>

            {item.items && item.items.length > 0 && (
              <CollapsibleTrigger
                onClick={(e) => {
                  e.stopPropagation()
                  setIsOpen((prev) => !prev)
                }}
                render={
                  <button type="button" className="p-0.5 text-zinc-400 hover:text-white rounded transition-colors group-data-[collapsible=icon]:hidden cursor-pointer shrink-0">
                    <HugeiconsIcon
                      icon={ArrowRight01Icon}
                      size={14}
                      className={`transition-transform duration-200 ${
                        isOpen ? "rotate-90 text-white" : ""
                      }`}
                    />
                  </button>
                }
              />
            )}
          </SidebarMenuButton>
        </div>

        {item.items && item.items.length > 0 && (
          <CollapsibleContent className="w-full group-data-[collapsible=icon]:hidden">
            <SidebarMenuSub className="border-l border-zinc-800/80 ml-4 my-1 space-y-0.5 pl-3">
              {item.items.map((subItem) => (
                <SidebarMenuSubItem key={subItem.title}>
                  <SidebarMenuSubButton
                    onClick={() => onSelectView(subItem.view)}
                    className="text-[11px] text-zinc-400 hover:text-white hover:bg-white/[0.04] rounded-lg px-2 py-1 transition-colors cursor-pointer block truncate"
                  >
                    <span>{subItem.title}</span>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        )}
      </SidebarMenuItem>
    </Collapsible>
  )
}

export function NavMain({ items, onSelectView }: NavMainProps) {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:items-center">
      <SidebarGroupLabel className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 px-2 group-data-[collapsible=icon]:hidden">
        Platform Navigation
      </SidebarGroupLabel>
      <SidebarMenu className="space-y-1 group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:w-full">
        {items.map((item) => (
          <NavMainItem key={item.title} item={item} onSelectView={onSelectView} />
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
