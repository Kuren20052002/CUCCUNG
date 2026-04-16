'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Menu, X, ChevronDown, Bell, LogOut, LayoutDashboard, User as UserIcon } from 'lucide-react';
import clsx from 'clsx';
import Image from 'next/image';

interface Category {
  name: string;
  slug: string;
}

interface HeaderProps {
  categories: Category[];
}

export const Header: React.FC<HeaderProps> = ({ categories }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { data: session, status } = useSession();
  const isLoading = status === 'loading';
  const isLoggedIn = status === 'authenticated';
  const isAdmin = session?.user?.role === 'ADMIN';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    // Initialize on mount
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={clsx(
        'sticky top-0 z-50 w-full transition-all duration-300',
        isScrolled
          ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-100 py-3'
          : 'bg-white/70 backdrop-blur-sm py-5'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-12">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:rotate-6 transition-all duration-300 overflow-hidden">
                <Image
                  src="/ngoanxinhyeu_logo.png"
                  alt="Logo Ngoanxinhyeu - Cộng đồng Mẹ & Bé uy tín"
                  width={40}
                  height={40}
                  priority
                  className="object-contain w-full h-full"
                />
              </div>
              <span className="text-2xl font-black text-slate-900 tracking-tight group-hover:text-primary transition-colors">
                NgoanXinhYeu<span className="text-secondary ml-0.5">.</span>
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-sm font-bold text-slate-600 hover:text-primary transition-colors"
            >
              Trang chủ
            </Link>

            {/* Explore Dropdown */}
            <div className="relative group">
              <button
                className="flex items-center space-x-1.5 text-sm font-bold text-slate-600 group-hover:text-primary transition-all outline-none"
                aria-label="Mở danh mục Cẩm nang"
              >
                <span>Cẩm nang</span>
                <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
              </button>
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-64 bg-white/95 backdrop-blur-xl rounded-[1.5rem] shadow-2xl shadow-slate-200/60 border border-slate-50 p-2.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                <div className="grid grid-cols-1 gap-1">
                  {categories.length > 0 ? (
                    categories.map((cat) => (
                      <Link
                        key={cat.slug}
                        href={`/${cat.slug}`}
                        className="group/item flex items-center px-4 py-3 text-sm font-bold text-slate-600 hover:bg-emerald-50 hover:text-primary rounded-2xl transition-all"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-200 group-hover/item:bg-primary mr-3 transition-colors" />
                        <span className="truncate">{cat.name}</span>
                      </Link>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-sm text-slate-400 italic">Đang cập nhật danh mục...</div>
                  )}
                </div>
              </div>
            </div>
          </nav>

          {/* Right CTA */}
          <div className="hidden md:flex items-center space-x-3">
            {!isLoading && (
              <>
                {isLoggedIn ? (
                  <div className="flex items-center space-x-3">
                    {isAdmin && (
                      <Link
                        href="/admin"
                        className="flex items-center space-x-1 px-4 py-2.5 text-sm font-bold text-primary bg-emerald-50 hover:bg-emerald-100 rounded-2xl transition-all"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        <span>Quản trị</span>
                      </Link>
                    )}
                    <button
                      className="p-2 text-slate-500 hover:text-primary hover:bg-slate-50 rounded-full transition-all mr-1"
                      aria-label="Thông báo"
                    >
                      <Bell className="w-5 h-5" />
                    </button>

                    <button
                      onClick={() => signOut()}
                      className="p-2.5 text-slate-500 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all group"
                      aria-label="Đăng xuất"
                    >
                      <LogOut className="w-5 h-5" />
                    </button>
                    <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center border border-white shadow-sm overflow-hidden border-slate-200">
                      {session.user?.image ? (
                        <Image src={session.user.image} alt={session.user.name || 'Avatar người dùng'} width={40} height={40} className="w-full h-full object-cover" />
                      ) : (
                        <UserIcon className="w-5 h-5 text-slate-500" />
                      )}
                    </div>
                  </div>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:text-primary transition-all"
                    >
                      Đăng nhập
                    </Link>
                    <Link
                      href="/signup"
                      className="px-6 py-2.5 text-sm font-extrabold text-white bg-primary hover:bg-emerald-700 rounded-2xl transition-all shadow-md shadow-emerald-500/20 active:scale-95"
                    >
                      Đăng ký
                    </Link>
                  </>
                )}
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label={isMenuOpen ? 'Đóng menu' : 'Mở menu'}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-nav"
            >
              {isMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Overlay & Container */}
      <div
        className={clsx(
          'md:hidden fixed inset-0 z-[60] transition-all duration-300 ease-in-out',
          isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
      >
        {/* Backdrop overlay */}
        <div
          className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm shadow-inner"
          onClick={() => setIsMenuOpen(false)}
        />

        {/* Sliding Menu */}
        <div
          id="mobile-nav"
          className={clsx(
            'absolute right-0 top-0 bottom-0 w-80 bg-white shadow-2xl p-6 flex flex-col pt-20 transform transition-transform duration-300 ease-in-out',
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          )}
        >
          <button
            onClick={() => setIsMenuOpen(false)}
            className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 transition-colors"
            aria-label="Đóng menu"
          >
            <X className="w-6 h-6 text-slate-500" />
          </button>

          <nav className="space-y-6">


            <div className="space-y-4">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-2">Cẩm nang</h3>
              <div className="grid grid-cols-1 gap-1">
                {categories.length > 0 ? (
                  categories.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/${cat.slug}`}
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-4 py-3 text-lg font-bold text-slate-600 hover:bg-emerald-50 hover:text-primary rounded-2xl transition-all"
                    >
                      {cat.name}
                    </Link>
                  ))
                ) : (
                  <div className="px-4 py-3 text-sm text-slate-400 italic">Đang cập nhật...</div>
                )}
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 space-y-4">
              {!isLoading && (
                <div className="space-y-4">
                  {isLoggedIn ? (
                    <>
                      <div className="flex items-center space-x-3 px-4 py-3 bg-slate-50 rounded-2xl">
                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center border border-slate-200 overflow-hidden shadow-sm">
                          {session.user?.image ? (
                            <Image src={session.user.image} alt={session.user.name || 'Avatar người dùng'} width={40} height={40} className="w-full h-full object-cover" />
                          ) : (
                            <UserIcon className="w-5 h-5 text-slate-500" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-slate-900 truncate">{session.user?.name}</p>
                          <p className="text-xs text-slate-500 truncate">{session.user?.email}</p>
                        </div>
                      </div>

                      {isAdmin && (
                        <Link
                          href="/admin"
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center space-x-3 px-4 py-4 text-lg font-bold text-primary bg-emerald-50 rounded-2xl transition-all"
                        >
                          <LayoutDashboard className="w-5 h-5" />
                          <span>Bảng quản trị</span>
                        </Link>
                      )}

                      <button
                        onClick={() => {
                          setIsMenuOpen(false);
                          signOut();
                        }}
                        className="flex items-center space-x-3 w-full px-4 py-4 text-lg font-bold text-rose-500 hover:bg-rose-50 rounded-2xl transition-all"
                      >
                        <LogOut className="w-5 h-5" />
                        <span>Đăng xuất</span>
                      </button>
                    </>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      <Link
                        href="/login"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center justify-center py-4 text-sm font-bold text-slate-600 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all"
                      >
                        Đăng nhập
                      </Link>
                      <Link
                        href="/signup"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center justify-center py-4 text-sm font-extrabold text-white bg-primary rounded-2xl shadow-lg shadow-emerald-500/10 active:scale-95 transition-all"
                      >
                        Đăng ký
                      </Link>
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-4 pt-2">
                <p className="text-xs text-slate-400 leading-relaxed italic px-2">
                  "Cùng Mẹ chăm sóc Bé yêu thông minh & khỏe mạnh mỗi ngày."
                </p>
                <Link
                  href="#newsletter"
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full py-4 text-center text-sm font-extrabold text-slate-700 bg-slate-100/50 hover:bg-slate-100 rounded-2xl transition-all"
                >
                  Nhận tin tức mới nhất
                </Link>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};
