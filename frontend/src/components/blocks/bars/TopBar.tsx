"use client"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { InfoIcon, MenuIcon } from "../../icons";
import { useSidebar } from "@/context/SidebarContext";

interface HomeTopBarProps {
  title: string;
  tooltipMessage?: string;
  actions?: React.ReactNode[];
}

export default function TopBar({ title, tooltipMessage, actions = [] }: HomeTopBarProps) {
  const { isOpen, setIsOpen } = useSidebar();
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <div className="flex w-full flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            className="lg:hidden ml-auto inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-accent"
            onClick={() => setIsOpen(!isOpen)} // Open the sidebar
          >
            <MenuIcon size={18} className="text-muted-foreground" />
          </button>
          <h1 className="text-base font-semibold">{title}</h1>
          {tooltipMessage && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <InfoIcon size={10} />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{tooltipMessage}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        <div className="flex items-center gap-2">
          {actions.map((action, index) => (
            <div
              key={index}
              className="inline-flex items-center justify-center rounded-md transition-colors hover:bg-accent hover:text-accent-foreground size-9"
            >
              {action}
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}