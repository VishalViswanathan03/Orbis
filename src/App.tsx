import React from 'react';
import { PlayerProvider, usePlayer } from './context/PlayerContext';
import { Header } from './components/Header';
import { Player } from './components/Player';
import { LibraryView } from './components/LibraryView';
import { PlayNextQueue } from './components/PlayNextQueue';
import { DropZoneOverlay } from './components/DropZoneOverlay';
import { EqualizerModal } from './components/EqualizerModal';
import { VideoEffectsModal } from './components/VideoEffectsModal';
import { StreamModal } from './components/StreamModal';

const AppContent: React.FC = () => {
  const { currentView } = usePlayer();

  return (
    <div className="flex flex-col h-screen w-screen bg-surface-lowest text-slate-100 overflow-hidden font-sans select-none">
      {/* Top Header & Navigation */}
      <Header />

      {/* Main Workspace (Player or Library + Sliding Play Next Queue) */}
      <main className="flex-1 flex overflow-hidden relative">
        <div className="flex-1 flex flex-col h-full overflow-hidden relative">
          {currentView === 'player' ? <Player /> : <LibraryView />}
        </div>

        {/* Play Next Queue Drawer */}
        <PlayNextQueue />
      </main>

      {/* Global Drag & Drop Overlay */}
      <DropZoneOverlay />

      {/* Modals */}
      <EqualizerModal />
      <VideoEffectsModal />
      <StreamModal />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <PlayerProvider>
      <AppContent />
    </PlayerProvider>
  );
};

export default App;
