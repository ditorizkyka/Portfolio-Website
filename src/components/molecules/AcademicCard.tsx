import { Academic } from '@/src/types/academic';
import Image from 'next/image';


interface AcademicBadgeProps {
  children: React.ReactNode;
}

const AcademicBadge = ({ children }: AcademicBadgeProps) => (
  <span className="bg-portfolio-raised text-portfolio-muted text-[9px] md:text-xs px-2 py-1 rounded-full whitespace-nowrap hidden md:inline-block">
    {children}
  </span>
);

const AcademicCard = ({ academics }: { academics: Academic }) => (
  <div className="bg-portfolio-surface border border-portfolio-border rounded-xl p-3 md:p-6 transition-all hover:border-portfolio-border-strong">
    {/* Top Section: Logo, Info, Category, and Duration */}
    <div className="flex flex-col md:flex-row md:justify-between md:items-start space-y-3 md:space-y-0 mb-4">
      <div className="flex items-center space-x-3 md:space-x-4">
        <div className="relative w-10 h-10 md:w-12 md:h-12 shrink-0">
          <Image 
            src={academics.logo_url} 
            alt={academics.institution} 
            fill 
            className="rounded-md md:rounded-lg object-cover" 
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <h3 className="text-portfolio-ink font-semibold text-sm md:text-lg truncate">{academics.institution}</h3>
            <AcademicBadge>{academics.degree}</AcademicBadge>
          </div>
          <p className="text-portfolio-muted text-[10px] md:text-sm truncate">{academics.website}</p>
        </div>
      </div>
      <div className="text-portfolio-ink font-bold md:font-semibold text-sm md:text-lg border-t border-portfolio-border md:border-none pt-3 md:pt-0">
        {academics.duration}
      </div>
    </div>

    {/* Description Box */}
    <div className="bg-portfolio-canvas border border-portfolio-border rounded-xl p-4 space-y-2">
      <h4 className="text-portfolio-ink font-semibold text-sm md:text-base">{academics.major}</h4>
      <p className="text-portfolio-muted text-[12px] md:text-sm leading-relaxed">
        {academics.description}
      </p>
    </div>
  </div>
);

export default AcademicCard;