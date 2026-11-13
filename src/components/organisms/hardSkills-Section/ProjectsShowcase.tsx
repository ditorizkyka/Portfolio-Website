'use client';
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Calendar, Code, Link as LinkIcon, Shapes, Radio, ChevronDown } from 'lucide-react';
import { ProjectCard, ProjectBadge } from '../../molecules/ProjectCard';
import ScrambleText from "../../atoms/buttonAnimation";
import { Project } from '@/src/types/project';
import Image from 'next/image';
import { ProjectText, ProjectTitle } from '../../atoms/ProjectText';
import { getProjectCategory, PROJECT_CATEGORIES } from '@/src/lib/projectCategories';
import { plainProjectTitle } from '@/src/lib/projectText';

const PROJECTS_PER_LOAD = 9;
const PROJECT_FILTERS = ['All Projects', ...PROJECT_CATEGORIES] as const;
type ProjectFilter = typeof PROJECT_FILTERS[number];

const ProjectShowcase: React.FC<{ projects: Project[] }> = ({ projects }) => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [filter, setFilter] = useState<ProjectFilter>('All Projects');
  const [visibleCount, setVisibleCount] = useState(PROJECTS_PER_LOAD);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Prevent body scroll when dialog is open
  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedProject]);

  const truncateText = (text: string, maxLines = 2): string => {
    const words = text.split(' ');
    const maxWords = maxLines * 15;
    return words.length > maxWords ? words.slice(0, maxWords).join(' ') + '...' : text;
  };

  const closeDialog = () => setSelectedProject(null);

  const selectFilter = (nextFilter: ProjectFilter) => {
    if (nextFilter === filter) return;
    setFilter(nextFilter);
    setVisibleCount(PROJECTS_PER_LOAD);
  };

  const filteredProjects = filter === 'All Projects'
    ? projects
    : projects.filter((project) => getProjectCategory(project.category) === filter);
  const visibleProjects = filteredProjects.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProjects.length;

  return (
    <>
      <section className="bg-black min-h-screen text-left  md:px-0 font-space-grotesk">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6 md:mb-10">
            <div className="flex items-center gap-3 mb-4 md:mb-6">
              <Shapes className="w-7 h-7 md:w-8 md:h-8 text-white" />
              <h1 className="text-xl md:text-4xl font-bold text-white">All projects details</h1>
            </div>
            <p className="text-[#999999] text-xs md:text-lg max-w-4xl leading-relaxed">
              Formulating comprehensive strategies to meet your design goals and exceed expectations.
            </p>
          </div>

          <div role="group" aria-label="Filter projects by category" className="mb-6 flex flex-wrap gap-2 md:mb-8">
            {PROJECT_FILTERS.map((option) => (
              <button
                key={option}
                type="button"
                aria-pressed={filter === option}
                onClick={() => selectFilter(option)}
                className="rounded-lg border border-[#333] bg-[#141415] px-3 py-2 text-xs font-semibold text-[#ccc] transition-colors hover:bg-[#222] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6DD33D] aria-pressed:border-[#6DD33D] aria-pressed:bg-[#6DD33D] aria-pressed:text-black md:px-4 md:text-sm"
              >
                {option}
              </button>
            ))}
          </div>

          <p role="status" className={filteredProjects.length ? 'sr-only' : 'mb-10 rounded-xl border border-[#333] p-6 text-sm text-[#ccc]'}>
            {filteredProjects.length
              ? `Showing ${visibleProjects.length} of ${filteredProjects.length} projects`
              : 'No projects found.'}
          </p>

          {/* Projects Grid */}
          <div className={`grid gap-4 md:gap-8 mb-10 ${isMobile ? 'grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
            {visibleProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                isMobile={isMobile}
                truncateText={truncateText}
                onClick={(p) => setSelectedProject(p)}
              />
            ))}
          </div>

          {/* Load More Button */}
          {hasMore && (
            <div className="flex justify-center mb-10">
              <button
                onClick={() => setVisibleCount((count) => Math.min(count + PROJECTS_PER_LOAD, filteredProjects.length))}
                className="group flex items-center gap-3 bg-[#141415] hover:bg-[#1f1f20] px-8 py-4 rounded-xl transition-all duration-300 border border-[#333] hover:border-[#555]"
              >
                <ScrambleText 
                  text="LOAD MORE PROJECTS" 
                  className="text-sm font-medium text-[#CCCCCC] group-hover:text-white" 
                />
                <ChevronDown className="w-5 h-5 text-[#CCCCCC] group-hover:text-white group-hover:translate-y-1 transition-transform" />
              </button>
            </div>
          )}

          {/* Bottom Actions */}
          <div className="flex flex-col md:flex-row gap-4 w-full mb-10">
            <a href="https://github.com/ditorizkyka" target="_blank" rel="noopener noreferrer" className="flex-1">
              <button className="w-full flex items-center justify-center space-x-2 bg-[#141415] hover:bg-[#1f1f20] px-6 py-3 rounded-lg group transition-colors">
                <svg className="w-4 h-4 text-[#CCCCCC] group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                <ScrambleText text="GITHUB PROJECTS" className="text-sm text-[#CCCCCC] group-hover:text-white" />
              </button>
            </a>
            <a href="https://drive.google.com/..." target="_blank" rel="noopener noreferrer" className="flex-1">
              <button className="w-full flex items-center justify-center space-x-2 bg-[#141415] hover:bg-[#1f1f20] px-6 py-3 rounded-lg group transition-colors">
                <LinkIcon className="w-4 h-4 text-[#CCCCCC] group-hover:text-white" />
                <ScrambleText text="DRIVE FILES" className="text-sm text-[#CCCCCC] group-hover:text-white" />
              </button>
            </a>
          </div>
        </div>
      </section>

      {/* Modal Dialog dengan Portal - SAMA SEPERTI SOCIAL PROJECTS */}
      {typeof window !== 'undefined' && selectedProject && createPortal(
        <div 
          className="fixed inset-0 z-9999 flex items-center justify-center py-3 px-6 md:p-6 "
          onClick={closeDialog}
        >
          {/* Background Overlay */}
          <div className="absolute inset-0 bg-black/85 backdrop-blur-md transition-opacity" />

          {/* Dialog Content */}
          <div 
            className="relative z-10000 bg-[#0A0A0B] border border-[#333] rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeDialog}
              className="absolute top-4 right-4 z-50 bg-black/70 hover:bg-black/90 text-white p-2 rounded-full backdrop-blur-md transition-all hover:scale-110 border border-white/10"
            >
              <X className="w-5 h-5 md:w-6 md:h-6" />
            </button>

            {/* Header Image */}
            <div className="relative w-full h-56 md:h-72 overflow-hidden rounded-t-2xl">
              <Image
                src={selectedProject.images[0]}
                alt={plainProjectTitle(selectedProject.title)}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 1200px"
                priority
              />
              <div className="absolute inset-0 bg-linear-to-t from-[#0A0A0B] via-transparent to-transparent" />
              
              {/* Label Badge */}
              <div className="absolute top-4 left-4">
                <ProjectBadge label={selectedProject.category} />
              </div>

              {/* Title Overlay */}
              <div className="absolute bottom-4 left-6 right-6">
                <h2 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg">
                  <ProjectTitle value={selectedProject.title} />
                </h2>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 md:p-8 space-y-6">
              {/* Meta Information */}
              <div className="flex flex-wrap gap-4 md:gap-8 pb-6 border-b border-[#1f1f1f]">
                <div className="flex items-center gap-2 text-gray-400">
                  <Calendar className="w-4 h-4 text-[#6DD33D]" />
                  <span className="text-sm font-medium">{selectedProject.duration}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Code className="w-4 h-4 text-[#6DD33D]" />
                  <span className="text-sm font-medium">Tech Stack</span>
                </div>
              </div>

              {/* Tech Stack Tags */}
              <div>
                <h4 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wider">Technologies</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.tech_stack.map((tech, i) => (
                    <span 
                      key={i} 
                      className="px-3 py-1 bg-[#1A1A1A] text-gray-300 text-sm rounded-md border border-[#333] hover:border-[#555] transition-colors"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wider">Deskripsi</h4>
                <ProjectText value={selectedProject.short_description} className="text-gray-300 text-sm md:text-base leading-7" />
              </div>

              {/* Implementation */}
              <div>
                <h4 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wider">Implementasi</h4>
                <ProjectText
                  value={selectedProject.long_description}
                  className="text-gray-300 text-sm md:text-base leading-7"
                  allowLegacyHtml
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col md:flex-row gap-3 pt-4">
                <a 
                  href={selectedProject.repo_link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 py-3 rounded-xl text-center font-medium transition-colors text-white flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  View on GitHub
                </a>
                
                {selectedProject.demo_link && (
                  <a 
                    href={selectedProject.demo_link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-1 bg-green-600 hover:bg-green-700 py-3 rounded-xl text-center font-medium transition-colors text-white flex items-center justify-center gap-2"
                  >
                    <Radio className="w-5 h-5" />
                    Live Demo
                  </a>
                )}
                
                <button 
                  onClick={closeDialog}
                  className="flex-1 bg-[#1f1f1f] hover:bg-[#2a2a2a] text-white font-medium py-3 rounded-xl transition-colors border border-white/5"
                >
                  Close Details
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Animations */}
      <style jsx>{`
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default ProjectShowcase;
