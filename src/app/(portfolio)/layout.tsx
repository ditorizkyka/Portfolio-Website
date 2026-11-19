import { cookies } from 'next/headers';
import { PORTFOLIO_THEME_COOKIE } from '@/src/lib/portfolioTheme';

export default async function PortfolioLayout({ children }: { children: React.ReactNode }) {
  const preference = (await cookies()).get(PORTFOLIO_THEME_COOKIE)?.value;
  const theme = preference === 'light' || preference === 'dark' ? preference : undefined;

  return (
    <div id="portfolio-theme" className="portfolio-theme min-h-screen" data-theme={theme}>
      {children}
    </div>
  );
}
