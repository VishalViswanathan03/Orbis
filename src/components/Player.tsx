import React, { useState, useEffect, useRef } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { FloatingControls } from './FloatingControls';
import { Music, Radio, Volume2, Sparkles, AlertCircle } from 'lucide-react';

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

  // Auto-hide floating controls on mouse inactivity
  const showControlsTemporarily = () => {
    setControlsVisible(true);
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    if (isPlaying) {
      hideTimeoutRef.current = setTimeout(() => {
        setControlsVisible(false);
      }, 3000);
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

  // Video element sync
  useEffect(() => {
    const video = mediaRef.current;
    if (!video) return;

    if (isPlaying) {
      video.play().catch(err => {
        console.warn("Autoplay blocked or play failed:", err);
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

  // Keyboard Shortcuts (Standard VLC Keys)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
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
        console.error("Failed to enter fullscreen:", err);
      });
    } else {
      document.exitFullscreen().catch(err => {
        console.error("Failed to exit fullscreen:", err);
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

  // Aspect ratio classes
  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case '16:9': return 'aspect-video object-contain';
      case '4:3': return 'aspect-[4/3] object-contain';
      case '21:9': return 'aspect-[21/9] object-contain';
      case 'fill': return 'w-full h-full object-fill';
      case 'fit': default: return 'w-full h-full object-contain';
    }
  };

  // Animated Audio Visualizer simulation for Audio Tracks
  useEffect(() => {
    if (currentMedia?.type !== 'audio' || !visualizerCanvasRef.current) return;
    const canvas = visualizerCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const bars = 48;
      const barWidth = canvas.width / bars;

      for (let i = 0; i < bars; i++) {
        const heightMultiplier = isPlaying ? Math.sin(phase + i * 0.3) * 0.5 + 0.5 : 0.08;
        const barHeight = heightMultiplier * (canvas.height * 0.75);
        const x = i * barWidth;
        const y = canvas.height - barHeight;

        const grad = ctx.createLinearGradient(0, y, 0, canvas.height);
        grad.addColorStop(0, accentColor);
        grad.addColorStop(1, '#FF550022');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.roundRect(x + 2, y, barWidth - 4, barHeight, [4, 4, 0, 0]);
        ctx.fill();
      }

      phase += 0.08;
      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [currentMedia, isPlaying, accentColor]);

  return (
    <div
      ref={containerRef}
      onMouseMove={showControlsTemporarily}
      onMouseEnter={showControlsTemporarily}
      className="relative flex-1 bg-black flex items-center justify-center overflow-hidden select-none"
    >
      {/* Primary Media Element (HTML5 Video supports both audio and video streams) */}
      {currentMedia && (
        <video
          ref={mediaRef}
          src={currentMedia.url}
          style={filterStyle}
          className={`${getAspectRatioClass()} max-h-full transition-all duration-200 cursor-pointer ${
            currentMedia.type === 'audio' ? 'opacity-0 absolute pointer-events-none' : 'block'
          }`}
          onClick={togglePlay}
          onDoubleClick={toggleFullscreen}
          onTimeUpdate={e => setCurrentTime(e.currentTarget.currentTime)}
          onLoadedMetadata={e => {
            if (e.currentTarget.duration && !isNaN(e.currentTarget.duration)) {
              setDuration(e.currentTarget.duration);
            }
          }}
          onEnded={nextTrack}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onError={e => {
            console.error("Media load error:", e);
            setHasError(true);
            setErrorMessage("Cannot decode or stream media source.");
          }}
          onLoadedData={() => setHasError(false)}
          playsInline
        />
      )}

      {/* Audio Visualizer Viewport (When playing music / podcasts) */}
      {currentMedia?.type === 'audio' && (
        <div
          className="w-full h-full flex flex-col items-center justify-center p-8 bg-gradient-to-b from-surface-dim via-surface-lowest to-black cursor-pointer"
          onClick={togglePlay}
        >
          {/* Curved Album Art Card */}
          <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-4xl overflow-hidden shadow-glow-pill border border-white/10 mb-8 group">
            <img
              src={currentMedia.thumbnail}
              alt={currentMedia.title}
              className={`w-full h-full object-cover transition-transform duration-700 ${
                isPlaying ? 'scale-105' : 'scale-100 grayscale-20'
              }`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6">
              <span className="text-[11px] font-bold uppercase tracking-wider text-orbis-400">Now Playing Audio</span>
              <h2 className="text-xl font-bold text-white truncate">{currentMedia.title}</h2>
              <p className="text-sm text-slate-300 truncate">{currentMedia.artist}</p>
            </div>
          </div>

          {/* Glowing Frequency Bars Canvas */}
          <div className="w-full max-w-xl h-24">
            <canvas ref={visualizerCanvasRef} width={600} height={100} className="w-full h-full" />
          </div>
        </div>
      )}

      {/* Stream / Live Indicator Viewport (if stream without video) */}
      {currentMedia?.type === 'stream' && (
        <div className="absolute top-6 left-6 z-20 flex items-center space-x-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
          <span className="text-xs font-bold uppercase tracking-wider text-white">Live Stream</span>
        </div>
      )}

      {/* Subtitles Overlay */}
      {subtitleConfig.enabled && currentMedia?.type === 'video' && isPlaying && (
        <div
          className="absolute bottom-28 left-0 right-0 z-20 flex justify-center pointer-events-none px-6 text-center"
        >
          <span
            className="px-4 py-1.5 rounded-2xl font-semibold backdrop-blur-sm shadow-xl inline-block"
            style={{
              fontSize: `${subtitleConfig.fontSize}px`,
              color: subtitleConfig.color,
              backgroundColor: subtitleConfig.backgroundColor,
            }}
          >
            {/* Subtitle simulation placeholder or track text */}
            {currentMedia.title} — High Fidelity Sound
          </span>
        </div>
      )}

      {/* Floating Bottom HUD Controls */}
      <div
        className={`absolute bottom-6 left-0 right-0 z-30 transition-all duration-300 pointer-events-auto ${
          controlsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 pointer-events-none'
        }`}
      >
        <FloatingControls
          onToggleFullscreen={toggleFullscreen}
          isFullscreen={isFullscreen}
          onTogglePiP={togglePiP}
          isPiP={isPiP}
        />
      </div>

      {/* Error state alert */}
      {hasError && (
        <div className="absolute top-20 z-30 px-5 py-3 rounded-2xl bg-red-950/80 border border-red-500/50 text-white flex items-center space-x-3 shadow-2xl backdrop-blur-lg">
          <AlertCircle size={20} className="text-red-400" />
          <div className="text-xs">
            <p className="font-bold">Playback Notice</p>
            <p className="text-slate-300">{errorMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
};
