import clsx from "clsx";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Home,
  Users,
  Settings,
  BookOpen,
  FileText,
  BarChart3,
  UserPlus,
  MessageSquare,
  ChevronLeft,
  Menu,
  User,
  CreditCard,
  Command,
  LogOut,
  Star,
  Building2
} from "lucide-react";
import { LogoIcon } from "../../icons";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import Image from "next/image";
import { useSidebar } from "@/context/SidebarContext";
import { ThemeSelector } from "@/components/widgets/ThemeSwitcher/ThemeSelector";
import { useSession } from "@/context/Sessioncontext";
import { Logout } from "./Logout";

export default function Sidebar() {
  const { isOpen, setIsOpen } = useSidebar();
  const pathname = usePathname(); // Get the current pathname
  const { session } = useSession(); // Fetch session data

  // Navigation configuration array
  const navigationLinks = [
    { title: "Home", route: "/dashboard/home", icon: <Home size={18} /> },
    { title: "Student Management", route: "/dashboard/student-management", icon: <Users size={18} /> },
    { title: "Courses", route: "/dashboard/courses", icon: <BookOpen size={18} /> },
    { title: "Documents", route: "/dashboard/documents", icon: <FileText size={18} /> },
    { title: "Performance", route: "/dashboard/performance", icon: <BarChart3 size={18} /> },
    { title: "Chat", route: "/dashboard/chat", icon: <Users size={18} /> },
    { title: "Forum", route: "/dashboard/forum", icon: <Users size={18} /> },
    { title: "Settings", route: "/dashboard/settings", icon: <Settings size={18} /> },
  ];

  return (
    <aside
      className={clsx(
        "hidden lg:flex fixed z-40 inset-y-0 left-0 bg-background Q overflow-x-hidden border-r p-4 flex-col transition-all duration-300",
        {
          "w-64": isOpen, // Full width when open
          "w-[4.1rem]": !isOpen, // Compact width when collapsed
        }
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-6 w-full justify-between">
        {isOpen ? (
          <div className="flex items-center gap-2">
            <LogoIcon className="text-foreground p-2 border rounded-md w-fit h-fit" />
            <span className="font-bold text-lg">Acme</span>
          </div>
        ) : (
          <button
            className="ml-auto inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-accent"
            onClick={() => setIsOpen(true)} // Open the sidebar
          >
            <Menu size={18} className="text-muted-foreground" />
          </button>
        )}
        {isOpen && (
          <button
            className="ml-auto inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-accent"
            onClick={() => setIsOpen(false)} // Close the sidebar
          >
            <ChevronLeft size={18} className="text-muted-foreground" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="space-y-1 mb-6 w-full">
        {navigationLinks.map((link) => (
          <Link
            key={link.route}
            href={link.route}
            className={clsx(
              "flex items-center rounded-lg hover:bg-accent transition-colors",
              {
                "bg-accent font-semibold": pathname === link.route,
                "gap-3 px-3 py-2": isOpen,
                "justify-center py-2": !isOpen,
              }
            )}
          >
            <div className="shrink-0">
              {link.icon}
            </div>
            <span
              className={clsx("text-sm font-medium transition-opacity duration-300", {
                "opacity-0 w-0": !isOpen,
              })}
            >
              {link.title}
            </span>
          </Link>
        ))}
      </nav>

      {/* Favorites */}
      <div className="mb-6 w-full">
        <p
          className={clsx(
            "text-sm font-semibold text-muted-foreground mb-3 transition-opacity duration-300",
            { "opacity-0 h-0": !isOpen }
          )}
        >
          Favorites
        </p>
        <div className="flex flex-col gap-1">
          <div className={clsx(
            "flex hover:cursor-pointer items-center rounded-lg hover:bg-accent hover:text-foreground transition-colors",
            {
              "gap-3 px-3 py-2": isOpen,
              "justify-center py-2": !isOpen,
            }
          )}>
            <Star size={18} className="shrink-0" />
            <span
              className={clsx("text-sm font-medium transition-opacity duration-300", {
                "opacity-0 w-0": !isOpen,
              })}
            >
              Starred Items
            </span>
          </div>
          <div className={clsx(
            "flex hover:cursor-pointer items-center rounded-lg hover:bg-accent hover:text-foreground transition-colors",
            {
              "gap-3 px-3 py-2": isOpen,
              "justify-center py-2": !isOpen,
            }
          )}>
            <Building2 size={18} className="shrink-0" />
            <span
              className={clsx("text-sm font-medium transition-opacity duration-300", {
                "opacity-0 w-0": !isOpen,
              })}
            >
              Organizations
            </span>
          </div>
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-grow"></div>

      {/* Actions */}
      <div className="border-t pt-4 flex flex-col gap-1 w-full text-nowrap">
        <button className={clsx(
          "rounded-lg flex items-center text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors",
          {
            "gap-3 px-3 py-2": isOpen,
            "justify-center py-2": !isOpen,
          }
        )}>
          <UserPlus size={18} className="shrink-0" />
          <span
            className={clsx("transition-opacity duration-300", {
              "opacity-0 w-0": !isOpen,
            })}
          >
            Invite member
          </span>
        </button>
        <button className={clsx(
          "rounded-lg flex items-center text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors",
          {
            "gap-3 px-3 py-2": isOpen,
            "justify-center py-2": !isOpen,
          }
        )}>
          <MessageSquare size={18} className="shrink-0" />
          <span
            className={clsx("transition-opacity duration-300", {
              "opacity-0 w-0": !isOpen,
            })}
          >
            Feedback
          </span>
        </button>

        <Popover>
          <PopoverTrigger asChild>
            <button className="rounded-lg flex items-center gap-3 text-sm hover:bg-accent px-3 py-2 transition-colors w-full">
              <div className="w-[20px] h-[20px] relative shrink-0">
                <Image
                  className="rounded-full object-cover"
                  alt="User"
                  src={session?.avaUrl || "/user.jpg"}
                  fill
                />
              </div>
              <span
                className={clsx("transition-opacity duration-300 text-left truncate", {
                  "opacity-0": !isOpen,
                })}
              >
                {session?.name || "Guest"}
              </span>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-0 bg-background rounded-lg shadow-lg border" align="end">
            {/* User Info Header */}
            <div className="p-4 border-b">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 relative shrink-0">
                  <Image
                    className="rounded-full object-cover"
                    alt="User"
                    src={session?.avaUrl || "/user.jpg"}
                    fill
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold truncate">{session?.name || "Guest"}</div>
                  <div className="text-xs text-muted-foreground truncate">{session?.email || "No email"}</div>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="p-2 space-y-1">
              <button className="flex items-center gap-3 w-full text-sm hover:bg-accent px-3 py-2 rounded-md transition-colors">
                <User size={16} />
                <span className="flex-1 text-left">Profile</span>
                <span className="text-xs text-muted-foreground">⇧P</span>
              </button>
              <button className="flex items-center gap-3 w-full text-sm hover:bg-accent px-3 py-2 rounded-md transition-colors">
                <CreditCard size={16} />
                <span className="flex-1 text-left">Billing</span>
                <span className="text-xs text-muted-foreground">⇧B</span>
              </button>
              <button className="flex items-center gap-3 w-full text-sm hover:bg-accent px-3 py-2 rounded-md transition-colors">
                <Command size={16} />
                <span className="flex-1 text-left">Command Menu</span>
                <span className="text-xs text-muted-foreground">⌘K</span>
              </button>
              <div className="flex items-center gap-3 w-full text-sm px-3 py-2">
                <Settings size={16} />
                <span className="flex-1 text-left">Theme</span>
                <ThemeSelector />
              </div>
            </div>

            {/* Logout */}
            <div className="p-2 border-t">
              <div className="flex items-center gap-3 w-full text-sm hover:bg-accent px-3 py-2 rounded-md transition-colors">
                <LogOut size={16} />
                <Logout />
                <span className="text-xs text-muted-foreground ml-auto">⇧L</span>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </aside>
  );
}