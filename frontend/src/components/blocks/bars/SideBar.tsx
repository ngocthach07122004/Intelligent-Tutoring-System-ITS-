import clsx from "clsx";
import { usePathname } from "next/navigation"; // Import usePathname
import Link from "next/link"; // Import Link from next/link
import {
  MicrosoftIcon,
  GoogleIcon,
  HomeIcon,
  UsersIcon,
  SettingsIcon,
  PlusIcon,
  FeedbackIcon,
  ChevronLeftIcon,
  LogoIcon,
  MenuIcon, // Import MenuIcon
} from "../../icons";
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
    { title: "Home", route: "/dashboard/home", icon: <HomeIcon size={18} /> },
    { title: "Contacts", route: "/dashboard/contacts", icon: <UsersIcon size={18} /> },
    { title: "Settings", route: "/dashboard/settings", icon: <SettingsIcon size={18} /> },
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
            <MenuIcon size={18} className="text-muted-foreground" />
          </button>
        )}
        {isOpen && (
          <button
            className="ml-auto inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-accent"
            onClick={() => setIsOpen(false)} // Close the sidebar
          >
            <ChevronLeftIcon size={18} className="text-muted-foreground" />
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
              "flex items-center gap-3 rounded px-2 py-2 hover:bg-accent",
              {
                "bg-accent font-bold": pathname === link.route, // Highlight active page
              }
            )}
          >
            {link.icon}
            <span
              className={clsx("text-sm font-medium transition-opacity duration-300", {
                "opacity-0": !isOpen,
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
            { "opacity-0": !isOpen }
          )}
        >
          Favorites
        </p>
        <div className="flex flex-col gap-4 mt-5">
          <div className="flex hover:cursor-pointer items-center gap-3 p-2 rounded-md hover:bg-accent hover:text-foreground transition-colors" >
            <div className="w-[18px] h-[18px] relative shrink-0">
              <Image
                className="rounded-md object-cover"
                alt="Airbnb"
                src="https://demo.achromatic.dev/api/contact-images/d1f1feea-13d0-467b-9ee6-e9e1d3dd05c1?v=51bbe674c4608776218704a0bdc00a18082affe42b946db6d3c80cb579f1829e"
                fill
              />
            </div>
            <span
              className={clsx("text-sm font-medium transition-opacity duration-300", {
                "opacity-0": !isOpen,
              })}
            >
              Airbnb
            </span>
          </div>
          <div className="flex hover:cursor-pointer items-center gap-3 p-2 rounded-md hover:bg-accent hover:text-foreground transition-colors">
            <GoogleIcon size={18} />
            <span
              className={clsx("text-sm font-medium transition-opacity duration-300", {
                "opacity-0": !isOpen,
              })}
            >
              Google
            </span>
          </div>
          <div className="flex hover:cursor-pointer items-center gap-3 p-2 rounded-md hover:bg-accent hover:text-foreground transition-colors">
            <MicrosoftIcon size={18} />
            <span
              className={clsx("text-sm font-medium transition-opacity duration-300", {
                "opacity-0": !isOpen,
              })}
            >
              Microsoft
            </span>
          </div>
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-grow"></div>

      {/* Actions */}
      <div className="border-t pt-4 flex flex-col gap-3 w-full text-nowrap">
        <button className="rounded-md flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground hover:bg-accent px-2 py-2">
          <PlusIcon size={18} />
          <span
            className={clsx("transition-opacity duration-300", {
              "opacity-0": !isOpen,
            })}
          >
            Invite member
          </span>
        </button>
        <button className="rounded-md flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground  hover:bg-accent px-2 py-2">
          <FeedbackIcon size={18} />
          <span
            className={clsx("transition-opacity duration-300", {
              "opacity-0": !isOpen,
            })}
          >
            Feedback
          </span>
        </button>

        <Popover>
          <PopoverTrigger>
            <div className="rounded-md flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground hover:bg-accent px-2 py-2">
              
                <div className="w-[20px] h-[20px] relative shrink-0">
                  <Image
                    className="rounded-full object-cover"
                    alt="User"
                    src={session?.avaUrl || "/user.jpg"} // Use session avatar or fallback
                    fill
                  />
                </div>
              <span
                className={clsx("transition-opacity duration-300", {
                  "opacity-0": !isOpen,
                })}
              >
                {session?.name || "Guest"} {/* Use session name or fallback */}
              </span>
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-4 bg-background rounded-lg shadow-md">
            <div className="flex flex-col gap-2">
              <div className="text-sm font-semibold">{session?.name || "Guest"}</div>
              <div className="text-xs text-muted-foreground">{session?.email || "No email available"}</div>
            </div>
            <div className="mt-4 border-t pt-4 space-y-2">
              <button className="flex items-center justify-between w-full text-sm text-muted-foreground hover:text-foreground hover:bg-accent px-2 py-2 rounded-md">
                <span>Profile</span>
                <span className="text-xs">⇧P</span>
              </button>
              <button className="flex items-center justify-between w-full text-sm text-muted-foreground hover:text-foreground hover:bg-accent px-2 py-2 rounded-md">
                <span>Billing</span>
                <span className="text-xs">⇧B</span>
              </button>
              <button className="flex items-center justify-between w-full text-sm text-muted-foreground hover:text-foreground hover:bg-accent px-2 py-2 rounded-md">
                <span>Command Menu</span>
                <span className="text-xs">⌘K</span>
              </button>
              <div className="flex items-center justify-between w-full text-sm text-muted-foreground hover:bg-accent px-2 py-2 rounded-md">
                <span>Theme</span>
                <div className="flex items-center gap-2">
                    <ThemeSelector />
                </div>
              </div>
              <button className="flex items-center justify-between w-full text-sm text-muted-foreground hover:text-foreground hover:bg-accent px-2 py-2 rounded-md">
                {/* <span>Log out</span> */}
                <Logout/>
                <span className="text-xs">⇧L</span>
              </button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </aside>
  );
}