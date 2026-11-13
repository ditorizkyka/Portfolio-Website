'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';
import { createPortal } from 'react-dom';

interface ProjectGalleryCarouselProps {
  images: string[];
  title: string;
}

export const ProjectGalleryCarousel: React.FC<ProjectGalleryCarouselProps> = ({ images, title }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const safeImages = images && images.length > 0 ? images : ['/placeholder.png'];
  const hasMultipleImages = safeImages.length > 1;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % safeImages.length);
  }, [safeImages.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + safeImages.length) % safeImages.length);
  }, [safeImages.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'Escape') setIsLightboxOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > 40) {
      if (diff > 0) nextSlide();
      else prevSlide();
    }
    setTouchStartX(null);
  };

  return (
    <div className="w-full space-y-4">
      {/* Main Showcase View */}
      <div
        className="group relative w-full h-[280px] sm:h-[380px] md:h-[480px] lg:h-[540px] rounded-2xl overflow-hidden border border-[#2a2a2e] bg-[#0c0c0e] shadow-2xl select-none"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Ambient Blurred Backdrop for Aspect Ratio Harmony */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <Image
            src={safeImages[currentIndex]}
            alt=""
            fill
            className="object-cover blur-2xl opacity-20 scale-110"
            sizes="100vw"
            priority
          />
        </div>

        {/* Crisp Center Image */}
        <div className="relative w-full h-full flex items-center justify-center p-2 md:p-4">
          <Image
            key={currentIndex}
            src={safeImages[currentIndex]}
            alt={`${title} screenshot ${currentIndex + 1}`}
            fill
            className="object-contain transition-opacity duration-300"
            sizes="(max-width: 768px) 100vw, 1200px"
            priority
          />
        </div>

        {/* Counter Badge */}
        {hasMultipleImages && (
          <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
            <span className="rounded-full border border-white/10 bg-black/75 px-3 py-1 font-mono text-xs text-[#E0E0E0] backdrop-blur-md">
              {currentIndex + 1} / {safeImages.length}
            </span>
          </div>
        )}

        {/* Expand / Lightbox Button */}
        <button
          type="button"
          onClick={() => setIsLightboxOpen(true)}
          className="absolute top-4 left-4 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-black/70 text-white backdrop-blur-md transition-all hover:bg-black/90 hover:scale-105"
          title="Open fullscreen view"
          aria-label="Open fullscreen image view"
        >
          <Maximize2 className="h-4 w-4" />
        </button>

        {/* Navigation Arrow Controls */}
        {hasMultipleImages && (
          <>
            <button
              type="button"
              onClick={prevSlide}
              aria-label="Previous slide"
              className="absolute left-3 md:left-5 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 md:h-11 md:w-11 items-center justify-center rounded-full border border-white/15 bg-black/75 text-white backdrop-blur-md transition-colors hover:bg-white hover:text-black shadow-lg"
            >
              <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
            </button>

            <button
              type="button"
              onClick={nextSlide}
              aria-label="Next slide"
              className="absolute right-3 md:right-5 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 md:h-11 md:w-11 items-center justify-center rounded-full border border-white/15 bg-black/75 text-white backdrop-blur-md transition-colors hover:bg-white hover:text-black shadow-lg"
            >
              <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail Navigation Strip */}
      {hasMultipleImages && (
        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
          {safeImages.map((img, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`relative h-14 w-20 md:h-16 md:w-24 shrink-0 overflow-hidden rounded-xl border transition-colors ${
                  isActive
                    ? 'border-white ring-1 ring-white/30'
                    : 'border-[#262628] opacity-50 hover:opacity-100 hover:border-[#444]'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              >
                <Image
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </button>
            );
          })}
        </div>
      )}

      {/* Lightbox Modal (Portal) */}
      {isLightboxOpen && typeof window !== 'undefined' && createPortal(
        <div
          className="fixed inset-0 z-99999 flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 animate-in fade-in duration-200"
          onClick={() => setIsLightboxOpen(false)}
        >
          <button
            type="button"
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-5 right-5 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/80 text-white backdrop-blur-md transition-colors hover:bg-white hover:text-black"
            aria-label="Close fullscreen"
          >
            <X className="h-5 w-5" />
          </button>

          <div
            className="relative w-full max-w-6xl h-[85vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={safeImages[currentIndex]}
              alt={`${title} enlarged screenshot`}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />

            {hasMultipleImages && (
              <>
                <button
                  type="button"
                  onClick={prevSlide}
                  className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-30 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/80 text-white backdrop-blur-md transition-colors hover:bg-white hover:text-black"
                  aria-label="Previous"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  type="button"
                  onClick={nextSlide}
                  className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-30 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/80 text-white backdrop-blur-md transition-colors hover:bg-white hover:text-black"
                  aria-label="Next"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

