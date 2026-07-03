import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, ArrowRight, ArrowLeft, Send } from 'lucide-react';
import Swal from 'sweetalert2';
import confetti from 'canvas-confetti';
import { useNavStore, useLangStore } from '../../lib/store';
import { locales } from '../../data/locales';
import { playHover, playClick, playSuccess, playFail } from '../../lib/sfx';
import { submitCollaboration } from '../../lib/api';
import RetroButton from '../ui/RetroButton';
import RetroInput from '../ui/RetroInput';
import RetroCard from '../ui/RetroCard';

export default function RequestWizard() {
  const { wizardOpen, closeWizard } = useNavStore();
  const { lang } = useLangStore();
  const t = locales[lang];

  // Steps: 1, 2, 3
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    idea: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (wizardOpen) {
      setStep(1);
      setErrors({});
    }
  }, [wizardOpen]);

  if (!wizardOpen) return null;

  const validateStep = () => {
    const err = {};
    if (step === 1) {
      if (!form.name.trim()) err.name = t.alertFieldRequired;
      if (!form.email.trim()) err.email = t.alertFieldRequired;
      if (!form.phone.trim()) err.phone = t.alertFieldRequired;
    } else if (step === 2) {
      if (!form.idea.trim()) err.idea = t.alertFieldRequired;
    }
    
    if (Object.keys(err).length > 0) {
      playFail();
    }
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleNext = () => {
    playClick();
    if (validateStep()) {
      setStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    playClick();
    setStep((prev) => prev - 1);
  };

  const handleInputChange = (key, val) => {
    setForm({ ...form, [key]: val });
    if (errors[key]) setErrors({ ...errors, [key]: '' });
  };

  const handleSubmit = async () => {
    playClick();
    
    Swal.fire({
      title: t.wizardConfirmText,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: t.alertYes,
      cancelButtonText: t.alertNo,
      confirmButtonColor: '#9333ea',
      cancelButtonColor: '#475569',
      background: document.documentElement.classList.contains('dark') ? '#0f172a' : '#ffffff',
      color: document.documentElement.classList.contains('dark') ? '#f1f5f9' : '#0f172a',
      customClass: {
        popup: 'border-4 border-slate-950 font-inter text-sm rounded-none',
        confirmButton: 'font-press text-[9px] uppercase px-4 py-2 bg-purple-600 border-2 border-slate-950 shadow-retro-sm rounded-none',
        cancelButton: 'font-press text-[9px] uppercase px-4 py-2 bg-slate-500 border-2 border-slate-950 shadow-retro-sm rounded-none',
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        setIsSubmitting(true);
        try {
          // 1. Submit proposal via fetch JS script
          await submitCollaboration({
            name: form.name,
            email: form.email,
            phone: form.phone,
            idea: form.idea
          });

          // 2. Play 8-bit Success audio and launch confetti
          playSuccess();
          confetti({
            particleCount: 160,
            spread: 80,
            origin: { y: 0.6 }
          });

          // 3. Format WhatsApp redirect text
          let msg = `*🤝 OPEN COLLABORATION PROPOSAL - SUKAMAJU HUB*\n`;
          msg += `=======================================\n`;
          msg += `Name: ${form.name}\n`;
          msg += `Email: ${form.email}\n`;
          msg += `WhatsApp: ${form.phone}\n\n`;
          msg += `*COLLABORATION IDEA:*\n${form.idea}\n`;
          msg += `=======================================\n`;
          
          const waUrl = `https://wa.me/6285817048266?text=${encodeURIComponent(msg)}`;
          window.open(waUrl, '_blank');

          Swal.fire({
            title: t.wizardSuccessTitle,
            text: t.wizardSuccessText,
            icon: 'success',
            confirmButtonColor: '#9333ea',
            background: document.documentElement.classList.contains('dark') ? '#0f172a' : '#ffffff',
            color: document.documentElement.classList.contains('dark') ? '#f1f5f9' : '#0f172a',
            customClass: {
              popup: 'border-4 border-slate-950 font-inter text-sm rounded-none',
              confirmButton: 'font-press text-[9px] uppercase px-4 py-2 bg-purple-600 border-2 border-slate-950 shadow-retro-sm rounded-none',
            }
          });

          // Reset Form
          setForm({ name: '', email: '', phone: '', idea: '' });
          closeWizard();
        } catch (error) {
          playFail();
          Swal.fire({
            title: 'Submission Failed',
            text: 'System was unable to write to API logs. Please retry.',
            icon: 'error',
            confirmButtonColor: '#e11d48',
            background: document.documentElement.classList.contains('dark') ? '#0f172a' : '#ffffff',
            color: document.documentElement.classList.contains('dark') ? '#f1f5f9' : '#0f172a',
            customClass: {
              popup: 'border-4 border-slate-950 font-inter text-sm rounded-none',
            }
          });
        } finally {
          setIsSubmitting(false);
        }
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-slate-950/70 backdrop-blur-sm font-inter">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-xl relative"
      >
        <RetroCard
          variant="purple"
          title={t.wizardCollabTitle}
          headerRight={
            <button
              onClick={() => { playClick(); closeWizard(); }}
              onMouseEnter={playHover}
              className="p-1 border-2 border-slate-950 dark:border-slate-100 bg-white dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-900"
            >
              <X className="w-4 h-4 text-slate-800 dark:text-slate-100" />
            </button>
          }
        >
          {/* Step indicators */}
          <div className="flex justify-between items-center gap-2 mb-6 border-b-2 border-slate-100 dark:border-slate-900 pb-3 text-[8px] font-press text-slate-400">
            <span className={step === 1 ? 'text-purple-600 dark:text-cyan-400 font-bold' : ''}>
              {t.wizardCollabStep1}
            </span>
            <span className={step === 2 ? 'text-purple-600 dark:text-cyan-400 font-bold' : ''}>
              {t.wizardCollabStep2}
            </span>
            <span className={step === 3 ? 'text-purple-600 dark:text-cyan-400 font-bold' : ''}>
              {t.wizardCollabStep3}
            </span>
          </div>

          {/* Form Content Steps */}
          <div className="min-h-[200px]">
            {step === 1 && (
              <div className="flex flex-col gap-4 animate-fade-in">
                <RetroInput
                  id="collab-name"
                  label={t.wizardCollabName}
                  value={form.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  error={errors.name}
                  required
                />

                <RetroInput
                  id="collab-email"
                  type="email"
                  label={t.wizardCollabEmail}
                  value={form.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  error={errors.email}
                  required
                />

                <RetroInput
                  id="collab-phone"
                  label={t.wizardCollabPhone}
                  placeholder="e.g. 6285817048266"
                  value={form.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  error={errors.phone}
                  required
                />
              </div>
            )}

            {step === 2 && (
              <div className="flex flex-col gap-4 animate-fade-in">
                <RetroInput
                  id="collab-idea"
                  type="textarea"
                  label={t.wizardCollabIdea}
                  value={form.idea}
                  onChange={(e) => handleInputChange('idea', e.target.value)}
                  error={errors.idea}
                  rows={6}
                  required
                />
              </div>
            )}

            {step === 3 && (
              <div className="flex flex-col gap-4 text-left animate-fade-in">
                <h4 className="font-press text-[10px] uppercase text-purple-600 dark:text-cyan-400 font-bold border-b border-slate-200 dark:border-slate-800 pb-1.5">
                  {t.wizardReviewSummary}
                </h4>

                <div className="font-mono text-xs flex flex-col gap-2 bg-slate-50 dark:bg-slate-900 p-3 border-2 border-slate-950 dark:border-slate-100">
                  <div><span className="text-slate-500">PARTNER:</span> {form.name}</div>
                  <div><span className="text-slate-500">EMAIL:</span> {form.email}</div>
                  <div><span className="text-slate-500">WHATSAPP:</span> {form.phone}</div>
                  <div className="border-t border-slate-300 dark:border-slate-800 my-1 pt-1.5"></div>
                  <div><span className="text-slate-500">COLLAB IDEA:</span></div>
                  <p className="whitespace-pre-wrap pl-2 border-l-2 border-purple-500 text-slate-750 dark:text-slate-300">
                    {form.idea}
                  </p>
                </div>

                <p className="font-inter text-xs text-slate-500">
                  {t.wizardVerifyData}
                </p>
              </div>
            )}
          </div>

          {/* Navigation controls */}
          <div className="flex justify-between items-center mt-8 pt-4 border-t-2 border-slate-100 dark:border-slate-900">
            {step > 1 ? (
              <RetroButton
                variant="gray"
                size="sm"
                onClick={handleBack}
                onMouseEnter={playHover}
                className="flex items-center gap-1"
                disabled={isSubmitting}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                {t.wizardPrev}
              </RetroButton>
            ) : (
              <RetroButton
                variant="red"
                size="sm"
                onMouseEnter={playHover}
                onClick={() => { playClick(); closeWizard(); }}
                disabled={isSubmitting}
              >
                {t.wizardClose}
              </RetroButton>
            )}

            {step < 3 ? (
              <RetroButton
                variant="purple"
                size="sm"
                onClick={handleNext}
                onMouseEnter={playHover}
                className="flex items-center gap-1"
              >
                {t.wizardNext}
                <ArrowRight className="w-3.5 h-3.5" />
              </RetroButton>
            ) : (
              <RetroButton
                variant="green"
                size="sm"
                onClick={handleSubmit}
                onMouseEnter={playHover}
                disabled={isSubmitting}
                className="flex items-center gap-1.5 animate-pulse"
              >
                <Send className="w-3.5 h-3.5" />
                {isSubmitting ? 'TRANSMITTING...' : t.wizardCollabSubmit}
              </RetroButton>
            )}
          </div>

        </RetroCard>
      </motion.div>
    </div>
  );
}
