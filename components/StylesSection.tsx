'use client';

import React, { useState } from 'react';
import { Sparkles, Eye, Check, X, ArrowRight } from 'lucide-react';
import businessData from '../data/business-data.json';

interface StylesSectionProps {
  onBookClick: (styleName?: string) => void;
}

export default function StylesSection({ onBookClick }: StylesSectionProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedStyle, setSelectedStyle] = useState<any | null>(null);

  const styles = businessData.drapingStyles;

  const categories = [
    { id: 'all', label: 'सर्व प्रकार (All 14+)' },
    { id: 'Gauri Mahalakshmi', label: 'गौरी महालक्ष्मी पॅटर्न' },
    { id: 'Maharashtrian Classic', label: 'नऊवारी व काष्टा' },
    { id: 'Designer Royal', label: 'डिझायनर व फेस्टिव्ह' },
  ];

  const filteredStyles =
    activeCategory === 'all'
      ? styles
      : styles.filter((s) => {
          if (activeCategory === 'Gauri Mahalakshmi') return s.category.includes('Gauri');
          if (activeCategory === 'Maharashtrian Classic')
            return s.category.includes('Maharashtrian') || s.category.includes('Heritage') || s.category.includes('Regional');
          if (activeCategory === 'Designer Royal')
            return s.category.includes('Designer') || s.category.includes('Festive') || s.category.includes('Artistic') || s.category.includes('Cinematic');
          return true;
        });

  return (
    <section id="styles" className="py-16 sm:py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF0F3] text-[#8B1E3F] text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Exquisite Draping Collection
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#3B1F25] font-serif">
            14+ सुंदर साडी ड्रॅपिंग प्रकार
          </h2>
          <p className="text-sm sm:text-base text-[#6E4F55] mt-2 max-w-xl mx-auto">
            गौरी सण, लग्नकार्य, फोटोशूट आणि पूजाविधीसाठी लागणारे सर्व पारंपारिक आणि आधुनिक पॅटर्न प्रत्यक्ष शिकवले जातात.
          </p>
          <div className="w-16 h-1 bg-[#8B1E3F] mx-auto mt-4 rounded-full" />
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                activeCategory === cat.id
                  ? 'bg-[#8B1E3F] text-white shadow-sm'
                  : 'bg-[#FAF7F2] text-[#5B454A] hover:bg-[#F2EAE0] border border-[#EADBCE]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Saree Styles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredStyles.map((item, index) => (
            <div
              key={item.id}
              onClick={() => setSelectedStyle(item)}
              className="group cursor-pointer rounded-2xl overflow-hidden bg-[#FAF7F2] border border-[#EAE2D7] hover:border-[#8B1E3F]/50 hover:shadow-lg transition-all flex flex-col justify-between"
            >
              {/* Image Preview Container */}
              <div className="relative h-60 w-full overflow-hidden bg-gray-100">
                <img
                  src={item.image}
                  alt={item.nameMarathi}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
                
                {/* Number Badge */}
                <div className="absolute top-3 left-3 w-7 h-7 rounded-full bg-[#581825]/90 text-amber-200 text-xs font-bold flex items-center justify-center shadow-md">
                  {index + 1}
                </div>

                {/* Accent Tag */}
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-xs text-[10px] font-bold text-[#8B1E3F] shadow-xs">
                  {item.accent}
                </div>

                {/* Hover overlay hint */}
                <div className="absolute inset-0 bg-[#36111B]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white text-[#36111B] text-xs font-bold shadow-md">
                    <Eye className="w-3.5 h-3.5 text-[#8B1E3F]" />
                    तपशील पहा
                  </span>
                </div>
              </div>

              {/* Card Information */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-[#3B1F25] group-hover:text-[#8B1E3F] transition-colors font-serif">
                    {item.nameMarathi}
                  </h3>
                  <p className="text-xs text-[#7A585F] font-medium tracking-wide">
                    {item.nameEnglish}
                  </p>
                  <p className="text-xs text-[#5B454A] mt-2.5 line-clamp-2 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-3.5 mt-3.5 border-t border-[#EAE2D7] flex items-center justify-between">
                  <span className="text-[11px] font-medium text-[#8B1E3F]">
                    वर्कशॉपमध्ये समाविष्ट
                  </span>
                  <span className="text-xs font-semibold text-[#8B1E3F] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    शिकायचे आहे? →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner for All 14+ Styles */}
        <div className="mt-12 text-center p-6 rounded-2xl bg-gradient-to-r from-[#FAF4EE] via-[#FDFBF8] to-[#FAF4EE] border border-[#EADBCE] max-w-2xl mx-auto">
          <p className="text-sm sm:text-base font-semibold text-[#4A1521]">
            हे सर्व 14+ साडी ड्रॅपिंग प्रकार तुम्ही एकाच 1-डे वर्कशॉपमध्ये स्वतः हाताने शिकू शकता!
          </p>
          <div className="mt-4">
            <button
              onClick={() => onBookClick()}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#8B1E3F] hover:bg-[#721531] text-white text-xs sm:text-sm font-semibold shadow-sm transition-all"
            >
              <span>वर्कशॉपसाठी तारीख व जागा तपासा</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* Style Details Modal */}
      {selectedStyle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-[#EADBCE]">
            
            {/* Modal Image */}
            <div className="relative h-64 sm:h-72 w-full bg-gray-100">
              <img
                src={selectedStyle.image}
                alt={selectedStyle.nameMarathi}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <button
                onClick={() => setSelectedStyle(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-gray-700 flex items-center justify-center shadow-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-4 px-3 py-1 rounded-full bg-amber-400 text-[#36111B] text-xs font-bold">
                {selectedStyle.accent}
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="mb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#8B1E3F]">
                  {selectedStyle.category}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold font-serif text-[#3B1F25]">
                  {selectedStyle.nameMarathi}
                </h3>
                <p className="text-xs text-gray-500 font-medium">{selectedStyle.nameEnglish}</p>
              </div>

              <p className="text-sm text-[#4A3E3D] leading-relaxed mb-5">
                {selectedStyle.desc}
              </p>

              {/* Training details */}
              <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#EADBCE] space-y-2 mb-6 text-xs text-[#5B454A]">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>प्रत्यक्ष प्रात्यक्षिक व स्वतः सराव</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>परफेक्ट प्लीट्स आणि पदर सेटिंगचे बारकावे</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>पूजा मॅडमचे वैयक्तिक लक्ष व मार्गदर्शन</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    const name = selectedStyle.nameMarathi;
                    setSelectedStyle(null);
                    onBookClick(name);
                  }}
                  className="flex-1 py-3 rounded-xl bg-[#8B1E3F] hover:bg-[#721531] text-white text-sm font-semibold shadow-md transition-all text-center"
                >
                  हा पॅटर्न शिकण्यासाठी नोंदणी करा
                </button>
                <button
                  onClick={() => setSelectedStyle(null)}
                  className="px-4 py-3 rounded-xl border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-colors"
                >
                  बंद करा
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </section>
  );
}
