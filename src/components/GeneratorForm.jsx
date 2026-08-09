import React, { useState, useRef } from 'react';
import { Upload, User, Cpu, Users, Award, Sparkles } from 'lucide-react';

export default function GeneratorForm({
  name,
  setName,
  teamName,
  setTeamName,
  role,
  setRole,
  builderTitle,
  setBuilderTitle,
  photo,
  photoPreview,
  onPhotoUpload,
  isConverting,
  error,
  onSubmit,
}) {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onPhotoUpload(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      onPhotoUpload(e.target.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6 bg-[#111110] p-6 rounded-xl border border-[#2a2a26]">
      <div className="border-b border-[#2a2a26] pb-4">
        <h2 className="text-lg font-mono font-bold text-[#ede8d5] uppercase tracking-wider">Builder Information</h2>
        <p className="text-xs font-mono text-[#8a8575] mt-1">Customize your official HH Goa 2026 ID pass.</p>
      </div>

      {/* Photo Upload Zone */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-mono font-bold text-[#d4a017] uppercase tracking-widest flex items-center gap-2">
          <Upload className="w-3.5 h-3.5" /> Portrait Photo (1:1 Ratio)
        </label>
        
        <div
          className={`relative border-2 border-dashed rounded-lg p-5 flex flex-col items-center justify-center cursor-pointer transition-all ${
            dragActive ? 'border-[#d4a017] bg-[#d4a017]/10' : 'border-[#2a2a26] hover:border-[#8a8575] bg-[#161614]'
          }`}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".jpg,.jpeg,.png,.heic,.heif"
            onChange={handleChange}
          />

          {isConverting ? (
            <div className="flex flex-col items-center gap-2 py-2">
              <div className="w-6 h-6 border-2 border-[#d4a017] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs font-mono text-[#8a8575]">Processing image...</p>
            </div>
          ) : photoPreview ? (
            <div className="flex items-center gap-4">
              <img src={photoPreview} alt="Uploaded avatar preview" className="w-16 h-16 rounded-md object-cover border border-[#d4a017] aspect-square" />
              <div className="flex flex-col">
                <span className="text-xs font-mono text-[#ede8d5] font-bold">Photo Selected</span>
                <span className="text-[11px] font-mono text-[#8a8575]">Click or drag to replace photo</span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-center py-2">
              <Upload className="w-6 h-6 text-[#8a8575]" />
              <span className="text-xs font-mono font-bold text-[#ede8d5]">Drag & Drop Photo Here</span>
              <span className="text-[11px] font-mono text-[#8a8575]">Supports 1:1 ratio JPG, PNG, and iPhone HEIC (Max 5MB)</span>
            </div>
          )}
        </div>
        {error && <p className="text-xs font-mono text-red-400 mt-1">{error}</p>}
      </div>

      {/* Card Details Inputs */}
      <div className="flex flex-col gap-4 pt-2">
        <span className="text-xs font-mono font-bold text-[#d4a017] uppercase tracking-widest">Card Details</span>
        
        {/* Full Name & Team Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-mono text-[#8a8575] uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" /> Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value.slice(0, 30))}
              placeholder="Your name here"
              maxLength={30}
              className="bg-[#161614] border border-[#2a2a26] rounded px-3 py-2 text-xs font-mono text-[#ede8d5] placeholder-[#5a5545] focus:outline-none focus:border-[#d4a017]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-mono text-[#8a8575] uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" /> Team Name
            </label>
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value.slice(0, 25))}
              placeholder="Your team name here"
              maxLength={25}
              className="bg-[#161614] border border-[#2a2a26] rounded px-3 py-2 text-xs font-mono text-[#ede8d5] placeholder-[#5a5545] focus:outline-none focus:border-[#d4a017]"
            />
          </div>
        </div>

        {/* Role & Builder Title */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-mono text-[#8a8575] uppercase tracking-wider flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5" /> Stack / Role
            </label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value.slice(0, 30))}
              placeholder="Your stack / role here"
              maxLength={30}
              className="bg-[#161614] border border-[#2a2a26] rounded px-3 py-2 text-xs font-mono text-[#ede8d5] placeholder-[#5a5545] focus:outline-none focus:border-[#d4a017]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-mono text-[#8a8575] uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5" /> Builder Title
            </label>
            <input
              type="text"
              value={builderTitle}
              onChange={(e) => setBuilderTitle(e.target.value.slice(0, 30))}
              placeholder="Your builder title here"
              maxLength={30}
              className="bg-[#161614] border border-[#2a2a26] rounded px-3 py-2 text-xs font-mono text-[#ede8d5] placeholder-[#5a5545] focus:outline-none focus:border-[#d4a017]"
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-4 border-t border-[#2a2a26]">
        <button
          type="submit"
          className="w-full py-3.5 px-4 bg-[#d4a017] hover:bg-[#c29112] text-[#0a0a08] font-mono font-bold text-sm uppercase tracking-widest rounded-lg flex items-center justify-center gap-2 shadow-lg hover:shadow-[#d4a017]/20 transition-all active:scale-[0.99]"
        >
          <Sparkles className="w-4 h-4" />
          Generate ID Pass
        </button>
      </div>
    </form>
  );
}

