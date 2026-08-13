import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Spells - Portfolio",
  description: "AI Spells and neural models coming soon.",
};

export default function SpellsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
