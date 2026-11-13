"use client";
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Project } from '@/src/types/project';
import { ProjectText, ProjectTitle } from '../atoms/ProjectText';
import { getProjectCategory } from '@/src/lib/projectCategories';
import { isRichProjectText, plainProjectTitle } from '@/src/lib/projectText';

interface ProjectCardProps {
  project: Project;
  onClick?: (project: Project) => void;
  isMobile: boolean;
  truncateText: (text: string) => string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, isMobile, truncateText, onClick }) => {
  const projectHref = `/projects/${project.slug || project.id}`;

  return (
    <Link
      href={projectHref}
      onClick={() => onClick && onClick(project)}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[#222] hover:border-[#38383e] bg-[#0A0A0B] text-[#999999] transition-colors block"
    >
      <div>
        {/* Thumbnail View */}
        <div className={`relative overflow-hidden w-full ${isMobile ? 'h-32' : 'h-52'} bg-[#121214]`}>
          <Image
            src={project.images[0] || '/placeholder.png'}
            alt={plainProjectTitle(project.title)}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-linear-to-t from-[#0A0A0B] via-black/20 to-transparent" />

          {/* Category Badge */}
          <div className="absolute top-3 right-3 z-10">
            <ProjectBadge label={project.category} />
          </div>
        </div>

        {/* Info */}
        <div className="p-4 md:p-5">
          <h3 className={`font-bold text-white mb-2 line-clamp-1 ${isMobile ? 'text-sm' : 'text-lg'}`}>
            <ProjectTitle value={project.title} />
          </h3>

          <ProjectText
            className={`${isMobile ? 'text-xs' : 'text-xs md:text-sm'} text-[#8A8A8A] leading-relaxed mb-4 line-clamp-2`}
            value={isRichProjectText(project.short_description) ? project.short_description : truncateText(project.short_description ?? '')}
          />
        </div>
      </div>

      {/* Footer Meta & Action */}
      <div className="px-4 pb-4 md:px-5 md:pb-5 pt-0 flex items-center justify-between border-t border-[#1a1a1c] mt-2 pt-3">
        <div className="flex items-center gap-1.5 text-xs font-medium text-[#ccc] group-hover:text-white transition-colors">
          <span>Read Case Study</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#888]" />
        </div>

        {project.duration && (
          <span className="text-[11px] font-mono text-[#666]">
            {project.duration}
          </span>
        )}
      </div>
    </Link>
  );
};

interface ProjectBadgeProps {
  label: string;
}

const ProjectBadge: React.FC<ProjectBadgeProps> = ({ label }) => {
  const category = getProjectCategory(label);

  return (
    <span className="inline-block px-2.5 py-0.5 text-[11px] font-medium rounded-full border border-[#333] bg-black/70 backdrop-blur-md text-[#ccc]">
      {category}
    </span>
  );
};

export { ProjectCard, ProjectBadge };
