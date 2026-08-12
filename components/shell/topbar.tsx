'use client'

import { usePathname } from 'next/navigation'
import { Menu, Search, Bell } from 'lucide-react'
import { navItems } from '@/lib/nav'

export function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const pathname = usePathname()
  const current = navItems.find(
    (item) => pathname === item.href || pathname.startsWith(item.href + '/'),
  )

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-md md:px-6">
      <button
        onClick={onMenuClick}
        aria-label="Open menu"
        className="flex size-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground lg:hidden"
      >
        <Menu className="size-5" />
      </button>

      <div className="flex min-w-0 flex-col">
        <h1 className="truncate font-display text-lg font-bold tracking-tight">
          {current?.label ?? 'Dashboard'}
        </h1>
        <p className="hidden truncate text-xs text-muted-foreground sm:block">
          {current?.description ?? 'Your shop at a glance'}
        </p>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <div className="hidden items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm text-muted-foreground md:flex">
          <Search className="size-4" />
          <input
            className="w-32 bg-transparent outline-none placeholder:text-muted-foreground xl:w-48"
            placeholder="Search products..."
            aria-label="Search products"
          />
        </div>
        <button
          aria-label="Notifications"
          className="relative flex size-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground"
        >
          <Bell className="size-[1.1rem]" />
          <span className="absolute right-2 top-2 size-2 rounded-full bg-primary ring-2 ring-card" />
        </button>
        <div className="flex items-center gap-2.5 rounded-lg border border-border bg-card py-1 pl-1 pr-3">
          <span className="flex size-8 items-center justify-center rounded-md bg-secondary font-display text-sm font-bold text-secondary-foreground">
            RS
          </span>
          <span className="hidden flex-col leading-tight sm:flex">
            <span className="text-sm font-medium">Ravi&apos;s Store</span>
            <span className="text-[0.7rem] text-muted-foreground">Owner</span>
          </span>
        </div>
      </div>
    </header>
  )
}
