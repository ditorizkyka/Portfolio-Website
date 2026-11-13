import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink, ArrowRight } from 'lucide-react';
import { Project } from '@/src/types/project';
import { ProjectText, ProjectTitle } from '../atoms/ProjectText';
import { getProjectCategory } from '@/src/lib/projectCategories';
import { plainProjectTitle } from '@/src/lib/projectText';

interface ProjectTechBadgeProps {
  tech: string;
  isPrimary?: boolean;
}

const ProjectTechBadge = ({ tech, isPrimary = true }: ProjectTechBadgeProps) => (
  <span
    className={`px-2.5 py-1 text-xs rounded-md border font-medium ${
      isPrimary 
        ? "bg-blue-500/10 text-blue-400 border-blue-500/20" 
        : "bg-[#1f1f1f] text-[#999999] border-transparent"
    }`}
  >
    {tech}
  </span>
);

const ProjectCard = ({ project }: { project: Project }) => {
  const projectHref = `/projects/${project.slug || project.id}`;

  return (
    <div className="group relative rounded-3xl overflow-hidden flex flex-col md:flex-row bg-[#0A0A0B] border border-[#222] hover:border-[#333] transition-colors">
      {/* Project Image Container */}
      <div className="w-full md:w-1/2 p-3 sm:p-4">
        <Link href={projectHref} className="relative block h-52 sm:h-64 lg:h-76 w-full overflow-hidden rounded-2xl bg-[#141416]">
          <Image
            src={project.images[0] || '/placeholder.png'}
            alt={plainProjectTitle(project.title)}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </Link>
      </div>

      {/* Project Info */}
      <div className="w-full md:w-1/2 px-6 py-6 md:py-8 flex flex-col justify-center">
        <div className="flex justify-between items-start mb-3">
          <Link href={projectHref}>
            <h3 className="text-xl md:text-2xl font-bold text-white line-clamp-2 hover:text-[#ddd] transition-colors">
              <ProjectTitle value={project.title} />
            </h3>
          </Link>
          {project.repo_link && (
            <a
              href={project.repo_link}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-[#141415] border border-[#2a2a2e] rounded-lg text-xs text-[#999999] hover:bg-[#1f1f20] hover:text-white hover:border-[#444] transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              GitHub
            </a>
          )}
        </div>

        {/* Badges & Meta */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="bg-[#18181a] border border-[#26262a] text-[#ccc] text-[11px] font-medium px-2.5 py-0.5 rounded-full">
            {getProjectCategory(project.category)}
          </span>
          {project.duration && (
            <span className="bg-[#18181a] border border-[#26262a] text-[#888] text-[11px] font-mono px-2.5 py-0.5 rounded-full">
              {project.duration}
            </span>
          )}
        </div>

        <ProjectText value={project.short_description} className="text-sm md:text-base text-[#999999] line-clamp-2 mb-5 leading-relaxed" />

        {/* Tech Stack List */}
        <div className="flex flex-wrap gap-2 mb-6">
          {project.tech_stack.slice(0, 4).map((tech, idx) => (
            <ProjectTechBadge key={idx} tech={tech} />
          ))}
          {project.tech_stack.length > 4 && (
            <ProjectTechBadge tech={`+${project.tech_stack.length - 4} more`} isPrimary={false} />
          )}
        </div>

        {/* Action Row */}
        <div className="flex items-center gap-3">
          <Link
            href={projectHref}
            className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-xs font-semibold text-black hover:bg-[#e0e0e0] transition-colors"
          >
            <span>View Case Study</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          {project.demo_link && (
            <a
              href={project.demo_link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#2a2a2e] bg-[#141415] px-4 py-2.5 text-xs font-medium text-[#ccc] hover:border-[#444] hover:text-white transition-colors"
            >
              <span>Demo</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#888]" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
