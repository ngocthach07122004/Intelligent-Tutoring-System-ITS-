"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { SunIcon, MoonIcon} from "../../icons"

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="fixed bottom-4 right-4">
      <button
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        className="hover:cursor-pointer w-10 h-10 flex items-center justify-center rounded-full border bg-transparent hover:bg-accent dark:hover:bg-gray-800 transition-colors"
      >
        {theme === "light" ? (
          <MoonIcon />
        ) : (
          <SunIcon  />
        )}
      </button>
    </div>
  )
}
