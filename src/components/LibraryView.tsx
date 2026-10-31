import React, { useState } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { MediaItem, LibraryCategory } from '../types/media';
import {
  Search,
  Film,
  Music,
  Globe,
  Heart,
  Plus,
  Play,
  ListPlus,
  LayoutGrid,
  List,
  Sparkles,
  Clock,
  HardDrive,
  FolderPlus,
  MoreVertical,
  Trash2
} from 'lucide-react';

export const LibraryView: React.FC = () => {
  const {
    libraryItems,
    libraryCategory,
    setLibraryCategory,
    searchQuery,
    setSearchQuery,
    playMedia,
    playNext,
    addToQueue,
    toggleFavorite,
    deleteFromLibrary,
    accentColor,
    importLocalFiles,
    setIsStreamModalOpen,
  } = usePlayer();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Filter items
  const filteredItems = libraryItems.filter(item => {
    // Category filter
    if (libraryCategory === 'videos' && item.type !== 'video') return false;
    if (libraryCategory === 'audio' && item.type !== 'audio') return false;
    if (libraryCategory === 'streams' && item.type !== 'stream') return false;
    if (libraryCategory === 'favorites' && !item.isFavorite) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchArtist = item.artist?.toLowerCase().includes(q);
      const matchAlbum = item.album?.toLowerCase().includes(q);
      return matchTitle || matchArtist || matchAlbum;
    }
    return true;
  });

  const formatDuration = (sec: number) => {
    if (!sec || isNaN(sec)) return 'Live / N/A';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleCardDragStart = (e: React.DragEvent, item: MediaItem) => {
    e.dataTransfer.setData('text/plain', JSON.stringify(item));
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto custom-scrollbar select-none p-6 md:p-8 animate-fade-in bg-gradient-to-b from-surface-dim to-surface-lowest">
      <input
        type="file"
        ref={fileInputRef}
        onChange={e => e.target.files && importLocalFiles(e.target.files)}
        multiple
        accept="video/*,audio/*"
        className="hidden"
      />

      {/* Hero Welcome Banner (Curved Material 3 Island) */}
      <div className="relative overflow-hidden rounded-4xl bg-gradient-to-r from-surface-high via-surface-mid to-surface-low border border-white/10 p-7 md:p-9 mb-8 shadow-2xl">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-slate-200 mb-3.5">
            <Sparkles size={14} style={{ color: accentColor }} />
            <span>Orbis Unified Media Hub</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Your Local Library, Reimagined
          </h1>
          <p className="text-slate-300 text-sm mt-2 leading-relaxed">
            Smooth playback powered by VLC core engine principles. Seamlessly drag items into your Play Next queue, enjoy 4K HDR playback, and manage all your collections with Material Design 3.
          </p>

          {/* Quick Buttons */}
          <div className="flex flex-wrap items-center gap-3 mt-6">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-full font-bold text-xs text-white shadow-glow-pill hover:scale-105 active:scale-95 transition-all"
              style={{ backgroundColor: accentColor }}
            >
              <FolderPlus size={16} />
              <span>Import Local Files</span>
            </button>
            <button
              onClick={() => setIsStreamModalOpen(true)}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/10 font-bold text-xs text-slate-200 hover:text-white transition-all"
            >
              <Globe size={16} />
              <span>Add Network Stream</span>
            </button>
          </div>
        </div>

        {/* Ambient glow decoration */}
        <div
          className="absolute -right-10 -bottom-10 w-96 h-96 rounded-full blur-3xl opacity-25 pointer-events-none"
          style={{ backgroundColor: accentColor }}
        />
      </div>

      {/* Control Bar: Category Pills + Search + View Modes */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        
        {/* Category Pills (Material 3 filter chips) */}
        <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {[
            { id: 'all', label: 'All Media', icon: Sparkles },
            { id: 'videos', label: 'Movies & Videos', icon: Film },
            { id: 'audio', label: 'Music & Tracks', icon: Music },
            { id: 'streams', label: 'Streams', icon: Globe },
            { id: 'favorites', label: 'Favorites', icon: Heart },
          ].map(cat => {
            const Icon = cat.icon;
            const isActive = libraryCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setLibraryCategory(cat.id as LibraryCategory)}
                className={`flex items-center space-x-1.5 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? 'text-white shadow-md'
                    : 'bg-surface-mid/80 text-slate-400 hover:text-white hover:bg-surface-high border border-white/5'
                }`}
                style={isActive ? { backgroundColor: accentColor } : {}}
              >
                <Icon size={14} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right side: Search Box and View Mode Toggles */}
        <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
          {/* Search bar */}
          <div className="relative flex-1 md:w-64">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search library..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-full bg-surface-mid/80 border border-white/10 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-white/30 transition-colors"
            />
          </div>

          {/* Grid / List View Toggle */}
          <div className="flex items-center bg-surface-mid/80 p-1 rounded-full border border-white/10">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-full transition-colors ${
                viewMode === 'grid' ? 'bg-white/20 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Grid View"
            >
              <LayoutGrid size={15} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-full transition-colors ${
                viewMode === 'list' ? 'bg-white/20 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="List View"
            >
              <List size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Media Items Presentation */}
      {filteredItems.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center rounded-4xl border border-dashed border-white/10 bg-surface-low/30">
          <Film size={44} className="text-slate-600 mb-3" />
          <h3 className="text-lg font-bold text-white">No media found</h3>
          <p className="text-slate-400 text-xs mt-1 max-w-sm">
            Drag and drop video/audio files directly here or click Import to add them to your Orbis library.
          </p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="mt-4 px-5 py-2 rounded-full text-xs font-bold text-white shadow-md hover:scale-105 transition-all"
            style={{ backgroundColor: accentColor }}
          >
            Import Media
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW (Modern Curved Cards) */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredItems.map(item => (
            <div
              key={item.id}
              className="group relative bg-surface-mid/70 hover:bg-surface-high border border-white/10 hover:border-white/20 rounded-3xl p-3.5 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl flex flex-col cursor-pointer"
              draggable
              onDragStart={e => handleCardDragStart(e, item)}
              onClick={() => playMedia(item)}
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-surface-highest mb-3">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                />

                {/* Badges Overlay */}
                <div className="absolute top-2.5 left-2.5 flex items-center space-x-1.5">
                  {item.resolution && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/10">
                      {item.resolution}
                    </span>
                  )}
                  {item.type === 'stream' && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-600/80 backdrop-blur-md text-white">
                      LIVE
                    </span>
                  )}
                </div>

                {/* Duration Badge */}
                <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-[11px] font-mono text-white flex items-center space-x-1">
                  <Clock size={10} />
                  <span>{formatDuration(item.duration)}</span>
                </div>

                {/* Hover Play Button Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 backdrop-blur-[1px] flex items-center justify-center transition-opacity">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white shadow-xl transform scale-75 group-hover:scale-100 transition-transform"
                    style={{ backgroundColor: accentColor }}
                  >
                    <Play size={20} className="fill-white translate-x-0.5" />
                  </div>
                </div>
              </div>

              {/* Title & Metadata */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-sm text-white truncate group-hover:text-orbis-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 truncate mt-0.5">
                    {item.artist || 'Local Media'}
                  </p>
                </div>

                {/* Card Action Row */}
                <div className="flex items-center justify-between pt-3 mt-3 border-t border-white/5">
                  <span className="text-[11px] font-mono text-slate-500">{item.fileSize || item.codec}</span>

                  <div className="flex items-center space-x-1" onClick={e => e.stopPropagation()}>
                    {/* Play Next Button */}
                    <button
                      onClick={() => playNext(item)}
                      className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-sky-400 transition-colors"
                      title="Play Next in Queue"
                    >
                      <ListPlus size={15} />
                    </button>

                    {/* Favorite Button */}
                    <button
                      onClick={() => toggleFavorite(item.id)}
                      className={`p-1.5 rounded-full hover:bg-white/10 transition-colors ${
                        item.isFavorite ? 'text-red-400' : 'text-slate-400 hover:text-white'
                      }`}
                      title="Favorite"
                    >
                      <Heart size={15} className={item.isFavorite ? 'fill-red-400' : ''} />
                    </button>

                    {/* Delete item if local */}
                    {item.isCustomLocal && (
                      <button
                        onClick={() => deleteFromLibrary(item.id)}
                        className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-red-400 transition-colors"
                        title="Remove from library"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* LIST VIEW (Sleek rows) */
        <div className="bg-surface-mid/60 border border-white/10 rounded-3xl overflow-hidden divide-y divide-white/5">
          {filteredItems.map(item => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3.5 hover:bg-surface-high transition-colors cursor-pointer group"
              onClick={() => playMedia(item)}
            >
              <div className="flex items-center space-x-4 min-w-0">
                <div className="relative w-16 h-11 rounded-xl overflow-hidden bg-surface-highest flex-shrink-0">
                  <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <Play size={14} className="fill-white" />
                  </div>
                </div>

                <div className="min-w-0">
                  <h4 className="text-sm font-semibold text-white truncate group-hover:text-orbis-400">
                    {item.title}
                  </h4>
                  <div className="flex items-center space-x-2 text-xs text-slate-400 mt-0.5">
                    <span>{item.artist}</span>
                    <span>•</span>
                    <span>{item.codec}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-5" onClick={e => e.stopPropagation()}>
                <span className="text-xs font-mono text-slate-400">{formatDuration(item.duration)}</span>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => playNext(item)}
                    className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-sky-400"
                    title="Play Next"
                  >
                    <ListPlus size={16} />
                  </button>
                  <button
                    onClick={() => toggleFavorite(item.id)}
                    className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-red-400"
                    title="Favorite"
                  >
                    <Heart size={16} className={item.isFavorite ? 'fill-red-400 text-red-400' : ''} />
                  </button>
                  {item.isCustomLocal && (
                    <button
                      onClick={() => deleteFromLibrary(item.id)}
                      className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-red-400"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
