import React, { useState, useEffect } from 'react';
import GeneratorForm from './components/GeneratorForm';
import CanvasPreview from './components/CanvasPreview';
import { convertHeicToJpg } from './utils/imageHelpers';
import { Sparkles, Compass } from 'lucide-react';

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
    <div className="min-h-screen bg-[#0a0a08] text-[#ede8d5] flex flex-col font-sans selection:bg-[#d4a017] selection:text-[#0a0a08]">
      {/* App Header */}
      <header className="sticky top-0 z-40 bg-[#0a0a08]/95 backdrop-blur-md border-b border-[#2a2a26] px-6 py-4 flex justify-between items-center max-w-7xl w-full mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-[#d4a017] text-[#0a0a08] font-mono font-bold flex items-center justify-center text-sm shadow-md">
            HH
          </div>
          <div>
            <h1 className="font-mono font-bold text-sm tracking-wider uppercase text-[#ede8d5] flex items-center gap-2">
              HH GOA 2026 <span className="text-[10px] text-[#d4a017] border border-[#d4a017]/40 px-1.5 py-0.5 rounded">BUILDER PASS</span>
            </h1>
            <p className="text-[11px] font-mono text-[#8a8575] hidden sm:block">Official ID Pass Generator</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="text-xs font-mono text-[#8a8575] hover:text-[#ede8d5] px-3 py-1.5 rounded border border-[#2a2a26] hover:border-[#8a8575] transition-all"
          >
            Reset Form
          </button>
          <a
            href="https://hhgoa.com/"
            target="_blank"
            rel="noreferrer"
            className="text-xs font-mono text-[#0a0a08] bg-[#d4a017] hover:bg-[#c29112] font-bold px-3 py-1.5 rounded flex items-center gap-1 transition-all"
          >
            <Compass className="w-3.5 h-3.5" />
            hhgoa.com
          </a>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="border-b border-[#2a2a26] bg-gradient-to-b from-[#111110] to-[#0a0a08] py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#d4a017]/10 border border-[#d4a017]/30 text-[#d4a017] font-mono text-[11px] uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" /> #FrameInGoa Challenge
            </div>
            <h2 className="text-2xl md:text-3xl font-bold font-sans tracking-tight text-[#ede8d5]">
              Generate Your Official Builder ID Pass
            </h2>
            <p className="text-sm font-mono text-[#8a8575] mt-1 max-w-2xl">
              Upload your 1:1 portrait photo and enter your details, then click Generate to render your pixel-perfect official ID pass.
            </p>
          </div>
        </div>
      </section>

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Generator Inputs Form */}
        <section className="lg:col-span-7 w-full">
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
        <aside className="lg:col-span-5 w-full lg:sticky lg:top-24">
          <div className="bg-[#111110] p-6 rounded-xl border border-[#2a2a26] flex flex-col items-center">
            <h3 className="text-xs font-mono font-bold text-[#8a8575] uppercase tracking-widest mb-4 w-full text-center">
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
      <footer className="border-t border-[#2a2a26] py-6 px-6 text-center font-mono text-xs text-[#8a8575] mt-auto">
        <p>HACKER HOUSE GOA 2026 &nbsp;·&nbsp; 4 DAYS. ONE RHYTHM. EVERYTHING INTENTIONAL.</p>
      </footer>
    </div>
  );
}

