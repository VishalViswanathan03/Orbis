import React, { useState } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { Globe, X, Play, Radio, Sparkles } from 'lucide-react';

const PRESET_STREAMS = [
  {
    title: 'NASA TV Space Live',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4',
  },
  {
    title: 'Blender 4K Demo Stream',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  },
  {
    title: 'HLS Test Stream (Akamai)',
    url: 'https://cph-p2p-msl.akamaized.net/hls/live/2000341/test/master.m3u8',
  },
];

export const StreamModal: React.FC = () => {
  const { isStreamModalOpen, setIsStreamModalOpen, addCustomStream, accentColor } = usePlayer();
  const [streamUrl, setStreamUrl] = useState('');
  const [streamTitle, setStreamTitle] = useState('');

  if (!isStreamModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!streamUrl.trim()) return;
    addCustomStream(streamTitle.trim() || 'Network Stream', streamUrl.trim());
    setStreamUrl('');
    setStreamTitle('');
    setIsStreamModalOpen(false);
  };

  const handleSelectPreset = (preset: { title: string; url: string }) => {
    addCustomStream(preset.title, preset.url);
    setIsStreamModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 select-none animate-fade-in">
      <div className="w-full max-w-lg bg-surface-dim/95 border border-white/10 rounded-4xl p-6 md:p-8 shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white"
              style={{ backgroundColor: accentColor }}
            >
              <Globe size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Open Network Stream</h3>
              <p className="text-xs text-slate-400">Play live HLS (.m3u8), HTTP, RTSP or MP4 URLs</p>
            </div>
          </div>

          <button
            onClick={() => setIsStreamModalOpen(false)}
            className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="my-6 space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">Stream Name (Optional)</label>
            <input
              type="text"
              placeholder="e.g. My Favorite Radio / IPTV Stream"
              value={streamTitle}
              onChange={e => setStreamTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-surface-mid/80 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-white/30"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">Stream URL (Required)</label>
            <input
              type="url"
              required
              placeholder="https://example.com/live/stream.m3u8"
              value={streamUrl}
              onChange={e => setStreamUrl(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-surface-mid/80 border border-white/10 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-white/30"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-full font-bold text-xs text-white shadow-lg flex items-center justify-center space-x-2 hover:scale-102 active:scale-98 transition-all"
            style={{ backgroundColor: accentColor }}
          >
            <Play size={16} className="fill-white" />
            <span>Open & Play Stream</span>
          </button>
        </form>

        {/* Presets List */}
        <div>
          <label className="text-xs font-semibold text-slate-400 block mb-2">Or choose a test stream</label>
          <div className="space-y-2">
            {PRESET_STREAMS.map(item => (
              <div
                key={item.url}
                onClick={() => handleSelectPreset(item)}
                className="flex items-center justify-between p-3 rounded-2xl bg-surface-mid/60 hover:bg-surface-mid border border-white/5 hover:border-white/15 transition-all cursor-pointer group"
              >
                <div className="flex items-center space-x-3">
                  <Radio size={16} className="text-sky-400 group-hover:scale-110 transition-transform" />
                  <div>
                    <h5 className="text-xs font-bold text-white group-hover:text-orbis-400 transition-colors">
                      {item.title}
                    </h5>
                    <p className="text-[10px] font-mono text-slate-400 truncate max-w-xs">{item.url}</p>
                  </div>
                </div>

                <Play size={14} className="text-slate-500 group-hover:text-white" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
