'use client';

import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  CheckCircle2,
  Sparkles,
  Ticket,
  MessageCircle,
  Edit3,
  Users,
  Award,
} from 'lucide-react';
import EditWorkshopModal, { WorkshopConfig } from './EditWorkshopModal';

interface WorkshopSectionProps {
  onBookClick: () => void;
}

const DEFAULT_WORKSHOP_CONFIG: WorkshopConfig = {
  title: '1 डे साडी ड्रॅपिंग वर्कशॉप',
  instructor: 'पूजा पाटील',
  training: 'गौरी महालक्ष्मीच्या 14 ते 15 सुंदर साडी ड्रॅपिंग प्रकारांचे प्रात्यक्षिकासह प्रशिक्षण',
  suitableFor: 'उभारलेल्या तसेच बसलेल्या गौरीसाठी आणि सणांसारख्या विशेष प्रसंगांसाठी',
  nextDate: 'आगामी शनिवार / रविवार (Upcoming Weekend)',
  time: 'सकाळी 10:30 ते संध्याकाळी 5:30 (पूर्ण 1 दिवस)',
  fee: '₹1,999/- फक्त',
  seatsLeft: 'फक्त 8 ते 10 जागा (वैयक्तिक लक्ष देण्यासाठी मर्यादित बॅच)',
  venue: 'साईप्रभा हाऊस, जगताप हॉस्पिटल समोर, सिंहगड रोड, आनंद नगर, पुणे - 411051',
};

