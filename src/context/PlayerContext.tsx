import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  MediaItem,
  RepeatMode,
  AspectRatio,
  VideoFilterSettings,
  SubtitleConfig,
  LibraryCategory
} from '../types/media';
import { SAMPLE_MEDIA, EQUALIZER_PRESETS } from '../constants/sampleMedia';

interface PlayerContextType {
  // Playback state
  currentMedia: MediaItem | null;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  currentTime: number;
  setCurrentTime: (time: number) => void;
  duration: number;
  setDuration: (duration: number) => void;
  volume: number;
  isMuted: boolean;
  playbackRate: number;
  aspectRatio: AspectRatio;
  repeatMode: RepeatMode;
  isShuffle: boolean;

  // View state
  currentView: 'player' | 'library';
  setCurrentView: (view: 'player' | 'library') => void;
  isQueueOpen: boolean;
  setIsQueueOpen: (open: boolean | ((prev: boolean) => boolean)) => void;

  // Queue state (Drag and drop Play Next)
  queue: MediaItem[];
  queueIndex: number;
  playMedia: (item: MediaItem) => void;
  playNext: (item: MediaItem) => void;
  addToQueue: (item: MediaItem) => void;
  reorderQueue: (fromIndex: number, toIndex: number) => void;
  removeFromQueue: (index: number) => void;
  clearQueue: () => void;
  nextTrack: () => void;
  prevTrack: () => void;

  // Controls
  togglePlay: () => void;
  seek: (seconds: number) => void;
  setVolumeLevel: (val: number) => void;
  toggleMute: () => void;
  setPlaybackRate: (rate: number) => void;
  setAspectRatio: (ratio: AspectRatio) => void;
  setRepeatMode: (mode: RepeatMode) => void;
  setIsShuffle: (shuffle: boolean | ((prev: boolean) => boolean)) => void;

  // Modern Audio/Video Overhaul features
  videoFilters: VideoFilterSettings;
  setVideoFilters: React.Dispatch<React.SetStateAction<VideoFilterSettings>>;
  resetVideoFilters: () => void;

  equalizerBands: number[];
  setEqualizerBands: (bands: number[]) => void;
  selectedPreset: string;
  setPreset: (presetName: string) => void;

  subtitleConfig: SubtitleConfig;
  setSubtitleConfig: React.Dispatch<React.SetStateAction<SubtitleConfig>>;

  // Theme Accent & Mode
  accentColor: string;
  setAccentColor: (accent: string) => void;
  themeMode: 'dark' | 'light';
  toggleThemeMode: () => void;

  // Modals
  isEqualizerOpen: boolean;
  setIsEqualizerOpen: (open: boolean) => void;
  isVideoEffectsOpen: boolean;
  setIsVideoEffectsOpen: (open: boolean) => void;
  isStreamModalOpen: boolean;
  setIsStreamModalOpen: (open: boolean) => void;

  // Library
  libraryItems: MediaItem[];
  setLibraryItems: React.Dispatch<React.SetStateAction<MediaItem[]>>;
  libraryCategory: LibraryCategory;
  setLibraryCategory: (cat: LibraryCategory) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  toggleFavorite: (id: string) => void;
  importLocalFiles: (files: FileList | File[]) => void;
  addCustomStream: (title: string, url: string) => void;
  deleteFromLibrary: (id: string) => void;

  // Internal media element ref
  mediaRef: React.RefObject<HTMLVideoElement | null>;
}

