import React, { useState, useRef } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { MediaItem, LibraryCategory } from '../types/media';
import {
  Search,
  Film,
  Music,
  Heart,
  Plus,
  Play,
  ListPlus,
  LayoutGrid,
  List,
  FolderPlus,
  Clock,
  Trash2,
  X
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
    toggleFavorite,
    deleteFromLibrary,
    accentColor,
    themeMode,
    importLocalFiles,
  } = usePlayer();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isDark = themeMode === 'dark';

  const filteredItems = libraryItems.filter(item => {
    if (libraryCategory === 'videos' && item.type !== 'video') return false;
    if (libraryCategory === 'audio' && item.type !== 'audio') return false;
    if (libraryCategory === 'favorites' && !item.isFavorite) return false;

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
    if (!sec || isNaN(sec)) return '--:--';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleCardDragStart = (e: React.DragEvent, item: MediaItem) => {
    e.dataTransfer.setData('text/plain', JSON.stringify(item));
  };

  return (
    <div className={`flex-1 flex flex-col h-full overflow-y-auto custom-scrollbar select-none p-6 md:p-8 transition-colors ${
      isDark ? 'bg-[#0A0D14] text-slate-100' : 'bg-[#F8F9FC] text-slate-900'
    }`}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={e => e.target.files && importLocalFiles(e.target.files)}
        multiple
        accept="video/*,audio/*"
        className="hidden"
      />

      {/* Top Bar: Categories, Search, and View Toggles */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-7">
        
        {/* Category Filter Chips */}
        <div className="flex items-center space-x-1.5 overflow-x-auto w-full md:w-auto">
          {[
            { id: 'all', label: 'All', icon: null },
            { id: 'videos', label: 'Videos', icon: Film },
            { id: 'audio', label: 'Music', icon: Music },
            { id: 'favorites', label: 'Favorites', icon: Heart },
          ].map(cat => {
            const Icon = cat.icon;
            const isActive = libraryCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setLibraryCategory(cat.id as LibraryCategory)}
                className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  isActive
                    ? 'text-white shadow-sm'
                    : isDark
                      ? 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                      : 'bg-slate-200/80 text-slate-600 hover:text-black hover:bg-slate-300'
                }`}
                style={isActive ? { backgroundColor: accentColor } : {}}
              >
                {Icon && <Icon size={12} />}
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Actions: Search + Layout + Import */}
        <div className="flex items-center space-x-2.5 w-full md:w-auto justify-end">
          {/* Search Bar */}
          <div className="relative flex-1 md:w-56">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className={`w-full pl-9 pr-7 py-1.5 rounded-full text-xs transition-colors focus:outline-none border ${
                isDark
                  ? 'bg-white/5 border-white/10 text-white placeholder-slate-500 focus:border-white/30'
                  : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-slate-400 shadow-sm'
              }`}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* Grid / List switch */}
          <div className={`flex items-center p-0.5 rounded-full border ${
            isDark ? 'bg-white/5 border-white/10' : 'bg-slate-200/80 border-slate-200'
          }`}>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-full transition-colors ${
                viewMode === 'grid'
                  ? isDark ? 'bg-white/20 text-white' : 'bg-white text-black shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Grid"
            >
              <LayoutGrid size={13} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-full transition-colors ${
                viewMode === 'list'
                  ? isDark ? 'bg-white/20 text-white' : 'bg-white text-black shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="List"
            >
              <List size={13} />
            </button>
          </div>

          {/* Import Button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-white shadow-sm hover:scale-105 active:scale-95 transition-all"
            style={{ backgroundColor: accentColor }}
          >
            <FolderPlus size={13} />
            <span className="hidden sm:inline">Import</span>
          </button>
        </div>
      </div>

      {/* Media Presentation */}
      {filteredItems.length === 0 ? (
        <div className={`flex-1 flex flex-col items-center justify-center p-12 text-center rounded-3xl border border-dashed ${
          isDark ? 'border-white/10 text-slate-400' : 'border-slate-200 text-slate-500'
        }`}>
          <Film size={36} className="mb-2 opacity-40" />
          <h3 className="text-sm font-semibold">Your library is empty</h3>
          <p className="text-xs mt-1 max-w-xs opacity-70">
            Open media from your hard drive, drop files anywhere into Orbis, or enter a stream URL.
          </p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="mt-4 px-4 py-2 rounded-full text-xs font-semibold text-white shadow-sm hover:scale-105 active:scale-95 transition-all"
            style={{ backgroundColor: accentColor }}
          >
            Open Media Files
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredItems.map(item => (
            <div
              key={item.id}
              className={`group relative rounded-2xl p-2.5 transition-all duration-200 border cursor-pointer hover:shadow-lg ${
                isDark
                  ? 'bg-white/5 hover:bg-white/10 border-white/5 hover:border-white/15'
                  : 'bg-white hover:bg-slate-50 border-slate-200 shadow-sm'
              }`}
              draggable
              onDragStart={e => handleCardDragStart(e, item)}
              onClick={() => playMedia(item)}
            >
              {/* Thumbnail */}
              <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-800 mb-2.5">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Duration chip */}
                <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded-md bg-black/75 backdrop-blur-sm text-[10px] font-mono text-white flex items-center space-x-1">
                  <Clock size={9} />
                  <span>{formatDuration(item.duration)}</span>
                </div>

                {/* Resolution Badge */}
                {item.resolution && (
                  <div className="absolute top-2 left-2 px-1.5 py-0.2 rounded-md bg-black/60 backdrop-blur-sm text-[9px] font-bold text-white">
                    {item.resolution}
                  </div>
                )}

                {/* Hover Play Button */}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg transform scale-90 group-hover:scale-100 transition-transform"
                    style={{ backgroundColor: accentColor }}
                  >
                    <Play size={16} className="fill-white translate-x-0.5" />
                  </div>
                </div>
              </div>

              {/* Title & Actions */}
              <div className="px-1 pb-1">
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1 pr-2">
                    <h4 className={`text-xs font-bold truncate ${
                      isDark ? 'text-white' : 'text-slate-800'
                    }`}>
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      {item.artist || 'Local Media'}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-1" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={() => playNext(item)}
                      className="p-1 rounded-md text-slate-400 hover:text-sky-400 transition-colors"
                      title="Play Next"
                    >
                      <ListPlus size={14} />
                    </button>
                    <button
                      onClick={() => toggleFavorite(item.id)}
                      className={`p-1 rounded-md transition-colors ${
                        item.isFavorite ? 'text-red-500' : 'text-slate-400 hover:text-slate-600'
                      }`}
                      title="Favorite"
                    >
                      <Heart size={14} className={item.isFavorite ? 'fill-red-500' : ''} />
                    </button>
                    {item.isCustomLocal && (
                      <button
                        onClick={() => deleteFromLibrary(item.id)}
                        className="p-1 rounded-md text-slate-400 hover:text-red-400 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* LIST VIEW */
        <div className={`rounded-2xl border divide-y overflow-hidden ${
          isDark ? 'bg-white/5 border-white/10 divide-white/5' : 'bg-white border-slate-200 divide-slate-100 shadow-sm'
        }`}>
          {filteredItems.map(item => (
            <div
              key={item.id}
              className={`flex items-center justify-between p-3 transition-colors cursor-pointer group ${
                isDark ? 'hover:bg-white/5' : 'hover:bg-slate-50'
              }`}
              onClick={() => playMedia(item)}
            >
              <div className="flex items-center space-x-3 min-w-0">
                <div className="relative w-14 h-9 rounded-lg overflow-hidden bg-slate-800 shrink-0">
                  <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <Play size={12} className="fill-white" />
                  </div>
                </div>

                <div className="min-w-0">
                  <h4 className={`text-xs font-semibold truncate ${
                    isDark ? 'text-white' : 'text-slate-800'
                  }`}>
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 truncate">{item.artist}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 shrink-0" onClick={e => e.stopPropagation()}>
                <span className="text-[11px] font-mono text-slate-400">{formatDuration(item.duration)}</span>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => playNext(item)}
                    className="p-1 rounded-md text-slate-400 hover:text-sky-400"
                    title="Play Next"
                  >
                    <ListPlus size={14} />
                  </button>
                  <button
                    onClick={() => toggleFavorite(item.id)}
                    className={`p-1 rounded-md ${
                      item.isFavorite ? 'text-red-500' : 'text-slate-400 hover:text-slate-600'
                    }`}
                    title="Favorite"
                  >
                    <Heart size={14} className={item.isFavorite ? 'fill-red-500' : ''} />
                  </button>
                  {item.isCustomLocal && (
                    <button
                      onClick={() => deleteFromLibrary(item.id)}
                      className="p-1 rounded-md text-slate-400 hover:text-red-400"
                      title="Delete"
                    >
                      <Trash2 size={13} />
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
