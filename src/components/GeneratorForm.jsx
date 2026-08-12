import React, { useState, useRef } from 'react';
import { Upload, User, Cpu, Users, Award, Sparkles, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';

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
  const [touched, setTouched] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});
  const [formShake, setFormShake] = useState(false);
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
      validateSingleField('photo', e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      onPhotoUpload(e.target.files[0]);
      validateSingleField('photo', e.target.files[0]);
    }
  };

  const validateSingleField = (fieldName, value) => {
    let err = '';
    if (fieldName === 'name') {
      const val = value !== undefined ? value : name;
      if (!val || !val.trim()) {
        err = 'Full Name is required';
      } else if (val.trim().length < 2) {
        err = 'Name must be at least 2 characters';
      }
    } else if (fieldName === 'teamName') {
      const val = value !== undefined ? value : teamName;
      if (!val || !val.trim()) {
        err = 'Team Name is required';
      } else if (val.trim().length < 2) {
        err = 'Team Name must be at least 2 characters';
      }
    } else if (fieldName === 'role') {
      const val = value !== undefined ? value : role;
      if (!val || !val.trim()) {
        err = 'Stack / Role is required';
      } else if (val.trim().length < 2) {
        err = 'Role must be at least 2 characters';
      }
    } else if (fieldName === 'builderTitle') {
      const val = value !== undefined ? value : builderTitle;
      if (!val || !val.trim()) {
        err = 'Builder Title is required';
      } else if (val.trim().length < 2) {
        err = 'Title must be at least 2 characters';
      }
    } else if (fieldName === 'photo') {
      const hasPhoto = value || photo || photoPreview;
      if (!hasPhoto) {
        err = 'Portrait Photo is required for ID Pass';
      }
    }

    setFieldErrors((prev) => ({ ...prev, [fieldName]: err }));
    return !err;
  };

  const handleBlur = (fieldName) => {
    setTouched((prev) => ({ ...prev, [fieldName]: true }));
    validateSingleField(fieldName);
  };

  const handleInputChange = (fieldName, setter, val) => {
    setter(val);
    if (touched[fieldName] || fieldErrors[fieldName]) {
      validateSingleField(fieldName, val);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!name || !name.trim()) {
      newErrors.name = 'Full Name is required';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!teamName || !teamName.trim()) {
      newErrors.teamName = 'Team Name is required';
    } else if (teamName.trim().length < 2) {
      newErrors.teamName = 'Team Name must be at least 2 characters';
    }

    if (!role || !role.trim()) {
      newErrors.role = 'Stack / Role is required';
    } else if (role.trim().length < 2) {
      newErrors.role = 'Role must be at least 2 characters';
    }

    if (!builderTitle || !builderTitle.trim()) {
      newErrors.builderTitle = 'Builder Title is required';
    } else if (builderTitle.trim().length < 2) {
      newErrors.builderTitle = 'Title must be at least 2 characters';
    }

    if (!photo && !photoPreview) {
      newErrors.photo = 'Portrait Photo is required for ID Pass';
    }

    setFieldErrors(newErrors);
    setTouched({
      name: true,
      teamName: true,
      role: true,
      builderTitle: true,
      photo: true,
    });

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const isValid = validateForm();
    if (!isValid) {
      setFormShake(true);
      setTimeout(() => setFormShake(false), 500);
      return;
    }

    if (onSubmit) {
      onSubmit(e);
    }
  };

  const randomTitles = [
    'Rust Wrangler',
    'Full-Stack Alchemist',
    'AI Systems Architect',
    'Solidity Whisperer',
    'Protocol Wizard',
    'Kernel Hacker',
    'DeFi Tinkerer',
    'Byte Craftsman',
    'Zero-Knowledge Engineer',
    'GPU Accelerator',
    'Distributed Systems Ninja',
    'Cyberpunk Artisan',
    'LLM Trainer',
    'Chain Architect',
    'Code Craftsman',
  ];

  const handleRandomTitle = (e) => {
    e.preventDefault();
    const randomIndex = Math.floor(Math.random() * randomTitles.length);
    const selectedTitle = randomTitles[randomIndex];
    setBuilderTitle(selectedTitle);
    validateSingleField('builderTitle', selectedTitle);
  };

  const hasFormErrors = Object.values(fieldErrors).some((err) => Boolean(err));

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className={`w-full flex flex-col gap-6 bg-[#03588C]/35 backdrop-blur-md p-6 rounded-2xl border border-[#0388A6]/45 shadow-xl transition-all ${
        formShake ? 'animate-shake' : ''
      }`}
    >
      <div className="border-b border-[#0388A6]/35 pb-4 flex items-center justify-between">
        <h2 className="text-lg font-mono font-bold text-[#F2E41D] uppercase tracking-wider flex items-center gap-2">
          <Award className="w-5 h-5 text-[#F2E41D]" /> Builder Credentials
        </h2>
        <span className="text-[10px] font-mono text-[#8cd6e6] uppercase tracking-widest">
          * All fields required
        </span>
      </div>

      {/* Validation Warning Banner */}
      {hasFormErrors && (
        <div className="bg-[#013b42]/85 border-2 border-[#F2884B] text-[#F2E41D] px-4 py-3 rounded-lg flex items-center gap-3 text-xs font-mono animate-fade-in-up">
          <AlertCircle className="w-4 h-4 shrink-0 text-[#F2884B]" />
          <span>Validation Warning: Please fill in the highlighted inputs below before generating pass.</span>
        </div>
      )}

      {/* Photo Upload Zone */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-mono font-bold text-[#F2E41D] uppercase tracking-widest flex items-center gap-2">
            <Upload className="w-3.5 h-3.5 text-[#F2E41D]" /> Portrait Photo *
          </label>
          {photoPreview && (
            <span className="text-[10px] font-mono text-[#4ade80] flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Photo Attached
            </span>
          )}
        </div>

        <div
          className={`relative border-2 border-dashed rounded-lg p-5 flex flex-col items-center justify-center cursor-pointer transition-all ${
            touched.photo && fieldErrors.photo
              ? 'border-[#F2E41D] bg-[#013b42]/60'
              : dragActive
              ? 'border-[#F2E41D] bg-[#0388A6]/40'
              : 'border-[#0388A6]/40 hover:border-[#F2E41D] bg-[#013b42]/40 backdrop-blur-sm'
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
              <div className="w-6 h-6 border-2 border-[#F2E41D] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs font-mono text-[#8cd6e6]">Processing image...</p>
            </div>
          ) : photoPreview ? (
            <div className="flex items-center gap-4">
              <img
                src={photoPreview}
                alt="Uploaded avatar preview"
                className="w-16 h-16 rounded-md object-cover border-2 border-[#F2E41D] aspect-square shadow-md"
              />
              <div className="flex flex-col">
                <span className="text-xs font-mono text-[#f4f0e6] font-bold">Photo Selected</span>
                <span className="text-[11px] font-mono text-[#8cd6e6]">Click or drag to replace photo</span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-center py-2">
              <Upload className="w-6 h-6 text-[#8cd6e6]" />
              <span className="text-xs font-mono font-bold text-[#f4f0e6]">Drag & Drop Photo Here</span>
              <span className="text-[11px] font-mono text-[#8cd6e6]">Supports JPG, PNG, and iPhone HEIC (Max 5MB)</span>
            </div>
          )}
        </div>
        {touched.photo && fieldErrors.photo && (
          <p className="text-xs font-mono text-[#F2E41D] flex items-center gap-1 mt-1 font-bold">
            <AlertCircle className="w-3.5 h-3.5 text-[#F2E41D]" /> {fieldErrors.photo}
          </p>
        )}
        {error && <p className="text-xs font-mono text-[#F2E41D] mt-1 font-bold">{error}</p>}
      </div>

      {/* Card Details Inputs */}
      <div className="flex flex-col gap-4 pt-2">
        <span className="text-xs font-mono font-bold text-[#F2E41D] uppercase tracking-widest">
          Pass Information
        </span>

        {/* Full Name & Team Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Full Name */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[11px] font-mono text-[#8cd6e6] uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#F2E41D]" /> Full Name *
              </label>
              <span className="text-[10px] font-mono text-[#8cd6e6]">
                {name.length}/30
              </span>
            </div>
            <input
              type="text"
              value={name}
              onBlur={() => handleBlur('name')}
              onChange={(e) => handleInputChange('name', setName, e.target.value.slice(0, 30))}
              placeholder="e.g. Alex Rivera"
              maxLength={30}
              className={`bg-[#013b42]/50 border rounded px-3 py-2 text-xs font-mono text-[#f4f0e6] placeholder-[#8cd6e6]/50 focus:outline-none transition-all ${
                touched.name && fieldErrors.name
                  ? 'input-error'
                  : 'border-[#0388A6]/40 focus:border-[#F2E41D]'
              }`}
            />
            {touched.name && fieldErrors.name && (
              <p className="text-[11px] font-mono text-[#F2E41D] flex items-center gap-1 mt-0.5 font-bold">
                <AlertCircle className="w-3 h-3 text-[#F2E41D]" /> {fieldErrors.name}
              </p>
            )}
          </div>

          {/* Team Name */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[11px] font-mono text-[#8cd6e6] uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#F2E41D]" /> Team Name *
              </label>
              <span className="text-[10px] font-mono text-[#8cd6e6]">
                {teamName.length}/25
              </span>
            </div>
            <input
              type="text"
              value={teamName}
              onBlur={() => handleBlur('teamName')}
              onChange={(e) => handleInputChange('teamName', setTeamName, e.target.value.slice(0, 25))}
              placeholder="e.g. CyberPulse Labs"
              maxLength={25}
              className={`bg-[#013b42]/50 border rounded px-3 py-2 text-xs font-mono text-[#f4f0e6] placeholder-[#8cd6e6]/50 focus:outline-none transition-all ${
                touched.teamName && fieldErrors.teamName
                  ? 'input-error'
                  : 'border-[#0388A6]/40 focus:border-[#F2E41D]'
              }`}
            />
            {touched.teamName && fieldErrors.teamName && (
              <p className="text-[11px] font-mono text-[#F2E41D] flex items-center gap-1 mt-0.5 font-bold">
                <AlertCircle className="w-3 h-3 text-[#F2E41D]" /> {fieldErrors.teamName}
              </p>
            )}
          </div>
        </div>

        {/* Role & Builder Title */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Stack / Role */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[11px] font-mono text-[#8cd6e6] uppercase tracking-wider flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-[#F2E41D]" /> Stack / Role *
              </label>
              <span className="text-[10px] font-mono text-[#8cd6e6]">
                {role.length}/30
              </span>
            </div>
            <input
              type="text"
              value={role}
              onBlur={() => handleBlur('role')}
              onChange={(e) => handleInputChange('role', setRole, e.target.value.slice(0, 30))}
              placeholder="e.g. Full-Stack / Rust / AI"
              maxLength={30}
              className={`bg-[#013b42]/50 border rounded px-3 py-2 text-xs font-mono text-[#f4f0e6] placeholder-[#8cd6e6]/50 focus:outline-none transition-all ${
                touched.role && fieldErrors.role
                  ? 'input-error'
                  : 'border-[#0388A6]/40 focus:border-[#F2E41D]'
              }`}
            />
            {touched.role && fieldErrors.role && (
              <p className="text-[11px] font-mono text-[#F2E41D] flex items-center gap-1 mt-0.5 font-bold">
                <AlertCircle className="w-3 h-3 text-[#F2E41D]" /> {fieldErrors.role}
              </p>
            )}
          </div>

          {/* Builder Title */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[11px] font-mono text-[#8cd6e6] uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-[#F2E41D]" /> Builder Title *
              </label>
              <button
                type="button"
                onClick={handleRandomTitle}
                className="text-[10px] font-mono text-[#F2884B] hover:underline flex items-center gap-1 opacity-90 hover:opacity-100 transition-opacity"
                title="Generate random builder title"
              >
                <RefreshCw className="w-3 h-3 text-[#F2884B]" /> Auto-Generate
              </button>
            </div>
            <input
              type="text"
              value={builderTitle}
              onBlur={() => handleBlur('builderTitle')}
              onChange={(e) => handleInputChange('builderTitle', setBuilderTitle, e.target.value.slice(0, 30))}
              placeholder="e.g. Protocol Wizard"
              maxLength={30}
              className={`bg-[#013b42]/50 border rounded px-3 py-2 text-xs font-mono text-[#f4f0e6] placeholder-[#8cd6e6]/50 focus:outline-none transition-all ${
                touched.builderTitle && fieldErrors.builderTitle
                  ? 'input-error'
                  : 'border-[#0388A6]/40 focus:border-[#F2E41D]'
              }`}
            />
            {touched.builderTitle && fieldErrors.builderTitle && (
              <p className="text-[11px] font-mono text-[#F2E41D] flex items-center gap-1 mt-0.5 font-bold">
                <AlertCircle className="w-3 h-3 text-[#F2E41D]" /> {fieldErrors.builderTitle}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-4 border-t border-[#0388A6]/35">
        <button
          type="submit"
          className="w-full py-3.5 px-4 bg-[#F2E41D] hover:bg-[#e0cc16] text-[#013b42] font-mono font-bold text-sm uppercase tracking-widest rounded flex items-center justify-center gap-2 pattern-border transition-all active:scale-[0.99]"
        >
          <Sparkles className="w-4 h-4 text-[#013b42]" />
          Generate ID Pass
        </button>
      </div>
    </form>
  );
}

