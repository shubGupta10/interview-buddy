"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, User, LogOut, X } from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import useAuthStore from "@/app/store/useAuthStore";

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
  const { data: session } = useSession();
  const { user, setUser, logout } = useAuthStore();
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (session?.user) {
      setUser({
        id: session.user.id || "",
        email: session.user.email || "",
        name: session.user.name || "",
        provider: session.user.provider || "",
        isAdmin: (session.user as any).isAdmin || false,
        profileImage: session.user.image || "",
      });
    }
  }, [session, setUser]);

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const response = await fetch("/api/user/profile", {
          method: "GET",
          cache: "no-store",
        });
        const data = await response.json();
        setCurrentUser(data.user);
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    };

    if (user) {
      getCurrentUser();
    }
  }, [user]);

  const isActive = (path: string) => pathname === path;

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/how-to-use", label: "How to Use" },
    { href: "/feedback", label: "Feedback" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-[#1A1040] border-b border-[#FF2A6D]/30 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center hover:text-white">
              <span className="text-xl sm:text-2xl font-bold whitespace-nowrap">
                <span className="text-[#FF2A6D]">Interview</span>
                <span className="text-[#9D4EDD]">Buddy</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex flex-1 items-center justify-center">
            <div className="flex items-center space-x-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 text-base font-medium transition-colors rounded-md ${
                    isActive(link.href)
                      ? "bg-[#231651]/80 text-[#05FFF8]"
                      : "text-[#D1D7E0] hover:text-[#05FFF8] hover:bg-[#231651]/30"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {isMounted && currentUser?.isAdmin && (
                <Link
                  href="/admin/dashboard"
                  className={`px-3 py-2 text-base font-medium transition-colors rounded-md ${
                    isActive("/admin/dashboard")
                      ? "bg-[#231651]/80 text-[#05FFF8]"
                      : "text-[#D1D7E0] hover:text-[#05FFF8] hover:bg-[#231651]/30"
                  }`}
                >
                  Admin
                </Link>
              )}
            </div>
          </div>

          {/* User Menu & Mobile/Tablet Menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="relative rounded-md bg-[#231651] border border-[#FF2A6D]/30 text-white hover:bg-[#231651]/80 hover:text-[#05FFF8] transition-all"
                  >
                    <span className="sr-only">Open user menu</span>
                    <div className="flex items-center gap-x-2">
                      <span className="text-sm truncate">{currentUser?.name || user?.name}</span>
                      <div className="h-6 w-6 rounded-full bg-[#9D4EDD]/10 p-1 text-[#9D4EDD] flex-shrink-0">
                        <User className="h-4 w-4" />
                      </div>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-[#231651] text-white border-[#FF2A6D]/30">
                  <DropdownMenuItem
                    onClick={() => router.push("/profile")}
                    className="hover:bg-[#231651]/80 hover:text-[#05FFF8]"
                  >
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      signOut();
                      logout();
                    }}
                    className="text-[#FF2A6D] hover:bg-[#231651]/80 hover:text-[#05FFF8]"
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push("/login")}
                  className="border border-[#9D4EDD] text-[#D1D7E0] hover:bg-[#231651] hover:text-[#05FFF8] cursor-pointer"
                >
                  Login
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => router.push("/signup")}
                  className="bg-[#FF2A6D] hover:bg-[#FF2A6D]/80 text-white cursor-pointer"
                >
                  Sign Up
                </Button>
              </>
            )}

            {/* Mobile/Tablet Menu */}
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="lg:hidden p-1 rounded-md text-white">
                  <Menu />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[250px] bg-[#1A1040] p-0 border-l border-[#FF2A6D]/30">
                {/* Mobile Menu Content */}
                <div className="px-4 py-6 space-y-2">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`block px-3 py-2 rounded-md ${
                        isActive(link.href)
                          ? "bg-[#231651] text-[#05FFF8]"
                          : "text-[#D1D7E0] hover:text-[#05FFF8]"
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                  {!user && (
                    <>
                      <Button
                        variant="ghost"
                        size="default"
                        onClick={() => {
                          router.push("/login");
                          setIsMenuOpen(false);
                        }}
                        className="w-full border text-white border-[#9D4EDD] cursor-pointer"
                      >
                        Login
                      </Button>
                      <Button
                        variant="default"
                        size="default"
                        onClick={() => {
                          router.push("/signup");
                          setIsMenuOpen(false);
                        }}
                        className="w-full bg-[#FF2A6D]"
                      >
                        Sign Up
                      </Button>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;