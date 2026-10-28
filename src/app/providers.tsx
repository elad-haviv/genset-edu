"use client";

import type { ReactNode } from "react";
import { I18nProvider } from "@/lib/i18n";
import { ProgressProvider } from "@/lib/progress";
import { AppShell } from "@/components/AppShell";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <I18nProvider>
      <ProgressProvider>
        <AppShell>{children}</AppShell>
      </ProgressProvider>
    </I18nProvider>
  );
}
