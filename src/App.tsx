import React, { useState } from 'react';
import { Sparkles, BookOpen } from 'lucide-react';
import EbookSection from './components/EbookSection';
import LadiCollection from './components/LadiCollection';
import { Lead } from './types';

export default function App() {
  const [registeredLead, setRegisteredLead] = useState<Lead | null>(null);

  const handleEbookRegister = (completedLead: Lead) => {
    setRegisteredLead(completedLead);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-white">
      
      {/* 1. Header Area conforming to Elegant Dark */}
      <header className="px-6 py-5 flex justify-between items-center border-b border-white/5 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Sparkles className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-bold tracking-tight text-white font-space">THONGUYENxAI</span>
              <span className="text-[10px] bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-1.5 py-0.5 rounded-md font-mono">v1.0</span>
            </div>
            <p className="text-[10px] text-slate-500">Ebook cơ bàn tạo Ladipage bằng AI</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 rounded-xl font-medium flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 animate-bounce" />
            <span>Quà Tặng Premium</span>
          </span>
        </div>
      </header>

      {/* 2. Main Workspace Centered Layout */}
      <div className="flex-1 bg-slate-950 p-4 md:p-8 flex justify-center items-start overflow-y-auto max-h-[calc(100vh-80px)] editor-scroll">
        <main className="w-full max-w-4xl space-y-12">
          <EbookSection 
            onRegister={handleEbookRegister} 
            registeredLead={registeredLead} 
          />
          <LadiCollection />
        </main>
      </div>

      {/* 3. Footer */}
      <footer className="border-t border-white/5 bg-slate-950 py-6 text-center text-[11px] text-slate-500">
        <p>© 2026 THONGUYENxAI • Hệ thống tối ưu hóa tỷ lệ chuyển đổi tự động</p>
      </footer>

    </div>
  );
}
