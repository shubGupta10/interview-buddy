"use client"

import { useEffect, useState } from "react"
import { Button } from "./ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { Menu, User, LogOut, X } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import useAuthStore from "@/app/store/useAuthStore"

interface User {
  id: string;
  email: string;
  name: string;
  username?: string;
  provider: string;
  isAdmin: boolean;
  profileImage: string;
}

function Navbar() {
  const { data: session } = useSession()
  const { user, setUser, logout } = useAuthStore()

  const [currentUser, setCurrentUser] = useState<User | null>(null)
  
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (session?.user) {
      setUser({
        id: session.user.id || "",
        email: session.user.email || "",
        name: session.user.name || "",
        provider: session.user.provider || "",
        isAdmin: (session.user as any).isAdmin || false,
        profileImage: session.user.image || "",
      })
    }
  }, [session, setUser])

  useEffect(() => {
    const getCurrentUser = async () => {
      const response = await fetch("/api/user/profile", {
        method: "GET",
        cache: "no-store"
      })
      const data = await response.json()
      setCurrentUser(data.user)
    }
    getCurrentUser()
  }, [])

  return (
    <nav className="sticky top-0 z-50 bg-[#1A1040] border-b border-[#FF2A6D]/30 text-white shadow-lg">
      <div className="container mx-auto">
        <div className="flex items-center justify-between h-16 px-4 md:px-6 lg:px-8">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 hover:text-white">
              <span className="text-2xl font-bold">
                <span className="text-[#FF2A6D]">Interview</span>
                <span className="text-[#9D4EDD]">Buddy</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-6">
              <Link
                href="/"
                className="px-3 py-2 text-[#D1D7E0] hover:text-[#05FFF8] transition-colors"
              >
                Home
              </Link>
              <Link
                href="/dashboard"
                className="px-3 py-2 text-[#D1D7E0] hover:text-[#05FFF8] transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/features"
                className="px-3 py-2 text-[#D1D7E0] hover:text-[#05FFF8] transition-colors"
              >
                Features
              </Link>
              <Link
                href="/pricing"
                className="px-3 py-2 text-[#D1D7E0] hover:text-[#05FFF8] transition-colors"
              >
                Pricing
              </Link>
              {isMounted && currentUser?.isAdmin === true && (
                <Link
                  href="/admin/dashboard"
                  className="px-3 py-2 text-[#D1D7E0] hover:text-[#05FFF8] transition-colors"
                >
                  Admin
                </Link>
              )}
             
            </div>
          </div>

          {/* Action Buttons & User Menu */}
          <div className="flex items-center">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="relative rounded-md bg-[#231651] border border-[#FF2A6D]/30 text-white hover:bg-[#231651]/80 hover:text-[#05FFF8] hover:border-[#05FFF8]/50 transition-all"
                  >
                    <span className="sr-only">Open user menu</span>
                    <div className="flex items-center gap-x-2">
                      <span className="text-sm">{currentUser?.name || user?.name}</span>
                      <div className="h-6 w-6 rounded-full bg-[#9D4EDD]/10 p-1 text-[#9D4EDD]">
                        <User className="h-4 w-4" />
                      </div>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-[#231651] text-white border-[#FF2A6D]/30">
                  <DropdownMenuItem
                    onClick={() => router.push("/profile")}
                    className="hover:bg-[#231651]/80 hover:text-[#05FFF8] focus:bg-[#231651]/80 focus:text-[#05FFF8] cursor-pointer"
                  >
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-[#FF2A6D]/30" />
                  <DropdownMenuItem
                    onClick={() => {
                      signOut()
                      logout()
                    }}
                    className="text-[#FF2A6D] hover:bg-[#231651]/80 hover:text-[#05FFF8] focus:bg-[#231651]/80 focus:text-[#05FFF8] cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="default"
                size="default"
                className="hidden md:flex items-center gap-2 bg-[#FF2A6D] hover:bg-[#FF2A6D]/80 text-white transition-colors"
                onClick={() => router.push("/generate")}
              >
                Get Started
              </Button>
            )}

            {/* Mobile Menu Button */}
            <div className="ml-4 md:hidden">
              <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="inline-flex items-center justify-center p-2 rounded-md text-[#D1D7E0] hover:bg-[#231651] hover:text-[#05FFF8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#1A1040] focus:ring-[#9D4EDD]"
                    onClick={() => setIsMenuOpen(true)}
                  >
                    <span className="sr-only">Open main menu</span>
                    {isMenuOpen ? (
                      <X className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Menu className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[250px] bg-[#1A1040] text-white p-0 border-l border-[#FF2A6D]/30">
                  <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                  <div className="px-4 py-6 space-y-4">
                    <div className="flex items-center mb-6">
                      <span className="text-xl font-bold">
                        <span className="text-[#FF2A6D]">Interview</span>
                        <span className="text-[#9D4EDD]">Buddy</span>
                      </span>
                    </div>

                    <Link
                      href="/"
                      className="block px-3 py-2 rounded-md text-[#D1D7E0] hover:text-[#05FFF8] hover:bg-[#231651] transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/dashboard"
                      className="block px-3 py-2 rounded-md text-[#D1D7E0] hover:text-[#05FFF8] hover:bg-[#231651] transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      href="/features"
                      className="block px-3 py-2 rounded-md text-[#D1D7E0] hover:text-[#05FFF8] hover:bg-[#231651] transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Features
                    </Link>
                    <Link
                      href="/pricing"
                      className="block px-3 py-2 rounded-md text-[#D1D7E0] hover:text-[#05FFF8] hover:bg-[#231651] transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Pricing
                    </Link>
                    {isMounted && currentUser?.isAdmin === true && (
                      <Link
                        href="/admin/dashboard"
                        className="block px-3 py-2 rounded-md text-[#D1D7E0] hover:text-[#05FFF8] hover:bg-[#231651] transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Admin
                      </Link>
                    )}

                    {!user ? (
                      <Button
                        variant="default"
                        size="default"
                        className="w-full mt-6 bg-[#FF2A6D] hover:bg-[#FF2A6D]/80 text-white"
                        onClick={() => {
                          router.push("/generate")
                          setIsMenuOpen(false)
                        }}
                      >
                        Get Started
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="default"
                        className="w-full mt-6 border-[#FF2A6D]/30 text-[#FF2A6D] hover:bg-[#231651] hover:text-[#05FFF8]"
                        onClick={() => {
                          signOut()
                          logout()
                          setIsMenuOpen(false)
                        }}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </Button>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar