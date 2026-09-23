import React, { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Camera, CheckCircle2, UserCheck, Search, AlertCircle, RefreshCw } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Badge } from '../common/Badge';
import { useGym } from '../../context/GymContext';

export const QRScannerModal = ({ isOpen, onClose, defaultClassId = null }) => {
  const { members, classes, checkIn } = useGym();
  const [activeTab, setActiveTab] = useState('camera'); // 'camera' | 'manual'
  const [cameraError, setCameraError] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Manual Check-in states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [selectedClassId, setSelectedClassId] = useState(defaultClassId || '');

  const scannerRef = useRef(null);
  const scannerContainerId = 'fitflow-qr-reader';

  // Initialize camera scanner when modal opens on 'camera' tab
  useEffect(() => {
    let html5QrCode = null;

    if (isOpen && activeTab === 'camera') {
      setCameraError(null);
      setScanResult(null);

      const startScanner = async () => {
        try {
          html5QrCode = new Html5Qrcode(scannerContainerId);
          scannerRef.current = html5QrCode;

          await html5QrCode.start(
            { facingMode: 'environment' },
            {
              fps: 10,
              qrbox: { width: 250, height: 250 },
            },
            async (decodedText) => {
              // Successfully decoded QR code
              try {
                html5QrCode.pause();
              } catch (e) {}

              handleQrScanned(decodedText);
            },
            (errorMessage) => {
              // Ignore standard frame scan errors
            }
          );
          setIsScanning(true);
        } catch (err) {
          console.warn('Camera failed to start:', err);
          setCameraError(
            err.message || 'Unable to access camera. Please allow camera permissions or use Manual Check-in tab.'
          );
          setIsScanning(false);
        }
      };

      // Slight timeout to ensure DOM container is mounted
      const timer = setTimeout(startScanner, 200);

      return () => {
        clearTimeout(timer);
        if (scannerRef.current) {
          try {
            scannerRef.current.stop().then(() => {
              scannerRef.current.clear();
            });
          } catch (e) {}
        }
      };
    }
  }, [isOpen, activeTab]);

  const handleQrScanned = async (text) => {
    setIsProcessing(true);
    try {
      let memberId = text;
      // If JSON formatted pass
      if (text.startsWith('{')) {
        const parsed = JSON.parse(text);
        memberId = parsed.memberId;
      }

      const res = await checkIn(memberId, selectedClassId || null, 'qr');
      setScanResult(res);
    } catch (err) {
      setCameraError(err.message || 'Failed to verify member check-in.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleManualCheckIn = async (e) => {
    e.preventDefault();
    if (!selectedMemberId) return;

    setIsProcessing(true);
    try {
      const res = await checkIn(selectedMemberId, selectedClassId || null, 'manual');
      setScanResult(res);
    } catch (err) {
      setCameraError(err.message || 'Check-in failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleResetScan = () => {
    setScanResult(null);
    setCameraError(null);
    if (scannerRef.current && isScanning) {
      try {
        scannerRef.current.resume();
      } catch (e) {}
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
      description="Scan member passes using live camera or perform manual attendance lookup."
      maxWidth="max-w-xl"
    >
      {/* Tabs */}
      <div className="flex border-b border-slate-200 mb-5">
        <button
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === 'camera'
              ? 'border-brand-600 text-brand-600'
              : 'border-transparent text-slate-500 hover:text-navy-900'
          }`}
          onClick={() => {
            setActiveTab('camera');
            setScanResult(null);
          }}
        >
          <Camera className="w-4 h-4" />
          Camera Scanner
        </button>
        <button
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === 'manual'
              ? 'border-brand-600 text-brand-600'
              : 'border-transparent text-slate-500 hover:text-navy-900'
          }`}
          onClick={() => {
            setActiveTab('manual');
            setScanResult(null);
          }}
        >
          <UserCheck className="w-4 h-4" />
          Manual Lookup & Check-In
        </button>
      </div>

      {/* SUCCESS RESULT SCREEN */}
      {scanResult ? (
        <div className="flex flex-col items-center text-center p-6 bg-emerald-50/60 rounded-2xl border border-emerald-200 animate-in fade-in">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4 shadow-soft">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <Badge variant="success" size="lg" className="mb-2">
            ✓ Check-In Verified
          </Badge>
          <h3 className="text-xl font-bold text-navy-900 mt-1">{scanResult.member?.full_name}</h3>
          <p className="text-sm text-slate-600">{scanResult.member?.email}</p>

          <div className="mt-4 p-3 bg-white rounded-xl border border-emerald-200 w-full text-xs text-slate-700 flex justify-around">
            <div>
              <span className="text-slate-400 block">Membership</span>
              <strong className="text-emerald-700 uppercase font-semibold">
                {scanResult.membership?.status || 'Active'}
              </strong>
            </div>
            <div>
              <span className="text-slate-400 block">Method</span>
              <strong className="text-navy-900 uppercase font-semibold">
                {scanResult.record?.check_in_method}
              </strong>
            </div>
            <div>
              <span className="text-slate-400 block">Time</span>
              <strong className="text-navy-900 font-semibold">
                {new Date(scanResult.record?.check_in_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </strong>
            </div>
          </div>

          <div className="mt-6 flex gap-3 w-full">
            <Button variant="secondary" onClick={handleResetScan} className="flex-1" icon={RefreshCw}>
              Scan Next Member
            </Button>
            <Button variant="primary" onClick={onClose} className="flex-1">
              Done
            </Button>
          </div>
        </div>
      ) : activeTab === 'camera' ? (
        /* CAMERA SCANNER TAB */
        <div>
          <div className="relative rounded-2xl overflow-hidden bg-slate-900 aspect-video flex items-center justify-center border border-slate-700 shadow-inner">
            <div id={scannerContainerId} className="w-full h-full" />

            {/* Simulated test button if webcam is absent or user wants immediate test */}
            <div className="absolute bottom-3 inset-x-3 flex justify-between items-center bg-slate-900/80 backdrop-blur-md p-2 rounded-xl border border-white/10 text-white text-xs">
              <span className="text-slate-300">Test quick pass:</span>
              <button
                type="button"
                onClick={() => {
                  const testMember = members[0];
                  if (testMember) handleQrScanned(JSON.stringify({ memberId: testMember.id }));
                }}
                className="px-2.5 py-1 rounded bg-accent-500 hover:bg-accent-600 text-white font-medium transition-colors"
              >
                Simulate Pass Scan
              </button>
            </div>
          </div>

          {cameraError && (
            <div className="mt-3 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-600" />
              <div>
                <p className="font-semibold">Camera Notice</p>
                <p className="mt-0.5">{cameraError}</p>
                <button
                  onClick={() => setActiveTab('manual')}
                  className="mt-1 font-semibold text-brand-600 underline"
                >
                  Switch to Manual Member Lookup
                </button>
              </div>
            </div>
          )}

          <p className="mt-4 text-xs text-center text-slate-500">
            Hold member QR pass in front of camera or test using the simulation button.
          </p>
        </div>
      ) : (
        /* MANUAL CHECK-IN TAB */
        <form onSubmit={handleManualCheckIn} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Select Member
            </label>
            <Input
              placeholder="Search member by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={Search}
              className="mb-2"
            />
            <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-xl divide-y divide-slate-100 bg-white">
              {filteredMembers.map((m) => (
                <div
                  key={m.id}
                  onClick={() => setSelectedMemberId(m.id)}
                  className={`p-3 flex items-center justify-between cursor-pointer transition-colors ${
                    selectedMemberId === m.id ? 'bg-brand-50 border-brand-200' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={m.avatar_url}
                      alt={m.full_name}
                      className="w-8 h-8 rounded-full border border-slate-200 object-cover"
                    />
                    <div>
                      <p className="text-sm font-semibold text-navy-900 leading-tight">{m.full_name}</p>
                      <p className="text-xs text-slate-500">{m.email}</p>
                    </div>
                  </div>
                  <Badge variant={m.membership?.status === 'active' ? 'success' : 'warning'} size="sm">
                    {m.plan?.name || 'Active'}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Assign to Class (Optional)
            </label>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="block w-full rounded-xl border border-slate-200 bg-white text-navy-900 text-sm px-3.5 py-2.5 focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              <option value="">General Gym Floor Entry</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.start_time} - {c.location})
                </option>
              ))}
            </select>
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <Button variant="secondary" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button
              variant="accent"
              type="submit"
              disabled={!selectedMemberId || isProcessing}
              isLoading={isProcessing}
              icon={CheckCircle2}
            >
              Confirm Check-In
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
