'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiMenu, FiX, FiUser } from 'react-icons/fi';
import { RiAiGenerate } from 'react-icons/ri';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Research Platform', href: '/research-platform' },
    { name: 'DeepFake Roadmap', href: '/roadmap' },
    { name: 'Storage', href: '/storage' },
    { name: 'DeepFake News & Info', href: '/deepfake-news' },
  ];

  const UserAvatar = ({ className = '' }) => (
    <div className={`relative w-8 h-8 rounded-full overflow-hidden bg-[var(--muted)] ${className}`}>
      <div className="w-full h-full flex items-center justify-center">
        <FiUser className="h-4 w-4 text-gray-400" />
      </div>
    </div>
  );

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[var(--card-bg)]/95 backdrop-blur-md shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="relative overflow-hidden rounded-full p-1 bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] transition-all duration-300 group-hover:scale-110">
                <RiAiGenerate className="h-7 w-7 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                <span className="text-[var(--secondary)]">Deep</span>
                <span className="text-[var(--accent)]">Fake</span>
                <span>Lab</span>
              </span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-gray-300 hover:text-white hover:bg-[var(--primary)]/10 px-3 py-2 rounded-md text-sm font-bold transition-all duration-300 relative group"
                >
                  {link.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] transition-all duration-300 group-hover:w-full"></span>
                </Link>
              ))}
              
              <Link
                href="/profile"
                className="flex items-center text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-bold transition-colors duration-300 group bg-[var(--card-bg)]/50 hover:bg-[var(--card-bg)] border border-[var(--border)] hover:border-[var(--primary)]"
              >
                <UserAvatar className="mr-2 border-2 border-transparent group-hover:border-[var(--secondary)] transition-all" />
                Profile
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-[var(--primary)]/20 focus:outline-none transition-colors duration-300"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <FiX className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <FiMenu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <motion.div
        className="md:hidden"
        initial={{ opacity: 0, height: 0 }}
        animate={{
          opacity: isOpen ? 1 : 0,
          height: isOpen ? 'auto' : 0,
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-[var(--card-bg)]/95 backdrop-blur-md border-t border-[var(--border)]">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-gray-300 hover:text-white hover:bg-[var(--primary)]/10 block px-3 py-2 rounded-md text-base font-bold transition-all duration-300"
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          
          <Link
            href="/profile"
            className="flex items-center text-gray-300 hover:text-white hover:bg-[var(--primary)]/10 px-3 py-2 rounded-md text-base font-bold transition-all duration-300"
            onClick={() => setIsOpen(false)}
          >
            <UserAvatar className="mr-2" />
            Profile
          </Link>
        </div>
      </motion.div>
    </nav>
  );
};

export default Navbar; 