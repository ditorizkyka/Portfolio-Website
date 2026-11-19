'use client';
import React, { useEffect, useState, useRef } from 'react';
import { Link as LinkIcon, Shapes, ChevronDown, Filter, Check } from 'lucide-react';
import { ProjectCard } from '../../molecules/ProjectCard';
import ScrambleText from "../../atoms/buttonAnimation";
import { Project } from '@/src/types/project';
import { getProjectCategory, PROJECT_CATEGORIES } from '@/src/lib/projectCategories';

const PROJECTS_PER_LOAD = 9;
const PROJECT_FILTERS = ['All Projects', ...PROJECT_CATEGORIES] as const;
type ProjectFilter = typeof PROJECT_FILTERS[number];

const ProjectShowcase: React.FC<{ projects: Project[] }> = ({ projects }) => {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [filter, setFilter] = useState<ProjectFilter>('All Projects');
  const [visibleCount, setVisibleCount] = useState(PROJECTS_PER_LOAD);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDropdownOpen]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const truncateText = (text: string, maxLines = 2): string => {
    const words = text.split(' ');
    const maxWords = maxLines * 15;
    return words.length > maxWords ? words.slice(0, maxWords).join(' ') + '...' : text;
  };

  const selectFilter = (nextFilter: ProjectFilter) => {
    if (nextFilter === filter) return;
    setFilter(nextFilter);
    setVisibleCount(PROJECTS_PER_LOAD);
  };

  const getFilterCount = (option: ProjectFilter) => {
    if (option === 'All Projects') return projects.length;
    return projects.filter((project) => getProjectCategory(project.category) === option).length;
  };

  const filteredProjects = filter === 'All Projects'
    ? projects
    : projects.filter((project) => getProjectCategory(project.category) === filter);
  const visibleProjects = filteredProjects.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProjects.length;

  return (
    <>
      <section className="bg-portfolio-canvas min-h-screen text-left  md:px-0 font-space-grotesk">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6 md:mb-10">
            <div className="flex items-center gap-3 mb-4 md:mb-6">
              <Shapes className="w-7 h-7 md:w-8 md:h-8 text-portfolio-ink" />
              <h1 className="text-xl md:text-4xl font-bold text-portfolio-ink">All projects details</h1>
            </div>
            <p className="text-portfolio-muted text-xs md:text-lg max-w-4xl leading-relaxed">
              Formulating comprehensive strategies to meet your design goals and exceed expectations.
            </p>
          </div>

          {/* Filter Dropdown */}
          <div className="relative mb-6 md:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div ref={dropdownRef} className="relative inline-block w-full sm:w-auto text-left">
              <button
                type="button"
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                className={`flex w-full sm:w-auto items-center justify-between sm:justify-start gap-2.5 rounded-xl border px-4 py-2.5 text-xs md:text-sm font-medium transition-colors ${
                  isDropdownOpen
                    ? 'border-portfolio-border-strong bg-portfolio-raised text-portfolio-ink'
                    : filter !== 'All Projects'
                    ? 'border-portfolio-border-strong bg-portfolio-panel text-portfolio-ink'
                    : 'border-portfolio-border-strong bg-portfolio-panel text-portfolio-body hover:border-portfolio-border-strong hover:text-portfolio-ink'
                }`}
                aria-haspopup="listbox"
                aria-expanded={isDropdownOpen}
              >
                <div className="flex items-center gap-2.5">
                  <Filter className="w-4 h-4 text-portfolio-muted" />
                  <span className="text-portfolio-muted">Filter:</span>
                  <span className="font-semibold text-portfolio-ink">{filter}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full px-2 py-0.5 text-[11px] font-mono border border-portfolio-border-strong bg-portfolio-raised text-portfolio-body">
                    {filteredProjects.length}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-portfolio-muted transition-transform duration-200 ${
                      isDropdownOpen ? 'rotate-180 text-portfolio-ink' : ''
                    }`}
                  />
                </div>
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div
                  role="listbox"
                  className="absolute left-0 mt-2 w-full sm:w-64 origin-top-left rounded-xl border border-portfolio-border-strong bg-portfolio-panel p-1.5 shadow-2xl shadow-portfolio-shadow z-30 animate-dropdown"
                >
                  <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-portfolio-muted border-b border-portfolio-border mb-1">
                    Select Category
                  </div>
                  {PROJECT_FILTERS.map((option) => {
                    const isSelected = filter === option;
                    const count = getFilterCount(option);

                    return (
                      <button
                        key={option}
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => {
                          selectFilter(option);
                          setIsDropdownOpen(false);
                        }}
                        className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-xs md:text-sm transition-colors text-left ${
                          isSelected
                            ? 'bg-portfolio-raised text-portfolio-ink font-medium'
                            : 'text-portfolio-body hover:bg-portfolio-raised hover:text-portfolio-ink'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          {isSelected ? (
                            <Check className="w-4 h-4 text-portfolio-ink shrink-0" />
                          ) : (
                            <span className="w-4 h-4 shrink-0" />
                          )}
                          <span>{option}</span>
                        </div>
                        <span className="rounded-full px-2 py-0.5 text-[11px] font-mono border border-portfolio-border-strong bg-portfolio-raised text-portfolio-muted">
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Reset button if filter active */}
            {filter !== 'All Projects' && (
              <button
                type="button"
                onClick={() => selectFilter('All Projects')}
                className="self-start sm:self-auto text-xs text-portfolio-muted hover:text-portfolio-ink transition-colors underline underline-offset-4 decoration-portfolio-border-strong hover:decoration-portfolio-ink"
              >
                Reset to All Projects
              </button>
            )}
          </div>

          <p role="status" className={filteredProjects.length ? 'sr-only' : 'mb-10 rounded-xl border border-portfolio-border-strong p-6 text-sm text-portfolio-body'}>
            {filteredProjects.length
              ? `Showing ${visibleProjects.length} of ${filteredProjects.length} projects`
              : 'No projects found.'}
          </p>

          {/* Projects Grid */}
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 mb-10">
            {visibleProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                isMobile={isMobile}
                truncateText={truncateText}
              />
            ))}
          </div>

          {/* Load More Button */}
          {hasMore && (
            <div className="flex justify-center mb-10">
              <button
                onClick={() => setVisibleCount((count) => Math.min(count + PROJECTS_PER_LOAD, filteredProjects.length))}
                className="group flex items-center gap-3 bg-portfolio-panel hover:bg-portfolio-raised px-8 py-4 rounded-xl transition-all duration-300 border border-portfolio-border-strong hover:border-portfolio-border-strong"
              >
                <ScrambleText 
                  text="LOAD MORE PROJECTS" 
                  className="text-sm font-medium text-portfolio-body group-hover:text-portfolio-ink"
                />
                <ChevronDown className="w-5 h-5 text-portfolio-body group-hover:text-portfolio-ink group-hover:translate-y-1 transition-transform" />
              </button>
            </div>
          )}

          {/* Bottom Actions */}
          <div className="flex flex-col md:flex-row gap-4 w-full mb-10">
            <a href="https://github.com/ditorizkyka" target="_blank" rel="noopener noreferrer" className="flex-1">
              <button className="w-full flex items-center justify-center space-x-2 bg-portfolio-panel hover:bg-portfolio-raised px-6 py-3 rounded-lg group transition-colors">
                <svg className="w-4 h-4 text-portfolio-body group-hover:text-portfolio-ink" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                <ScrambleText text="GITHUB PROJECTS" className="text-sm text-portfolio-body group-hover:text-portfolio-ink" />
              </button>
            </a>
            <a href="https://drive.google.com/..." target="_blank" rel="noopener noreferrer" className="flex-1">
              <button className="w-full flex items-center justify-center space-x-2 bg-portfolio-panel hover:bg-portfolio-raised px-6 py-3 rounded-lg group transition-colors">
                <LinkIcon className="w-4 h-4 text-portfolio-body group-hover:text-portfolio-ink" />
                <ScrambleText text="DRIVE FILES" className="text-sm text-portfolio-body group-hover:text-portfolio-ink" />
              </button>
            </a>
          </div>
        </div>
      </section>

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

        @keyframes dropdownFade {
          from {
            opacity: 0;
            transform: translateY(-8px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .animate-dropdown {
          animation: dropdownFade 0.18s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </>
  );
};

export default ProjectShowcase;
