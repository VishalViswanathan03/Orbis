import React, { useState } from 'react';
import { usePlayer } from '../context/PlayerContext';
import {
  GripVertical,
  X,
  Play,
  Trash2,
  ListMusic,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';

export const PlayNextQueue: React.FC = () => {
  const {
    queue,
    queueIndex,
    reorderQueue,
    removeFromQueue,
    clearQueue,
    playMedia,
    isPlaying,
    accentColor,
    themeMode,
    isQueueOpen,
    setIsQueueOpen,
  } = usePlayer();

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const isDark = themeMode === 'dark';

  if (!isQueueOpen) return null;

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== targetIndex) {
      reorderQueue(draggedIndex, targetIndex);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const formatSec = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return '--:--';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <aside className={`w-80 sm:w-88 shrink-0 border-l flex flex-col h-full z-30 select-none animate-fade-in shadow-xl transition-colors ${
      isDark ? 'bg-[#0E1118] border-white/5 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
    }`}>
      {/* Header */}
      <div className={`p-3.5 px-4 border-b flex items-center justify-between ${
        isDark ? 'border-white/5' : 'border-slate-200'
      }`}>
        <div className="flex items-center space-x-2">
          <ListMusic size={16} className="text-orbis-500" />
          <h3 className="font-bold text-xs uppercase tracking-wider">
            Up Next
          </h3>
          <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
            isDark ? 'bg-white/10 text-slate-300' : 'bg-slate-100 text-slate-600'
          }`}>
            {queue.length}
          </span>
        </div>

        <div className="flex items-center space-x-1">
          {queue.length > 1 && (
            <button
              onClick={clearQueue}
              className={`p-1.5 rounded-full transition-colors ${
                isDark ? 'text-slate-400 hover:text-red-400 hover:bg-white/5' : 'text-slate-500 hover:text-red-600 hover:bg-slate-100'
              }`}
              title="Clear queue"
            >
              <Trash2 size={13} />
            </button>
          )}
          <button
            onClick={() => setIsQueueOpen(false)}
            className={`p-1.5 rounded-full transition-colors ${
              isDark ? 'text-slate-400 hover:text-white hover:bg-white/5' : 'text-slate-500 hover:text-black hover:bg-slate-100'
            }`}
            title="Close"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Queue Items */}
      <div className="flex-1 overflow-y-auto p-2.5 space-y-1.5 custom-scrollbar flex flex-col">
        {queue.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center opacity-60 select-none">
            <ListMusic size={28} className="mb-2" />
            <p className="text-xs font-semibold">Queue is empty</p>
            <p className="text-[11px] text-slate-400 mt-1 max-w-[200px]">
              Drag files or click Play Next on any video to build your list
            </p>
          </div>
        ) : (
          queue.map((item, index) => {
          const isCurrentlyPlaying = queueIndex === index;
          const isDragging = draggedIndex === index;
          const isOver = dragOverIndex === index;

          return (
            <div
              key={`${item.id}-${index}`}
              draggable
              onDragStart={e => handleDragStart(e, index)}
              onDragOver={e => handleDragOver(e, index)}
              onDrop={e => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
              className={`group relative flex items-center p-2 rounded-xl border transition-all duration-150 cursor-grab active:cursor-grabbing ${
                isCurrentlyPlaying
                  ? isDark
                    ? 'bg-white/10 border-white/20'
                    : 'bg-slate-100 border-slate-300'
                  : isDark
                    ? 'bg-white/3 hover:bg-white/6 border-white/5'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-100'
              } ${isDragging ? 'opacity-30 border-dashed border-orbis-500' : ''} ${
                isOver && !isDragging ? 'border-t-2 border-t-orbis-500' : ''
              }`}
            >
              {/* Drag Handle */}
              <div className="text-slate-400 group-hover:text-slate-300 mr-1.5 cursor-grab">
                <GripVertical size={14} />
              </div>

              {/* Thumbnail */}
              <div
                className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-slate-800 cursor-pointer"
                onClick={() => playMedia(item)}
              >
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                {isCurrentlyPlaying && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    {isPlaying ? (
                      <div className="flex items-end space-x-0.5 h-2.5">
                        <div className="w-0.5 bg-white animate-pulse h-2 rounded-full" />
                        <div className="w-0.5 bg-white animate-pulse h-3 rounded-full delay-75" />
                        <div className="w-0.5 bg-white animate-pulse h-1.5 rounded-full delay-150" />
                      </div>
                    ) : (
                      <Play size={10} className="fill-white text-white" />
                    )}
                  </div>
                )}
              </div>

              {/* Title & Info */}
              <div
                className="ml-2.5 flex-1 min-w-0 cursor-pointer"
                onClick={() => playMedia(item)}
              >
                <h4
                  className={`text-xs font-semibold truncate ${
                    isCurrentlyPlaying ? 'text-orbis-500' : isDark ? 'text-slate-200' : 'text-slate-800'
                  }`}
                  style={isCurrentlyPlaying ? { color: accentColor } : {}}
                >
                  {item.title}
                </h4>
                <div className="flex items-center space-x-1.5 text-[10px] text-slate-400 mt-0.5">
                  <span className="truncate max-w-24">{item.artist || 'Local'}</span>
                  <span>•</span>
                  <span>{formatSec(item.duration)}</span>
                </div>
              </div>

              {/* Nudge / Remove */}
              <div className="flex items-center space-x-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                {index > 0 && (
                  <button
                    onClick={() => reorderQueue(index, index - 1)}
                    className="p-1 rounded text-slate-400 hover:text-white"
                    title="Move Up"
                  >
                    <ChevronUp size={12} />
                  </button>
                )}
                {index < queue.length - 1 && (
                  <button
                    onClick={() => reorderQueue(index, index + 1)}
                    className="p-1 rounded text-slate-400 hover:text-white"
                    title="Move Down"
                  >
                    <ChevronDown size={12} />
                  </button>
                )}
                <button
                  onClick={() => removeFromQueue(index)}
                  className="p-1 rounded text-slate-400 hover:text-red-400"
                  title="Remove"
                >
                  <X size={12} />
                </button>
              </div>
            </div>
          );
        })
      )}
      </div>
    </aside>
  );
};
