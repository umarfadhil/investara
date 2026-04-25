"use client";

import { Globe2 } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { languages } from "@/lib/i18n";

export function LanguageSwitcher() {
  return (
    <Select defaultValue="en">
      <SelectTrigger
        aria-label="Select language"
        className="h-9 w-[148px] border-border/80 bg-secondary/60 text-xs"
      >
        <Globe2 className="mr-2 h-4 w-4 text-primary" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {languages.map((language) => (
          <SelectItem key={language.code} value={language.code}>
            {language.nativeLabel}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

