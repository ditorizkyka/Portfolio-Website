"use client";
import { useState , useEffect } from 'react';
// Common Components (Layout)
import SidebarLeft from '@/src/components/organisms/common/SidebarLeft';
import SidebarRight from '@/src/components/organisms/common/SidebarRight';
import StatusBar from '@/src/components/organisms/common/StatusBar';
import MobileTopNav from '@/src/components/organisms/common/MobileTopNav';
import FooterBar from '@/src/components/organisms/common/FooterBar';
import supabase from '@/src/lib/supabase/client';
import { Carousel } from '@/src/types/carousel';
import CarouselSection from '@/src/components/organisms/common/CarouselSection';
import { SoftSkill } from '@/src/types/softSkills';
import SocialSkills from '@/src/components/organisms/softSkills-Section/SocialSection';
import Certifications from '@/src/components/organisms/softSkills-Section/Certifications';
import { Certification } from '@/src/types/certification';
import { Profile } from '@/src/types/profile';

const SocialPage: React.FC = () => {
  const [softSkills, setSoftSkills] = useState<SoftSkill[]>([]);
  const [carousel , setCarousel] = useState<Carousel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [certificates, setCertificates] = useState<Certification[]>([]);
  const [profile, setProfile] = useState<Profile>();

  useEffect(() => {
    const fetchSoftSkills = async () => {
      const { data, error } = await supabase.from('social_projects').select('*');
      if (error) 
        console.error('Error fetching soft skills:', error);
      else 
        setSoftSkills(data);
    };

    const fetchCarousel = async () => {
      const { data, error } = await supabase.from('carousel_content').select('*');
      if (error) 
        console.error('Error fetching carousel:', error);
      else 
        setCarousel(data);
    };

    const fetchCertificates = async () => {
      const { data, error } = await supabase.from('certifications').select('*');
      if (error) 
        console.error('Error fetching certificates:', error);
      else 
        setCertificates(data);
    };

    const fetchProfile = async () => {
      const { data, error } = await supabase.from('profile').select('*');
      if (error) 
        console.error('Error fetching profile:', error);
      else 
        setProfile(data[0]);
      
    };

    const fetchAllData = async () => {
      try {
        await Promise.all([
          fetchSoftSkills(),
          fetchCarousel(),
          fetchCertificates(),
          fetchProfile(),
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-portfolio-canvas flex flex-col items-center justify-center z-50 fixed inset-0">
        <div className="w-12 h-12 border-4 border-portfolio-border-strong border-t-portfolio-accent rounded-full animate-spin mb-4"></div>
        <span className="text-portfolio-body font-space-grotesk tracking-widest text-sm animate-pulse">LOADING ASSETS...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-portfolio-canvas text-portfolio-ink font-space-grotesk selection:bg-portfolio-accent selection:text-portfolio-accent-ink">
      
      {/* 📱 Mobile Navigation */}
      <div className="block md:hidden">
        <MobileTopNav />
      </div>

      {/* 💻 Desktop Navigation & UI */}
      <div className="hidden md:block">
        <SidebarLeft profile={profile as Profile}/>
        <SidebarRight />
        <StatusBar />
      </div>

      {/* 🚀 Main Content Container - DIPERBAIKI PADDING MOBILE */}
      <main className="relative z-10 px-6 pt-20 pb-20 md:px-50  md:pt-20 md:pb-32">
        <div className="max-w-7xl mx-auto space-y-12 md:space-y-20 lg:space-y-32">
          <CarouselSection carousels={carousel} />
          <SocialSkills social={softSkills} />
          <Certifications certifications={certificates} />
        </div>
      </main>

      {/* 🏁 Footer */}
      <FooterBar />

      {/* Background Decorator */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#6DD33D]/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-blue-500/5 blur-[120px] rounded-full" />
      </div>
    </div>
  );
};

export default SocialPage;