"use client";

import { useEffect, useState } from "react";
import { profile } from "@/data/profile";

export function Footer() {
  const [year, setYear] = useState(2025);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="border-t border-border bg-background py-8">
      <div className="mx-auto max-w-6xl px-6 flex items-center justify-between gap-4">
        <p className="font-heading text-sm font-light text-muted-foreground">
          {profile.name}
        </p>
        <p className="font-mono text-xs text-muted-foreground/50">
          © {year}
        </p>
      </div>
    </footer>
  );
}
