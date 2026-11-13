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
      <div className={`relative overflow-hidden rounded-2xl border border-[#333333] bg-[#141415] ${className}`} />
    );
  }

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-[#333333] bg-[#141415] shadow-xl transition-all duration-300 hover:border-[#555555] ${className}`}
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