import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/aervo/Sidebar';
import { Topbar } from './components/aervo/Topbar';
import { SportStrip } from './components/aervo/SportStrip';
import { MobileBottomNav } from './components/aervo/MobileBottomNav';
import HomePage from './pages/HomePage';
import PlayersPage from './pages/PlayersPage';
import GamesPage from './pages/GamesPage';
import GameDetailPage from './pages/GameDetailPage';
import ScoresPage from './pages/ScoresPage';
import EzkoraSettingsPage from './pages/EzkoraSettingsPage';

function AppLayout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="ezkora-app aervo-app ezkora-noise aervo-noise flex min-h-screen">
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
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/players" element={<PlayersPage />} />
          <Route path="/games" element={<GamesPage />} />
          <Route path="/games/:gameId" element={<GameDetailPage />} />
          <Route path="/scores" element={<ScoresPage />} />
          <Route path="/settings" element={<EzkoraSettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppLayout>
    </Router>
  );
}

