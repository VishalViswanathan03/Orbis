import { MediaItem, EqualizerPreset } from '../types/media';

// No unwanted pre-loaded sample videos or audio - user starts fresh with their own media
export const SAMPLE_MEDIA: MediaItem[] = [];

export const EQUALIZER_PRESETS: EqualizerPreset[] = [
  { name: 'Flat', bands: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
  { name: 'Bass Boost (VLC)', bands: [7, 6, 5, 3, 1, 0, 0, 0, 0, 0] },
  { name: 'Vocal Clarity', bands: [-2, -1, 0, 3, 5, 6, 4, 2, 0, -1] },
  { name: 'Electronic', bands: [6, 5, 2, 0, -2, 2, 4, 5, 6, 6] },
  { name: 'Rock', bands: [5, 4, 3, 1, -1, -1, 2, 3, 5, 5] },
  { name: 'Cinema', bands: [4, 3, 1, 0, 2, 4, 5, 3, 2, 1] },
  { name: 'Acoustic', bands: [3, 2, 1, 1, 2, 3, 3, 4, 3, 2] },
];
