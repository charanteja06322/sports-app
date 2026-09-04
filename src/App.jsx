import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { SportProvider } from './context/SportContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import TeamsPage from './pages/TeamsPage';
import CreateTeamPage from './pages/CreateTeamPage';
import TeamDetailPage from './pages/TeamDetailPage';
import FriendsPage from './pages/FriendsPage';
import SettingsPage from './pages/SettingsPage';
import MatchesPage from './pages/MatchesPage';
import NotFoundPage from './pages/NotFoundPage';
import LoadingSpinner from './components/LoadingSpinner';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <SportProvider>
            <div className="App">
              <Header />
              <main>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/teams" element={<TeamsPage />} />
                  <Route path="/teams/create" element={<CreateTeamPage />} />
                  <Route path="/teams/:teamId" element={<TeamDetailPage />} />
                  <Route path="/friends" element={<FriendsPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="/matches" element={<MatchesPage />} />
                  <Route path="/matches/create" element={<MatchesPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </SportProvider>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
