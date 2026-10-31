import React, { useState, useRef } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { AspectRatio } from '../types/media';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Volume1,
  Maximize,
  Minimize,
  Repeat,
  Repeat1,
  Shuffle,
  PictureInPicture2,
  Subtitles,
  Gauge,
  Ratio,
} from 'lucide-react';

interface FloatingControlsProps {
  onToggleFullscreen: () => void;
  isFullscreen: boolean;
  onTogglePiP: () => void;
  isPiP: boolean;
}

const formatTime = (seconds: number) => {
  if (isNaN(seconds) || seconds < 0) return '00:00';
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  if (hrs > 0) {
    return `${hrs}:${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }
  return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

export const FloatingControls: React.FC<FloatingControlsProps> = ({
  onToggleFullscreen,
  isFullscreen,
  onTogglePiP,
}) => {
  const {
    currentMedia,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    playbackRate,
    aspectRatio,
    repeatMode,
    isShuffle,
    accentColor,
    themeMode,
    togglePlay,
    seek,
    setVolumeLevel,
    toggleMute,
    setPlaybackRate,
    setAspectRatio,
    setRepeatMode,
    setIsShuffle,
    nextTrack,
    prevTrack,
    subtitleConfig,
    setSubtitleConfig,
  } = usePlayer();

  const [isHoveringTimeline, setIsHoveringTimeline] = useState(false);
  const [hoverPosition, setHoverPosition] = useState<number | null>(null);
  const [hoverTime, setHoverTime] = useState(0);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [showAspectMenu, setShowAspectMenu] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  const timelineRef = useRef<HTMLDivElement>(null);
  const isDark = themeMode === 'dark';

  const handleTimelineMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!timelineRef.current || duration <= 0) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setHoverPosition(pos * 100);
    setHoverTime(pos * duration);
  };

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!timelineRef.current || duration <= 0) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    seek(pos * duration);
  };

  const currentPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const cycleRepeat = () => {
    if (repeatMode === 'off') setRepeatMode('all');
    else if (repeatMode === 'all') setRepeatMode('one');
    else setRepeatMode('off');
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 select-none">
      {/* Sleek Floating Glass Capsule */}
      <div className={`relative backdrop-blur-2xl rounded-3xl p-3 px-5 shadow-2xl border transition-all duration-300 ${
        isDark
          ? 'bg-[#12151D]/85 border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.6)]'
          : 'bg-white/85 border-slate-200 shadow-[0_12px_40px_rgba(0,0,0,0.1)]'
      }`}>
        
        {/* Progress Timeline Track */}
        <div className="mb-2">
          <div
            ref={timelineRef}
            onClick={handleTimelineClick}
            onMouseEnter={() => setIsHoveringTimeline(true)}
            onMouseLeave={() => {
              setIsHoveringTimeline(false);
              setHoverPosition(null);
            }}
            onMouseMove={handleTimelineMouseMove}
            className={`group relative h-2 hover:h-3 rounded-full cursor-pointer transition-all duration-200 flex items-center ${
              isDark ? 'bg-white/10' : 'bg-slate-200'
            }`}
          >
            {/* Played track */}
            <div
              className="h-full rounded-full relative"
              style={{
                width: `${currentPercent}%`,
                backgroundColor: accentColor,
              }}
            >
              <div
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3.5 h-3.5 rounded-full bg-white shadow-md border-2 scale-75 group-hover:scale-110 transition-transform"
                style={{ borderColor: accentColor }}
              />
            </div>

            {/* Hover tooltip */}
            {isHoveringTimeline && hoverPosition !== null && (
              <div
                className="absolute -top-8 px-2 py-0.5 rounded-md bg-black/90 text-white font-mono text-[10px] shadow-lg pointer-events-none -translate-x-1/2"
                style={{ left: `${hoverPosition}%` }}
              >
                {formatTime(hoverTime)}
              </div>
            )}
          </div>

          {/* Time & Badges Bar */}
          <div className="flex justify-between items-center text-[11px] font-mono mt-1 px-1 opacity-70">
            <span>{formatTime(currentTime)}</span>
            <div className="flex items-center space-x-2">
              {currentMedia?.resolution && (
                <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                  isDark ? 'bg-white/10 text-slate-300' : 'bg-slate-200 text-slate-700'
                }`}>
                  {currentMedia.resolution}
                </span>
              )}
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        </div>

        {/* Action Controls Row */}
        <div className="flex items-center justify-between">
          
          {/* Left: Volume & Auxiliary */}
          <div className="flex items-center space-x-1">
            <button
              onClick={cycleRepeat}
              className={`p-2 rounded-full transition-colors ${
                repeatMode !== 'off'
                  ? 'text-orbis-500'
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-black'
              }`}
              style={repeatMode !== 'off' ? { color: accentColor } : {}}
              title={`Repeat: ${repeatMode}`}
            >
              {repeatMode === 'one' ? <Repeat1 size={15} /> : <Repeat size={15} />}
            </button>

            <button
              onClick={() => setIsShuffle(prev => !prev)}
              className={`p-2 rounded-full transition-colors ${
                isShuffle
                  ? 'text-orbis-500'
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-black'
              }`}
              style={isShuffle ? { color: accentColor } : {}}
              title="Shuffle"
            >
              <Shuffle size={15} />
            </button>

            {/* Volume */}
            <div
              className="relative flex items-center"
              onMouseEnter={() => setShowVolumeSlider(true)}
              onMouseLeave={() => setShowVolumeSlider(false)}
            >
              <button
                onClick={toggleMute}
                className={`p-2 rounded-full transition-colors ${
                  isDark ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-black'
                }`}
                title="Mute / Unmute"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX size={16} className="text-red-400" />
                ) : volume < 0.5 ? (
                  <Volume1 size={16} />
                ) : (
                  <Volume2 size={16} />
                )}
              </button>

              <div className={`transition-all duration-200 overflow-hidden flex items-center ${
                showVolumeSlider ? 'w-20 opacity-100 mr-2' : 'w-0 opacity-0'
              }`}>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={isMuted ? 0 : volume}
                  onChange={e => setVolumeLevel(parseFloat(e.target.value))}
                  className="w-18 h-1 rounded-full appearance-none cursor-pointer"
                  style={{ accentColor: accentColor }}
                />
              </div>
            </div>
          </div>

          {/* Center: Playback FAB & Skips */}
          <div className="flex items-center space-x-2">
            <button
              onClick={prevTrack}
              className={`p-2 rounded-full transition-colors ${
                isDark ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-black'
              }`}
              title="Previous"
            >
              <SkipBack size={16} />
            </button>

            <button
              onClick={() => seek(currentTime - 10)}
              className={`p-1.5 rounded-full transition-colors ${
                isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-black'
              }`}
              title="-10s"
            >
              <RotateCcw size={14} />
            </button>

            {/* Main Play / Pause Circle */}
            <button
              onClick={togglePlay}
              className="w-11 h-11 rounded-full flex items-center justify-center text-white shadow-md hover:scale-105 active:scale-95 transition-all"
              style={{ backgroundColor: accentColor }}
              title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
            >
              {isPlaying ? (
                <Pause size={18} className="fill-white" />
              ) : (
                <Play size={18} className="fill-white translate-x-0.5" />
              )}
            </button>

            <button
              onClick={() => seek(currentTime + 10)}
              className={`p-1.5 rounded-full transition-colors ${
                isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-black'
              }`}
              title="+10s"
            >
              <RotateCw size={14} />
            </button>

            <button
              onClick={nextTrack}
              className={`p-2 rounded-full transition-colors ${
                isDark ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-black'
              }`}
              title="Next"
            >
              <SkipForward size={16} />
            </button>
          </div>

          {/* Right: Tools & Fullscreen */}
          <div className="flex items-center space-x-1">
            {/* Speed */}
            <div className="relative">
              <button
                onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-mono font-medium border transition-colors ${
                  isDark
                    ? 'border-white/10 text-slate-300 hover:text-white bg-white/5'
                    : 'border-slate-200 text-slate-700 hover:text-black bg-slate-100'
                }`}
                title="Speed"
              >
                <Gauge size={12} />
                <span>{playbackRate}x</span>
              </button>

              {showSpeedMenu && (
                <div className={`absolute bottom-9 right-0 p-1.5 rounded-xl border shadow-xl z-50 flex flex-col space-y-0.5 min-w-20 ${
                  isDark ? 'bg-surface-high border-white/10' : 'bg-white border-slate-200'
                }`}>
                  {[0.5, 0.75, 1, 1.25, 1.5, 2].map(r => (
                    <button
                      key={r}
                      onClick={() => {
                        setPlaybackRate(r);
                        setShowSpeedMenu(false);
                      }}
                      className={`px-2.5 py-1 text-left text-xs rounded-lg font-mono transition-colors ${
                        playbackRate === r
                          ? 'bg-orbis-500 text-white font-bold'
                          : isDark ? 'text-slate-300 hover:bg-white/10' : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {r}x
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Aspect Ratio */}
            <div className="relative">
              <button
                onClick={() => setShowAspectMenu(!showAspectMenu)}
                className={`p-2 rounded-full transition-colors ${
                  isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-black'
                }`}
                title="Aspect Ratio"
              >
                <Ratio size={15} />
              </button>

              {showAspectMenu && (
                <div className={`absolute bottom-9 right-0 p-1.5 rounded-xl border shadow-xl z-50 flex flex-col space-y-0.5 min-w-24 ${
                  isDark ? 'bg-surface-high border-white/10' : 'bg-white border-slate-200'
                }`}>
                  {(['fit', 'fill', '16:9', '4:3', '21:9'] as AspectRatio[]).map(r => (
                    <button
                      key={r}
                      onClick={() => {
                        setAspectRatio(r);
                        setShowAspectMenu(false);
                      }}
                      className={`px-2.5 py-1 text-left text-xs rounded-lg uppercase font-mono transition-colors ${
                        aspectRatio === r
                          ? 'bg-orbis-500 text-white font-bold'
                          : isDark ? 'text-slate-300 hover:bg-white/10' : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Subtitles */}
            <button
              onClick={() => setSubtitleConfig(prev => ({ ...prev, enabled: !prev.enabled }))}
              className={`p-2 rounded-full transition-colors ${
                subtitleConfig.enabled
                  ? 'text-orbis-500'
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-black'
              }`}
              style={subtitleConfig.enabled ? { color: accentColor } : {}}
              title="Toggle Subtitles"
            >
              <Subtitles size={15} />
            </button>

            {/* PiP */}
            <button
              onClick={onTogglePiP}
              className={`p-2 rounded-full transition-colors ${
                isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-black'
              }`}
              title="Picture-in-Picture"
            >
              <PictureInPicture2 size={15} />
            </button>

            {/* Fullscreen */}
            <button
              onClick={onToggleFullscreen}
              className={`p-2 rounded-full transition-colors ${
                isDark ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-black'
              }`}
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize size={15} /> : <Maximize size={15} />}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
