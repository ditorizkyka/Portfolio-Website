'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowLeft, 
  ArrowRight, 
  Calendar, 
  Code2, 
  ExternalLink, 
  Share2, 
  Check, 
  Sparkles, 
  Layers, 
  AlertCircle, 
  Compass, 
  Shapes 
} from 'lucide-react';
import supabase from '@/src/lib/supabase/client';
import { Project } from '@/src/types/project';
import { Profile } from '@/src/types/profile';
import { TechStack } from '@/src/types/techStack';
import { ProjectBadge } from '@/src/components/molecules/ProjectCard';
import { ProjectText, ProjectTitle } from '@/src/components/atoms/ProjectText';
import { plainProjectTitle } from '@/src/lib/projectText';
import { ProjectGalleryCarousel } from '@/src/components/organisms/hardSkills-Section/ProjectGalleryCarousel';
import SidebarLeft from '@/src/components/organisms/common/SidebarLeft';
import SidebarRight from '@/src/components/organisms/common/SidebarRight';
import StatusBar from '@/src/components/organisms/common/StatusBar';
import MobileTopNav from '@/src/components/organisms/common/MobileTopNav';
import FooterBar from '@/src/components/organisms/common/FooterBar';
import ScrambleText from '@/src/components/atoms/buttonAnimation';

