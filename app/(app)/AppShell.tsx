"use client";

import { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Palette,
  CreditCard,
  Settings,
  ExternalLink,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/customize", label: "Customize", icon: Palette },
  { href: "/billing", label: "Billing", icon: CreditCard },
  { href: "/settings", label: "Settings", icon: Settings },
] as const;

interface Props {
  children: React.ReactNode;
  workspaceName: string;
  plan: string;
  email: string;
  token: string;
}

export default function AppShell({ children, workspaceName, plan, email, token }: Props) {
  const [open, setOpen] = useState(false);
  const isPro = plan === "pro";

  const SidebarBody = (
    <>
      <div className="h-16 flex items-center px-5 border-b border-white/5">
        <Link href="/dashboard" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <Logo size={28} className="rounded-md shadow-[0_0_10px_rgba(99,102,241,0.4)]" />
          <span className="font-bold text-zinc-100 tracking-tight">Wallflow</span>
        </Link>
      </div>

      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5">
        {NAV.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-zinc-400 hover:text-zinc-100 hover:bg-white/5 rounded-lg transition-colors"
          >
            <Icon className="w-4 h-4" />
            {label}
          </Link>
        ))}

        <div className="my-2 border-t border-white/5" />

        {token && (
          <>
            <a
              href={`/collect/${token}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Collect form
            </a>
            <a
              href={`/widget/${token}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              View widget
            </a>
          </>
        )}
      </nav>

      <div className="px-3 py-3 border-t border-white/5">
        <form action="/api/auth/signout" method="POST">
          <button
            type="submit"
            className="flex w-full items-center gap-3 px-3 py-2 text-sm text-zinc-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </form>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#09090B] text-zinc-100 flex">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-60 fixed top-0 bottom-0 left-0 bg-[#09090B] border-r border-white/5 flex-col z-40">
        {SidebarBody}
      </aside>

      {/* Mobile drawer */}
      {open && (
        <>
          <div
            className="md:hidden fixed inset-0 bg-black/60 z-40"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <aside className="md:hidden w-60 fixed top-0 bottom-0 left-0 bg-[#09090B] border-r border-white/5 flex flex-col z-50">
            {SidebarBody}
          </aside>
        </>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen md:ml-60">
        <header className="h-16 bg-[#09090B]/80 backdrop-blur border-b border-white/5 flex items-center px-4 sm:px-6 gap-3 sticky top-0 z-30">
          <button
            onClick={() => setOpen(true)}
            className="md:hidden text-zinc-400 hover:text-zinc-100 transition-colors"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <p className="font-semibold text-zinc-200 text-sm truncate">{workspaceName}</p>
          <span
            className={`text-xs font-bold px-2 py-0.5 rounded-full ${
              isPro
                ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                : "bg-white/5 text-zinc-500 border border-white/10"
            }`}
          >
            {isPro ? "PRO" : "FREE"}
          </span>
          <div className="ml-auto text-xs text-zinc-500 truncate hidden sm:block">{email}</div>
        </header>

        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>

      {/* Close button for mobile drawer */}
      {open && (
        <button
          onClick={() => setOpen(false)}
          className="md:hidden fixed top-4 right-4 z-50 text-zinc-400 hover:text-zinc-100"
          aria-label="Close navigation menu"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
