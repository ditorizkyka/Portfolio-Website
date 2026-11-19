import React from 'react';


const FooterBar: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-portfolio-canvas text-portfolio-ink text-center py-6 mt-auto border-t border-portfolio-border z-10 relative">
      <div className="max-w-6xl mx-auto px-6 md:px-0 flex flex-col items-center justify-center">
        <CopyrightText 
          year={currentYear} 
          author="Dito Portfolio" 
        />
        
        {/* Opsional: Tambahkan status koneksi atau tech stack singkat di sini */}
        <div className="mt-2 flex items-center space-x-2">
          <div className="w-1 h-1 rounded-full bg-portfolio-border-strong" />
          <span className="text-[10px] text-portfolio-muted uppercase tracking-[0.2em]">
            Built with Next.js & TypeScript
          </span>
        </div>
      </div>
    </footer>
  );
};

interface CopyrightTextProps {
  year: number;
  author: string;
}

const CopyrightText = ({ year, author }: CopyrightTextProps) => (
  <p className="text-portfolio-muted text-xs md:text-sm font-space-grotesk tracking-wide">
    © {year} {author}. All rights reserved.{" "}
    <span className="font-bold text-portfolio-body hover:text-portfolio-ink transition-colors cursor-default">
      Designed/Inspired by Praha
    </span>
  </p>
);


export default FooterBar;