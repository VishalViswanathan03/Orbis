import React, { useState, useRef, useEffect } from 'react';
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
  Layers
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
  isPiP,
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
    <div className="w-full max-w-5xl mx-auto px-4 select-none">
      {/* Floating Pill Container */}
      <div className="relative backdrop-blur-2xl bg-surface-dim/90 border border-white/10 rounded-4xl p-4 shadow-glow-pill transition-all duration-300">
        
        {/* Seekbar / Material 3 Thick Progress Track */}
        <div className="mb-3 px-2">
          <div
            ref={timelineRef}
            onClick={handleTimelineClick}
            onMouseEnter={() => setIsHoveringTimeline(true)}
            onMouseLeave={() => {
              setIsHoveringTimeline(false);
              setHoverPosition(null);
            }}
            onMouseMove={handleTimelineMouseMove}
            className="group relative h-3 bg-white/10 hover:bg-white/15 rounded-full cursor-pointer transition-all duration-200 flex items-center"
          >
            {/* Played Track */}
            <div
              className="h-full rounded-full relative transition-all duration-75"
              style={{
                width: `${currentPercent}%`,
                backgroundColor: accentColor,
              }}
            >
              {/* Material You Distinct Playhead Pill */}
              <div
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-4 h-4 rounded-full bg-white shadow-md border-2 scale-90 group-hover:scale-125 transition-transform"
                style={{ borderColor: accentColor }}
              />
            </div>

            {/* Hover preview tooltip */}
            {isHoveringTimeline && hoverPosition !== null && (
              <div
                className="absolute -top-9 px-2.5 py-1 rounded-full bg-surface-highest border border-white/20 text-white font-mono text-[11px] shadow-lg pointer-events-none -translate-x-1/2"
                style={{ left: `${hoverPosition}%` }}
              >
                {formatTime(hoverTime)}
              </div>
            )}
          </div>

          {/* Time stamps */}
          <div className="flex justify-between items-center text-slate-400 font-mono text-xs mt-1.5 px-0.5">
            <span>{formatTime(currentTime)}</span>
            <div className="flex items-center space-x-2">
              {currentMedia?.resolution && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-white/10 text-slate-200">
                  {currentMedia.resolution}
                </span>
              )}
              {currentMedia?.codec && (
                <span className="text-[10px] font-medium text-slate-400 hidden sm:inline">
                  {currentMedia.codec}
                </span>
              )}
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        </div>

        {/* Action Controls Row */}
        <div className="flex items-center justify-between">
          
          {/* Left Group: Secondary Controls (Repeat, Shuffle, Volume) */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            {/* Repeat */}
            <button
              onClick={cycleRepeat}
              className={`p-2.5 rounded-full transition-colors ${
                repeatMode !== 'off' ? 'text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
              style={repeatMode !== 'off' ? { color: accentColor } : {}}
              title={`Repeat: ${repeatMode}`}
            >
              {repeatMode === 'one' ? <Repeat1 size={18} /> : <Repeat size={18} />}
            </button>

            {/* Shuffle */}
            <button
              onClick={() => setIsShuffle(prev => !prev)}
              className={`p-2.5 rounded-full transition-colors ${
                isShuffle ? 'text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
              style={isShuffle ? { color: accentColor } : {}}
              title="Shuffle"
            >
              <Shuffle size={18} />
            </button>

            {/* Volume & Cone Indicator */}
            <div
              className="relative flex items-center"
              onMouseEnter={() => setShowVolumeSlider(true)}
              onMouseLeave={() => setShowVolumeSlider(false)}
            >
              <button
                onClick={toggleMute}
                className="p-2.5 rounded-full text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                title="Mute / Unmute"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX size={18} className="text-red-400" />
                ) : volume < 0.5 ? (
                  <Volume1 size={18} />
                ) : (
                  <Volume2 size={18} />
                )}
              </button>

              {/* Volume Slider Bar (Expands smoothly) */}
              <div
                className={`transition-all duration-300 overflow-hidden flex items-center ${
                  showVolumeSlider ? 'w-24 opacity-100 mr-2' : 'w-0 opacity-0'
                }`}
              >
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={isMuted ? 0 : volume}
                  onChange={e => setVolumeLevel(parseFloat(e.target.value))}
                  className="w-20 h-1.5 bg-white/20 rounded-full appearance-none cursor-pointer accent-orange-500"
                  style={{ accentColor: accentColor }}
                />
              </div>
            </div>
          </div>

          {/* Center Group: Primary Playback Group (Previous, -10s, PLAY/PAUSE, +10s, Next) */}
          <div className="flex items-center space-x-1 sm:space-x-3">
            {/* Prev Track */}
            <button
              onClick={prevTrack}
              className="p-2.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              title="Previous Track"
            >
              <SkipBack size={19} />
            </button>

            {/* -10s */}
            <button
              onClick={() => seek(currentTime - 10)}
              className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              title="Seek -10s"
            >
              <RotateCcw size={17} />
            </button>

            {/* Main Play / Pause FAB */}
            <button
              onClick={togglePlay}
              className="w-13 h-13 rounded-full flex items-center justify-center text-white shadow-glow-orbis hover:scale-108 active:scale-95 transition-all duration-200"
              style={{ backgroundColor: accentColor }}
              title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
            >
              {isPlaying ? (
                <Pause size={24} className="fill-white" />
              ) : (
                <Play size={24} className="fill-white translate-x-0.5" />
              )}
            </button>

            {/* +10s */}
            <button
              onClick={() => seek(currentTime + 10)}
              className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              title="Seek +10s"
            >
              <RotateCw size={17} />
            </button>

            {/* Next Track */}
            <button
              onClick={nextTrack}
              className="p-2.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              title="Next Track"
            >
              <SkipForward size={19} />
            </button>
          </div>

          {/* Right Group: Extras (Speed, Aspect Ratio, Subtitles, PiP, Fullscreen) */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            
            {/* Speed Selector */}
            <div className="relative">
              <button
                onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                className="flex items-center space-x-1 px-2.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-xs font-mono font-medium text-slate-300 hover:text-white transition-colors"
                title="Playback Speed"
              >
                <Gauge size={14} />
                <span>{playbackRate}x</span>
              </button>

              {showSpeedMenu && (
                <div className="absolute bottom-10 right-0 p-2 bg-surface-high border border-white/15 rounded-2xl shadow-2xl z-50 flex flex-col space-y-1 min-w-24">
                  {[0.5, 0.75, 1, 1.25, 1.5, 2].map(rate => (
                    <button
                      key={rate}
                      onClick={() => {
                        setPlaybackRate(rate);
                        setShowSpeedMenu(false);
                      }}
                      className={`px-3 py-1.5 text-left text-xs rounded-xl font-mono transition-colors ${
                        playbackRate === rate ? 'bg-white/20 text-white font-bold' : 'text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      {rate}x
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Aspect Ratio */}
            <div className="relative">
              <button
                onClick={() => setShowAspectMenu(!showAspectMenu)}
                className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                title="Aspect Ratio"
              >
                <Ratio size={18} />
              </button>

              {showAspectMenu && (
                <div className="absolute bottom-10 right-0 p-2 bg-surface-high border border-white/15 rounded-2xl shadow-2xl z-50 flex flex-col space-y-1 min-w-28">
                  {(['fit', 'fill', '16:9', '4:3', '21:9'] as AspectRatio[]).map(ratio => (
                    <button
                      key={ratio}
                      onClick={() => {
                        setAspectRatio(ratio);
                        setShowAspectMenu(false);
                      }}
                      className={`px-3 py-1.5 text-left text-xs uppercase rounded-xl font-mono transition-colors ${
                        aspectRatio === ratio ? 'bg-white/20 text-white font-bold' : 'text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      {ratio}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Subtitles Toggle */}
            <button
              onClick={() => setSubtitleConfig(prev => ({ ...prev, enabled: !prev.enabled }))}
              className={`p-2 rounded-full transition-colors ${
                subtitleConfig.enabled ? 'text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
              style={subtitleConfig.enabled ? { color: accentColor } : {}}
              title="Toggle Subtitles"
            >
              <Subtitles size={18} />
            </button>

            {/* Picture-in-Picture */}
            <button
              onClick={onTogglePiP}
              className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
              title="Picture in Picture"
            >
              <PictureInPicture2 size={18} />
            </button>

            {/* Fullscreen */}
            <button
              onClick={onToggleFullscreen}
              className="p-2.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              title={isFullscreen ? 'Exit Fullscreen (F)' : 'Fullscreen (F)'}
            >
              {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
