"use client";
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Project } from '@/src/types/project';
import { SoftSkill } from '@/src/types/softSkills';
import { ProjectText, ProjectTitle } from '../atoms/ProjectText';
import { getProjectCategory } from '@/src/lib/projectCategories';
import { isRichProjectText, plainProjectTitle } from '@/src/lib/projectText';

export const getBadgeColor = (label?: string | null): string => {
  const normalized = label?.trim().toLowerCase() ?? '';
  if (normalized === 'organization') {
    return 'bg-blue-100 text-blue-800 border-blue-200';
  }
  if (normalized === 'event' || normalized === 'community') {
    return 'bg-green-100 text-green-800 border-green-200';
  }
  if (normalized.includes('ai')) {
    return 'bg-purple-100 text-purple-800 border-purple-200';
  }
  return 'bg-blue-100 text-blue-800 border-blue-200';
};

export interface ProjectBadgeProps {
  label: string;
  className?: string;
}

export const ProjectBadge: React.FC<ProjectBadgeProps> = ({ label, className = '' }) => {
  const displayLabel =
    label === 'Organization' || label === 'Event' || label === 'Community'
      ? label
      : getProjectCategory(label);
  const colorClass = getBadgeColor(label);

  return (
    <span
      className={`inline-block px-3 py-1 text-[10px] md:text-xs font-bold rounded-full border backdrop-blur-md shadow-sm ${colorClass} ${className}`.trim()}
    >
      {displayLabel}
    </span>
  );
};

export interface ProjectCardProps {
  project?: Project;
  social?: SoftSkill;
  title?: string;
  image?: string;
  badge?: string;
  subtitle?: string;
  description?: string;
  href?: string;
  onClick?: (item: any) => void;
  isMobile?: boolean;
  truncateText?: (text: string, maxLines?: number) => string;
  className?: string;
}

const defaultTruncate = (text: string, maxLines = 2): string => {
  if (!text) return '';
  const words = text.split(' ');
  const maxWords = maxLines * 15;
  return words.length > maxWords ? words.slice(0, maxWords).join(' ') + '...' : text;
};

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  social,
  title,
  image,
  badge,
  subtitle,
  description,
  href,
  onClick,
  truncateText = defaultTruncate,
  className = '',
}) => {
  const cardTitle = title ?? project?.title ?? social?.title ?? '';
  const cardImage = image ?? project?.images?.[0] ?? social?.image_url ?? '/placeholder.png';
  const cardBadge = badge ?? (project ? getProjectCategory(project.category) : social?.label ?? '');
  const cardSubtitle =
    subtitle ??
    (project
      ? (project.duration || getProjectCategory(project.category))
      : social?.role ?? '');
  const rawDescription = description ?? project?.short_description ?? social?.description ?? '';
  const cardHref = href ?? (project ? `/projects/${project.slug || project.id}` : undefined);

  const cardContent = (
    <>
      {/* Thumbnail View */}
      <div className="relative h-40 md:h-48 w-full overflow-hidden bg-portfolio-panel">
        <Image
          src={cardImage}
          alt={plainProjectTitle(cardTitle)}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 50vw, 33vw"
        />
        {cardBadge && (
          <div className="absolute top-3 right-3 z-10">
            <ProjectBadge label={cardBadge} />
          </div>
        )}
      </div>

      {/* Info Body */}
      <div className="p-3 md:p-4 flex flex-col grow">
        <h3 className="text-portfolio-ink text-sm md:text-lg font-bold mb-2 line-clamp-1 group-hover:text-portfolio-link transition-colors">
          <ProjectTitle value={cardTitle} />
        </h3>

        {cardSubtitle && (
          <div className="mb-3">
            <span className="inline-block bg-portfolio-raised text-portfolio-muted text-[10px] md:text-xs px-2 md:px-3 py-1 rounded-lg border border-portfolio-border truncate max-w-full">
              {cardSubtitle}
            </span>
          </div>
        )}

        <div className="text-portfolio-muted text-[10px] md:text-xs leading-relaxed line-clamp-2 md:line-clamp-3">
          {isRichProjectText(rawDescription) ? (
            <ProjectText value={rawDescription} />
          ) : (
            <p>{truncateText(rawDescription, 2)}</p>
          )}
        </div>
      </div>
    </>
  );

  const commonClass = `bg-portfolio-surface border border-portfolio-border rounded-xl shadow-lg shadow-portfolio-shadow overflow-hidden hover:shadow-xl hover:border-portfolio-border-strong transition-all duration-300 group cursor-pointer flex flex-col h-full text-left ${className}`.trim();

  if (cardHref) {
    return (
      <Link
        href={cardHref}
        onClick={() => onClick && onClick(project || social)}
        className={commonClass}
      >
        {cardContent}
      </Link>
    );
  }

  return (
    <div
      onClick={() => onClick && onClick(project || social)}
      className={commonClass}
    >
      {cardContent}
    </div>
  );
};

export default ProjectCard;
export { ProjectCard };
