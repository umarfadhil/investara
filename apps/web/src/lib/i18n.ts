import type { LanguageCode } from "@/types/investara";

export const languages: Array<{ code: LanguageCode; label: string; nativeLabel: string }> = [
  { code: "en", label: "English", nativeLabel: "English" },
  { code: "zh", label: "Chinese", nativeLabel: "中文" },
  { code: "ja", label: "Japanese", nativeLabel: "日本語" },
  { code: "ko", label: "Korean", nativeLabel: "한국어" },
];

export const defaultLanguage: LanguageCode = "en";

