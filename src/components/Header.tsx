import React, { useRef } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { OrbisLogo } from './OrbisLogo';
import {
  FolderOpen,
  Globe,
  Sliders,
  Sparkles,
  ListMusic,
  PlaySquare,
  Library,
  Palette,
  Minus,
  Square,
  X
} from 'lucide-react';

const ACCENT_COLORS = [
  { name: 'VLC Sunset Orange', color: '#FF7A00' },
  { name: 'Cyberpunk Cyan', color: '#00E5FF' },
  { name: 'Emerald Wave', color: '#10B981' },
  { name: 'Cosmic Purple', color: '#A855F7' },
  { name: 'Neon Rose', color: '#F43F5E' },
];

export const Header: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    isQueueOpen,
    setIsQueueOpen,
    queue,
    accentColor,
    setAccentColor,
    setIsEqualizerOpen,
    setIsVideoEffectsOpen,
    setIsStreamModalOpen,
    importLocalFiles,
  } = usePlayer();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showColorPicker, setShowColorPicker] = React.useState(false);

  const handleOpenFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      importLocalFiles(e.target.files);
    }
  };

  return (
    <header className="h-16 px-5 flex items-center justify-between border-b border-white/5 bg-surface-dim/80 backdrop-blur-xl relative z-40 select-none">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        multiple
        accept="video/*,audio/*"
        className="hidden"
      />

      {/* Left: Branding & Tagline */}
      <div className="flex items-center space-x-3.5">
        <div className="cursor-pointer flex items-center space-x-2.5 group" onClick={() => setCurrentView('player')}>
          <div className="transition-transform group-hover:scale-105 group-hover:rotate-6">
            <OrbisLogo size={36} />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                ORBIS
              </span>
              <span
                className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full text-black shadow-sm"
                style={{ backgroundColor: accentColor }}
              >
                VLC 4 Core
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Material Media Experience</p>
          </div>
        </div>
      </div>

      {/* Center: Material 3 Pill Segmented View Switcher */}
      <div className="flex items-center bg-surface-mid/80 p-1 rounded-full border border-white/10 shadow-inner">
        <button
          onClick={() => setCurrentView('player')}
          className={`flex items-center space-x-2 px-5 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 ${
            currentView === 'player'
              ? 'text-white shadow-lg'
              : 'text-slate-400 hover:text-white'
          }`}
          style={currentView === 'player' ? { backgroundColor: accentColor } : {}}
        >
          <PlaySquare size={14} />
          <span>Player View</span>
        </button>

        <button
          onClick={() => setCurrentView('library')}
          className={`flex items-center space-x-2 px-5 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 ${
            currentView === 'library'
              ? 'text-white shadow-lg'
              : 'text-slate-400 hover:text-white'
          }`}
          style={currentView === 'library' ? { backgroundColor: accentColor } : {}}
        >
          <Library size={14} />
          <span>Library & Media</span>
        </button>
      </div>

      {/* Right: Quick Action Hub & Up Next queue trigger */}
      <div className="flex items-center space-x-2">
        {/* Open Local Files */}
        <button
          onClick={handleOpenFileClick}
          className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-slate-200 hover:text-white transition-colors"
          title="Open Media Files"
        >
          <FolderOpen size={14} className="text-orbis-400" />
          <span className="hidden sm:inline">Open Files</span>
        </button>

        {/* Network Stream */}
        <button
          onClick={() => setIsStreamModalOpen(true)}
          className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-slate-200 hover:text-white transition-colors"
          title="Open Network Stream (URL)"
        >
          <Globe size={14} className="text-sky-400" />
          <span className="hidden sm:inline">Stream URL</span>
        </button>

        {/* Equalizer */}
        <button
          onClick={() => setIsEqualizerOpen(true)}
          className="p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors"
          title="Audio Equalizer & Presets"
        >
          <Sliders size={16} />
        </button>

        {/* Video Effects */}
        <button
          onClick={() => setIsVideoEffectsOpen(true)}
          className="p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors"
          title="Video Adjustments & Filters"
        >
          <Sparkles size={16} />
        </button>

        {/* Accent Color Palette Popover */}
        <div className="relative">
          <button
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors"
            title="Material You Dynamic Theme"
          >
            <Palette size={16} style={{ color: accentColor }} />
          </button>

          {showColorPicker && (
            <div className="absolute right-0 mt-2 p-3 bg-surface-high border border-white/15 rounded-3xl shadow-2xl z-50 flex items-center space-x-2 animate-scale-in">
              {ACCENT_COLORS.map(c => (
                <button
                  key={c.color}
                  onClick={() => {
                    setAccentColor(c.color);
                    setShowColorPicker(false);
                  }}
                  className="w-7 h-7 rounded-full transition-transform hover:scale-125 border-2"
                  style={{
                    backgroundColor: c.color,
                    borderColor: accentColor === c.color ? '#FFFFFF' : 'transparent',
                  }}
                  title={c.name}
                />
              ))}
            </div>
          )}
        </div>

        <div className="h-5 w-px bg-white/10 mx-1" />

        {/* Queue / Play Next Toggle Pill */}
        <button
          onClick={() => setIsQueueOpen(prev => !prev)}
          className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-full border transition-all duration-200 ${
            isQueueOpen
              ? 'text-white border-white/20'
              : 'bg-white/5 text-slate-300 hover:text-white border-white/10'
          }`}
          style={isQueueOpen ? { backgroundColor: `${accentColor}33`, borderColor: accentColor } : {}}
          title="Play Next Queue"
        >
          <ListMusic size={15} style={{ color: isQueueOpen ? accentColor : undefined }} />
          <span className="text-xs font-semibold">Queue</span>
          <span
            className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-white/20 text-white min-w-5 text-center"
          >
            {queue.length}
          </span>
        </button>
      </div>
    </header>
  );
};
