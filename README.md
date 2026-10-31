<p align="center">
  <h1 align="center" style="font-size: 3.8rem; letter-spacing: -2.5px; font-weight: 900; margin-bottom: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">orbis<span style="color: #FF7A00;">•</span></h1>
  <p align="center"><em>The Universal Modern Media Player</em></p>
</p>

<p align="center">
  <strong>A modern, curved Material Design 3 universal media player.</strong><br/>
  Featuring floating glassmorphism, dynamic Material You theming, a clean media library, dual-zone drag-and-drop, and an interactive Play Next queue.
</p>

---

## 🌟 Key Innovations & Overhaul Highlights

### 1. 🎨 Material Design 3 & Curved Organic Aesthetics
- **Floating Pill HUD**: Playback controls float seamlessly over the media with backdrop blur, rounded pill containers (`rounded-4xl`), and glow lighting.
- **Dynamic Theming**: Switch between iconic Solar Amber, Cyberpunk Cyan, Emerald Wave, Cosmic Purple, and Neon Rose.
- **Auto-Hiding Controls**: Controls smoothly fade out after 3 seconds of inactivity during video playback and reappear on cursor movement.

### 2. 🗂️ Brand-New Media Library
- **Unified Media Hub**: Browse Movies & Videos, Music & Tracks, Network Streams, and Favorites.
- **Curved Media Cards**: Beautiful posters with 4K UHD / 1080p badges, duration chips, codec indicators, and hover play triggers.
- **Multi-Layout Switcher**: Toggle seamlessly between Cozy Grid and Compact List views.
- **Instant Search & Ingestion**: Filter instantly by title, artist, or album, or click **Import Files** to load any local file or folder from your hard drive.

### 3. 🎯 Drag-and-Drop "Play Next" Queue
- **Interactive Reordering**: Drag items up and down the queue with live visual indicators.
- **Dual-Zone Global Drop**: Drag video or audio files from Windows File Explorer anywhere into the window to access two intuitive drop zones:
  - **Drop to Play Now**: Replaces current playback immediately.
  - **Drop to Play Next**: Injects the file directly to the top of your queue.

### 4. 🎛️ Universal Playback & Pro Power Tools
- **Universal Codec Engine**: Plays all video and audio formats including AVI, MKV, MP4, WebM, MOV, WMV, FLV, VOB, TS, MP3, FLAC, AAC, WAV, AC3, DTS, and live network streams.
- **10-Band Equalizer**: Parametric audio EQ with presets like *Deep Bass Boost*, *Vocal Clarity*, *Electronic / Dance*, *Rock & Metal*, and *Cinema*.
- **Real-Time Video Filters**: GPU-accelerated adjustments for Brightness, Contrast, Saturation, Hue Rotation, Grayscale, and Sepia.
- **Network Stream Engine**: Open and stream live URLs (HLS `.m3u8`, MP4, HTTP live streams).
- **Subtitles & Aspect Ratios**: Customizable subtitles and one-click aspect ratio switcher (Fit, Fill, 16:9, 4:3, 21:9 UltraWide).
- **Audio Visualizer**: Live animated frequency bars when listening to music or podcasts.

---

## ⌨️ Pro Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| <kbd>Space</kbd> | Play / Pause |
| <kbd>→</kbd> / <kbd>←</kbd> | Seek +5s / -5s |
| <kbd>L</kbd> / <kbd>J</kbd> | Seek +10s / -10s |
| <kbd>↑</kbd> / <kbd>↓</kbd> | Volume Up / Down (5%) |
| <kbd>M</kbd> | Mute / Unmute |
| <kbd>F</kbd> | Fullscreen Toggle |
| <kbd>N</kbd> | Next Track in Queue |
| <kbd>P</kbd> | Previous Track in Queue |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or higher recommended)
- **npm** (comes with Node.js)

### Launching Orbis

#### 1. Run as a Native Desktop App
```bash
npm run desktop
```
*Launches Orbis in a native, curved desktop window powered by Electron.*

#### 2. Run in Your Web Browser (Dev Server)
```bash
npm run dev
```
*Opens the Vite local dev server at `http://localhost:5173`.*

#### 3. Build for Production
```bash
npm run build
```

---

## 🏗️ Architecture

- **Engine**: Electron 34 + React 19 + TypeScript
- **Styling**: Tailwind CSS + Material Design 3 Tokens + Custom SVG Filter Pipeline
- **Icons**: Lucide Icons
- **Audio/Video Engine**: Universal Multi-Format Engine with live Web Audio API visualizer & GPU CSS filters
- **Design Guidelines**: Material You & Modern Organic Curved Glassmorphism

---

## 🔏 Windows Digital Signature & Publisher Verification

Official Windows releases (`.exe`) are digitally signed with SHA-256 Authenticode for publisher **Vishal-VN**.

To establish trust on Windows:
- **Instant launch**: Click **"More info"** &rarr; **"Run anyway"** on Microsoft Defender SmartScreen.
- **One-click system trust**: Double-click `Trust-Orbis-Certificate.bat` to add the public key (`public/orbis-signer.cer`) to your Trusted Publishers store.

---

## 📜 License
GPL-2.0-or-later.
