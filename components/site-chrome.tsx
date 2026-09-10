"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer, type FooterContact } from "@/components/footer";
import { cn } from "@/lib/utils";

export function SiteChrome({
  children,
  contact,
}: {
  children: React.ReactNode;
  contact?: FooterContact;
}) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");

  if (isDashboard) {
    return <main className="flex-1">{children}</main>;
  }

  // The navbar is sticky, so it occupies its own row in the flow. Only the
  // home page pulls its hero back up underneath it, so the bar can float over
  // the photograph before the first scroll.
  const hasHero = pathname === "/";

  return (
    <>
      <Navbar />
      <main className={cn("flex-1", hasHero && "-mt-18")}>{children}</main>
      <Footer contact={contact} />
    </>
  );
}
