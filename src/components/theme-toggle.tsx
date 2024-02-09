import { useTheme } from "next-themes";
import { Switch } from "@/components/core/switch"
import {
  SunIcon,
  MoonIcon,
} from "@heroicons/react/24/outline";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <button
      type="button"
      className="w-full -mx-2 -mb-2 p-2 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 hover:dark:bg-zinc-900 hover:text-indigo-600 group flex gap-x-3 rounded-md text-sm font-semibold leading-6"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      {theme === "light" ? (
        <MoonIcon className="text-zinc-400 group-hover:text-indigo-600 h-6 w-6 shrink-0" aria-hidden="true" />
      ) : (
        <SunIcon className="text-zinc-400 group-hover:text-indigo-600 h-6 w-6 shrink-0" aria-hidden="true" />
      )}
      Theme Toggle
    </button>
  )
}
