import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import FooterNav from './components/FooterNav';
import AudioPlayer from './components/AudioPlayer';

import Home from './pages/Home/Home';
import Settings from './pages/Settings/Settings';
import Shop from './pages/Shop/Shop';
import BoardShop from './pages/Shop/BoardShop';
import KnifeSelect from './pages/Shop/KnifeSelect'

import PvPSetup from './pages/Play/choosemode';
import RushMode from './pages/Play/RushMode';
import RushScorePage from './pages/Play/RushScorePage';

import About from './pages/Legal/About';
import Privacy from './pages/Legal/Privacy';
import Terms from './pages/Legal/Terms';
import Help from './pages/Legal/help';

import PremiumPage from "./pages/PremiumPage";
import Tournament from './pages/Tournament';
import TournamentLeaderboard from './pages/TournamentLeaderboard'; 

// âœ… Import the Knife Game page wrapper
import KnifePage from './KnifePage';

function App() {
  return (
    <Router>
      <Routes>
        {/* âœ… Knife route without header/footer/audio */}
        <Route path="/rush" element={<RushMode />} />
        
        <Route path="/level" element={<KnifePage />} />

        {/* âœ… All other pages with layout */}
        <Route
          path="*"
          element={
            <>
              <Header />
              <AudioPlayer />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/shop" element={<Shop />} />
                
                <Route path="/shop/board" element={<BoardShop />} />
                <Route path="/shop/knife" element={<KnifeSelect />} />
                
                <Route path="/score" element={<RushScorePage />} />
                
                <Route path="/play/choosemode" element={<PvPSetup />} />
                
                <Route path="/about" element={<About />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                
                <Route path="/help" element={<Help />} />
               <Route path="/premium" element={<PremiumPage />} />
                
                 <Route path="/tournament" element={<Tournament />} />
  <Route path="/tournament-leaderboard" element={<TournamentLeaderboard />} />
  
              </Routes>
              <FooterNav />
            </>
          }
        />

        {/* âŒ RushMode without layout */}
        
      </Routes>
    </Router>
  );
}

export default App;
