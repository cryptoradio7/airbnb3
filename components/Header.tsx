"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Menu, User, LogOut, LogIn, UserPlus } from "lucide-react";

export default function Header() {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-[#FF385C]"></div>
            <span className="text-2xl font-bold text-[#222222]">airbnb</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {status === "loading" ? (
              <div className="animate-pulse h-8 w-24 bg-gray-200 rounded"></div>
            ) : session ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-gray-700 hover:text-[#FF385C] transition-colors"
                >
                  Tableau de bord
                </Link>
                <Link
                  href="/profile"
                  className="flex items-center space-x-2 text-gray-700 hover:text-[#FF385C] transition-colors"
                >
                  <User size={20} />
                  <span>Profil</span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 text-gray-700 hover:text-[#FF385C] transition-colors"
                >
                  <LogOut size={20} />
                  <span>Déconnexion</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="flex items-center space-x-2 text-gray-700 hover:text-[#FF385C] transition-colors"
                >
                  <LogIn size={20} />
                  <span>Connexion</span>
                </Link>
                <Link
                  href="/register"
                  className="flex items-center space-x-2 bg-[#FF385C] text-white px-4 py-2 rounded-lg hover:bg-[#E31C5F] transition-colors"
                >
                  <UserPlus size={20} />
                  <span>Inscription</span>
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu size={24} className="text-gray-700" />
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t pt-4">
            {status === "loading" ? (
              <div className="space-y-3">
                <div className="animate-pulse h-10 bg-gray-200 rounded"></div>
                <div className="animate-pulse h-10 bg-gray-200 rounded"></div>
              </div>
            ) : session ? (
              <div className="space-y-3">
                <Link
                  href="/dashboard"
                  className="block py-2 text-gray-700 hover:text-[#FF385C] transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Tableau de bord
                </Link>
                <Link
                  href="/profile"
                  className="flex items-center space-x-2 py-2 text-gray-700 hover:text-[#FF385C] transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User size={20} />
                  <span>Profil</span>
                </Link>
                <button
                  onClick={() => {
                    handleSignOut();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center space-x-2 w-full text-left py-2 text-gray-700 hover:text-[#FF385C] transition-colors"
                >
                  <LogOut size={20} />
                  <span>Déconnexion</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <Link
                  href="/login"
                  className="flex items-center space-x-2 py-2 text-gray-700 hover:text-[#FF385C] transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <LogIn size={20} />
                  <span>Connexion</span>
                </Link>
                <Link
                  href="/register"
                  className="flex items-center space-x-2 bg-[#FF385C] text-white px-4 py-2 rounded-lg hover:bg-[#E31C5F] transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <UserPlus size={20} />
                  <span>Inscription</span>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}