const defaultVideoFilters: VideoFilterSettings = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  hueRotate: 0,
  grayscale: 0,
  invert: 0,
  sepia: 0,
};

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const mediaRef = useRef<HTMLVideoElement | null>(null);

  // Library & Initial Queue
  const [libraryItems, setLibraryItems] = useState<MediaItem[]>(() => {
    const saved = localStorage.getItem('orbis_library_v3');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return [];
  });

  const [queue, setQueue] = useState<MediaItem[]>([]);
  const [queueIndex, setQueueIndex] = useState<number>(0);
  const [currentMedia, setCurrentMedia] = useState<MediaItem | null>(null);

  // Theme Mode
  const [themeMode, setThemeMode] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('orbis_theme') as 'dark' | 'light') || 'dark';
  });

  useEffect(() => {
    localStorage.setItem('orbis_theme', themeMode);
    if (themeMode === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, [themeMode]);

  const toggleThemeMode = () => {
    setThemeMode(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Playback States
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(SAMPLE_MEDIA[0]?.duration || 0);
  const [volume, setVolume] = useState<number>(0.85);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('fit');
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('all');
  const [isShuffle, setIsShuffle] = useState<boolean>(false);

  // Views & UI
  const [currentView, setCurrentView] = useState<'player' | 'library'>('player');
  const [isQueueOpen, setIsQueueOpen] = useState<boolean>(false);
  const [accentColor, setAccentColor] = useState<string>('#FF7A00'); // Solar Amber Accent
  const [libraryCategory, setLibraryCategory] = useState<LibraryCategory>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [isEqualizerOpen, setIsEqualizerOpen] = useState<boolean>(false);
  const [isVideoEffectsOpen, setIsVideoEffectsOpen] = useState<boolean>(false);
  const [isStreamModalOpen, setIsStreamModalOpen] = useState<boolean>(false);

  // Equalizer & Filters
  const [selectedPreset, setSelectedPreset] = useState<string>('Flat');
  const [equalizerBands, setEqualizerBands] = useState<number[]>([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  const [videoFilters, setVideoFilters] = useState<VideoFilterSettings>(defaultVideoFilters);

  // Subtitles
  const [subtitleConfig, setSubtitleConfig] = useState<SubtitleConfig>({
    enabled: true,
    fontSize: 20,
    color: '#FFFFFF',
    backgroundColor: 'rgba(0,0,0,0.7)',
    offsetSeconds: 0,
  });

  // Save library changes
  useEffect(() => {
    localStorage.setItem('orbis_library_v3', JSON.stringify(libraryItems));
  }, [libraryItems]);

  const resetVideoFilters = () => {
    setVideoFilters(defaultVideoFilters);
  };

  const setPreset = (presetName: string) => {
    setSelectedPreset(presetName);
    const found = EQUALIZER_PRESETS.find(p => p.name === presetName);
    if (found) {
      setEqualizerBands([...found.bands]);
    }
  };

  // Play Actions
  const playMedia = (item: MediaItem) => {
    // Check if item exists in queue
    const idx = queue.findIndex(q => q.id === item.id);
    if (idx !== -1) {
      setQueueIndex(idx);
    } else {
      const newQueue = [...queue.slice(0, queueIndex + 1), item, ...queue.slice(queueIndex + 1)];
      setQueue(newQueue);
      setQueueIndex(queueIndex + 1);
    }
    setCurrentMedia(item);
    setCurrentTime(0);
    setIsPlaying(true);
    setCurrentView('player');
  };

  // Play Next: Insert item directly right after currently playing item
  const playNext = (item: MediaItem) => {
    const without = queue.filter(q => q.id !== item.id);
    const targetIdx = queueIndex + 1;
    const updated = [
      ...without.slice(0, targetIdx),
      item,
      ...without.slice(targetIdx)
    ];
    setQueue(updated);
  };

  // Add to end of Queue
  const addToQueue = (item: MediaItem) => {
    if (queue.some(q => q.id === item.id)) {
      return; // already in queue
    }
    setQueue(prev => [...prev, item]);
  };

  // Drag-and-drop Reordering
  const reorderQueue = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0 || fromIndex >= queue.length || toIndex >= queue.length) return;
    const updated = [...queue];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);

    // Adjust queueIndex if currently playing moved
    if (queueIndex === fromIndex) {
      setQueueIndex(toIndex);
    } else if (fromIndex < queueIndex && toIndex >= queueIndex) {
      setQueueIndex(queueIndex - 1);
    } else if (fromIndex > queueIndex && toIndex <= queueIndex) {
      setQueueIndex(queueIndex + 1);
    }
    setQueue(updated);
  };

  const removeFromQueue = (index: number) => {
    if (queue.length <= 1) return;
    const updated = queue.filter((_, i) => i !== index);
    setQueue(updated);
    if (index === queueIndex) {
      const nextIdx = Math.min(index, updated.length - 1);
      setQueueIndex(nextIdx);
      setCurrentMedia(updated[nextIdx]);
    } else if (index < queueIndex) {
      setQueueIndex(queueIndex - 1);
    }
  };

  const clearQueue = () => {
    if (!currentMedia) return;
    setQueue([currentMedia]);
    setQueueIndex(0);
  };

  const nextTrack = () => {
    if (queue.length === 0) return;
    let nextIdx = queueIndex + 1;
    if (isShuffle) {
      nextIdx = Math.floor(Math.random() * queue.length);
    } else if (nextIdx >= queue.length) {
      if (repeatMode === 'all') {
        nextIdx = 0;
      } else {
        setIsPlaying(false);
        return;
      }
    }
    setQueueIndex(nextIdx);
    setCurrentMedia(queue[nextIdx]);
    setCurrentTime(0);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    if (currentTime > 3) {
      seek(0);
      return;
    }
    if (queue.length === 0) return;
    let prevIdx = queueIndex - 1;
    if (prevIdx < 0) {
      prevIdx = repeatMode === 'all' ? queue.length - 1 : 0;
    }
    setQueueIndex(prevIdx);
    setCurrentMedia(queue[prevIdx]);
    setCurrentTime(0);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    if (!mediaRef.current && !currentMedia) return;
    setIsPlaying(prev => !prev);
  };

  const seek = (seconds: number) => {
    if (mediaRef.current) {
      mediaRef.current.currentTime = Math.max(0, Math.min(seconds, duration));
    }
    setCurrentTime(seconds);
  };

  const setVolumeLevel = (val: number) => {
    const clamped = Math.max(0, Math.min(1, val));
    setVolume(clamped);
    if (clamped > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    setIsMuted(prev => !prev);
  };

  const toggleFavorite = (id: string) => {
    setLibraryItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, isFavorite: !item.isFavorite };
      }
      return item;
    }));
  };

  const deleteFromLibrary = (id: string) => {
    setLibraryItems(prev => prev.filter(item => item.id !== id));
    setQueue(prev => prev.filter(item => item.id !== id));
  };

  const importLocalFiles = async (files: FileList | File[]) => {
    const newItems: MediaItem[] = [];
    const electronAPI = (window as any).electronAPI;
    const fileArray = Array.from(files);

    for (let index = 0; index < fileArray.length; index++) {
      const file = fileArray[index];
      const isVideo = file.type.startsWith('video/') || /\.(mp4|mkv|avi|mov|webm|flv|wmv|ts|m2ts|vob|mpg|mpeg|rmvb|3gp|ogv|m4v)$/i.test(file.name);
      const isAudio = file.type.startsWith('audio/') || /\.(mp3|wav|flac|aac|ogg|m4a|wma|opus|ac3|dts|ape|alac)$/i.test(file.name);
      if (!isVideo && !isAudio) continue;

      const diskPath = (file as any).path;
      let finalUrl = '';
      let meta: any = {
        duration: 0,
        resolution: isVideo ? '1080p' : 'Audio',
        type: isVideo ? 'video' : 'audio',
        title: file.name.replace(/\.[^/.]+$/, "")
      };

      if (electronAPI && diskPath) {
        try {
          finalUrl = await electronAPI.getMediaUrl(diskPath);
          const probed = await electronAPI.probeMedia(diskPath);
          if (probed) meta = { ...meta, ...probed };
        } catch {
          finalUrl = URL.createObjectURL(file);
        }
      } else {
        finalUrl = URL.createObjectURL(file);
      }

      const sizeMb = (file.size / (1024 * 1024)).toFixed(1) + ' MB';

      newItems.push({
        id: `local-${Date.now()}-${index}`,
        title: meta.title || file.name.replace(/\.[^/.]+$/, ""),
        artist: 'Local Media',
        album: meta.type === 'video' ? 'Local Video' : 'Local Music',
        duration: meta.duration || 0,
        url: finalUrl,
        thumbnail: meta.type === 'video'
          ? 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=800&auto=format&fit=crop'
          : 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop',
        type: meta.type as any,
        resolution: meta.resolution as any,
        codec: file.type || 'Universal',
        fileSize: sizeMb,
        addedAt: new Date().toISOString().split('T')[0],
        isFavorite: false,
        isCustomLocal: true,
      });
    }

    if (newItems.length > 0) {
      setLibraryItems(prev => [...newItems, ...prev]);
      playMedia(newItems[0]);
    }
  };

  const addCustomStream = (title: string, url: string) => {
    const streamItem: MediaItem = {
      id: `stream-${Date.now()}`,
      title: title || 'Network Stream',
      artist: 'Live Network',
      album: 'Online Broadcast',
      duration: 0,
      url: url,
      thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop',
      type: 'stream',
      resolution: '1080p',
      codec: 'HLS / HTTP Live',
      fileSize: 'Live Stream',
      addedAt: new Date().toISOString().split('T')[0],
      isFavorite: true,
      isCustomLocal: true,
    };
    setLibraryItems(prev => [streamItem, ...prev]);
    playMedia(streamItem);
  };

  return (
    <PlayerContext.Provider value={{
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
        repeatMode,
        isShuffle,
        currentView,
        setCurrentView,
        isQueueOpen,
        setIsQueueOpen,
        queue,
        queueIndex,
        playMedia,
        playNext,
        addToQueue,
        reorderQueue,
        removeFromQueue,
        clearQueue,
        nextTrack,
        prevTrack,
        togglePlay,
        seek,
        setVolumeLevel,
        toggleMute,
        setPlaybackRate,
        setAspectRatio,
        setRepeatMode,
        setIsShuffle,
        videoFilters,
        setVideoFilters,
        resetVideoFilters,
        equalizerBands,
        setEqualizerBands,
        selectedPreset,
        setPreset,
        subtitleConfig,
        setSubtitleConfig,
        accentColor,
        setAccentColor,
        themeMode,
        toggleThemeMode,
        isEqualizerOpen,
        setIsEqualizerOpen,
        isVideoEffectsOpen,
        setIsVideoEffectsOpen,
        isStreamModalOpen,
        setIsStreamModalOpen,
        libraryItems,
        setLibraryItems,
        libraryCategory,
        setLibraryCategory,
        searchQuery,
        setSearchQuery,
        toggleFavorite,
        importLocalFiles,
        addCustomStream,
        deleteFromLibrary,
        mediaRef,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};
