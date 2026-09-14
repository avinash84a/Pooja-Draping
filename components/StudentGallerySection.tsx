'use client';

import React, { useState } from 'react';
import { Camera, X, ChevronLeft, ChevronRight, ZoomIn, Award, Sparkles, Heart } from 'lucide-react';
import businessData from '../data/business-data.json';

export default function StudentGallerySection() {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const gallery = businessData.galleryItems;

  const categories = [
    { id: 'all', label: 'सर्व फोटो (All Moments)' },
    { id: 'Gauri Draping', label: 'गौरी महालक्ष्मी साडी' },
    { id: 'Certificates', label: 'प्रमाणपत्र व विद्यार्थिनी' },
    { id: 'Workshops', label: 'वर्कशॉप प्रात्यक्षिक' },
  ];

  const filteredGallery =
    activeFilter === 'all'
      ? gallery
      : gallery.filter((item) => item.category === activeFilter);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((prev) =>
        prev === 0 ? filteredGallery.length - 1 : (prev as number) - 1
      );
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((prev) =>
        prev === filteredGallery.length - 1 ? 0 : (prev as number) + 1
      );
    }
  };

  return (
    <section id="gallery" className="py-16 sm:py-24 bg-[#FAF7F2] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#8B1E3F] text-xs font-semibold uppercase tracking-wider mb-3 border border-[#EADBCE]">
            <Camera className="w-3.5 h-3.5 text-[#8B1E3F]" />
            Student Gallery & Moments
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#3B1F25] font-serif">
            आमच्या विद्यार्थिनींचे अनुभव
          </h2>
          <p className="text-sm sm:text-base text-[#6E4F55] mt-2">
            वर्कशॉपमधील प्रात्यक्षिके, सराव, सर्टिफिकेट वितरण आणि सुंदर साडी ड्रॅपिंगचे क्षणचित्रे.
          </p>
          <div className="w-16 h-1 bg-[#8B1E3F] mx-auto mt-4 rounded-full" />
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveFilter(cat.id);
                setSelectedImageIndex(null);
              }}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                activeFilter === cat.id
                  ? 'bg-[#8B1E3F] text-white shadow-sm'
                  : 'bg-white text-[#5B454A] hover:bg-gray-50 border border-[#EADBCE]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Gallery Grid / Masonry Look */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGallery.map((item, index) => (
            <div
              key={index}
              onClick={() => setSelectedImageIndex(index)}
              className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl bg-white border border-[#EADBCE] cursor-pointer transition-all transform hover:-translate-y-1"
            >
              {/* Photo Container */}
              <div className="relative h-72 sm:h-80 w-full overflow-hidden bg-gray-100">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#2E0B14]/90 via-[#2E0B14]/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                {/* Top Badge */}
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-xs text-[10px] font-bold text-[#8B1E3F] shadow-xs">
                  {item.category}
                </div>

                {/* Bottom Content */}
                <div className="absolute bottom-0 inset-x-0 p-5 text-white">
                  <h3 className="font-serif font-bold text-base sm:text-lg drop-shadow-sm">
                    {item.title}
                  </h3>
                  <p className="text-xs text-amber-200 mt-0.5">
                    {item.subtitle}
                  </p>
                </div>

                {/* Zoom hint on hover */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/80 text-[#36111B] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                  <ZoomIn className="w-5 h-5 text-[#8B1E3F]" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Gallery Lightbox Modal */}
        {selectedImageIndex !== null && (
          <div
            onClick={() => setSelectedImageIndex(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn"
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedImageIndex(null)}
              className="absolute top-5 right-5 z-50 w-11 h-11 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Prev Button */}
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition-colors"
            >
              <ChevronLeft className="w-7 h-7" />
            </button>

            {/* Next Button */}
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition-colors"
            >
              <ChevronRight className="w-7 h-7" />
            </button>

            {/* Modal Image Box */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full max-h-[85vh] flex flex-col items-center justify-center"
            >
              <img
                src={filteredGallery[selectedImageIndex]?.image}
                alt={filteredGallery[selectedImageIndex]?.title}
                className="max-w-full max-h-[72vh] object-contain rounded-xl shadow-2xl"
                referrerPolicy="no-referrer"
              />

              <div className="mt-4 text-center text-white px-4">
                <h3 className="font-serif font-bold text-lg sm:text-xl">
                  {filteredGallery[selectedImageIndex]?.title}
                </h3>
                <p className="text-xs sm:text-sm text-amber-300 mt-0.5">
                  {filteredGallery[selectedImageIndex]?.subtitle}
                </p>
                <span className="inline-block mt-2 text-[11px] text-gray-400">
                  {selectedImageIndex + 1} of {filteredGallery.length}
                </span>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
