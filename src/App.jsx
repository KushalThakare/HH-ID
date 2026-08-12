import React, { useState, useEffect } from 'react';
import GeneratorForm from './components/GeneratorForm';
import CanvasPreview from './components/CanvasPreview';
import { convertHeicToJpg } from './utils/imageHelpers';
import { Sparkles, Compass, Play, Terminal } from 'lucide-react';

export default function App() {
  // Card Details State (Initialized empty with placeholder text)
  const [name, setName] = useState('');
  const [teamName, setTeamName] = useState('');
  const [role, setRole] = useState('');
  const [builderTitle, setBuilderTitle] = useState('');

  // Submitted Data & Generation Flag
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  // Photo Upload States
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState('');

  // Page Entrance Animation State
  const [isIntroShowing, setIsIntroShowing] = useState(true);
  const [animationKey, setAnimationKey] = useState(0);

  // Parallax Scroll Tracking
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsIntroShowing(false);
    }, 550);
    return () => clearTimeout(timer);
  }, [animationKey]);

  const triggerReplayIntro = () => {
    setIsIntroShowing(true);
    setAnimationKey((prev) => prev + 1);
  };

  // Clean up Object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (photoPreview) URL.revokeObjectURL(photoPreview);
    };
  }, [photoPreview]);

  // Photo Upload & Conversion Handler
  const handlePhotoUpload = async (file) => {
    setError('');
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('File size too large. Max size is 5MB.');
      return;
    }

    setIsConverting(true);
    try {
      const converted = await convertHeicToJpg(file);
      setPhoto(converted);
      const url = URL.createObjectURL(converted);
      setPhotoPreview(url);
    } catch (err) {
      setError(err.message || 'Error processing photo. Please try a JPG or PNG.');
    } finally {
      setIsConverting(false);
    }
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    setSubmittedData({
      name,
      teamName,
      role,
      builderTitle,
      photo,
    });
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setName('');
    setTeamName('');
    setRole('');
    setBuilderTitle('');
    setPhoto(null);
    setPhotoPreview(null);
    setSubmittedData(null);
    setIsSubmitted(false);
    setError('');
  };

  return (
    <div key={animationKey} className="min-h-screen text-[#f4f0e6] flex flex-col font-sans selection:bg-[#f5e025] selection:text-[#032116] relative z-10 overflow-x-hidden">
      {/* Viewport-Constrained Atmospheric Parallax Background (Will never overflow page content) */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div
          className="w-full h-full transition-transform duration-75 ease-out"
          style={{
            transform: `translateY(-${Math.min(scrollY * 0.25, 120)}px) scale(1.08)`,
            willChange: 'transform',
          }}
        >
          <img
            src="/assets/elements/pexels-manzoni-studios-59597719-8531053.jpg"
            alt="Atmospheric Background"
            className="w-full h-full object-cover object-top filter blur-[4px] brightness-[0.55] contrast-[1.15]"
          />
        </div>
        {/* Soft Dark Forest Overlay & Vignette Tint */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#032116]/75 via-[#032116]/65 to-[#032116]/85"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_30%,_#032116_90%)] opacity-75"></div>
      </div>

      {/* 550ms Ultra-Punchy Cyberpunk Intro Splash Curtain */}
      {isIntroShowing && (
        <div className="fixed inset-0 z-50 bg-[#032116]/95 backdrop-blur-lg flex flex-col items-center justify-center p-6 transition-all duration-300 pointer-events-none overflow-hidden">
          {/* Laser Scan Line Sweep */}
          <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#f5e025] to-transparent animate-laser-sweep opacity-80"></div>
          
          <div className="relative flex flex-col items-center gap-3 text-center animate-glitch-pop">
            <div className="flex items-center gap-2 text-[#f5e025] font-mono text-xs tracking-widest uppercase border border-[#f5e025]/50 px-3 py-1 rounded bg-[#062f20]">
              <Terminal className="w-4 h-4 text-[#fd267a] animate-spin-custom" />
              2:47PM STUDIO // LAUNCHING
            </div>
            
            <h1 className="text-4xl sm:text-6xl font-serif font-black tracking-tight text-[#f5e025] uppercase flex items-center gap-3">
              HACKER 
              <span className="bg-[#fd267a] text-[#f5e025] font-sans text-2xl sm:text-3xl px-3 py-0.5 rounded shadow-xl transform -rotate-3 border border-[#f5e025]/60 animate-bounce">
                गोवा
              </span> 
              HOUSE
            </h1>
            
            <div className="w-56 h-1.5 bg-[#062f20] rounded-full overflow-hidden border border-[#134d36] mt-1">
              <div className="w-full h-full bg-gradient-to-r from-[#fd267a] to-[#f5e025] animate-flash-pulse"></div>
            </div>
          </div>
        </div>
      )}

      {/* App Header (Full 100% Horizontal Span) */}
      <header className="sticky top-0 z-40 bg-[#032116]/75 backdrop-blur-md border-b border-[#134d36]/70 px-6 md:px-12 py-4 flex justify-between items-center w-full animate-fade-in-up">
        <div className="flex items-center gap-3">
          <div className="font-mono font-extrabold text-lg text-[#f5e025] tracking-tighter leading-none border-r border-[#134d36] pr-3">
            2:47PM <span className="block text-[10px] tracking-widest text-[#fd267a]">STUDIO</span>
          </div>
          <div>
            <h1 className="font-mono font-bold text-sm tracking-wider uppercase text-[#f4f0e6] flex items-center gap-2">
              HH GOA 2026 <span className="text-[10px] text-[#f5e025] bg-[#062f20]/80 border border-[#f5e025]/40 px-1.5 py-0.5 rounded font-mono">BUILDER PASS</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="text-xs font-mono text-[#859e92] hover:text-[#f4f0e6] px-3 py-1.5 rounded border border-[#134d36] hover:border-[#859e92] transition-all bg-[#032116]/50 backdrop-blur-sm"
          >
            Reset Form
          </button>
          <a
            href="https://hhgoa.com/"
            target="_blank"
            rel="noreferrer"
            className="text-xs font-mono font-bold text-[#032116] bg-[#f5e025] hover:bg-[#e0cc16] px-4 py-2 flex items-center gap-1.5 transition-all pattern-border shadow-md"
          >
            <Compass className="w-3.5 h-3.5" />
            HH Goa
          </a>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="border-b border-[#134d36]/50 bg-[#052e1e]/40 backdrop-blur-md py-10 px-6 animate-fade-in-up delay-75">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center gap-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#062f20]/80 border border-[#f5e025]/40 text-[#f5e025] font-mono text-xs uppercase tracking-widest mb-1 shadow-md">
            #FrameInGoa Challenge
          </div>
          
          {/* Main Display Typography matching HACKER HOUSE GOA image */}
          <div className="relative my-2 select-none">
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-serif font-extrabold tracking-tight text-[#f5e025] flex items-center justify-center gap-2 sm:gap-4 uppercase drop-shadow-md">
              HACKER 
              <span className="inline-block bg-[#fd267a] text-[#f5e025] font-sans font-black text-xl sm:text-3xl px-2.5 py-0.5 rounded shadow-lg transform -rotate-3 border border-[#f5e025]/40">
                गोवा
              </span> 
              HOUSE
            </h2>
            <p className="font-mono text-xs sm:text-sm text-[#f5e025] tracking-widest uppercase mt-2">
              GOA, INDIA &nbsp;·&nbsp; 28 - 31 OCT 2026 &nbsp;·&nbsp; 2:47 PM STUDIO
            </p>
          </div>
        </div>
      </section>

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
        {/* Left Column: Generator Inputs Form */}
        <section className="lg:col-span-7 w-full animate-fade-in-up delay-150">
          <GeneratorForm
            name={name}
            setName={setName}
            teamName={teamName}
            setTeamName={setTeamName}
            role={role}
            setRole={setRole}
            builderTitle={builderTitle}
            setBuilderTitle={setBuilderTitle}
            photo={photo}
            photoPreview={photoPreview}
            onPhotoUpload={handlePhotoUpload}
            isConverting={isConverting}
            error={error}
            onSubmit={handleSubmit}
          />
        </section>

        {/* Right Column: Interactive Canvas Pass Display */}
        <aside className="lg:col-span-5 w-full lg:sticky lg:top-24 animate-fade-in-up delay-250">
          <div className="bg-[#062f20]/65 backdrop-blur-md p-6 rounded-2xl border border-[#134d36]/70 flex flex-col items-center shadow-2xl">
            <h3 className="text-xs font-mono font-bold text-[#f5e025] uppercase tracking-widest mb-4 w-full text-center">
              Official ID Pass
            </h3>

            <CanvasPreview
              isSubmitted={isSubmitted}
              submittedData={submittedData}
            />
          </div>
        </aside>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#134d36]/70 py-6 px-6 text-center font-mono text-xs text-[#859e92] mt-auto bg-[#032116]/75 backdrop-blur-md relative z-10">
        <p>HACKER HOUSE GOA 2026 &nbsp;·&nbsp; 4 DAYS. ONE RHYTHM. EVERYTHING INTENTIONAL.</p>
      </footer>
    </div>
  );
}


