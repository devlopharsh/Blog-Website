"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, PenSquare, ScrollText } from "lucide-react";

import { clearAuth, getStoredUser, isLoggedIn } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/blogs", label: "Blogs" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const loggedIn = isLoggedIn();
  const user = getStoredUser();

  return (
    <header className="sticky top-0 z-30 border-b border-border/80 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/25">
            <ScrollText className="size-5" />
          </div>
          <div>
            <p className="font-serif text-2xl font-semibold leading-none">Inkspire CMS</p>
            <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
              Editorial control
            </p>
          </div>
        </Link>

        <div className="hidden items-center gap-2 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground",
                pathname === item.href && "bg-secondary text-secondary-foreground",
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {loggedIn ? (
            <>
              <Badge variant="default" className="hidden sm:inline-flex">
                {user?.email ?? "Authenticated"}
              </Badge>
              <Button asChild size="sm" className="hidden sm:inline-flex">
                <Link href="/add">
                  <PenSquare />
                  Add Post
                </Link>
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  clearAuth();
                  router.push("/login");
                  router.refresh();
                }}
              >
                <LogOut />
                <span className="sr-only">Logout</span>
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild className="hidden sm:inline-flex">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