export default function WorkshopSection({ onBookClick }: WorkshopSectionProps) {
  const [config, setConfig] = useState<WorkshopConfig>(() => {
    if (typeof window === 'undefined') return DEFAULT_WORKSHOP_CONFIG;
    try {
      const saved = localStorage.getItem('pooja_workshop_config');
      return saved ? JSON.parse(saved) : DEFAULT_WORKSHOP_CONFIG;
    } catch {
      return DEFAULT_WORKSHOP_CONFIG;
    }
  });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    const handleConfigUpdate = () => {
      try {
        const saved = localStorage.getItem('pooja_workshop_config');
        if (saved) {
          setConfig(JSON.parse(saved));
        }
      } catch {
        // ignore
      }
    };

    window.addEventListener('pooja_workshop_updated', handleConfigUpdate);
    window.addEventListener('storage', handleConfigUpdate);
    return () => {
      window.removeEventListener('pooja_workshop_updated', handleConfigUpdate);
      window.removeEventListener('storage', handleConfigUpdate);
    };
  }, []);

  const handleSaveConfig = (newConfig: WorkshopConfig) => {
    setConfig(newConfig);
    try {
      localStorage.setItem('pooja_workshop_config', JSON.stringify(newConfig));
    } catch {
      // ignore
    }
    window.dispatchEvent(new Event('pooja_workshop_updated'));
  };

  const keyHighlights = [
    'उभारलेल्या व बसलेल्या गौरीचे 14+ पारंपारिक व डिझायनर पॅटर्न',
    'प्रत्यक्ष प्रॅक्टिकल हँड्स-ऑन सराव (स्वतः हाताने साडी नेसणे)',
    'परफेक्ट प्लीट्स, पिनिंग व पदर फिनिशिंगचे प्रोफेशनल तंत्र',
    'वर्कशॉप पूर्ण केल्यावर अधिकृत सहभाग प्रमाणपत्र (Certificate)',
    'वर्कशॉप साहित्य, सराव साडी सपोर्ट व वैयक्तिक मार्गदर्शन',
    'चहा, अल्पोपहार व सविस्तर शंका निरसन सत्र समाविष्ट',
  ];

  return (
    <section id="workshop" className="py-16 sm:py-24 bg-gradient-to-b from-[#FAF7F2] via-[#F6EFE6] to-[#FAF7F2] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#8B1E3F]/10 border border-[#8B1E3F]/20 text-[#8B1E3F] text-xs sm:text-sm font-bold uppercase tracking-wider mb-3 shadow-xs">
            <Sparkles className="w-4 h-4 text-amber-600" />
            स्पेशल ट्रेनिंग प्रोग्राम
          </div>
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#3B1F25] font-serif tracking-tight">
            ✨ 1 डे साडी ड्रॅपिंग वर्कशॉप ✨
          </h2>

          <p className="mt-3 text-base sm:text-lg md:text-xl font-medium text-[#732939] leading-relaxed">
            “{config.training}”
          </p>
          <div className="w-20 h-1 bg-[#8B1E3F] mx-auto mt-4 rounded-full" />
        </div>

        {/* Main Workshop Card */}
        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl border border-[#EADBCE] overflow-hidden">
          
          {/* Card Top Banner */}
          <div className="bg-gradient-to-r from-[#581825] via-[#8B1E3F] to-[#581825] p-6 sm:p-8 text-white relative">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-amber-400 text-[#36111B] text-xs font-bold uppercase tracking-wider mb-2">
                  1-Day Masterclass
                </span>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold font-serif">
                  {config.title}
                </h3>
                <p className="text-xs sm:text-sm text-amber-100/90 mt-1">
                  प्रशिक्षक: <span className="font-semibold text-white">{config.instructor}</span> (Certified Saree Stylist)
                </p>
              </div>

              {/* Edit Information Trigger */}
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 border border-white/30 text-xs font-medium text-white transition-colors"
                title="वर्कशॉप तारीख किंवा फी बदला"
              >
                <Edit3 className="w-3.5 h-3.5 text-amber-300" />
                <span>माहिती बदला (Edit)</span>
              </button>
            </div>
          </div>

          {/* Card Body with Key Workshop Details */}
          <div className="p-6 sm:p-8 lg:p-10">
            
            {/* Quick Details Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
              
              <div className="flex items-start gap-3.5 p-4 rounded-xl bg-[#FAF7F2] border border-[#EAE2D7]">
                <div className="w-10 h-10 rounded-lg bg-[#8B1E3F]/10 text-[#8B1E3F] flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#7A585F]">
                    पुढील वर्कशॉप तारीख (Next Date)
                  </span>
                  <div className="text-sm sm:text-base font-bold text-[#3B1F25]">
                    {config.nextDate}
                  </div>
                  <span className="text-[11px] text-[#8B1E3F] font-medium">पूर्वनोंदणी सुरू आहे</span>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-4 rounded-xl bg-[#FAF7F2] border border-[#EAE2D7]">
                <div className="w-10 h-10 rounded-lg bg-[#8B1E3F]/10 text-[#8B1E3F] flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#7A585F]">
                    वेळ (Time)
                  </span>
                  <div className="text-sm sm:text-base font-bold text-[#3B1F25]">
                    {config.time}
                  </div>
                  <span className="text-[11px] text-gray-500">पूर्ण दिवस सराव सत्र</span>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-4 rounded-xl bg-[#FAF7F2] border border-[#EAE2D7]">
                <div className="w-10 h-10 rounded-lg bg-[#8B1E3F]/10 text-[#8B1E3F] flex items-center justify-center shrink-0">
                  <Ticket className="w-5 h-5 text-emerald-700" />
                </div>
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#7A585F]">
                    वर्कशॉप फी (Fee)
                  </span>
                  <div className="text-base sm:text-lg font-bold text-emerald-800 flex items-baseline gap-2">
                    <span>{config.fee}</span>
                    <span className="text-xs text-gray-400 line-through">₹2,999</span>
                  </div>
                  <span className="text-[11px] text-gray-500">साहित्य व अल्पोपहारासह</span>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-4 rounded-xl bg-[#FAF7F2] border border-[#EAE2D7]">
                <div className="w-10 h-10 rounded-lg bg-[#8B1E3F]/10 text-[#8B1E3F] flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5 text-amber-700" />
                </div>
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#7A585F]">
                    बॅच मर्यादा (Batch Size)
                  </span>
                  <div className="text-sm sm:text-base font-bold text-[#3B1F25]">
                    {config.seatsLeft}
                  </div>
                  <span className="text-[11px] text-amber-700 font-medium">प्रत्येक विद्यार्थिनीकडे खास लक्ष</span>
                </div>
              </div>

            </div>

            {/* Suitable For Banner */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-amber-50 to-rose-50 border border-amber-200/80 mb-8">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900">
                    कोणासाठी उपयुक्त (Suitable For):
                  </h4>
                  <p className="text-sm font-semibold text-[#4A1521] mt-0.5">
                    {config.suitableFor}
                  </p>
                </div>
              </div>
            </div>

            {/* Venue Address Bar */}
            <div className="flex items-start gap-3 p-4 rounded-xl bg-[#FAF7F2] border border-[#EAE2D7] mb-8">
              <MapPin className="w-5 h-5 text-[#8B1E3F] shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-[#3B1F25]">वर्कशॉप ठिकाण (Venue):</span>
                <p className="text-xs sm:text-sm text-[#5B454A] mt-0.5">{config.venue}</p>
              </div>
            </div>

            {/* What is Included Checklist */}
            <div className="mb-8">
              <h4 className="text-sm sm:text-base font-bold text-[#3B1F25] mb-4 flex items-center gap-2">
                <Award className="w-4 h-4 text-[#8B1E3F]" />
                वर्कशॉपमध्ये काय काय समाविष्ट आहे?
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {keyHighlights.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#4A3E3D]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action CTAs */}
            <div className="pt-6 border-t border-[#EAE2D7] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <div className="text-xs text-gray-500 font-medium">लवकर नोंदणी करा — मर्यादित जागा</div>
                <div className="text-sm font-bold text-[#8B1E3F]">
                  कॉल किंवा WhatsApp द्वारे जागा कन्फर्म करा
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <a
                  href={`https://wa.me/918446917187?text=${encodeURIComponent(
                    `नमस्कार पूजा मॅडम, मला ${config.title} बद्दल माहिती हवी आहे आणि जागा बुक करायची आहे.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-sm transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Enquiry</span>
                </a>

                <button
                  onClick={onBookClick}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#8B1E3F] hover:bg-[#721531] text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all"
                >
                  <Ticket className="w-4 h-4 text-amber-300" />
                  <span>Book Your Seat</span>
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Edit Workshop Modal */}
      <EditWorkshopModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        config={config}
        onSave={handleSaveConfig}
        defaultConfig={DEFAULT_WORKSHOP_CONFIG}
      />
    </section>
  );
}
