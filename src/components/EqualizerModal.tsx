import React from 'react';
import { usePlayer } from '../context/PlayerContext';
import { EQUALIZER_PRESETS } from '../constants/sampleMedia';
import { Sliders, X, RotateCcw } from 'lucide-react';

const FREQUENCIES = ['32Hz', '64Hz', '125Hz', '250Hz', '500Hz', '1kHz', '2kHz', '4kHz', '8kHz', '16kHz'];

export const EqualizerModal: React.FC = () => {
  const {
    isEqualizerOpen,
    setIsEqualizerOpen,
    equalizerBands,
    setEqualizerBands,
    selectedPreset,
    setPreset,
    accentColor,
    themeMode,
  } = usePlayer();

  const isDark = themeMode === 'dark';

  if (!isEqualizerOpen) return null;

  const handleBandChange = (index: number, value: number) => {
    const updated = [...equalizerBands];
    updated[index] = value;
    setEqualizerBands(updated);
  };

  const handleReset = () => {
    setPreset('Flat');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 select-none animate-fade-in">
      <div className={`w-full max-w-2xl border rounded-3xl p-6 md:p-7 shadow-2xl relative transition-colors ${
        isDark ? 'bg-[#121620] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between pb-4 border-b ${
          isDark ? 'border-white/10' : 'border-slate-200'
        }`}>
          <div className="flex items-center space-x-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white"
              style={{ backgroundColor: accentColor }}
            >
              <Sliders size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold">Audio Equalizer & Presets</h3>
              <p className="text-xs text-slate-400">10-Band Parametric EQ</p>
            </div>
          </div>

          <button
            onClick={() => setIsEqualizerOpen(false)}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Presets Chips */}
        <div className="my-6">
          <label className="text-xs font-semibold text-slate-300 mb-2.5 block">Sound Presets</label>
          <div className="flex flex-wrap gap-2">
            {EQUALIZER_PRESETS.map(preset => (
              <button
                key={preset.name}
                onClick={() => setPreset(preset.name)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  selectedPreset === preset.name
                    ? 'text-white shadow-md'
                    : 'bg-surface-mid text-slate-400 hover:text-white hover:bg-surface-high border border-white/5'
                }`}
                style={selectedPreset === preset.name ? { backgroundColor: accentColor } : {}}
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        {/* 10 Band Vertical Sliders Container */}
        <div className="bg-surface-lowest/70 border border-white/5 rounded-3xl p-6 mb-6">
          <div className="grid grid-cols-10 gap-2 h-48 items-center justify-items-center">
            {equalizerBands.map((gain, index) => (
              <div key={index} className="flex flex-col items-center h-full justify-between">
                <span className="text-[10px] font-mono text-slate-400 font-bold">
                  {gain > 0 ? `+${gain}` : gain}dB
                </span>

                {/* Vertical Range Slider */}
                <input
                  type="range"
                  min="-12"
                  max="12"
                  step="1"
                  value={gain}
                  onChange={e => handleBandChange(index, parseInt(e.target.value))}
                  className="h-28 w-1.5 appearance-none bg-white/20 rounded-full cursor-pointer slider-vertical"
                  style={{ accentColor: accentColor }}
                />

                <span className="text-[10px] font-mono text-slate-400">{FREQUENCIES[index]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={handleReset}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
          >
            <RotateCcw size={14} />
            <span>Reset to Flat</span>
          </button>

          <button
            onClick={() => setIsEqualizerOpen(false)}
            className="px-6 py-2 rounded-full text-xs font-bold text-white shadow-lg hover:scale-105 active:scale-95 transition-all"
            style={{ backgroundColor: accentColor }}
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
};
