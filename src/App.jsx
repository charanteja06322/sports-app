import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/ezkora/Sidebar';
import { Topbar } from './components/ezkora/Topbar';
import { SportStrip } from './components/ezkora/SportStrip';
import { MobileBottomNav } from './components/ezkora/MobileBottomNav';
import HomePage from './pages/HomePage';
import PlayersPage from './pages/PlayersPage';
import GamesPage from './pages/GamesPage';
import GameDetailPage from './pages/GameDetailPage';
import ScoresPage from './pages/ScoresPage';
import MatchesPage from './pages/MatchesPage';
import EzkoraSettingsPage from './pages/EzkoraSettingsPage';
import LoginPage from './pages/LoginPage';
import { PostComposer } from './components/ezkora/PostComposer';
import { useEzkoraStore } from './store/ezkoraStore';

function AppLayout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const composerOpen = useEzkoraStore((s) => s.composerOpen);
  const closeComposer = useEzkoraStore((s) => s.closeComposer);

  return (
    <div className="ezkora-app ezkora-noise flex min-h-screen">
      {/* Sidebar for Desktop & Drawer for Mobile */}
      <div
        className={`fixed inset-y-0 left-0 z-40 transition-transform duration-200 lg:static lg:translate-x-0 ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar mobileClose={() => setMenuOpen(false)} />
      </div>

      {/* Mobile Backdrop */}
      {menuOpen && (
        <div
          role="button"
          tabIndex={0}
          aria-label="Close navigation overlay"
          onClick={() => setMenuOpen(false)}
          onKeyDown={(e) => { if (e.key === 'Escape') setMenuOpen(false); }}
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Main Content Area */}
      <div className="flex min-w-0 flex-1 flex-col pb-20 lg:pb-0">
        <Topbar openMenu={() => setMenuOpen(true)} />
        <SportStrip />
        <div className="min-w-0 flex-1">
          {children}
        </div>
        <MobileBottomNav />
      </div>

      {/* Global Post Composer */}
      {composerOpen && <PostComposer onClose={closeComposer} />}
    </div>
  );
}

export default function App() {
  const me = useEzkoraStore((s) => s.me);

  if (!me) {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <AppLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/players" element={<PlayersPage />} />
          <Route path="/matches" element={<MatchesPage />} />
          <Route path="/matches/:gameId" element={<GameDetailPage />} />
          <Route path="/games" element={<Navigate to="/matches" replace />} />
          <Route path="/games/:gameId" element={<GameDetailPage />} />
          <Route path="/scores" element={<Navigate to="/matches" replace />} />
          <Route path="/settings" element={<EzkoraSettingsPage />} />
          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppLayout>
    </Router>
  );
}

