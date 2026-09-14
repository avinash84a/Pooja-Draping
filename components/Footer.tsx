'use client';

import React from 'react';
import {
  MapPin,
  Phone,
  MessageCircle,
  Star,
  Instagram,
  Facebook,
  ExternalLink,
  Heart,
  ArrowUp,
} from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#2D0F16] text-[#F3E8E9] pt-14 pb-24 sm:pb-16 border-t border-[#4A1521]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          
          {/* Brand Info & Motto */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-[#36111B] flex items-center justify-center font-serif text-xl font-bold shadow-md">
                पूं
              </div>
              <div>
                <h3 className="text-xl font-bold font-serif text-white tracking-tight">
                  Pooja Saree Draping Pune
                </h3>
                <p className="text-xs text-amber-300 font-medium">
                  पूजा साडी ड्रॅपिंग व ट्रेनिंग सेंटर, पुणे
                </p>
              </div>
            </div>

            <p className="text-sm text-amber-100/85 italic leading-relaxed font-serif">
              “सुंदर साडी ड्रॅपिंग शिका आणि आत्मविश्वासाने साडी नेसा.”
            </p>

            <p className="text-xs text-[#E0CDD0] leading-relaxed max-w-md">
              पुण्यातील सिंहगड रोड परिसरातील अग्रगण्य व ५-स्टार मानांकित साडी ड्रॅपिंग प्रशिक्षण केंद्र. गौरी महालक्ष्मी, नऊवारी, ब्राह्मणी व डिझायनर साडी ड्रॅपिंगचे प्रत्यक्ष हँड्स-ऑन प्रॅक्टिकल.
            </p>

            {/* Google Rating Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs text-amber-300">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="font-bold">5.0 (33 Google Reviews)</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-serif">
              महत्त्वाचे दुवे (Quick Links)
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-[#E0CDD0]">
              <li>
                <a href="#home" className="hover:text-amber-300 transition-colors">
                  मुख्यपृष्ठ (Home)
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-amber-300 transition-colors">
                  पूजा मॅडमबद्दल (About)
                </a>
              </li>
              <li>
                <a href="#workshop" className="hover:text-amber-300 transition-colors">
                  1 डे वर्कशॉप (Workshops)
                </a>
              </li>
              <li>
                <a href="#styles" className="hover:text-amber-300 transition-colors">
                  साडी ड्रॅपिंग प्रकार (Draping Styles)
                </a>
              </li>
              <li>
                <a href="#reviews" className="hover:text-amber-300 transition-colors">
                  विद्यार्थिनींचे रिव्ह्यूज (Reviews)
                </a>
              </li>
              <li>
                <a href="#gallery" className="hover:text-amber-300 transition-colors">
                  फोटो गॅलरी (Gallery)
                </a>
              </li>
              <li>
                <a href="#location" className="hover:text-amber-300 transition-colors">
                  आमचे ठिकाण (Location)
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-amber-300 transition-colors">
                  प्रश्नोत्तरे (FAQs)
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Address */}
          <div className="lg:col-span-4 space-y-3.5">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-serif">
              संपर्क व ठिकाण (Contact)
            </h4>

            <div className="space-y-3 text-xs sm:text-sm text-[#E0CDD0]">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <p>
                  साईप्रभा हाऊस, जगताप हॉस्पिटल समोर,<br />
                  सिंहगड रोड, आनंद नगर, पुणे - 411051
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <a href="tel:8446917187" className="hover:text-white font-semibold">
                  84469 17187
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <a
                  href="https://wa.me/918446917187"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white font-semibold text-emerald-400"
                >
                  WhatsApp वर चॅट करा
                </a>
              </div>
            </div>

            {/* Social Links */}
            <div className="pt-2">
              <span className="text-xs text-gray-400 block mb-2 font-medium">आम्हाला फॉलो करा:</span>
              <div className="flex items-center gap-2.5">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  href="https://wa.me/918446917187"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  className="w-9 h-9 rounded-full bg-emerald-600/80 hover:bg-emerald-600 text-white flex items-center justify-center transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Pooja+Saree+Draping+Pune"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Google Business Profile"
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                  title="Google Business Profile"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#BA9FA4]">
          <p>
            © {new Date().getFullYear()} Pooja Saree Draping Pune. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for Pune Women
            </span>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="वर जा"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
