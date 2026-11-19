'use client';

import type { MouseEvent } from 'react';
import { Moon, Sun } from 'lucide-react';
import { PORTFOLIO_THEME_COOKIE } from '@/src/lib/portfolioTheme';

function switchTheme(event: MouseEvent<HTMLButtonElement>) {
  const portfolio = event.currentTarget.closest<HTMLElement>('.portfolio-theme');
  if (!portfolio) return;

  const currentTheme = portfolio.dataset.theme
    ?? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';

  // Let the entire palette repaint together before hover transitions resume.
  portfolio.dataset.themeSwitching = '';
  portfolio.dataset.theme = nextTheme;
  requestAnimationFrame(() => {
    requestAnimationFrame(() => delete portfolio.dataset.themeSwitching);
  });

  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${PORTFOLIO_THEME_COOKIE}=${nextTheme}; Path=/; Max-Age=31536000; SameSite=Lax${secure}`;
}

export default function ThemeToggle() {
  return (
    <button
      type="button"
      onClick={switchTheme}
      className="inline-flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-portfolio-border bg-portfolio-surface text-portfolio-body transition-colors hover:border-portfolio-border-strong hover:bg-portfolio-panel hover:text-portfolio-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-portfolio-accent"
    >
      <span className="theme-to-dark">
        <Moon className="size-[18px]" aria-hidden="true" />
        <span className="sr-only">Switch to dark mode</span>
      </span>
      <span className="theme-to-light">
        <Sun className="size-[18px]" aria-hidden="true" />
        <span className="sr-only">Switch to light mode</span>
      </span>
    </button>
  );
}
