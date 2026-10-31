import React, { useState } from 'react';
import { usePlayer } from '../context/PlayerContext';
import {
  GripVertical,
  X,
  Play,
  Trash2,
  ListMusic,
  PlusCircle,
  Volume2,
  ChevronUp,
  ChevronDown,
  Sparkles
} from 'lucide-react';

export const PlayNextQueue: React.FC = () => {
  const {
    queue,
    queueIndex,
    reorderQueue,
    removeFromQueue,
    clearQueue,
    playMedia,
    currentMedia,
    isPlaying,
    accentColor,
    isQueueOpen,
    setIsQueueOpen,
  } = usePlayer();

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

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
    <aside className="w-84 sm:w-96 flex-shrink-0 border-l border-white/5 bg-surface-low/95 backdrop-blur-2xl flex flex-col h-full z-30 select-none animate-fade-in shadow-2xl">
      {/* Queue Header */}
      <div className="p-4 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-black"
            style={{ backgroundColor: accentColor }}
          >
            <ListMusic size={16} />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white flex items-center space-x-1.5">
              <span>Up Next Queue</span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-slate-300">
                {queue.length}
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">Drag items to reorder priority</p>
          </div>
        </div>

        <div className="flex items-center space-x-1">
          {queue.length > 1 && (
            <button
              onClick={clearQueue}
              className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-red-400 transition-colors"
              title="Clear queue (keep playing)"
            >
              <Trash2 size={15} />
            </button>
          )}
          <button
            onClick={() => setIsQueueOpen(false)}
            className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            title="Close queue"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Queue Items List with Drag & Drop */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
        {queue.map((item, index) => {
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
              className={`group relative flex items-center p-2 rounded-2xl border transition-all duration-200 cursor-grab active:cursor-grabbing ${
                isCurrentlyPlaying
                  ? 'bg-surface-high border-white/20 shadow-md'
                  : 'bg-surface-mid/60 hover:bg-surface-mid border-white/5 hover:border-white/10'
              } ${isDragging ? 'opacity-40 scale-98 border-dashed border-white/40' : ''} ${
                isOver && !isDragging ? 'border-t-2 border-t-orange-400' : ''
              }`}
            >
              {/* Drag Handle */}
              <div className="p-1 text-slate-500 group-hover:text-slate-300 cursor-grab transition-colors">
                <GripVertical size={16} />
              </div>

              {/* Thumbnail with overlay status */}
              <div
                className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-surface-highest cursor-pointer group/thumb"
                onClick={() => playMedia(item)}
              >
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover/thumb:scale-110 transition-transform duration-300"
                />
                
                {isCurrentlyPlaying ? (
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center">
                    {isPlaying ? (
                      <div className="flex items-end space-x-0.5 h-3">
                        <div className="w-1 bg-white animate-pulse h-3 rounded-full" />
                        <div className="w-1 bg-white animate-pulse h-2 rounded-full delay-75" />
                        <div className="w-1 bg-white animate-pulse h-4 rounded-full delay-150" />
                      </div>
                    ) : (
                      <Play size={14} className="fill-white text-white" />
                    )}
                  </div>
                ) : (
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/thumb:opacity-100 flex items-center justify-center transition-opacity">
                    <Play size={14} className="fill-white text-white" />
                  </div>
                )}
              </div>

              {/* Item Info */}
              <div
                className="ml-3 flex-1 min-w-0 cursor-pointer"
                onClick={() => playMedia(item)}
              >
                <div className="flex items-center space-x-1.5">
                  <h4
                    className={`text-xs font-semibold truncate ${
                      isCurrentlyPlaying ? 'text-white' : 'text-slate-200 group-hover:text-white'
                    }`}
                    style={isCurrentlyPlaying ? { color: accentColor } : {}}
                  >
                    {item.title}
                  </h4>
                </div>
                <div className="flex items-center space-x-2 text-[11px] text-slate-400 mt-0.5">
                  <span className="truncate max-w-28">{item.artist || 'Unknown'}</span>
                  <span>•</span>
                  <span className="font-mono">{formatSec(item.duration)}</span>
                </div>
              </div>

              {/* Quick Queue Operations */}
              <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {/* Nudge Up */}
                {index > 0 && (
                  <button
                    onClick={() => reorderQueue(index, index - 1)}
                    className="p-1 rounded-md hover:bg-white/10 text-slate-400 hover:text-white"
                    title="Move Up"
                  >
                    <ChevronUp size={14} />
                  </button>
                )}
                {/* Nudge Down */}
                {index < queue.length - 1 && (
                  <button
                    onClick={() => reorderQueue(index, index + 1)}
                    className="p-1 rounded-md hover:bg-white/10 text-slate-400 hover:text-white"
                    title="Move Down"
                  >
                    <ChevronDown size={14} />
                  </button>
                )}
                {/* Remove */}
                <button
                  onClick={() => removeFromQueue(index)}
                  className="p-1 rounded-md hover:bg-white/10 text-slate-400 hover:text-red-400"
                  title="Remove from queue"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Active Playing Badge */}
              {isCurrentlyPlaying && (
                <div
                  className="w-1.5 h-6 rounded-full ml-1"
                  style={{ backgroundColor: accentColor }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Queue Footer Hint */}
      <div className="p-3 bg-surface-dim/80 border-t border-white/5 text-[11px] text-slate-400 text-center flex items-center justify-center space-x-2">
        <Sparkles size={12} className="text-orbis-400" />
        <span>Drop files anywhere to play next or now</span>
      </div>
    </aside>
  );
};
