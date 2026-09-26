import React, { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import confetti from 'canvas-confetti';
import {
  Camera,
  CheckCircle2,
  UserCheck,
  Search,
  AlertCircle,
  RefreshCw,
  QrCode,
  Zap,
  Sparkles,
  ShieldCheck,
  Upload,
  Clock,
  User,
  X,
  ChevronRight,
  FileImage,
  Video,
  VideoOff,
  SwitchCamera,
  ArrowRight,
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Badge } from '../common/Badge';
import { useGym } from '../../context/GymContext';

// Audio chime using Web Audio API
const playSuccessChime = () => {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.frequency.setValueAtTime(587.33, now); // D5
    osc2.frequency.setValueAtTime(880, now + 0.1); // A5

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc1.stop(now + 0.2);
    osc2.start(now + 0.1);
    osc2.stop(now + 0.45);
  } catch (e) {}
};

export const QRScannerModal = ({ isOpen, onClose, defaultClassId = null }) => {
  const { members, classes, checkIn } = useGym();

  // 2 Primary Modes: 'camera' | 'upload' | 'manual'
  const [activeTab, setActiveTab] = useState('camera');
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [facingMode, setFacingMode] = useState('environment'); // 'environment' | 'user'

  // Drag & drop state for Image Upload
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadedPreview, setUploadedPreview] = useState(null);

  // Manual Check-in state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClassId, setSelectedClassId] = useState(defaultClassId || '');

  const scannerRef = useRef(null);
  const fileInputRef = useRef(null);
  const dropZoneRef = useRef(null);

  const cameraContainerId = 'fitflow-camera-viewport';
  const fileScannerContainerId = 'fitflow-file-scanner-hidden';

  // Start live webcam scanning
  const startCamera = async () => {
    setCameraError(null);
    setIsProcessing(false);

    try {
      if (scannerRef.current) {
        try {
          await scannerRef.current.stop();
        } catch (e) {}
      }

      const html5QrCode = new Html5Qrcode(cameraContainerId);
      scannerRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: facingMode },
        {
          fps: 15,
          qrbox: { width: 250, height: 250 },
        },
        async (decodedText) => {
          try {
            html5QrCode.pause();
          } catch (e) {}
          handleQrDecoded(decodedText, 'Camera Scanner');
        },
        () => {
          // Ignored standard frame noise
        }
      );

      setCameraActive(true);
    } catch (err) {
      console.warn('Camera failed to start:', err);
      setCameraActive(false);
      setCameraError(
        'Webcam access was not granted or no physical camera detected. You can click "Turn On Camera" to grant permission, or use Option 2 (Upload/Drag QR Image).'
      );
    }
  };

  // Stop live webcam scanning
  const stopCamera = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        await scannerRef.current.clear();
      } catch (e) {}
      scannerRef.current = null;
    }
    setCameraActive(false);
  };

  // Lifecycle when modal opens or tab changes
  useEffect(() => {
    let timer;
    if (isOpen && activeTab === 'camera') {
      setScanResult(null);
      setCameraError(null);
      timer = setTimeout(startCamera, 300);
    } else {
      stopCamera();
    }

    return () => {
      clearTimeout(timer);
      stopCamera();
    };
  }, [isOpen, activeTab, facingMode]);

  // Decode handler for both Camera & Image Upload
  const handleQrDecoded = async (text, methodLabel = 'QR Scan') => {
    setIsProcessing(true);
    setUploadError(null);

    try {
      let memberId = text;
      if (text.startsWith('{')) {
        try {
          const parsed = JSON.parse(text);
          memberId = parsed.memberId || parsed.id || text;
        } catch (e) {}
      }

      // Record check in
      const res = await checkIn(memberId, selectedClassId || null, 'qr');
      setScanResult({
        ...res,
        methodLabel,
      });

      playSuccessChime();
      try {
        confetti({
          particleCount: 55,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch (e) {}
    } catch (err) {
      const msg = err.message || 'QR code verification failed. Member record not found.';
      if (activeTab === 'upload') {
        setUploadError(msg);
      } else {
        setCameraError(msg);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // Process uploaded or dropped image file
  const processImageFile = async (file) => {
    if (!file || !file.type.startsWith('image/')) {
      setUploadError('Please provide a valid image file (PNG, JPG, WEBP).');
      return;
    }

    setIsProcessing(true);
    setUploadError(null);

    // Show thumbnail preview
    const reader = new FileReader();
    reader.onload = (e) => setUploadedPreview(e.target.result);
    reader.readAsDataURL(file);

    try {
      const html5QrCode = new Html5Qrcode(fileScannerContainerId);
      const decodedText = await html5QrCode.scanFile(file, true);
      await html5QrCode.clear();
      handleQrDecoded(decodedText, 'QR Image Upload');
    } catch (err) {
      console.warn('File QR decode failed:', err);
      setUploadError('No valid QR code found in this image. Please upload a clear photo of the member QR pass.');
      setIsProcessing(false);
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processImageFile(files[0]);
    }
  };

  // Reset scan to ready state
  const handleResetScan = () => {
    setScanResult(null);
    setCameraError(null);
    setUploadError(null);
    setUploadedPreview(null);
    if (activeTab === 'camera') {
      startCamera();
    }
  };

  const filteredMembers = members.filter(
    (m) =>
      m.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Front Desk & Attendance Scanner"
      description="Scan live with webcam or drag & drop a QR code image."
      maxWidth="max-w-2xl"
    >
      {/* Hidden container for file-based decoding */}
      <div id={fileScannerContainerId} className="hidden" />

      <div className="max-h-[82vh] overflow-y-auto pr-1">
        {/* TOP SEGMENTED CONTROL: 2 PRIMARY OPTIONS */}
        <div className="grid grid-cols-2 p-1.5 bg-slate-100 rounded-2xl mb-5 border border-slate-200">
          <button
            type="button"
            onClick={() => {
              setActiveTab('camera');
              setScanResult(null);
            }}
            className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
              activeTab === 'camera'
                ? 'bg-white text-navy-900 shadow-md shadow-slate-200'
                : 'text-slate-500 hover:text-navy-900'
            }`}
          >
            <Camera className="w-4 h-4 text-brand-600" />
            <span>Option 1: Live Camera</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('upload');
              setScanResult(null);
            }}
            className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
              activeTab === 'upload'
                ? 'bg-white text-navy-900 shadow-md shadow-slate-200'
                : 'text-slate-500 hover:text-navy-900'
            }`}
          >
            <Upload className="w-4 h-4 text-accent-500" />
            <span>Option 2: Drag / Upload Image</span>
          </button>
        </div>

        {/* 1. SUCCESS VERIFIED SCREEN */}
        {scanResult ? (
          <div className="flex flex-col items-center text-center p-6 bg-gradient-to-b from-emerald-50 via-white to-slate-50 rounded-3xl border border-emerald-200 shadow-lg animate-in fade-in zoom-in-95 duration-200">
            <div className="relative mb-3">
              <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="w-12 h-12 stroke-[2.5]" />
              </div>
              <span className="absolute bottom-0 right-0 p-1.5 rounded-full bg-emerald-500 text-white shadow">
                <Sparkles className="w-3.5 h-3.5" />
              </span>
            </div>

            <Badge variant="success" size="lg" className="mb-2 font-bold">
              ✓ Verified Check-In Successful
            </Badge>

            <h3 className="text-2xl font-black text-navy-900 mt-1">
              {scanResult.member?.full_name || 'Verified Member'}
            </h3>
            <p className="text-xs text-slate-500 font-medium">{scanResult.member?.email}</p>

            {/* Check-in Details */}
            <div className="mt-5 p-4 bg-white rounded-2xl border border-slate-200/90 shadow-sm w-full grid grid-cols-3 gap-3 text-xs">
              <div className="text-center p-2 rounded-xl bg-slate-50">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Membership</span>
                <strong className="text-emerald-700 font-black mt-0.5 block">
                  {scanResult.membership?.status || 'Active VIP'}
                </strong>
              </div>
              <div className="text-center p-2 rounded-xl bg-slate-50">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Scan Method</span>
                <strong className="text-navy-900 font-black mt-0.5 block">
                  {scanResult.methodLabel || 'QR Verified'}
                </strong>
              </div>
              <div className="text-center p-2 rounded-xl bg-slate-50">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Time</span>
                <strong className="text-navy-900 font-black mt-0.5 block">
                  {scanResult.record?.check_in_time
                    ? new Date(scanResult.record.check_in_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    : 'Just now'}
                </strong>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex items-center gap-3 w-full">
              <Button
                variant="secondary"
                onClick={handleResetScan}
                className="flex-1 font-bold"
                icon={RefreshCw}
              >
                Scan Next Member
              </Button>
              <Button
                variant="accent"
                onClick={onClose}
                className="flex-1 font-bold"
              >
                Done
              </Button>
            </div>
          </div>
        ) : activeTab === 'camera' ? (
          /* OPTION 1: LIVE WEBCAM SCANNER */
          <div className="space-y-4">
            {/* Camera Viewport Frame */}
            <div className="relative rounded-3xl overflow-hidden bg-slate-950 aspect-[4/3] sm:aspect-video flex items-center justify-center border border-slate-800 shadow-2xl">
              {/* Underlying Video */}
              <div id={cameraContainerId} className="w-full h-full object-cover" />

              {/* Laser Scanning HUD Overlay */}
              {cameraActive && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-6">
                  {/* 4 Corner Targeting Reticles */}
                  <div className="relative w-64 h-64 sm:w-72 sm:h-72 border-2 border-dashed border-white/20 rounded-2xl flex items-center justify-center">
                    <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-accent-400 -mt-1 -ml-1 rounded-tl-lg" />
                    <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-accent-400 -mt-1 -mr-1 rounded-tr-lg" />
                    <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-accent-400 -mb-1 -ml-1 rounded-bl-lg" />
                    <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-accent-400 -mb-1 -mr-1 rounded-br-lg" />

                    {/* Animated moving laser bar */}
                    <div className="absolute inset-x-2 h-1 bg-gradient-to-r from-transparent via-accent-400 to-transparent shadow-[0_0_12px_#f97316] animate-laser-scan rounded-full" />

                    <div className="text-center p-4">
                      <QrCode className="w-12 h-12 text-white/40 mx-auto mb-2 animate-pulse" />
                      <p className="text-xs font-bold text-white/80 tracking-wide uppercase">
                        QR Code Samnay Rakhein
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Status & Camera Switch Bar */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-white border border-white/10 font-bold">
                  {cameraActive ? (
                    <>
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      <span className="text-emerald-300">Camera Live & Scanning</span>
                    </>
                  ) : (
                    <>
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                      <span className="text-amber-300">Camera Off</span>
                    </>
                  )}
                </span>

                {cameraActive && (
                  <button
                    type="button"
                    onClick={() => setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'))}
                    className="flex items-center gap-1 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-slate-300 hover:text-white border border-white/10 font-bold cursor-pointer transition-colors"
                  >
                    <SwitchCamera className="w-3.5 h-3.5" />
                    <span>Flip</span>
                  </button>
                )}
              </div>

              {/* If camera is not active or stopped */}
              {!cameraActive && (
                <div className="absolute inset-0 bg-slate-900/95 flex flex-col items-center justify-center p-6 text-center space-y-3 z-20">
                  <div className="w-14 h-14 rounded-2xl bg-slate-800 text-brand-400 flex items-center justify-center shadow-lg border border-slate-700">
                    <Camera className="w-7 h-7" />
                  </div>
                  <h4 className="text-base font-bold text-white">Live Camera Not Active</h4>
                  <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                    Camera on karke samnay QR code layen ya doosra option (Image Drag/Upload) use karein.
                  </p>
                  <Button
                    variant="accent"
                    size="md"
                    onClick={startCamera}
                    icon={Video}
                    className="font-bold shadow-lg shadow-accent-500/30"
                  >
                    Turn On Camera (کیمرہ آن کریں)
                  </Button>
                </div>
              )}
            </div>

            {/* Camera error/permission warning */}
            {cameraError && (
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-bold">Camera Permission Required</p>
                  <p className="mt-0.5 text-amber-800 text-[11px] leading-relaxed">{cameraError}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('upload')}
                  className="px-3 py-1.5 rounded-xl bg-amber-200/90 hover:bg-amber-300 font-bold text-amber-900 text-xs transition-colors shrink-0"
                >
                  Upload Image Instead
                </button>
              </div>
            )}
          </div>
        ) : activeTab === 'upload' ? (
          /* OPTION 2: DRAG & DROP OR UPLOAD QR CODE IMAGE */
          <div className="space-y-4">
            <div
              ref={dropZoneRef}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative rounded-3xl p-8 sm:p-12 text-center border-2 border-dashed transition-all duration-200 cursor-pointer flex flex-col items-center justify-center ${
                isDragging
                  ? 'border-brand-500 bg-brand-50/80 scale-[1.01] shadow-xl'
                  : 'border-slate-300 hover:border-brand-400 bg-slate-50/80 hover:bg-slate-50'
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) processImageFile(file);
                }}
                className="hidden"
              />

              <div className="relative mb-4">
                <div className="w-18 h-18 rounded-3xl bg-brand-50 text-brand-600 flex items-center justify-center shadow-soft border border-brand-200/80">
                  <FileImage className="w-9 h-9" />
                </div>
                <div className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-accent-500 text-white shadow-md">
                  <Upload className="w-4 h-4" />
                </div>
              </div>

              <h4 className="text-base sm:text-lg font-black text-navy-900 tracking-tight">
                {isDragging ? 'Drop QR Code Image Here!' : 'Drag & Drop QR Code Image'}
              </h4>

              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-sm">
                Yahan QR code ki photo drag karein ya click karke upload karein (PNG, JPG, WEBP).
              </p>

              <div className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-md shadow-brand-600/20 transition-all">
                <Upload className="w-4 h-4" />
                <span>Browse From Device</span>
              </div>
            </div>

            {/* Error banner if image had no QR code */}
            {uploadError && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-bold">QR Decode Notice</p>
                  <p className="mt-0.5 text-rose-800 text-[11px] leading-relaxed">{uploadError}</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* OPTION 3: MANUAL SEARCH FALLBACK */
          <div className="space-y-4">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search member by full name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
              />
            </div>

            {/* Athlete List */}
            <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 border border-slate-200 rounded-2xl bg-white shadow-sm">
              {filteredMembers.map((m) => (
                <div
                  key={m.id}
                  className="p-3.5 flex items-center justify-between gap-3 hover:bg-slate-50/80 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        m.avatar_url ||
                        `https://api.dicebear.com/7.x/avataaars/svg?seed=${m.full_name}`
                      }
                      alt={m.full_name}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-sm"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-navy-900 leading-tight">
                        {m.full_name}
                      </h4>
                      <p className="text-[11px] text-slate-500">{m.email}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleQrDecoded(JSON.stringify({ memberId: m.id }), 'Manual Entry')}
                    className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                  >
                    Check In
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* QUICK PASS SIMULATOR (ONE-CLICK TEST PASSES) */}
        {!scanResult && (
          <div className="mt-5 p-3.5 rounded-2xl bg-slate-900 text-white border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold flex items-center gap-1.5 text-slate-300">
                <Zap className="w-3.5 h-3.5 text-accent-400" />
                Quick Test Pass (One-Click Simulation):
              </span>
              <button
                type="button"
                onClick={() => setActiveTab(activeTab === 'manual' ? 'camera' : 'manual')}
                className="text-[11px] font-semibold text-brand-400 hover:text-brand-300 underline"
              >
                {activeTab === 'manual' ? 'Back to Scanner' : 'Manual Member Lookup'}
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              {members.slice(0, 4).map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => handleQrDecoded(JSON.stringify({ memberId: m.id }), 'Simulated Pass')}
                  disabled={isProcessing}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-accent-500/30 text-white text-xs font-bold border border-white/15 hover:border-accent-400/50 transition-all cursor-pointer hover:scale-105 active:scale-95"
                >
                  <img
                    src={
                      m.avatar_url ||
                      `https://api.dicebear.com/7.x/avataaars/svg?seed=${m.full_name}`
                    }
                    alt={m.full_name}
                    className="w-5 h-5 rounded-full object-cover ring-1 ring-white/30"
                  />
                  <span>{m.full_name}</span>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
