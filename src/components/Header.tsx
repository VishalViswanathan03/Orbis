import React, { useRef, useState } from 'react';
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
  Sun,
  Moon,
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
    themeMode,
    toggleThemeMode,
    setIsEqualizerOpen,
    setIsVideoEffectsOpen,
    setIsStreamModalOpen,
    importLocalFiles,
  } = usePlayer();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      importLocalFiles(e.target.files);
    }
  };

  const isDark = themeMode === 'dark';

  return (
    <header className={`relative h-15 px-5 flex items-center justify-between border-b transition-colors duration-200 select-none z-40 ${
      isDark
        ? 'bg-[#0E1118]/90 border-white/5 text-slate-100 backdrop-blur-xl'
        : 'bg-white/90 border-slate-200 text-slate-800 backdrop-blur-xl'
    }`}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        multiple
        accept="video/*,audio/*"
        className="hidden"
      />

      {/* Left: Brand Identity (Clean Minimalist Wordmark) */}
      <div className="flex items-center space-x-3">
        <div
          onClick={() => setCurrentView('player')}
          className="flex items-center cursor-pointer group"
        >
          <span className={`font-black text-2xl tracking-tighter lowercase flex items-center transition-colors ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            <span>orbis</span>
            <span
              className="w-2 h-2 rounded-full ml-1.5 inline-block shadow-sm transition-transform group-hover:scale-125"
              style={{ backgroundColor: accentColor }}
            />
          </span>
        </div>
      </div>

      {/* Center: Absolute Pixel-Perfect Screen Centering for View Switcher */}
      <div className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center p-1 rounded-full border transition-colors shadow-sm ${
        isDark ? 'bg-white/5 border-white/10' : 'bg-slate-100 border-slate-200'
      }`}>
        <button
          onClick={() => setCurrentView('player')}
          className={`flex items-center space-x-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
            currentView === 'player'
              ? 'text-white shadow-sm'
              : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
          }`}
          style={currentView === 'player' ? { backgroundColor: accentColor } : {}}
        >
          <PlaySquare size={13} />
          <span>Player</span>
        </button>

        <button
          onClick={() => setCurrentView('library')}
          className={`flex items-center space-x-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
            currentView === 'library'
              ? 'text-white shadow-sm'
              : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
          }`}
          style={currentView === 'library' ? { backgroundColor: accentColor } : {}}
        >
          <Library size={13} />
          <span>Library</span>
        </button>
      </div>

      {/* Right: Modern Actions */}
      <div className="flex items-center space-x-1.5">
        {/* Open Files */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-colors ${
            isDark
              ? 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300 hover:text-white'
              : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700 hover:text-black'
          }`}
          title="Open Local Files"
        >
          <FolderOpen size={14} style={{ color: accentColor }} />
          <span className="hidden sm:inline">Open</span>
        </button>

        {/* Network Stream */}
        <button
          onClick={() => setIsStreamModalOpen(true)}
          className={`p-2 rounded-full border transition-colors ${
            isDark
              ? 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300 hover:text-white'
              : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700 hover:text-black'
          }`}
          title="Open Stream URL"
        >
          <Globe size={15} />
        </button>

        {/* Audio EQ */}
        <button
          onClick={() => setIsEqualizerOpen(true)}
          className={`p-2 rounded-full border transition-colors ${
            isDark
              ? 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300 hover:text-white'
              : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700 hover:text-black'
          }`}
          title="Audio Equalizer"
        >
          <Sliders size={15} />
        </button>

        {/* Video Effects */}
        <button
          onClick={() => setIsVideoEffectsOpen(true)}
          className={`p-2 rounded-full border transition-colors ${
            isDark
              ? 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300 hover:text-white'
              : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700 hover:text-black'
          }`}
          title="Video Adjustments"
        >
          <Sparkles size={15} />
        </button>

        {/* Dark / Light Mode Toggle */}
        <button
          onClick={toggleThemeMode}
          className={`p-2 rounded-full border transition-all ${
            isDark
              ? 'bg-white/5 hover:bg-white/10 border-white/10 text-amber-400'
              : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700 hover:text-slate-900'
          }`}
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDark ? <Sun size={15} /> : <Moon size={15} />}
        </button>

        {/* Accent Color Palette Popover */}
        <div className="relative">
          <button
            onClick={() => setShowColorPicker(!showColorPicker)}
            className={`p-2 rounded-full border transition-colors ${
              isDark
                ? 'bg-white/5 hover:bg-white/10 border-white/10'
                : 'bg-slate-100 hover:bg-slate-200 border-slate-200'
            }`}
            title="Theme Color"
          >
            <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: accentColor }} />
          </button>

          {showColorPicker && (
            <div className={`absolute right-0 mt-2 p-2.5 rounded-2xl border shadow-xl z-50 flex items-center space-x-2 animate-scale-in ${
              isDark ? 'bg-surface-high border-white/10' : 'bg-white border-slate-200'
            }`}>
              {ACCENT_COLORS.map(c => (
                <button
                  key={c.color}
                  onClick={() => {
                    setAccentColor(c.color);
                    setShowColorPicker(false);
                  }}
                  className="w-6 h-6 rounded-full transition-transform hover:scale-125 border-2"
                  style={{
                    backgroundColor: c.color,
                    borderColor: accentColor === c.color ? (isDark ? '#FFF' : '#000') : 'transparent',
                  }}
                  title={c.name}
                />
              ))}
            </div>
          )}
        </div>

        <div className={`h-4 w-px mx-1 ${isDark ? 'bg-white/10' : 'bg-slate-200'}`} />

        {/* Queue / Play Next Toggle Pill */}
        <button
          onClick={() => setIsQueueOpen(prev => !prev)}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full border transition-all ${
            isQueueOpen
              ? 'text-white border-transparent'
              : isDark
                ? 'bg-white/5 text-slate-300 hover:text-white border-white/10'
                : 'bg-slate-100 text-slate-700 hover:text-black border-slate-200'
          }`}
          style={isQueueOpen ? { backgroundColor: accentColor } : {}}
          title="Play Next Queue"
        >
          <ListMusic size={14} />
          <span className="text-xs font-semibold">Queue</span>
          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-black/20 text-white min-w-4 text-center">
            {queue.length}
          </span>
        </button>
      </div>
    </header>
  );
};
