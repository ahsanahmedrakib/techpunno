"use client";

import { site } from "@/data/site";
import {
  tableKeys,
  tables,
  type TableKey,
} from "@/lib/tables";
import {
  ArrowLeft,
  BadgeCheck,
  Calendar,
  Clapperboard,
  ClipboardList,
  FileText,
  HeartHandshake,
  Home,
  LayoutDashboard,
  Mail,
  Medal,
  Menu,
  Newspaper,
  Star,
  Trash2,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const tableIcons: Record<TableKey, LucideIcon> = {
  advisors: Users,
  coreteam: Star,
  blogs: FileText,
  events: Calendar,
  hero: Home,
  news: Newspaper,
  videos: Clapperboard,
  quizsets: ClipboardList,
  contacts: Mail,
  certificates: Medal,
  certificateconfig: BadgeCheck,
  volunteers: HeartHandshake,
  volunteerconfig: Wallet,
};

export default function AdminSidebar({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-cream">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-ink/40 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-ink text-white shadow-2xl shadow-ink/30 transition-transform duration-200 lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center gap-3 border-b border-white/10 px-5 py-5">
          <span className="relative h-9 w-9 overflow-hidden rounded-xl">
            <Image
              src={site.logo}
              alt={`${site.name} logo`}
              fill
              sizes="40px"
              className="object-cover"
            />
          </span>
          <div>
            <h1 className="text-sm font-bold tracking-wide">TechPunno</h1>
            <p className="text-[11px] text-white/40">Admin Panel</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 scrollbar-thin">
          <Link
            href="/admin"
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
              pathname === "/admin"
                ? "bg-primary text-white shadow-md shadow-primary/30"
                : "text-white/60 hover:bg-white/10 hover:text-white"
            }`}
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 text-sm">
              <LayoutDashboard className="h-4 w-4" />
            </span>
            Dashboard
          </Link>

          <div className="pt-4 pb-1 px-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/25">
              Tables
            </p>
          </div>

          {tableKeys.map((key) => {
            const col = tables[key];
            const href = `/admin/${key}`;
            const active = pathname.startsWith(href);
            const Icon = tableIcons[key];
            return (
              <Link
                key={key}
                href={href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                  active
                    ? "bg-primary text-white shadow-md shadow-primary/30"
                    : "text-white/60 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-lg ${
                    active ? "bg-white/20" : "bg-white/5"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </span>
                {col.label}
              </Link>
            );
          })}

          <Link
            href="/admin/deleted"
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
              pathname.startsWith("/admin/deleted")
                ? "bg-primary text-white shadow-md shadow-primary/30"
                : "text-white/60 hover:bg-white/10 hover:text-white"
            }`}
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/5">
              <Trash2 className="h-4 w-4" />
            </span>
            Deleted Data
          </Link>
        </nav>

        <div className="border-t border-white/10 p-3">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/40 transition-all hover:bg-white/10 hover:text-white"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/5">
              <ArrowLeft className="h-4 w-4" />
            </span>
            Back to site
          </Link>
        </div>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex items-center gap-4 border-b-2 border-primary/20 bg-white px-6 py-4 shadow-sm lg:px-8">
          <button
            onClick={() => setSidebarOpen(true)}
            className="cursor-pointer rounded-xl border border-ink/10 p-2 text-ink transition-colors hover:bg-mist lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          <h2 className="text-lg font-bold text-ink">
            {(() => {
              if (pathname === "/admin") return "Dashboard";
              const parts = pathname.split("/").filter(Boolean);
              if (parts.length >= 2) {
                const key = parts[1];
                if (key === "contacts" && parts.length > 2)
                  return "Contact Detail";
                if (key === "deleted") return "Deleted Data";
                if (isTableKey(key)) return tables[key].label;
              }
              return "Admin";
            })()}
          </h2>
        </header>

        <main className="flex-1 overflow-y-auto p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

function isTableKey(key: string): key is TableKey {
  return key in tables;
}

