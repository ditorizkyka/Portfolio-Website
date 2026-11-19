import React from 'react';
import Image, { StaticImageData } from 'next/image';

interface HeroImageProps {
  src: string | StaticImageData;
  alt?: string;
  className?: string;
}

const HeroImage = ({ src, alt = "Andito Rizkyka R.", className = "" }: HeroImageProps) => {
  if (!src) {
    return (
      <div className={`relative overflow-hidden rounded-2xl border border-portfolio-border-strong bg-portfolio-panel ${className}`} />
    );
  }

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-portfolio-border-strong bg-portfolio-panel shadow-xl shadow-portfolio-shadow transition-all duration-300 hover:border-portfolio-border-strong ${className}`}
    >
      <Image 
        src={src} 
        alt={alt} 
        fill 
        priority 
        className="object-cover object-top" 
        sizes="(max-width: 768px) 112px, 320px"
      />
    </div>
  );
};

export default HeroImage;