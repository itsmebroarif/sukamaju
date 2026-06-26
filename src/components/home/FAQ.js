import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useLangStore } from "../../lib/store";
import { locales } from "../../data/locales";
import { playClick, playHover } from "../../lib/sfx";

export default function FAQ() {
  const { lang } = useLangStore();
  const t = locales[lang];

  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    { q: t.faqQ1, a: t.faqA1 },
    { q: t.faqQ2, a: t.faqA2 },
    { q: t.faqQ3, a: t.faqA3 },
    { q: t.faqQ4, a: t.faqA4 },
  ];

  const handleToggle = (index) => {
    playClick();
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="py-16 px-4 md:px-8 border-b-4 border-slate-950 dark:border-slate-100 transition-colors duration-200">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center flex flex-col items-center gap-2 mb-12">
          <h2 className="font-press text-lg md:text-xl uppercase tracking-wider text-slate-900 dark:text-slate-50">
            {t.faqTitle}
          </h2>
        </div>

        {/* Accordion List */}
        <div className="flex flex-col gap-4">
          {faqs.map((faq, index) => {
            const isOpen = activeIndex === index;
            return (
              <div key={index} className="w-full">
                <div
                  onClick={() => handleToggle(index)}
                  onMouseEnter={playHover}
                  className={`w-full text-left p-4 border-4 border-slate-950 dark:border-slate-100 shadow-retro-sm cursor-pointer transition-all duration-150 flex items-center justify-between select-none ${
                    isOpen
                      ? "bg-purple-600 text-white dark:bg-purple-900"
                      : "bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-900"
                  }`}
                >
                  <span className="font-press text-[9px] sm:text-[10px] uppercase tracking-wide leading-relaxed pr-4">
                    {faq.q}
                  </span>
                  <div>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </div>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 md:p-6 border-x-4 border-b-4 border-slate-950 dark:border-slate-100 bg-slate-50 dark:bg-slate-900 text-slate-750 dark:text-slate-300 text-left text-xs md:text-sm leading-relaxed border-t-0 font-inter">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
