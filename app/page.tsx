'use client';

import React, { useState } from 'react';
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

export default function Home() {
  const [preselectedStyle, setPreselectedStyle] = useState<string | undefined>();

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
      <Navbar onBookClick={() => scrollToBooking()} />

      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection onBookClick={() => scrollToBooking()} />

        {/* About Section */}
        <AboutSection onExploreStylesClick={scrollToStyles} />

        {/* 1-Day Workshop Section with Editable Fields */}
        <WorkshopSection onBookClick={() => scrollToBooking()} />

        {/* 14+ Saree Draping Styles Showcase */}
        <StylesSection onBookClick={(styleName) => scrollToBooking(styleName)} />

        {/* Why Learn From Pooja? */}
        <WhyChooseSection />

        {/* Genuine Google Reviews & 5.0 Star Testimonials */}
        <TestimonialsSection />

        {/* Student Gallery & Workshop Moments */}
        <StudentGallerySection />

        {/* 6-Step Workshop Learning Roadmap */}
        <WorkshopProcessSection />

        {/* Studio Location & Google Maps */}
        <LocationSection />

        {/* Registration & Booking Form */}
        <BookingSection preselectedStyle={preselectedStyle} />

        {/* FAQs Section */}
        <FaqSection />
      </main>

      {/* Comprehensive Footer */}
      <Footer />

      {/* Floating Sticky CTA Bar on Mobile */}
      <FloatingMobileCTA onBookClick={() => scrollToBooking()} />
    </div>
  );
}
