"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { profile } from "@/data/profile";
import { Menu, X } from "lucide-react";

const links = [
  { href: "#about",    label: "about" },
  { href: "#projects", label: "projects" },
  { href: "#contact",  label: "contact" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 16);
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 bg-white transition-all duration-200",
        scrolled ? "border-b border-border" : "border-b border-transparent"
      )}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <a href="#" className="font-mono text-xs font-medium text-foreground hover:opacity-60 transition-opacity cursor-pointer">
          {profile.name.split(" ").map(w => w[0]).join("")}<span className="text-muted-foreground">.</span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="link-underline font-mono text-[11px] text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
            >
              {link.label}
            </a>
          ))}
          <a
            href={`mailto:${profile.email}`}
            className="border border-foreground font-mono text-[11px] px-3 py-1.5 text-foreground transition-colors hover:bg-foreground hover:text-white cursor-pointer"
          >
            hire me
          </a>
        </nav>

        <button
          className="md:hidden text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          onClick={() => setOpen(v => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-white md:hidden">
          <nav className="mx-auto max-w-6xl px-6 py-3 flex flex-col gap-0">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="border-b border-border py-3 font-mono text-[11px] text-muted-foreground last:border-none hover:text-foreground transition-colors cursor-pointer"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
