'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Heart, LayoutDashboard, LogOut, Menu, UserCircle } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Logo } from '@/components/shared/Logo'
import ThemeToggle from '@/components/shared/ThemeToggle'
import logout from '@/service/logout'
import { UserResponse } from '@/types/user'
import SearchBar from './search-bar'
import MobileMenu from './mobile-menu'

type NavbarProps = { user: UserResponse }

function getInitials(name?: string) {
  if (!name) return '?'
  return name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
}

export default function Navbar({ user }: NavbarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isLoggedIn = Boolean(user.success && user.data)
  const userData = user.data
  const role = userData?.role?.toLowerCase()

  const navLinks = isLoggedIn
    ? [
        { href: '/', label: 'Home' },
        { href: '/properties', label: 'Browse' },
        { href: `/dashboard/${role}`, label: 'Dashboard' },
        { href: '/about', label: 'About' },
        { href: '/blog', label: 'Blog' },
        { href: '/contact', label: 'Contact' },
      ]
    : [
        { href: '/', label: 'Home' },
        { href: '/properties', label: 'Browse' },
        { href: '/about', label: 'About' },
        { href: '/blog', label: 'Blog' },
        { href: '/contact', label: 'Contact' },
      ]

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  const handleLogout = async () => {
    await logout()
    router.push('/auth/login')
    router.refresh()
    toast('Logged out')
  }

  return (
    <nav
      className="sticky top-0 z-50 w-full border-b border-border bg-background"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-6">
        <div className="flex items-center gap-6">
          <Logo />
          <div className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-3 py-2 text-sm transition-colors ${
                  isActive(link.href)
                    ? 'bg-accent font-semibold text-accent-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="mx-4 hidden max-w-sm flex-1 xl:flex">
          <SearchBar />
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          {isLoggedIn ? (
            <Popover>
              <PopoverTrigger
                aria-label="Open profile menu"
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary hover:bg-primary/20"
              >
                {getInitials(userData?.name)}
              </PopoverTrigger>
              <PopoverContent align="end" className="w-56 p-2">
                <div className="px-2 py-1.5">
                  <p className="truncate text-sm font-semibold">{userData?.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{userData?.email}</p>
                </div>
                <div className="my-1 h-px bg-border" />
                <Button asChild variant="ghost" className="w-full justify-start">
                  <Link href="/dashboard/profile"><UserCircle className="h-4 w-4" /> Profile</Link>
                </Button>
                <Button asChild variant="ghost" className="w-full justify-start">
                  <Link href={`/dashboard/${role}`}><LayoutDashboard className="h-4 w-4" /> Dashboard</Link>
                </Button>
                {role === 'tenant' && (
                  <Button asChild variant="ghost" className="w-full justify-start">
                    <Link href="/dashboard/tenant/saved"><Heart className="h-4 w-4" /> Saved homes</Link>
                  </Button>
                )}
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  className="w-full justify-start text-destructive hover:text-destructive"
                >
                  <LogOut className="h-4 w-4" /> Logout
                </Button>
              </PopoverContent>
            </Popover>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Button asChild variant="ghost"><Link href="/auth/login">Login</Link></Button>
              <Button asChild><Link href="/auth/register">Get Started</Link></Button>
            </div>
          )}

          <button
            onClick={() => setMobileMenuOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground lg:hidden"
            aria-label="Open menu"
            aria-expanded={mobileMenuOpen}
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        <MobileMenu
          isOpen={mobileMenuOpen}
          onOpenChange={setMobileMenuOpen}
          navLinks={navLinks}
          isActive={isActive}
          isLoggedIn={isLoggedIn}
          onLogout={handleLogout}
        />
      </div>
    </nav>
  )
}