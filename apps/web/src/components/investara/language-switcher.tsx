"use client";

import { Globe2 } from "lucide-react";

import { useLanguage } from "@/components/investara/language-provider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { languages } from "@/lib/i18n";
import type { LanguageCode } from "@/types/investara";

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <Select value={language} onValueChange={(value: LanguageCode) => setLanguage(value)}>
      <SelectTrigger
        aria-label={t("common.language")}
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
