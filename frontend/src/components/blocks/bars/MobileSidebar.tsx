import clsx from "clsx";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  HomeIcon,
  UsersIcon,
  SettingsIcon,
  PlusIcon,
  FeedbackIcon,
  LogoIcon,
  MenuIcon,
  ChevronLeftIcon,
  MicrosoftIcon,
  GoogleIcon,
} from "../../icons";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import Image from "next/image";
import { useSidebar } from "@/context/SidebarContext";
import { useEffect } from "react";
import { ThemeSelector } from "@/components/widgets/ThemeSwitcher/ThemeSelector";
import { useSession } from "@/context/Sessioncontext";

export default function MobileSidebar() {
  const { isOpen, setIsOpen } = useSidebar();
  const pathname = usePathname();
  const { session } = useSession(); // Fetch session data
  const navigationLinks = [
    { title: "Home", route: "/dashboard/home", icon: <HomeIcon size={18} /> },
    { title: "Contacts", route: "/dashboard/contacts", icon: <UsersIcon size={18} /> },
    { title: "Settings", route: "/dashboard/settings", icon: <SettingsIcon size={18} /> },
  ];

  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", isOpen);
    return () => document.body.classList.remove("overflow-hidden");
  }, [isOpen]);

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="lg:hidden block fixed inset-0 bg-black bg-opacity-80 z-40 h-screen w-screen"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          "lg:hidden flex w-64 fixed z-40 inset-y-0 left-0 bg-background Q overflow-y-auto border-r p-4 flex-col transition-transform duration-300",
          {
            "translate-x-0": isOpen,
            "-translate-x-full": !isOpen,
          }
        )}
      >
        
        {/* Header */}
        <div className="flex items-center gap-2 mb-6 w-full justify-between">
          <div className="flex items-center gap-2 text-primary">
            <LogoIcon className="p-2 border rounded-md w-fit h-fit" />
            <span className=" font-bold text-lg">Acme</span>
          </div>
          
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
                  "bg-accent font-bold": pathname === link.route,
                }
              )}
            >
              {link.icon}
              <span className="text-sm font-medium">{link.title}</span>
            </Link>
          ))}
        </nav>

        <div className="mb-6 px-2 w-fit">
          <p
            className={clsx(
              "text-sm font-semibold text-muted-foreground mb-3 transition-opacity duration-300",
              { "opacity-0": !isOpen }
            )}
          >
            Favorites
          </p>
          <div className="space-y-3">
            <div className="flex items-center gap-3 w-full">
              <Image
                className="rounded-md"
                alt="Airbnb"
                src="https://demo.achromatic.dev/api/contact-images/d1f1feea-13d0-467b-9ee6-e9e1d3dd05c1?v=51bbe674c4608776218704a0bdc00a18082affe42b946db6d3c80cb579f1829e"
                width={18}
                height={18}
              />
              <span
                className={clsx("text-sm font-medium transition-opacity duration-300", {
                  "opacity-0": !isOpen,
                })}
              >
                Airbnb
              </span>
            </div>
            <div className="flex items-center gap-3">
              <GoogleIcon size={18} />
              <span
                className={clsx("text-sm font-medium transition-opacity duration-300", {
                  "opacity-0": !isOpen,
                })}
              >
                Google
              </span>
            </div>
            <div className="flex items-center gap-3">
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
              <Image
                className="rounded-full"
                alt="User"
                src={session?.avaUrl || "/user.jpg"} // Use session avatar or fallback
                width={30}
                height={30}
              />
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
                    <ThemeSelector/>
                </div>
              </div>
              <button className="flex items-center justify-between w-full text-sm text-muted-foreground hover:text-foreground hover:bg-accent px-2 py-2 rounded-md">
                <span>Log out</span>
                <span className="text-xs">⇧L</span>
              </button>
            </div>
          </PopoverContent>
        </Popover>
        </div>
      </aside>
    </>
  );
}
