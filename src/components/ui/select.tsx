import * as React from "react"
import { Select as SelectPrimitive } from "@base-ui/react/select"
import { cn } from "@/lib/utils"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowDown01Icon, Tick02Icon } from "@hugeicons/core-free-icons"

export function Select({ ...props }: React.ComponentPropsWithoutRef<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root data-slot="select" {...props} />
}

export function SelectTrigger({ className, children, ...props }: React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      className={cn(
        "flex h-9 w-full items-center justify-between gap-2 rounded-sm bg-zinc-900/80 border border-zinc-800/80 px-3 py-2 text-xs text-white shadow-sm hover:border-zinc-700/80 focus:outline-none transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 font-mono",
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon data-slot="select-icon">
        <HugeiconsIcon icon={ArrowDown01Icon} size={14} className="text-zinc-500 shrink-0" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
}

export function SelectValue({ className, placeholder, ...props }: React.ComponentPropsWithoutRef<typeof SelectPrimitive.Value> & { placeholder?: string }) {
  return (
    <SelectPrimitive.Value
      data-slot="select-value"
      className={cn("truncate text-xs font-medium text-white font-mono", className)}
      placeholder={placeholder}
      {...props}
    />
  )
}

export function SelectContent({
  className,
  children,
  side = "bottom",
  align = "start",
  sideOffset = 6,
  alignItemWithTrigger = false,
  ...props
}: React.ComponentPropsWithoutRef<typeof SelectPrimitive.Popup> & {
  side?: "bottom" | "top" | "left" | "right";
  align?: "start" | "center" | "end";
  sideOffset?: number;
  alignItemWithTrigger?: boolean;
}) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Positioner
        className="isolate z-50 outline-none"
        side={side}
        align={align}
        sideOffset={sideOffset}
        alignItemWithTrigger={alignItemWithTrigger}
      >
        <SelectPrimitive.Popup
          data-slot="select-content"
          className={cn(
            "z-50 min-w-[10rem] max-h-60 overflow-y-auto rounded-md bg-[#16161a] p-1 text-xs text-zinc-200 shadow-[0_10px_38px_rgba(0,0,0,0.8)] border border-zinc-700/80 outline-none animate-in fade-in-0 zoom-in-95 data-[side=bottom]:slide-in-from-top-1 data-[side=top]:slide-in-from-bottom-1 custom-scrollbar font-mono",
            className
          )}
          {...props}
        >
          {children}
        </SelectPrimitive.Popup>
      </SelectPrimitive.Positioner>
    </SelectPrimitive.Portal>
  )
}

export function SelectItem({ className, children, ...props }: React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "relative flex w-full cursor-pointer select-none items-center justify-between rounded-sm px-2.5 py-1.5 text-xs text-zinc-300 outline-none hover:bg-zinc-800 hover:text-white data-[highlighted]:bg-zinc-800 data-[highlighted]:text-white data-[selected]:font-semibold data-[selected]:text-white transition-colors font-mono",
        className
      )}
      {...props}
    >
      <SelectPrimitive.ItemText className="flex-1 truncate">{children}</SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator className="ml-auto shrink-0 pl-2">
        <HugeiconsIcon icon={Tick02Icon} size={14} className="text-white" />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  )
}
