"use client";

import { useEffect, useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";

import { cn } from "@/lib/utils";

type Theme = "light" | "dark";

type ThemeToggleProps = {
  className?: string;
};

const storageKey = "investara-theme";
const listeners = new Set<() => void>();

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
}

function getThemeSnapshot(): Theme {
  if (typeof window === "undefined") {
    return "dark";
  }

  return window.localStorage.getItem(storageKey) === "light" ? "light" : "dark";
}

function getServerThemeSnapshot(): Theme {
  return "dark";
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

function setStoredTheme(theme: Theme) {
  window.localStorage.setItem(storageKey, theme);
  applyTheme(theme);
  listeners.forEach((listener) => listener());
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const theme = useSyncExternalStore(subscribe, getThemeSnapshot, getServerThemeSnapshot);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  function updateTheme(nextTheme: Theme) {
    setStoredTheme(nextTheme);
  }

  return (
    <div
      aria-label="Display mode"
      className={cn(
        "grid grid-cols-2 overflow-hidden rounded-md border border-border/70 bg-card/90 p-1 text-xs shadow-lg shadow-black/10 backdrop-blur",
        className,
      )}
    >
      {[
        { value: "light" as const, label: "Light", icon: Sun },
        { value: "dark" as const, label: "Dark", icon: Moon },
      ].map((option) => {
        const Icon = option.icon;
        const active = theme === option.value;

        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => updateTheme(option.value)}
            className={cn(
              "inline-flex min-w-20 items-center justify-center gap-2 rounded-sm px-3 py-2 font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              active && "bg-primary text-primary-foreground hover:text-primary-foreground",
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
