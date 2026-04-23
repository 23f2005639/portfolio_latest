import { profile } from "@/data/profile";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background py-8">
      <div className="mx-auto max-w-6xl px-6 flex items-center justify-between gap-4">
        <p className="font-heading text-sm font-light text-muted-foreground">
          {profile.name}
        </p>
        <p className="font-mono text-xs text-muted-foreground/50">
          © 2025
        </p>
      </div>
    </footer>
  );
}