export default function ProjectDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [project, setProject] = useState<Project | null>(null);
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [allTechStacks, setAllTechStacks] = useState<TechStack[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!slug) return;

    const fetchData = async () => {
      try {
        setIsLoading(true);

        const decodedSlug = decodeURIComponent(slug).trim();
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(decodedSlug);

        let targetProject: Project | null = null;

        // 1. Fetch by UUID if it matches UUID format
        if (isUUID) {
          const { data: byId } = await supabase
            .from('projects')
            .select('*')
            .eq('id', decodedSlug)
            .maybeSingle();

          if (byId) targetProject = byId;
        }

        // 2. Fetch by slug if not found by UUID
        if (!targetProject) {
          const { data: bySlug } = await supabase
            .from('projects')
            .select('*')
            .eq('slug', decodedSlug)
            .maybeSingle();

          if (bySlug) targetProject = bySlug;
        }

        // 3. Fetch all projects for Previous / Next navigation
        const { data: listData } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false });

        if (listData) {
          setAllProjects(listData);

          // Fallback search in listData if exact query missed
          if (!targetProject) {
            targetProject = listData.find(
              (p) => p.slug === decodedSlug || p.id === decodedSlug
            ) || null;
          }
        }

        setProject(targetProject);

        // 4. Fetch profile for sidebar
        const { data: profileData } = await supabase
          .from('profile')
          .select('*')
          .maybeSingle();

        if (profileData) {
          setProfile(profileData);
        }

        // 5. Fetch all core tech stacks to get icons
        const { data: stacksData } = await supabase
          .from('tech_stacks')
          .select('*');

        if (stacksData) {
          setAllTechStacks(stacksData);
        }
      } catch (err) {
        console.error('Error fetching project detail:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  const getTechStackInfo = (tech: string): TechStack | null => {
    if (!tech || !allTechStacks.length) return null;
    const trimmed = tech.trim().toLowerCase();

    // 1. Direct ID or exact name match
    const exact = allTechStacks.find(
      (s) => s.id === tech || s.name.trim().toLowerCase() === trimmed
    );
    if (exact) return exact;

    // 2. Alphanumeric normalized match (e.g. "Next.js" vs "NextJS")
    const techNorm = trimmed.replace(/[^a-z0-9]/g, '');
    const normalized = allTechStacks.find(
      (s) => s.name.trim().toLowerCase().replace(/[^a-z0-9]/g, '') === techNorm
    );
    if (normalized) return normalized;

    // 3. Partial / substring match
    const partial = allTechStacks.find((s) => {
      const sLower = s.name.trim().toLowerCase();
      return sLower.includes(trimmed) || trimmed.includes(sLower);
    });
    return partial || null;
  };

  const handleShare = async () => {
    try {
      if (typeof window !== 'undefined') {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // Fallback
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center z-50 fixed inset-0 font-space-grotesk text-white">
        <div className="w-10 h-10 border-2 border-[#333] border-t-white rounded-full animate-spin mb-4" />
        <span className="text-[#888] tracking-widest text-xs">
          LOADING PROJECT...
        </span>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-black text-white font-space-grotesk flex flex-col items-center justify-center px-6">
        <div className="max-w-md text-center space-y-4">
          <AlertCircle className="w-10 h-10 text-[#888] mx-auto" />
          <h1 className="text-2xl font-bold">Project Not Found</h1>
          <p className="text-[#888] text-sm">
            We could not find the project you were looking for. It may have been moved or removed.
          </p>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 rounded-xl bg-[#141415] border border-[#333] px-5 py-2.5 text-sm font-medium hover:border-[#555] text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to All Projects
          </Link>
        </div>
      </div>
    );
  }

  // Calculate Next and Previous project
  const currentIndex = allProjects.findIndex((p) => p.id === project.id);
  const prevProject = currentIndex > 0 ? allProjects[currentIndex - 1] : null;
  const nextProject = currentIndex >= 0 && currentIndex < allProjects.length - 1 ? allProjects[currentIndex + 1] : null;

  return (
    <div className="min-h-screen bg-black text-white font-space-grotesk">
      {/* Mobile Top Navigation */}
      <div className="block md:hidden">
        <MobileTopNav />
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:block">
        {profile && <SidebarLeft profile={profile} />}
        <SidebarRight />
        <StatusBar />
      </div>

      {/* Main Container */}
      <main className="relative z-10 px-4 sm:px-6 pt-20 pb-24 md:px-32 lg:px-44 md:pt-24 md:pb-36">
        <div className="max-w-5xl mx-auto space-y-10 md:space-y-12">
          
          {/* Top Breadcrumb & Actions Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#1f1f20] pb-5">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-xs md:text-sm font-medium text-[#888] hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to all projects</span>
            </Link>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-2 rounded-lg border border-[#2a2a2e] bg-[#141415] px-3 py-1.5 text-xs font-medium text-[#ccc] hover:border-[#444] hover:text-white transition-colors"
                title="Share this project link"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-white" />
                    <span>Link Copied</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5 text-[#888]" />
                    <span>Share</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Hero Header */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2.5">
              <ProjectBadge label={project.category} />
              {project.is_featured && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#333] bg-[#141416] px-3 py-0.5 text-xs font-medium text-[#bbb]">
                  <Sparkles className="w-3 h-3 text-[#aaa]" />
                  Featured Project
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
              <ProjectTitle value={project.title} />
            </h1>

            {/* Short Description Lead */}
            {project.short_description && (
              <div className="text-base sm:text-lg text-[#999999] leading-relaxed max-w-4xl">
                <ProjectText value={project.short_description} className="text-base sm:text-lg text-[#999999] leading-relaxed" />
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {project.demo_link && (
                <a
                  href={project.demo_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-xs md:text-sm font-semibold text-black hover:bg-[#e0e0e0] transition-colors"
                >
                  <span>LIVE DEMO</span>
                  <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
                </a>
              )}

              {project.repo_link && (
                <a
                  href={project.repo_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-[#333] bg-[#141415] px-5 py-2.5 text-xs md:text-sm font-medium text-[#ccc] hover:border-[#555] hover:text-white transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  <span>GITHUB REPO</span>
                </a>
              )}
            </div>
          </div>

          {/* 1. Project Photo Gallery Carousel */}
          <section className="space-y-4">
            <ProjectGalleryCarousel 
              images={project.images} 
              title={plainProjectTitle(project.title)} 
            />
          </section>

          {/* 2. Specs & Tech Stack Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 rounded-xl border border-[#222] bg-[#0c0c0e] p-5 md:p-6">
            {/* Duration */}
            <div className="space-y-1">
              <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#777]">
                <Calendar className="w-3.5 h-3.5 text-[#aaa]" />
                Duration
              </span>
              <p className="text-sm md:text-base font-medium text-white">
                {project.duration || 'Not specified'}
              </p>
            </div>

            {/* Category */}
            <div className="space-y-1">
              <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#777]">
                <Shapes className="w-3.5 h-3.5 text-[#aaa]" />
                Domain
              </span>
              <p className="text-sm md:text-base font-medium text-white">
                {project.category}
              </p>
            </div>

            {/* Tech Stack List */}
            <div className="space-y-2.5 sm:col-span-3 pt-4 border-t border-[#1a1a1c]">
              <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#777]">
                <Code2 className="w-3.5 h-3.5 text-[#aaa]" />
                Technologies & Tools
              </span>
              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                {project.tech_stack && project.tech_stack.length > 0 ? (
                  project.tech_stack.map((tech, idx) => {
                    const stackInfo = getTechStackInfo(tech);
                    const iconUrl = stackInfo?.icon_url;
                    const techTitle = stackInfo?.name || tech;
                    const docUrl = stackInfo?.doc_url;

                    if (iconUrl) {
                      const iconContent = (
                        <div className="relative h-5 w-5 md:h-6 md:w-6 transition-transform duration-200 group-hover:scale-110">
                          <Image
                            src={iconUrl}
                            alt={techTitle}
                            fill
                            className="object-contain"
                            sizes="32px"
                            unoptimized
                          />
                        </div>
                      );

                      const tooltip = (
                        <div className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-[#333] bg-[#141416] px-2 py-0.5 text-[10px] font-medium text-white opacity-0 shadow-lg transition-all duration-150 group-hover:opacity-100 z-30">
                          {techTitle}
                        </div>
                      );

                      if (docUrl) {
                        return (
                          <a
                            key={idx}
                            href={docUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            title={techTitle}
                            className="group relative flex h-10 w-10 md:h-11 md:w-11 items-center justify-center rounded-xl bg-white p-2 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:shadow-white/10"
                          >
                            {iconContent}
                            {tooltip}
                          </a>
                        );
                      }

                      return (
                        <div
                          key={idx}
                          title={techTitle}
                          className="group relative flex h-10 w-10 md:h-11 md:w-11 items-center justify-center rounded-xl bg-white p-2 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:shadow-white/10"
                        >
                          {iconContent}
                          {tooltip}
                        </div>
                      );
                    }

                    return (
                      <span
                        key={idx}
                        className="rounded-lg border border-[#26262a] bg-[#141416] px-3 py-1.5 text-xs font-medium text-[#ccc]"
                      >
                        {tech}
                      </span>
                    );
                  })
                ) : (
                  <span className="text-xs text-[#666]">General Web Technologies</span>
                )}
              </div>
            </div>
          </div>

          {/* 3 Dedicated Case Study Pillars */}
          <div className="space-y-6">
            
            {/* 4. Background (Why this project created) */}
            <section className="rounded-xl border border-[#222] bg-[#0c0c0e] p-6 md:p-8 space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#18181a] border border-[#26262a] text-white">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#888]">01. The Problem</span>
                  <h2 className="text-lg md:text-xl font-bold text-white">Background & Motivation</h2>
                </div>
              </div>

              <div className="text-sm md:text-base text-[#bbb] leading-relaxed pt-2 border-t border-[#1a1a1c]">
                {project.background ? (
                  <ProjectText value={project.background} className="text-sm md:text-base text-[#bbb] leading-relaxed" allowLegacyHtml />
                ) : (
                  <p className="italic text-[#777]">
                    This project was created to address real-world workflows, solve technical challenges, and build an intuitive, efficient solution tailored to user needs.
                  </p>
                )}
              </div>
            </section>

            {/* 5. Implementation (What you created) */}
            <section className="rounded-xl border border-[#222] bg-[#0c0c0e] p-6 md:p-8 space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#18181a] border border-[#26262a] text-white">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#888]">02. The Architecture</span>
                  <h2 className="text-lg md:text-xl font-bold text-white">Implementation & Engineering Details</h2>
                </div>
              </div>

              <div className="text-sm md:text-base text-[#bbb] leading-relaxed pt-2 border-t border-[#1a1a1c]">
                {project.implementation || project.long_description ? (
                  <ProjectText 
                    value={project.implementation || project.long_description} 
                    className="text-sm md:text-base text-[#bbb] leading-relaxed"
                    allowLegacyHtml 
                  />
                ) : (
                  <p className="italic text-[#777]">
                    Detailed implementation breakdown for this project is being updated.
                  </p>
                )}
              </div>
            </section>

            {/* 6. Struggle (What struggle during development) */}
            <section className="rounded-xl border border-[#222] bg-[#0c0c0e] p-6 md:p-8 space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#18181a] border border-[#26262a] text-white">
                  <AlertCircle className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#888]">03. Key Learnings</span>
                  <h2 className="text-lg md:text-xl font-bold text-white">Struggles & How They Were Solved</h2>
                </div>
              </div>

              <div className="text-sm md:text-base text-[#bbb] leading-relaxed pt-2 border-t border-[#1a1a1c]">
                {project.struggle ? (
                  <ProjectText value={project.struggle} className="text-sm md:text-base text-[#bbb] leading-relaxed" allowLegacyHtml />
                ) : (
                  <p className="italic text-[#777]">
                    Overcoming complex state synchronization, latency optimization, and responsive design edge cases provided crucial insights and refined engineering skills throughout this project&apos;s development lifecycle.
                  </p>
                )}
              </div>
            </section>

          </div>

          {/* Previous / Next Project Navigation Footer */}
          <div className="pt-8 border-t border-[#1f1f22]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {prevProject ? (
                <Link
                  href={`/projects/${prevProject.slug || prevProject.id}`}
                  className="flex flex-col justify-between rounded-xl border border-[#222] bg-[#0c0c0e] p-4 hover:border-[#444] transition-colors"
                >
                  <div className="flex items-center gap-2 text-xs font-mono text-[#777] mb-1.5">
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>PREVIOUS PROJECT</span>
                  </div>
                  <h4 className="text-sm md:text-base font-semibold text-white line-clamp-1">
                    <ProjectTitle value={prevProject.title} />
                  </h4>
                </Link>
              ) : (
                <div className="rounded-xl border border-transparent p-4" />
              )}

              {nextProject ? (
                <Link
                  href={`/projects/${nextProject.slug || nextProject.id}`}
                  className="flex flex-col justify-between items-end text-right rounded-xl border border-[#222] bg-[#0c0c0e] p-4 hover:border-[#444] transition-colors"
                >
                  <div className="flex items-center gap-2 text-xs font-mono text-[#777] mb-1.5">
                    <span>NEXT PROJECT</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                  <h4 className="text-sm md:text-base font-semibold text-white line-clamp-1">
                    <ProjectTitle value={nextProject.title} />
                  </h4>
                </Link>
              ) : (
                <div className="rounded-xl border border-transparent p-4" />
              )}
            </div>

            {/* Back to all button */}
            <div className="flex justify-center mt-8">
              <Link href="/projects">
                <button
                  type="button"
                  className="inline-flex items-center gap-2.5 rounded-xl border border-[#333] bg-[#141415] px-6 py-3 text-xs md:text-sm font-medium text-[#ccc] hover:border-[#555] hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 text-[#888]" />
                  <ScrambleText text="ALL PROJECTS DIRECTORY" className="text-xs md:text-sm font-semibold text-white" />
                </button>
              </Link>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <FooterBar />
    </div>
  );
}
