import React, { useRef, useEffect, useState } from 'react';
import { Download, Share2, RefreshCw, CreditCard, Sparkles } from 'lucide-react';
import { drawCoverImage, loadImage } from '../utils/imageHelpers';

export default function CanvasPreview({
  isSubmitted,
  submittedData,
}) {
  const canvasRef = useRef(null);
  const [photoImg, setPhotoImg] = useState(null);
  const [assetsLoaded, setAssetsLoaded] = useState(false);
  const [loadingError, setLoadingError] = useState(false);

  const frontBgRef = useRef(null);
  const ticketOverlayRef = useRef(null);

  // Extract submitted data fields
  const name = submittedData?.name || '';
  const teamName = submittedData?.teamName || '';
  const role = submittedData?.role || '';
  const builderTitle = submittedData?.builderTitle || '';
  const photo = submittedData?.photo || null;

  // Load custom template backgrounds from public/assets/elements/
  useEffect(() => {
    let active = true;
    Promise.all([
      loadImage('/assets/elements/template_front.jpg')
        .then((img) => { if (active) frontBgRef.current = img; }),
      loadImage('/assets/elements/ticket_overlay.png')
        .then((img) => { if (active) ticketOverlayRef.current = img; })
    ])
      .then(() => {
        if (active) {
          setAssetsLoaded(true);
          setLoadingError(false);
        }
      })
      .catch((err) => {
        console.error('Failed to load ID card template elements:', err);
        if (active) setLoadingError(true);
      });

    return () => {
      active = false;
    };
  }, []);

  // Load user photo object URL when photo changes in submittedData
  useEffect(() => {
    if (!photo) {
      setPhotoImg(null);
      return;
    }

    const url = URL.createObjectURL(photo);
    let active = true;

    loadImage(url)
      .then((img) => {
        if (active) setPhotoImg(img);
      })
      .catch((err) => {
        console.error('Failed to load user photo into canvas image:', err);
      });

    return () => {
      active = false;
      URL.revokeObjectURL(url);
    };
  }, [photo]);

  // Canvas drawing routine (1000x1500 resolution)
  useEffect(() => {
    if (!isSubmitted) return;
    const canvas = canvasRef.current;
    if (!canvas || !assetsLoaded) return;

    const ctx = canvas.getContext('2d');
    canvas.width = 1000;
    canvas.height = 1500;
    ctx.clearRect(0, 0, 1000, 1500);

    const drawRoundedRect = (c, x, y, width, height, radius) => {
      c.beginPath();
      c.moveTo(x + radius, y);
      c.lineTo(x + width - radius, y);
      c.quadraticCurveTo(x + width, y, x + width, y + radius);
      c.lineTo(x + width, y + height - radius);
      c.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
      c.lineTo(x + radius, y + height);
      c.quadraticCurveTo(x, y + height, x, y + height - radius);
      c.lineTo(x, y + radius);
      c.quadraticCurveTo(x, y, x + radius, y);
      c.closePath();
    };

    // ── FRONT ID CARD RENDERING ──
    
    // 1. Draw Base Template Front Background
    if (frontBgRef.current) {
      ctx.drawImage(frontBgRef.current, 0, 0, 1000, 1500);
    } else {
      ctx.fillStyle = '#0b4d34';
      ctx.fillRect(0, 0, 1000, 1500);
    }

    // 2. Draw Photo Frame Area with exact 1:1 square ratio (Width: 440, Height: 440)
    // Shifted 8px down (photoY = 308)
    const photoW = 440;
    const photoH = 440;
    const photoX = (1000 - photoW) / 2; // 280
    const photoY = 308;
    const radius = 20;

    ctx.save();
    drawRoundedRect(ctx, photoX, photoY, photoW, photoH, radius);
    ctx.clip();

    if (photoImg) {
      drawCoverImage(ctx, photoImg, photoX, photoY, photoW, photoH);
    } else {
      // Placeholder dark green background when no photo is uploaded
      ctx.fillStyle = '#072b1d';
      ctx.fillRect(photoX, photoY, photoW, photoH);

      ctx.fillStyle = 'rgba(237, 232, 213, 0.4)';
      ctx.font = '600 22px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('1:1 PORTRAIT PHOTO', photoX + photoW / 2, photoY + photoH / 2);
    }
    ctx.restore();

    // Gold Frame Accent Border
    ctx.strokeStyle = '#d4a017';
    ctx.lineWidth = 3;
    drawRoundedRect(ctx, photoX, photoY, photoW, photoH, radius);
    ctx.stroke();

    // 3. Draw Ticket Stub Overlay Image (Name.png) shifted 8px down
    if (ticketOverlayRef.current) {
      ctx.drawImage(ticketOverlayRef.current, 0, 8, 1000, 1500);
    }

    // 4. Overlay User Candidate Name (Large Display Serif centered with increased font size)
    const displayName = (name || '').trim() || 'YOUR NAME';
    ctx.fillStyle = '#0b4d34';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    let nameSize = 70;
    ctx.font = `italic 700 ${nameSize}px "Cormorant Garamond", "Playfair Display", serif`;
    while (ctx.measureText(displayName).width > 640 && nameSize > 30) {
      nameSize -= 2;
      ctx.font = `italic 700 ${nameSize}px "Cormorant Garamond", "Playfair Display", serif`;
    }
    ctx.fillText(displayName, 500, 835);

    // 5. Overlay Team Name Value (Centered & positioned just below candidate name)
    const cleanTeam = (teamName || '').trim();
    if (cleanTeam) {
      ctx.fillStyle = '#0b4d34';
      ctx.font = '700 22px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(cleanTeam.toUpperCase(), 500, 888);
    }

    // 6. Overlay Stack / Role Value (Next to </> icon)
    const displayRole = (role || '').trim() || 'Builder';
    ctx.fillStyle = '#0b4d34';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';

    let roleSize = 20;
    ctx.font = `700 ${roleSize}px "JetBrains Mono", monospace`;
    while (ctx.measureText(displayRole).width > 240 && roleSize > 12) {
      roleSize -= 1;
      ctx.font = `700 ${roleSize}px "JetBrains Mono", monospace`;
    }
    ctx.fillText(displayRole, 265, 973);

    // 7. Overlay Builder Title Value (Next to ★ icon)
    const displayTitle = (builderTitle || '').trim() || 'Hacker';
    ctx.fillStyle = '#0b4d34';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';

    let titleSize = 20;
    ctx.font = `700 ${titleSize}px "JetBrains Mono", monospace`;
    while (ctx.measureText(displayTitle).width > 240 && titleSize > 12) {
      titleSize -= 1;
      ctx.font = `700 ${titleSize}px "JetBrains Mono", monospace`;
    }
    ctx.fillText(displayTitle, 615, 973);
  }, [name, teamName, role, builderTitle, photoImg, isSubmitted, assetsLoaded]);

  // Direct PNG Download Helper
  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const filename = `hh-goa-2026-pass-${(name || 'builder').toLowerCase().replace(/\s+/g, '-')}.png`;

    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleShareToX = () => {
    const caption = `Just minted my official HH Goa 2026 Builder ID Pass! Ready to lock in and ship in paradise. 🌊🌴\n\nGenerate yours at hhgoa.com! #FrameInGoa #HackerHouseGoa`;
    const xUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(caption)}`;
    window.open(xUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="w-full flex flex-col items-center gap-6">
      {/* Canvas Display Wrapper or Unsubmitted Placeholder */}
      {!isSubmitted ? (
        <div className="relative w-full max-w-sm aspect-[2/3] rounded-xl overflow-hidden shadow-2xl border-2 border-dashed border-[#2a2a26] bg-[#141412] flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-[#1c1c18] border border-[#2a2a26] flex items-center justify-center mb-4">
            <CreditCard className="w-8 h-8 text-[#8a8575]" />
          </div>
          <h3 className="font-mono text-sm font-bold text-[#ede8d5] uppercase tracking-wider mb-2">
            ID Pass Preview
          </h3>
          <p className="font-mono text-xs text-[#8a8575] leading-relaxed max-w-[240px]">
            Fill out your details on the left and click <span className="text-[#d4a017] font-bold">Generate ID Pass</span> to create your pass.
          </p>
        </div>
      ) : (
        <div className="relative w-full max-w-sm aspect-[2/3] rounded-xl overflow-hidden shadow-2xl border border-[#2a2a26] bg-[#0a0a08] group">
          {!assetsLoaded && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a0a08] gap-3 z-20">
              <RefreshCw className="w-7 h-7 text-[#d4a017] animate-spin" />
              <span className="font-mono text-xs text-[#8a8575] tracking-widest uppercase">Loading Card Templates...</span>
            </div>
          )}

          <canvas
            ref={canvasRef}
            className="w-full h-full object-contain display-block"
          />
        </div>
      )}

      {/* Action Buttons (Only visible when submitted) */}
      {isSubmitted && (
        <div className="w-full max-w-sm flex flex-col gap-3">
          <button
            type="button"
            onClick={handleDownload}
            disabled={!assetsLoaded}
            className="w-full py-3 px-4 bg-[#d4a017] hover:bg-[#c29112] text-[#0a0a08] font-mono font-bold text-xs uppercase tracking-widest rounded flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            Download ID Pass (PNG)
          </button>

          <button
            type="button"
            onClick={handleShareToX}
            className="w-full py-2.5 px-4 bg-[#1a1a16] hover:bg-[#252520] border border-[#2a2a26] text-[#ede8d5] font-mono font-bold text-[11px] uppercase tracking-wider rounded flex items-center justify-center gap-1.5 transition-all active:scale-[0.98]"
          >
            <Share2 className="w-3.5 h-3.5 text-[#fd267a]" />
            Share to X
          </button>
        </div>
      )}
    </div>
  );
}

