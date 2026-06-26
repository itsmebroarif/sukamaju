import React, { useState } from 'react';
import { Send, Disc, MessageSquare } from 'lucide-react';
import Swal from 'sweetalert2';
import confetti from 'canvas-confetti';
import { useLangStore } from '../../lib/store';
import { locales } from '../../data/locales';
import RetroCard from '../ui/RetroCard';
import RetroInput from '../ui/RetroInput';
import RetroButton from '../ui/RetroButton';
import { playClick, playSuccess, playFail } from '../../lib/sfx';
import { submitContactMessage } from '../../lib/api';

export default function Contact() {
  const { lang } = useLangStore();
  const t = locales[lang];

  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (key, value) => {
    setForm({ ...form, [key]: value });
    if (errors[key]) {
      setErrors({ ...errors, [key]: '' });
    }
  };

  const validate = () => {
    const tempErrors = {};
    if (!form.name.trim()) tempErrors.name = t.alertFieldRequired;
    if (!form.email.trim()) tempErrors.email = t.alertFieldRequired;
    if (!form.subject.trim()) tempErrors.subject = t.alertFieldRequired;
    if (!form.message.trim()) tempErrors.message = t.alertFieldRequired;
    if (Object.keys(tempErrors).length > 0) {
      playFail();
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    playClick();
    if (!validate()) return;

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
        try {
          await submitContactMessage({
            name: form.name,
            email: form.email,
            subject: form.subject,
            message: form.message
          });

          playSuccess();
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });

          // Format message
          let msg = `*📩 TRANSMISSION MESSAGE - KAFEINARTS STUDIO*\n`;
          msg += `=======================================\n`;
          msg += `Name: ${form.name}\n`;
          msg += `Email: ${form.email}\n`;
          msg += `Subject: ${form.subject}\n\n`;
          msg += `*MESSAGE BODY:*\n${form.message}\n`;
          msg += `=======================================\n`;

          // Redirect to WhatsApp
          const waUrl = `https://wa.me/6285817048266?text=${encodeURIComponent(msg)}`;
          window.open(waUrl, '_blank');

          Swal.fire({
            title: t.contactSuccess,
            icon: 'success',
            confirmButtonColor: '#9333ea',
            background: document.documentElement.classList.contains('dark') ? '#0f172a' : '#ffffff',
            color: document.documentElement.classList.contains('dark') ? '#f1f5f9' : '#0f172a',
            customClass: {
              popup: 'border-4 border-slate-950 font-inter text-sm rounded-none',
              confirmButton: 'font-press text-[9px] uppercase px-4 py-2 bg-purple-600 border-2 border-slate-950 shadow-retro-sm rounded-none',
            }
          });

          setForm({
            name: '',
            email: '',
            subject: '',
            message: ''
          });
        } catch (error) {
          playFail();
          Swal.fire({
            title: 'Transmission Failed',
            text: 'System was unable to write to API logs. Please retry.',
            icon: 'error',
            confirmButtonColor: '#e11d48',
            background: document.documentElement.classList.contains('dark') ? '#0f172a' : '#ffffff',
            color: document.documentElement.classList.contains('dark') ? '#f1f5f9' : '#0f172a',
            customClass: {
              popup: 'border-4 border-slate-950 font-inter text-sm rounded-none',
            }
          });
        }
      }
    });
  };

  return (
    <section className="py-12 md:py-16 px-4 md:px-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        
        {/* Title Header */}
        <div className="text-center flex flex-col items-center gap-2 mb-10">
          <h1 className="font-press text-lg md:text-xl uppercase tracking-wider text-slate-900 dark:text-slate-50">
            {t.contactTitle}
          </h1>
          <p className="font-inter text-xs md:text-sm text-slate-650 dark:text-slate-450 max-w-lg mt-2">
            {t.contactSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Panel: Direct Links */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <RetroCard variant="default" title="TRANSMISSION_CHANNELS">
              <div className="flex flex-col gap-4 mt-2">
                
                <a
                  href="https://wa.me/6285817048266"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 border-2 border-slate-950 dark:border-slate-100 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition-colors duration-150 group font-press text-[9px] uppercase"
                >
                  <div className="p-2 border-2 border-slate-950 dark:border-slate-100 bg-emerald-500 text-slate-950 shadow-retro-sm group-hover:scale-105 transition-transform duration-100">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <span className="block font-bold">WhatsApp Direct</span>
                    <span className="text-[7px] text-slate-400 font-inter font-normal lowercase">+62 858 1704 8266</span>
                  </div>
                </a>

                <a
                  href="https://www.instagram.com/kafeinarts.studio/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 border-2 border-slate-950 dark:border-slate-100 hover:bg-purple-50 dark:hover:bg-purple-950/20 transition-colors duration-150 group font-press text-[9px] uppercase"
                >
                  <div className="p-2 border-2 border-slate-950 dark:border-slate-100 bg-purple-600 text-white shadow-retro-sm group-hover:scale-105 transition-transform duration-100">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                    </svg>
                  </div>
                  <div className="text-left">
                    <span className="block font-bold">Instagram Feed</span>
                    <span className="text-[7px] text-slate-400 font-inter font-normal lowercase">@kafeinarts.studio</span>
                  </div>
                </a>

                <div className="flex items-center gap-3 p-3 border-2 border-slate-950 dark:border-slate-100 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 transition-colors duration-150 group font-press text-[9px] uppercase">
                  <div className="p-2 border-2 border-slate-950 dark:border-slate-100 bg-indigo-500 text-white shadow-retro-sm group-hover:scale-105 transition-transform duration-100">
                    <Disc className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <span className="block font-bold">Discord Server</span>
                    <span className="text-[7px] text-slate-400 font-inter font-normal lowercase">itsmebroarif</span>
                  </div>
                </div>

              </div>
            </RetroCard>
          </div>

          {/* Right Panel: Contact Form */}
          <div className="lg:col-span-8">
            <RetroCard variant="default" title="ENCRYPTED_MESSAGE_FORM">
              <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <RetroInput
                    id="name"
                    label={t.contactName}
                    value={form.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    error={errors.name}
                    required
                  />
                  <RetroInput
                    id="email"
                    type="email"
                    label={t.contactEmail}
                    value={form.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    error={errors.email}
                    required
                  />
                </div>

                <RetroInput
                  id="subject"
                  label={t.contactSubject}
                  value={form.subject}
                  onChange={(e) => handleInputChange('subject', e.target.value)}
                  error={errors.subject}
                  required
                />

                <RetroInput
                  id="message"
                  type="textarea"
                  label={t.contactMessage}
                  value={form.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  error={errors.message}
                  required
                />

                <div className="mt-4 flex justify-end">
                  <RetroButton
                    type="submit"
                    variant="purple"
                    className="flex items-center gap-2"
                  >
                    <Send className="w-4.5 h-4.5" />
                    {t.contactSubmit}
                  </RetroButton>
                </div>
              </form>
            </RetroCard>
          </div>

        </div>

      </div>
    </section>
  );
}
