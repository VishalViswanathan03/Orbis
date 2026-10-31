import React, { useState, useEffect, useRef } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { FloatingControls } from './FloatingControls';
import { Play, Pause, Music, AlertCircle, RefreshCw, FolderOpen, Globe } from 'lucide-react';

export const Player: React.FC = () => {
  const {
    currentMedia,
    isPlaying,
    setIsPlaying,
    currentTime,
    setCurrentTime,
    duration,
    setDuration,
    volume,
    isMuted,
    playbackRate,
    aspectRatio,
    togglePlay,
    seek,
    setVolumeLevel,
    toggleMute,
    nextTrack,
    prevTrack,
    videoFilters,
    subtitleConfig,
    accentColor,
    themeMode,
    setIsStreamModalOpen,
    mediaRef,
  } = usePlayer();

  const containerRef = useRef<HTMLDivElement>(null);
  const visualizerCanvasRef = useRef<HTMLCanvasElement>(null);

  const [controlsVisible, setControlsVisible] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPiP, setIsPiP] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const hideTimeoutRef = useRef<any>(null);

  const isDark = themeMode === 'dark';

  // Auto-hide floating controls on inactivity
  const showControlsTemporarily = () => {
    setControlsVisible(true);
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    if (isPlaying) {
      hideTimeoutRef.current = setTimeout(() => {
        setControlsVisible(false);
      }, 3500);
    }
  };

  useEffect(() => {
    if (!isPlaying) {
      setControlsVisible(true);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    } else {
      showControlsTemporarily();
    }
    return () => {
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, [isPlaying]);

  // Video element playback synchronization
  useEffect(() => {
    const video = mediaRef.current;
    if (!video) return;

    setHasError(false);
    if (isPlaying) {
      video.play().catch(err => {
        // Handled silently if autoplay restricted before user interaction
        console.debug("Playback awaiting user gesture:", err);
      });
    } else {
      video.pause();
    }
  }, [isPlaying, currentMedia]);

  useEffect(() => {
    const video = mediaRef.current;
    if (!video) return;
    video.volume = isMuted ? 0 : volume;
    video.muted = isMuted;
  }, [volume, isMuted]);

  useEffect(() => {
    const video = mediaRef.current;
    if (!video) return;
    video.playbackRate = playbackRate;
  }, [playbackRate]);

  // Fullscreen listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Standard Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      showControlsTemporarily();

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowRight':
          e.preventDefault();
          seek(currentTime + 5);
          break;
        case 'ArrowLeft':
          e.preventDefault();
          seek(currentTime - 5);
          break;
        case 'KeyL':
          seek(currentTime + 10);
          break;
        case 'KeyJ':
          seek(currentTime - 10);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setVolumeLevel(volume + 0.05);
          break;
        case 'ArrowDown':
          e.preventDefault();
          setVolumeLevel(volume - 0.05);
          break;
        case 'KeyM':
          toggleMute();
          break;
        case 'KeyF':
          toggleFullscreen();
          break;
        case 'KeyN':
          nextTrack();
          break;
        case 'KeyP':
          prevTrack();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, seek, currentTime, volume, setVolumeLevel, toggleMute, nextTrack, prevTrack]);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => {
        console.error("Fullscreen error:", err);
      });
    } else {
      document.exitFullscreen().catch(err => {
        console.error("Exit fullscreen error:", err);
      });
    }
  };

  const togglePiP = async () => {
    const video = mediaRef.current;
    if (!video) return;

    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
        setIsPiP(false);
      } else if (document.pictureInPictureEnabled) {
        await video.requestPictureInPicture();
        setIsPiP(true);
      }
    } catch (err) {
      console.warn("PiP error:", err);
    }
  };

  // Video CSS Filters styling
  const filterStyle = {
    filter: `brightness(${videoFilters.brightness}%) contrast(${videoFilters.contrast}%) saturate(${videoFilters.saturation}%) hue-rotate(${videoFilters.hueRotate}deg) grayscale(${videoFilters.grayscale}%) invert(${videoFilters.invert}%) sepia(${videoFilters.sepia}%)`,
  };

  // Aspect ratio styling
  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case '16:9': return 'aspect-video object-contain';
      case '4:3': return 'aspect-[4/3] object-contain';
      case '21:9': return 'aspect-[21/9] object-contain';
      case 'fill': return 'w-full h-full object-fill';
      case 'fit': default: return 'w-full h-full object-contain';
    }
  };

  // Animated Audio Visualizer simulation
  useEffect(() => {
    if (currentMedia?.type !== 'audio' || !visualizerCanvasRef.current) return;
    const canvas = visualizerCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const bars = 40;
      const barWidth = canvas.width / bars;

      for (let i = 0; i < bars; i++) {
        const heightMultiplier = isPlaying ? Math.sin(phase + i * 0.35) * 0.45 + 0.55 : 0.06;
        const barHeight = heightMultiplier * (canvas.height * 0.8);
        const x = i * barWidth;
        const y = canvas.height - barHeight;

        const grad = ctx.createLinearGradient(0, y, 0, canvas.height);
        grad.addColorStop(0, accentColor);
        grad.addColorStop(1, `${accentColor}11`);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.roundRect(x + 3, y, barWidth - 6, barHeight, [3, 3, 0, 0]);
        ctx.fill();
      }

      phase += 0.08;
      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [currentMedia, isPlaying, accentColor]);

  const handleRetry = () => {
    setHasError(false);
    if (mediaRef.current) {
      mediaRef.current.load();
      mediaRef.current.play().catch(() => {});
    }
  };

  const handleScreenClick = (e: React.MouseEvent) => {
    // Only toggle if clicked directly on the video viewport or container, not on controls
    if ((e.target as HTMLElement).closest('.controls-container')) return;
    setControlsVisible(prev => !prev);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={() => {
        if (!controlsVisible) {
          // If controls are hidden, keep them hidden on minor mouse movement unless clicked or near bottom
        }
      }}
      onClick={handleScreenClick}
      className={`relative flex-1 flex items-center justify-center overflow-hidden select-none transition-colors cursor-pointer ${
        isDark ? 'bg-black' : 'bg-slate-950'
      }`}
    >
      {/* Primary Video Element */}
      {currentMedia && (
        <video
          ref={mediaRef}
          src={currentMedia.url}
          style={filterStyle}
          className={`${getAspectRatioClass()} max-h-full transition-all duration-200 ${
            currentMedia.type === 'audio' ? 'opacity-0 absolute pointer-events-none' : 'block'
          }`}
          onDoubleClick={toggleFullscreen}
          onTimeUpdate={e => setCurrentTime(e.currentTarget.currentTime)}
          onLoadedMetadata={e => {
            if (e.currentTarget.duration && !isNaN(e.currentTarget.duration)) {
              setDuration(e.currentTarget.duration);
            }
            setHasError(false);
          }}
          onEnded={nextTrack}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onError={() => {
            if (currentMedia?.url) {
              setHasError(true);
              setErrorMessage("Stream format unreachable or offline.");
            }
          }}
          onLoadedData={() => setHasError(false)}
          playsInline
        />
      )}

      {/* Audio Visualizer Viewport (When playing music) */}
      {currentMedia?.type === 'audio' && (
        <div
          className={`w-full h-full flex flex-col items-center justify-center p-8 cursor-pointer transition-colors ${
            isDark ? 'bg-gradient-to-b from-[#10141D] to-black' : 'bg-gradient-to-b from-slate-100 to-white'
          }`}
          onClick={togglePlay}
        >
          {/* Curved Artwork */}
          <div className="relative w-56 h-56 md:w-64 md:h-64 rounded-3xl overflow-hidden shadow-2xl border border-white/10 mb-6 group">
            <img
              src={currentMedia.thumbnail}
              alt={currentMedia.title}
              className={`w-full h-full object-cover transition-transform duration-700 ${
                isPlaying ? 'scale-105' : 'scale-100'
              }`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-orbis-400">Audio Track</span>
              <h2 className="text-base font-bold text-white truncate">{currentMedia.title}</h2>
              <p className="text-xs text-slate-300 truncate">{currentMedia.artist}</p>
            </div>
          </div>

          {/* Sound wave visualizer */}
          <div className="w-full max-w-md h-16">
            <canvas ref={visualizerCanvasRef} width={500} height={80} className="w-full h-full" />
          </div>
        </div>
      )}

      {/* Subtitles Overlay */}
      {subtitleConfig.enabled && currentMedia?.type === 'video' && isPlaying && (
        <div className="absolute bottom-24 left-0 right-0 z-20 flex justify-center pointer-events-none px-6 text-center">
          <span
            className="px-3.5 py-1 rounded-xl font-semibold backdrop-blur-sm shadow-lg inline-block"
            style={{
              fontSize: `${subtitleConfig.fontSize}px`,
              color: subtitleConfig.color,
              backgroundColor: subtitleConfig.backgroundColor,
            }}
          >
            {currentMedia.title}
          </span>
        </div>
      )}

      {/* Empty State (When no media is loaded) */}
      {!currentMedia && (
        <div className="flex flex-col items-center justify-center p-8 text-center max-w-md animate-fade-in select-none">
          <div className="flex items-center space-x-1 mb-3">
            <span className={`font-black text-4xl tracking-tighter lowercase flex items-center ${
              isDark ? 'text-white' : 'text-slate-800'
            }`}>
              <span>orbis</span>
              <span
                className="w-2.5 h-2.5 rounded-full ml-1.5 inline-block shadow-md animate-pulse-subtle"
                style={{ backgroundColor: accentColor }}
              />
            </span>
          </div>
          <p className="text-xs text-slate-400 mb-6 max-w-xs leading-relaxed">
            Drop any video or audio file anywhere on the screen, or open media from your computer.
          </p>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
                fileInput?.click();
              }}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-full text-xs font-bold text-white shadow-md hover:scale-105 active:scale-95 transition-all"
              style={{ backgroundColor: accentColor }}
            >
              <FolderOpen size={14} />
              <span>Open File</span>
            </button>
            <button
              onClick={() => setIsStreamModalOpen(true)}
              className={`flex items-center space-x-2 px-5 py-2.5 rounded-full border text-xs font-semibold transition-all ${
                isDark
                  ? 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-200 hover:text-white'
                  : 'bg-slate-200/80 hover:bg-slate-300 border-slate-300 text-slate-700 hover:text-black'
              }`}
            >
              <Globe size={14} />
              <span>Stream URL</span>
            </button>
          </div>
        </div>
      )}

      {/* Floating Bottom HUD Controls (Only if media is loaded) */}
      {currentMedia && (
        <div
          onClick={e => e.stopPropagation()}
          className={`controls-container absolute bottom-5 left-0 right-0 z-30 transition-all duration-300 ease-out pointer-events-auto ${
            controlsVisible
              ? 'opacity-100 translate-y-0 scale-100'
              : 'opacity-0 translate-y-16 scale-95 pointer-events-none'
          }`}
        >
          <FloatingControls
            onToggleFullscreen={toggleFullscreen}
            isFullscreen={isFullscreen}
            onTogglePiP={togglePiP}
            isPiP={isPiP}
            onMinimize={() => setControlsVisible(false)}
          />
        </div>
      )}

      {/* Gentle Error Notification Toast */}
      {hasError && (
        <div className="absolute top-6 z-30 px-4 py-2.5 rounded-2xl bg-slate-900/90 border border-slate-700 text-white flex items-center space-x-3 shadow-xl backdrop-blur-md animate-fade-in">
          <AlertCircle size={16} className="text-amber-400 shrink-0" />
          <div className="text-xs">
            <p className="font-semibold">{errorMessage}</p>
          </div>
          <button
            onClick={handleRetry}
            className="ml-2 px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-[11px] font-medium flex items-center space-x-1 transition-colors"
          >
            <RefreshCw size={11} />
            <span>Retry</span>
          </button>
        </div>
      )}
    </div>
  );
};
