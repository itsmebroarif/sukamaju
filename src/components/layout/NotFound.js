import React, { useState, useEffect } from 'react';
import { Terminal, ShieldAlert, ArrowLeft } from 'lucide-react';
import { useNavStore, useLangStore } from '../../lib/store';
import RetroButton from '../ui/RetroButton';

export default function NotFound() {
  const { setPage } = useNavStore();
  const { lang } = useLangStore();

  const [typedText, setTypedText] = useState('');
  const fullCommand = 'dir C:\\sukamaju\\secret_data';

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < fullCommand.length) {
        setTypedText((prev) => prev + fullCommand.charAt(index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="py-12 px-4 md:px-8 max-w-2xl mx-auto font-mono transition-colors duration-200">
      <div className="border border-slate-200 dark:border-white/10 rounded-3xl bg-black p-6 relative overflow-hidden min-h-[400px] flex flex-col justify-between text-left shadow-lg">

        {/* CRT Scanline Overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none z-10" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.15)_50%)] bg-[size:100%_4px] pointer-events-none z-10" />

        {/* DOS Terminal Content */}
        <div className="text-xs text-emerald-400 leading-relaxed">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-4 text-slate-400 text-[10px]">
            <span className="flex items-center gap-1 font-semibold">
              <Terminal className="w-3.5 h-3.5 text-rose-500" />
              MS-DOS v6.22 - SYSTEM WARNING
            </span>
            <span className="text-rose-500 font-bold">CRITICAL_ERR</span>
          </div>

          <div className="flex flex-col gap-2">
            <div>Sukamaju(R) Term-Os(R) Version 6.22</div>
            <div>(C)Copyright Sukamaju Corp 1981-1994.</div>
            <br />
            <div>C:\&gt;{typedText}<span className="animate-blink text-white">_</span></div>

            {typedText === fullCommand && (
              <div className="mt-4 flex flex-col gap-1.5 text-rose-400">
                <div className="flex items-center gap-2 font-bold text-rose-500 animate-pulse">
                  <ShieldAlert className="w-4 h-4" />
                  [CRITICAL ERROR: 404]
                </div>
                <div className="mt-2">&gt;&gt; SECTOR NOT FOUND ON C: DRIVE</div>
                <div>&gt;&gt; REQUESTED DIRECTORY IS MISSING OR CORRUPTED</div>
                <div>&gt;&gt; FAIL TO DETECTION: FILE NOT RECOVERABLE</div>
                <br />
                <div className="text-white">
                  Abort, Retry, Fail? _
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Options */}
        <div className="mt-8 pt-4 border-t border-slate-800 flex flex-wrap gap-4 items-center justify-between z-20">
          <span className="text-[10px] text-slate-500 font-semibold">
            SYS_RESET: ACTIVE
          </span>
          <RetroButton
            variant="red"
            size="sm"
            onClick={() => setPage('home')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            {lang === 'id' ? 'KEMBALI KE BERANDA' : lang === 'jp' ? 'ホームに戻る' : 'ABORT & RETURN HOME'}
          </RetroButton>
        </div>

      </div>
    </div>
  );
}
