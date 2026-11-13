import { useEffect, useMemo, useRef, useState } from 'react';

/**
 * Interactive Signal Processing Sandbox comparing noisy input against an IIR low-pass filtered signal.
 */
export default function DspLab() {
  const canvasRef = useRef(null);
  const [freq, setFreq] = useState(4);
  const [amp, setAmp] = useState(75);
  const [noise, setNoise] = useState(35);
  const [cutoff, setCutoff] = useState(72);

  const noiseSamples = useMemo(
    () =>
      Array.from({ length: 380 }, (_, idx) => {
        const s = Math.sin(idx * 12.9898) * 43758.5453;
        return (s - Math.floor(s)) * 2 - 1;
      }),
    []
  );

  const ampNorm = amp / 100;
  const noiseNorm = noise / 100;
  const cutoffNorm = cutoff / 100;
  const snrGain = Math.max(0.8, noiseNorm * 14.5 * (1.15 - cutoffNorm * 0.45) + 2.4);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const lctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    const midY = h / 2;

    lctx.clearRect(0, 0, w, h);

    // Grid
    lctx.strokeStyle = 'rgba(96, 61, 65, 0.25)';
    lctx.lineWidth = 1;
    for (let gx = 0; gx <= w; gx += w / 8) {
      lctx.beginPath();
      lctx.moveTo(gx, 0);
      lctx.lineTo(gx, h);
      lctx.stroke();
    }
    for (let gy = 0; gy <= h; gy += h / 4) {
      lctx.beginPath();
      lctx.moveTo(0, gy);
      lctx.lineTo(w, gy);
      lctx.stroke();
    }

    const count = noiseSamples.length;
    const rawPoints = new Array(count);
    const filteredPoints = new Array(count);
    const alpha = 0.06 + cutoffNorm * 0.45;
    let prevFiltered = 0;

    for (let i = 0; i < count; i++) {
      const xNorm = i / (count - 1);
      const clean = ampNorm * Math.sin(xNorm * Math.PI * 2 * freq);
      const raw = clean + noiseNorm * 0.65 * noiseSamples[i];
      rawPoints[i] = raw;

      prevFiltered = prevFiltered + alpha * (raw - prevFiltered);
      filteredPoints[i] = prevFiltered;
    }

    // Raw noisy signal (#7F122D Muted Crimson)
    lctx.strokeStyle = '#7F122D';
    lctx.lineWidth = 1.6;
    lctx.beginPath();
    for (let i = 0; i < count; i++) {
      const x = (i / (count - 1)) * w;
      const y = midY - rawPoints[i] * (h * 0.36);
      if (i === 0) lctx.moveTo(x, y);
      else lctx.lineTo(x, y);
    }
    lctx.stroke();

    // Filtered DSP output (#B88A3B Antique Gold)
    lctx.strokeStyle = '#B88A3B';
    lctx.lineWidth = 2.6;
    lctx.beginPath();
    for (let i = 0; i < count; i++) {
      const x = (i / (count - 1)) * w;
      const y = midY - filteredPoints[i] * (h * 0.36);
      if (i === 0) lctx.moveTo(x, y);
      else lctx.lineTo(x, y);
    }
    lctx.stroke();
  }, [freq, ampNorm, noiseNorm, cutoffNorm, noiseSamples]);

  return (
    <div
      className="lab-shell reveal-card"
      id="dsp-lab-shell"
      style={{
        '--lab-freq': String(freq),
        '--lab-noise': noiseNorm.toFixed(2),
        '--lab-cutoff': cutoffNorm.toFixed(2),
      }}
    >
      <div className="lab-controls">
        <div className="control-group">
          <div className="control-label-row">
            <label htmlFor="lab-freq">Carrier Frequency</label>
            <output htmlFor="lab-freq">{freq.toFixed(1)} Hz</output>
          </div>
          <input
            type="range"
            id="lab-freq"
            min="1"
            max="12"
            step="0.5"
            value={freq}
            onChange={(e) => setFreq(parseFloat(e.target.value))}
          />
        </div>

        <div className="control-group">
          <div className="control-label-row">
            <label htmlFor="lab-amp">Signal Amplitude</label>
            <output htmlFor="lab-amp">{amp}%</output>
          </div>
          <input
            type="range"
            id="lab-amp"
            min="25"
            max="100"
            step="5"
            value={amp}
            onChange={(e) => setAmp(parseInt(e.target.value, 10))}
          />
        </div>

        <div className="control-group">
          <div className="control-label-row">
            <label htmlFor="lab-noise">Noise Floor</label>
            <output htmlFor="lab-noise">{noise}%</output>
          </div>
          <input
            type="range"
            id="lab-noise"
            min="0"
            max="90"
            step="5"
            value={noise}
            onChange={(e) => setNoise(parseInt(e.target.value, 10))}
          />
        </div>

        <div className="control-group">
          <div className="control-label-row">
            <label htmlFor="lab-cutoff">DSP Filter Cutoff</label>
            <output htmlFor="lab-cutoff">{cutoff}%</output>
          </div>
          <input
            type="range"
            id="lab-cutoff"
            min="15"
            max="100"
            step="1"
            value={cutoff}
            onChange={(e) => setCutoff(parseInt(e.target.value, 10))}
          />
        </div>

        <div className="lab-readout">
          <div className="snr-box">
            <span className="snr-label">Estimated SNR Gain</span>
            <strong className="snr-value">+{snrGain.toFixed(1)} dB</strong>
          </div>
          <div className="legend-items">
            <span className="legend-item">
              <span className="swatch swatch--crimson" aria-hidden="true"></span>
              Raw Noisy Signal
            </span>
            <span className="legend-item">
              <span className="swatch swatch--gold" aria-hidden="true"></span>
              Filtered DSP Output
            </span>
          </div>
        </div>
      </div>

      <div className="lab-canvas-wrap">
        <canvas
          ref={canvasRef}
          id="lab-canvas"
          width={760}
          height={320}
          aria-label="Interactive signal filtering comparison graph"
        />
      </div>
    </div>
  );
}

