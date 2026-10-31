export interface MediaItem {
  id: string;
  title: string;
  artist?: string;
  album?: string;
  duration: number; // in seconds
  url: string;
  thumbnail: string;
  type: 'video' | 'audio' | 'stream';
  resolution?: '4K' | '1080p' | '720p' | 'Audio';
  codec?: string;
  fileSize?: string;
  fps?: number;
  addedAt: string;
  isFavorite?: boolean;
  subtitlesUrl?: string;
  isCustomLocal?: boolean;
}

export type RepeatMode = 'off' | 'all' | 'one';
export type AspectRatio = 'fit' | 'fill' | '16:9' | '4:3' | '21:9';

export interface EqualizerPreset {
  name: string;
  bands: number[]; // 10 bands: 32Hz, 64Hz, 125Hz, 250Hz, 500Hz, 1kHz, 2kHz, 4kHz, 8kHz, 16kHz (-12 to +12)
}

export interface VideoFilterSettings {
  brightness: number; // 50 to 150 (default 100)
  contrast: number; // 50 to 150 (default 100)
  saturation: number; // 0 to 200 (default 100)
  hueRotate: number; // 0 to 360 (default 0)
  grayscale: number; // 0 to 100 (default 0)
  invert: number; // 0 to 100 (default 0)
  sepia: number; // 0 to 100 (default 0)
}

export interface SubtitleConfig {
  enabled: boolean;
  fontSize: number; // 14 to 36
  color: string;
  backgroundColor: string;
  offsetSeconds: number; // sync delay +/-
  currentText?: string;
}

export type LibraryCategory = 'all' | 'videos' | 'audio' | 'streams' | 'favorites' | 'history';
