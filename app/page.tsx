'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import AboutSection from '../components/AboutSection';
import WorkshopSection from '../components/WorkshopSection';
import StylesSection from '../components/StylesSection';
import WhyChooseSection from '../components/WhyChooseSection';
import TestimonialsSection from '../components/TestimonialsSection';
import StudentGallerySection from '../components/StudentGallerySection';
import WorkshopProcessSection from '../components/WorkshopProcessSection';
import LocationSection from '../components/LocationSection';
import BookingSection from '../components/BookingSection';
import FaqSection from '../components/FaqSection';
import Footer from '../components/Footer';
import FloatingMobileCTA from '../components/FloatingMobileCTA';
import AdminPanelModal from '../components/AdminPanelModal';
import { ShieldCheck } from 'lucide-react';
import {
  loadFullSiteDataAsync,
  getInitialWorkshopConfig,
  getInitialGallery,
  getInitialStyles,
  getInitialLeads,
  WorkshopConfig,
  GalleryItem,
  BookingLead,
} from '../lib/galleryStorage';

export default function Home() {
  const [preselectedStyle, setPreselectedStyle] = useState<string | undefined>();
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [dataRefreshKey, setDataRefreshKey] = useState(0);

  // Central site data state (Double-layer protection for instant reactivity)
  const [siteData, setSiteData] = useState<{
    workshopConfig: WorkshopConfig;
    galleryItems: GalleryItem[];
    styleImages: Record<string | number, string>;
    leads: BookingLead[];
  }>({
    workshopConfig: getInitialWorkshopConfig(),
    galleryItems: getInitialGallery(),
    styleImages: getInitialStyles(),
    leads: getInitialLeads(),
  });

  const refreshSiteData = async () => {
    try {
      const data = await loadFullSiteDataAsync();
      if (data) {
        setSiteData(data);
      }
    } catch (err) {
      console.warn('Could not refresh full site data:', err);
    }
  };

  const handleDataChanged = () => {
    setDataRefreshKey((prev) => prev + 1);
    refreshSiteData();
  };

  // Initial load & real-time sync listeners
  useEffect(() => {
    let isMounted = true;
    loadFullSiteDataAsync().then((data) => {
      if (isMounted && data) {
        setSiteData(data);
      }
    });

    const handleUpdate = () => {
      loadFullSiteDataAsync().then((data) => {
        if (isMounted && data) {
          setSiteData(data);
        }
      });
    };

    window.addEventListener('pooja_gallery_updated', handleUpdate);
    window.addEventListener('pooja_styles_updated', handleUpdate);
    window.addEventListener('pooja_workshop_updated', handleUpdate);
    window.addEventListener('pooja_leads_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      isMounted = false;
      window.removeEventListener('pooja_gallery_updated', handleUpdate);
      window.removeEventListener('pooja_styles_updated', handleUpdate);
      window.removeEventListener('pooja_workshop_updated', handleUpdate);
      window.removeEventListener('pooja_leads_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  useEffect(() => {
    const checkAdmin = () => {
      try {
        setIsAdminLoggedIn(localStorage.getItem('pooja_admin_authenticated') === 'true');
      } catch {
        setIsAdminLoggedIn(false);
      }
    };
    checkAdmin();
    window.addEventListener('storage', checkAdmin);
    return () => window.removeEventListener('storage', checkAdmin);
  }, [isAdminOpen]);

  const scrollToBooking = (styleName?: string) => {
    if (styleName) {
      setPreselectedStyle(styleName);
    }
    const bookingElement = document.getElementById('booking');
    if (bookingElement) {
      bookingElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToStyles = () => {
    const stylesElement = document.getElementById('styles');
    if (stylesElement) {
      stylesElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2]">
      {/* Sticky Header with Navigation & Trust Metrics */}
      <Navbar
        onBookClick={() => scrollToBooking()}
        onAdminClick={() => setIsAdminOpen(true)}
      />

      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection
          onBookClick={() => scrollToBooking()}
          workshopConfig={siteData.workshopConfig}
        />

        {/* About Section */}
        <AboutSection onExploreStylesClick={scrollToStyles} />

        {/* 1-Day Workshop Section with Editable Fields */}
        <WorkshopSection
          config={siteData.workshopConfig}
          refreshKey={dataRefreshKey}
          onBookClick={() => scrollToBooking()}
        />

        {/* 14+ Saree Draping Styles Showcase */}
        <StylesSection
          customImages={siteData.styleImages}
          refreshKey={dataRefreshKey}
          onBookClick={(styleName) => scrollToBooking(styleName)}
        />

        {/* Why Learn From Pooja? */}
        <WhyChooseSection />

        {/* Genuine Google Reviews & 5.0 Star Testimonials */}
        <TestimonialsSection />

        {/* Student Gallery & Workshop Moments */}
        <StudentGallerySection
          items={siteData.galleryItems}
          refreshKey={dataRefreshKey}
        />

        {/* 6-Step Workshop Learning Roadmap */}
        <WorkshopProcessSection />

        {/* Studio Location & Google Maps */}
        <LocationSection />

        {/* Registration & Booking Form */}
        <BookingSection key={preselectedStyle || 'default'} preselectedStyle={preselectedStyle} />

        {/* FAQs Section */}
        <FaqSection />
      </main>

      {/* Comprehensive Footer */}
      <Footer onAdminClick={() => setIsAdminOpen(true)} />

      {/* Floating Sticky CTA Bar on Mobile */}
      <FloatingMobileCTA onBookClick={() => scrollToBooking()} />

      {/* Floating Admin Trigger (Always accessible, highlighted when logged in) */}
      <div className="fixed bottom-20 sm:bottom-6 left-4 z-40">
        <button
          onClick={() => setIsAdminOpen(true)}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-full shadow-lg border transition-all cursor-pointer ${
            isAdminLoggedIn
              ? 'bg-[#8B1E3F] text-amber-200 border-amber-400 hover:bg-[#721531] ring-2 ring-amber-400/40'
              : 'bg-white/95 text-[#4A1521] border-[#EADBCE] hover:bg-amber-50 backdrop-blur-md'
          }`}
          title="Pooja Tai Admin CMS Panel"
        >
          <ShieldCheck className={`w-4 h-4 ${isAdminLoggedIn ? 'text-amber-300' : 'text-[#8B1E3F]'}`} />
          <span className="text-xs font-bold font-serif hidden sm:inline">
            {isAdminLoggedIn ? 'पूजा ताई (Admin Panel)' : 'ॲडमिन पॅनेल'}
          </span>
          {isAdminLoggedIn && (
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          )}
        </button>
      </div>

      {/* In-App Admin CMS Panel Modal */}
      <AdminPanelModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onDataChanged={handleDataChanged}
      />
    </div>
  );
}
