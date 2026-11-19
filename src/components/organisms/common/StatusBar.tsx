"use client";

import React, { useState, useEffect } from 'react';
import ThemeToggle from './ThemeToggle';

interface StatusBadgeProps {
  children: React.ReactNode;
  className?: string;
}

const StatusBadge = ({ children, className = "" }: StatusBadgeProps) => (
  <div className={`flex items-center bg-portfolio-panel px-6 py-3 rounded-full border border-portfolio-border ${className}`}>
    {children}
  </div>
);

const StatusBar: React.FC = () => {
  // Biarkan initial state kosong untuk menghindari perbedaan konten saat server-side rendering
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    // Fungsi update waktu
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZone: 'Asia/Jakarta',
      };
      setTime(now.toLocaleTimeString('en-GB', options));
    };

    // Jalankan interval
    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []); // Kosong berarti hanya jalan di client-side (setelah mount)

  return (
    <header className="hidden md:flex fixed top-0 left-0 right-0 h-16 bg-portfolio-canvas border-b border-portfolio-border items-center justify-between px-6 md:px-40 py-10 z-20 font-space-grotesk">
      <div className="flex items-center">
        <StatusBadge>
          <div className="w-2 h-2 bg-portfolio-accent rounded-full mr-2 animate-pulse" />
          <span className="text-sm text-portfolio-body">
            Available For Work
          </span>
        </StatusBadge>
      </div>

      <div className="flex items-center gap-3 text-sm text-portfolio-body">
        <span className="hidden lg:inline">Local Time (WIB)</span>
        <StatusBadge className="min-w-30 justify-center">
          {/* Jika time masih kosong (saat SSR), tampilkan placeholder. 
            Ini akan terisi otomatis setelah useEffect berjalan di browser.
          */}
          {time || '--:--:--'}
        </StatusBadge>
        <ThemeToggle />
      </div>
    </header>
  );
};

export default StatusBar;
