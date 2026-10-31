import React from 'react';
import { usePlayer } from '../context/PlayerContext';
import { Sparkles, X, RotateCcw, Sun, Contrast, Droplets, Eye } from 'lucide-react';

export const VideoEffectsModal: React.FC = () => {
  const {
    isVideoEffectsOpen,
    setIsVideoEffectsOpen,
    videoFilters,
    setVideoFilters,
    resetVideoFilters,
    accentColor,
  } = usePlayer();

  if (!isVideoEffectsOpen) return null;

  const setPreset = (preset: 'vibrant' | 'cinema' | 'noir' | 'warm') => {
    switch (preset) {
      case 'vibrant':
        setVideoFilters({
          brightness: 105,
          contrast: 115,
          saturation: 135,
          hueRotate: 0,
          grayscale: 0,
          invert: 0,
          sepia: 0,
        });
        break;
      case 'cinema':
        setVideoFilters({
          brightness: 95,
          contrast: 120,
          saturation: 90,
          hueRotate: 350,
          grayscale: 0,
          invert: 0,
          sepia: 15,
        });
        break;
      case 'noir':
        setVideoFilters({
          brightness: 110,
          contrast: 140,
          saturation: 0,
          hueRotate: 0,
          grayscale: 100,
          invert: 0,
          sepia: 0,
        });
        break;
      case 'warm':
        setVideoFilters({
          brightness: 100,
          contrast: 105,
          saturation: 110,
          hueRotate: 0,
          grayscale: 0,
          invert: 0,
          sepia: 30,
        });
        break;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 select-none animate-fade-in">
      <div className="w-full max-w-xl bg-surface-dim/95 border border-white/10 rounded-4xl p-6 md:p-8 shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white"
              style={{ backgroundColor: accentColor }}
            >
              <Sparkles size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Video Adjustments & Filters</h3>
              <p className="text-xs text-slate-400">Real-time GPU accelerated video post-processing</p>
            </div>
          </div>

          <button
            onClick={() => setIsVideoEffectsOpen(false)}
            className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Quick Style Presets */}
        <div className="my-5">
          <label className="text-xs font-semibold text-slate-300 mb-2 block">Quick Visual Styles</label>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'vibrant', label: 'Vibrant Colors' },
              { id: 'cinema', label: 'Cinematic Movie' },
              { id: 'warm', label: 'Sunset Warmth' },
              { id: 'noir', label: 'Noir Black & White' },
            ].map(p => (
              <button
                key={p.id}
                onClick={() => setPreset(p.id as any)}
                className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-surface-mid text-slate-300 hover:text-white hover:bg-surface-high border border-white/5 transition-all"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sliders Grid */}
        <div className="space-y-4 bg-surface-lowest/70 border border-white/5 rounded-3xl p-5 mb-6">
          {/* Brightness */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-300 flex items-center space-x-2">
              <Sun size={15} className="text-amber-400" />
              <span>Brightness</span>
            </span>
            <div className="flex items-center space-x-3 w-64">
              <input
                type="range"
                min="50"
                max="150"
                value={videoFilters.brightness}
                onChange={e => setVideoFilters(prev => ({ ...prev, brightness: parseInt(e.target.value) }))}
                className="w-full h-1.5 bg-white/20 rounded-full appearance-none cursor-pointer"
                style={{ accentColor: accentColor }}
              />
              <span className="font-mono text-xs w-10 text-right text-slate-400">{videoFilters.brightness}%</span>
            </div>
          </div>

          {/* Contrast */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-300 flex items-center space-x-2">
              <Contrast size={15} className="text-sky-400" />
              <span>Contrast</span>
            </span>
            <div className="flex items-center space-x-3 w-64">
              <input
                type="range"
                min="50"
                max="150"
                value={videoFilters.contrast}
                onChange={e => setVideoFilters(prev => ({ ...prev, contrast: parseInt(e.target.value) }))}
                className="w-full h-1.5 bg-white/20 rounded-full appearance-none cursor-pointer"
                style={{ accentColor: accentColor }}
              />
              <span className="font-mono text-xs w-10 text-right text-slate-400">{videoFilters.contrast}%</span>
            </div>
          </div>

          {/* Saturation */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-300 flex items-center space-x-2">
              <Droplets size={15} className="text-rose-400" />
              <span>Saturation</span>
            </span>
            <div className="flex items-center space-x-3 w-64">
              <input
                type="range"
                min="0"
                max="200"
                value={videoFilters.saturation}
                onChange={e => setVideoFilters(prev => ({ ...prev, saturation: parseInt(e.target.value) }))}
                className="w-full h-1.5 bg-white/20 rounded-full appearance-none cursor-pointer"
                style={{ accentColor: accentColor }}
              />
              <span className="font-mono text-xs w-10 text-right text-slate-400">{videoFilters.saturation}%</span>
            </div>
          </div>

          {/* Hue Rotation */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-300 flex items-center space-x-2">
              <Eye size={15} className="text-purple-400" />
              <span>Hue Tint</span>
            </span>
            <div className="flex items-center space-x-3 w-64">
              <input
                type="range"
                min="0"
                max="360"
                value={videoFilters.hueRotate}
                onChange={e => setVideoFilters(prev => ({ ...prev, hueRotate: parseInt(e.target.value) }))}
                className="w-full h-1.5 bg-white/20 rounded-full appearance-none cursor-pointer"
                style={{ accentColor: accentColor }}
              />
              <span className="font-mono text-xs w-10 text-right text-slate-400">{videoFilters.hueRotate}°</span>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-between">
          <button
            onClick={resetVideoFilters}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
          >
            <RotateCcw size={14} />
            <span>Reset Defaults</span>
          </button>

          <button
            onClick={() => setIsVideoEffectsOpen(false)}
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
