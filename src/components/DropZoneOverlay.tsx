import React, { useState, useEffect } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { Play, ListPlus, Sparkles, Film } from 'lucide-react';

export const DropZoneOverlay: React.FC = () => {
  const { importLocalFiles, playNext, accentColor } = usePlayer();
  const [isDraggingOverWindow, setIsDraggingOverWindow] = useState(false);
  const [activeTarget, setActiveTarget] = useState<'now' | 'next' | null>(null);

  useEffect(() => {
    let dragCounter = 0;

    const handleWindowDragEnter = (e: DragEvent) => {
      e.preventDefault();
      dragCounter++;
      if (e.dataTransfer?.types.includes('Files')) {
        setIsDraggingOverWindow(true);
      }
    };

    const handleWindowDragLeave = (e: DragEvent) => {
      e.preventDefault();
      dragCounter--;
      if (dragCounter === 0) {
        setIsDraggingOverWindow(false);
        setActiveTarget(null);
      }
    };

    const handleWindowDragOver = (e: DragEvent) => {
      e.preventDefault();
    };

    const handleWindowDrop = (e: DragEvent) => {
      e.preventDefault();
      dragCounter = 0;
      setIsDraggingOverWindow(false);
      setActiveTarget(null);
    };

    window.addEventListener('dragenter', handleWindowDragEnter);
    window.addEventListener('dragleave', handleWindowDragLeave);
    window.addEventListener('dragover', handleWindowDragOver);
    window.addEventListener('drop', handleWindowDrop);

    return () => {
      window.removeEventListener('dragenter', handleWindowDragEnter);
      window.removeEventListener('dragleave', handleWindowDragLeave);
      window.removeEventListener('dragover', handleWindowDragOver);
      window.removeEventListener('drop', handleWindowDrop);
    };
  }, []);

  if (!isDraggingOverWindow) return null;

  const handlePlayNowDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOverWindow(false);
    setActiveTarget(null);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      importLocalFiles(e.dataTransfer.files);
    }
  };

  const handlePlayNextDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOverWindow(false);
    setActiveTarget(null);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      // Import file and place in Play Next
      const files = Array.from(e.dataTransfer.files);
      files.forEach((file, index) => {
        const isVideo = file.type.startsWith('video/') || /\.(mp4|mkv|avi|mov|webm|flv)$/i.test(file.name);
        const isAudio = file.type.startsWith('audio/') || /\.(mp3|wav|flac|aac|ogg|m4a)$/i.test(file.name);
        if (!isVideo && !isAudio) return;

        const blobUrl = URL.createObjectURL(file);
        playNext({
          id: `dropped-${Date.now()}-${index}`,
          title: file.name.replace(/\.[^/.]+$/, ''),
          artist: 'Queued File',
          album: 'Dropped Media',
          duration: 0,
          url: blobUrl,
          thumbnail: isVideo
            ? 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=800&auto=format&fit=crop'
            : 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop',
          type: isVideo ? 'video' : 'audio',
          resolution: isVideo ? '1080p' : 'Audio',
          fileSize: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
          addedAt: new Date().toISOString().split('T')[0],
          isCustomLocal: true,
        });
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md p-10 flex flex-col justify-center items-center select-none animate-fade-in pointer-events-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 mb-3 text-sm text-slate-200">
          <Sparkles size={16} className="text-orbis-400" />
          <span>Orbis Instant Ingestion</span>
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">Drop Media to Play</h2>
        <p className="text-slate-400 text-sm mt-1">Supports MP4, MKV, AVI, WEBM, MP3, FLAC, AAC, WAV & More</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl h-72">
        {/* Drop Zone: PLAY NOW */}
        <div
          onDragOver={e => {
            e.preventDefault();
            setActiveTarget('now');
          }}
          onDragLeave={() => setActiveTarget(null)}
          onDrop={handlePlayNowDrop}
          className={`rounded-5xl border-3 border-dashed flex flex-col items-center justify-center p-8 transition-all duration-300 cursor-pointer ${
            activeTarget === 'now'
              ? 'scale-103 bg-white/10 shadow-glow-pill'
              : 'bg-surface-mid/70 border-white/20 hover:border-white/40'
          }`}
          style={activeTarget === 'now' ? { borderColor: accentColor } : {}}
        >
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center text-white mb-4 shadow-xl transition-transform"
            style={{ backgroundColor: accentColor }}
          >
            <Play size={36} className="fill-white translate-x-1" />
          </div>
          <h3 className="text-xl font-bold text-white mb-1">Drop to Play Now</h3>
          <p className="text-xs text-slate-400 text-center">Replaces current playback immediately</p>
        </div>

        {/* Drop Zone: PLAY NEXT */}
        <div
          onDragOver={e => {
            e.preventDefault();
            setActiveTarget('next');
          }}
          onDragLeave={() => setActiveTarget(null)}
          onDrop={handlePlayNextDrop}
          className={`rounded-5xl border-3 border-dashed flex flex-col items-center justify-center p-8 transition-all duration-300 cursor-pointer ${
            activeTarget === 'next'
              ? 'scale-103 bg-white/10 shadow-glow-pill border-sky-400'
              : 'bg-surface-mid/70 border-white/20 hover:border-white/40'
          }`}
        >
          <div className="w-20 h-20 rounded-full bg-sky-500 flex items-center justify-center text-white mb-4 shadow-xl transition-transform">
            <ListPlus size={36} />
          </div>
          <h3 className="text-xl font-bold text-white mb-1">Drop to Play Next</h3>
          <p className="text-xs text-slate-400 text-center">Inserts right next at top of queue</p>
        </div>
      </div>
    </div>
  );
};
