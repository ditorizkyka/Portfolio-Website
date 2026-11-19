'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LucideIcon } from 'lucide-react';
import React from 'react';
import { User, Zap, Shapes } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

interface MobileNavLinkProps {
  to: string;
  icon: LucideIcon;
  label: string;
  isActive: boolean;
}

const MobileTopNav: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    { to: "/", icon: User, label: "HOME" },
    { to: "/projects", icon: Shapes, label: "PROJECTS" },
    { to: "/soft-skills", icon: Zap, label: "SKILLS" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-portfolio-canvas/80 backdrop-blur-md border-b border-portfolio-border py-3 z-50 md:hidden">

      <div className="flex items-center justify-center gap-2 px-2 sm:gap-3">
        <div className="flex gap-1">
          {navItems.map((item) => (
            <MobileNavLink
              key={item.to}
              to={item.to}
              icon={item.icon}
              label={item.label}
              isActive={pathname === item.to}
            />
          ))}
        </div>
        <ThemeToggle />
      </div>
    </nav>
  );
};

const MobileNavLink = ({ to, icon: Icon, label, isActive }: MobileNavLinkProps) => {
  const baseClass = "flex min-h-11 items-center gap-1 rounded-lg border px-2.5 transition-colors sm:gap-2 sm:px-5";
  const activeClass = "bg-portfolio-surface border-portfolio-border-strong text-portfolio-ink";
  const inactiveClass = "border-transparent text-portfolio-muted hover:text-portfolio-ink hover:border-portfolio-border";

  return (
    <Link href={to} className={`${baseClass} ${isActive ? activeClass : inactiveClass}`}>
      <Icon className={`w-4 h-4 ${isActive ? 'text-portfolio-accent' : 'text-inherit'}`} />
      <span className="text-[10px] font-bold tracking-widest">{label}</span>
    </Link>
  );
};

export default MobileTopNav;
