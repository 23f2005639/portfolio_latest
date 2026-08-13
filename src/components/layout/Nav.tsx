"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { profile } from "@/data/profile";
import { Menu, X } from "lucide-react";

const links = [
  { href: "#about",    label: "about" },
  { href: "#spells",   label: "spells" },
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
        "fixed inset-x-0 top-0 z-50 bg-white/95 backdrop-blur-xs transition-all duration-200",
        scrolled ? "border-b border-border shadow-xs" : "border-b border-border/50"
      )}
    >
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6">
        {/* Larger SN. Logo */}
        <a href="#" className="font-mono text-xl font-bold tracking-wider text-foreground hover:opacity-75 transition-opacity cursor-pointer flex items-center gap-0.5">
          <span>{profile.name.split(" ").map(w => w[0]).join("")}</span>
          <span className="text-foreground font-bold">.</span>
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="link-underline font-mono text-sm font-medium text-foreground/90 transition-colors hover:text-foreground cursor-pointer tracking-wide"
            >
              {link.label}
            </a>
          ))}
          <a
            href={`mailto:${profile.email}`}
            className="border-2 border-foreground font-mono text-xs font-semibold px-4 py-2 text-foreground transition-colors hover:bg-foreground hover:text-white cursor-pointer tracking-wider"
          >
            HIRE ME
          </a>
        </nav>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-foreground hover:opacity-70 transition-opacity cursor-pointer p-1"
          onClick={() => setOpen(v => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile nav drawer */}
      {open && (
        <div className="border-t border-border bg-white md:hidden shadow-lg">
          <nav className="mx-auto max-w-6xl px-6 py-4 flex flex-col gap-2">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="border-b border-border/60 py-3 font-mono text-sm font-medium text-foreground last:border-none hover:text-foreground transition-colors cursor-pointer"
              >
                {link.label}
              </a>
            ))}
            <a
              href={`mailto:${profile.email}`}
              onClick={() => setOpen(false)}
              className="mt-2 text-center border-2 border-foreground bg-foreground text-white font-mono text-xs font-bold py-2.5 cursor-pointer"
            >
              HIRE ME
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
