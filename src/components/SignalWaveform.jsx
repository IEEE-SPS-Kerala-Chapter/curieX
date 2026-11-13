import { useEffect, useRef, useState } from 'react';

const WAVE_MODES = [
  { id: 'carrier', label: 'Carrier Wave' },
  { id: 'fourier', label: 'Fourier Harmonics' },
  { id: 'ecg', label: 'Bio-Signal ECG' },
  { id: 'spectrum', label: 'Audio Spectrum' },
];

const sampleWaveform = (xNorm, t, mode) => {
  switch (mode) {
    case 'fourier': {
      const f = xNorm * Math.PI * 4 - t;
      return (
        (Math.sin(f) +
          Math.sin(3 * f) / 3 +
          Math.sin(5 * f) / 5 +
          Math.sin(7 * f) / 7) *
        0.72
      );
    }
    case 'ecg': {
      const cycle = (((xNorm * 3 - t * 0.28) % 1) + 1) % 1;
      const p = 0.14 * Math.exp(-Math.pow((cycle - 0.18) / 0.035, 2));
      const q = -0.18 * Math.exp(-Math.pow((cycle - 0.36) / 0.014, 2));
      const r = 0.95 * Math.exp(-Math.pow((cycle - 0.4) / 0.016, 2));
      const s = -0.28 * Math.exp(-Math.pow((cycle - 0.44) / 0.015, 2));
      const tWave = 0.26 * Math.exp(-Math.pow((cycle - 0.65) / 0.065, 2));
      return p + q + r + s + tWave;
    }
    case 'spectrum': {
      const env = Math.sin(xNorm * Math.PI);
      return (
        env *
        (0.55 * Math.sin(xNorm * 28 - t * 2.1) +
          0.35 * Math.cos(xNorm * 14 + t * 1.4))
      );
    }
    case 'carrier':
    default: {
      const mod = 0.55 + 0.45 * Math.sin(xNorm * Math.PI * 3 - t * 0.7);
      return mod * Math.sin(xNorm * Math.PI * 16 - t * 1.8);
    }
  }
};

/**
 * Hero Signal Waveform visualizer with interactive presets and accessible Pause/Play toggle.
 */
export default function SignalWaveform({ onMotionChange }) {
  const canvasRef = useRef(null);
  const phaseRef = useRef(0);
  const [waveMode, setWaveMode] = useState('carrier');
  const [isPlaying, setIsPlaying] = useState(
    () => !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  useEffect(() => {
    onMotionChange?.(isPlaying);
  }, [isPlaying, onMotionChange]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let rafId = null;

    const drawSignal = () => {
      const w = canvas.width;
      const h = canvas.height;
      const midY = h * 0.52;
      const phase = phaseRef.current;

      ctx.clearRect(0, 0, w, h);

      ctx.strokeStyle = 'rgba(96, 61, 65, 0.35)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, midY);
      ctx.lineTo(w, midY);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(101, 22, 43, 0.7)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let x = 0; x <= w; x += 4) {
        const y = midY - sampleWaveform(x / w, phase - 0.45, waveMode) * (h * 0.34);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      ctx.strokeStyle = waveMode === 'ecg' ? '#B88A3B' : '#B3928D';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let x = 0; x <= w; x += 3) {
        const y = midY - sampleWaveform(x / w, phase, waveMode) * (h * 0.36);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    };

    const tick = () => {
      phaseRef.current += 0.045;
      drawSignal();
      rafId = window.requestAnimationFrame(tick);
    };

    drawSignal();
    if (isPlaying) {
      rafId = window.requestAnimationFrame(tick);
    }

    return () => {
      if (rafId !== null) window.cancelAnimationFrame(rafId);
    };
  }, [waveMode, isPlaying]);

  return (
    <div className="waveform-strip" aria-label="Live Signal Waveform Visualizer">
      <div className="waveform-toolbar">
        <div className="waveform-modes" role="group" aria-label="Signal mode presets">
          {WAVE_MODES.map((mode) => (
            <button
              key={mode.id}
              type="button"
              className={`chip ${waveMode === mode.id ? 'is-active' : ''}`}
              onClick={() => setWaveMode(mode.id)}
            >
              {mode.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          className="btn btn--subtle"
          id="waveform-toggle-btn"
          onClick={() => setIsPlaying((prev) => !prev)}
        >
          {isPlaying ? 'Pause Waveform' : 'Play Waveform'}
        </button>
      </div>
      <canvas
        ref={canvasRef}
        id="signal-canvas"
        width={1120}
        height={120}
        aria-label="Animated Signal Processing waveform"
      />
    </div>
  );
}
