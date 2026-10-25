'use client'

import Link from 'next/link'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

interface MobileMenuProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  navLinks: Array<{ href: string; label: string }>
  isActive: (href: string) => boolean
  isLoggedIn: boolean
  onLogout: () => void
}

export default function MobileMenu({
  isOpen, onOpenChange, navLinks, isActive, isLoggedIn, onLogout,
}: MobileMenuProps) {
  const close = () => onOpenChange(false)

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full p-0 sm:w-96">
        <SheetHeader className="border-b px-6 py-4">
          <SheetTitle className="text-xl font-bold">Menu</SheetTitle>
        </SheetHeader>

        <div className="flex h-full flex-col">
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <nav className="space-y-1" aria-label="Mobile navigation">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={close}
                  className={`block rounded-lg px-4 py-3 transition-colors ${
                    isActive(link.href)
                      ? 'bg-accent font-semibold text-accent-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <Separator />

          <div className="space-y-3 px-6 py-4">
            {isLoggedIn ? (
              <Button variant="outline" className="w-full" onClick={() => { close(); onLogout() }}>
                Logout
              </Button>
            ) : (
              <>
                <Button asChild variant="outline" className="w-full" onClick={close}>
                  <Link href="/auth/login">Sign in</Link>
                </Button>
                <Button asChild className="w-full" onClick={close}>
                  <Link href="/auth/register">Get started</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}