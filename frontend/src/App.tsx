import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Casino from './pages/Casino';
import DiceGame from './pages/DiceGame';
import SlotsGame from './pages/SlotsGame';
import RouletteGame from './pages/RouletteGame';
import BlackjackGame from './pages/BlackjackGame';
import History from './pages/History';
import ProviderGames from './pages/ProviderGames';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/casino" replace />} />
        <Route path="/casino" element={<Casino />} />
        <Route path="/provider-games" element={<ProviderGames />} />
        <Route path="/dice" element={<DiceGame />} />
        <Route path="/slots" element={<SlotsGame />} />
        <Route path="/roulette" element={<RouletteGame />} />
        <Route path="/blackjack" element={<BlackjackGame />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </Layout>
  );
}

export default App;
