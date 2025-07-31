import './Legal.css';
import { Link } from 'react-router-dom';
import FooterNav from '../../components/FooterNav';

function Privacy() {
  return (
    <>
      <div className="legal-page">
        <h2>Privacy Policy</h2>
        <div className="content">
          <p>
            At <strong>Aditya Games</strong>, your privacy is important to us. <strong>Blade Rush</strong> is designed to deliver a secure, fun, and transparent experience for all users.
          </p>

          <ol>
            <li><strong>No Personal Data Collection (General Use):</strong> We do not collect, store, or transmit any personal information during normal gameplay (Level Mode or Rush Mode).</li>

            <li><strong>Local Data Only:</strong> Your preferences, scores, and selected themes (e.g., knife or board) are saved only on your device using local storage. No cloud syncing or third-party storage is used.</li>

            <li><strong>No Internet Required:</strong> The game works fully offline. However, some sounds or images may not load on the first launch if no internet is available.</li>

            <li><strong>No Ads or Tracking:</strong> Blade Rush does not use cookies, analytics, or advertising services. Your gameplay remains private and ad-free.</li>

            <li><strong>Data Deletion:</strong> If you uninstall the app or clear your browser storage, all saved data (scores, progress, preferences) will be permanently removed.</li>

            <li><strong>Future Tournament Mode (Coming Soon):</strong> When our online tournament feature launches:
              <ul>
                <li>✅ We will ask for a username (via Pi Network authentication) to identify your scores on the leaderboard.</li>
                <li>✅ Scores submitted for tournaments will be saved in our secure backend to enable competition and rewards.</li>
                <li>✅ Participation may require a small entry fee paid using <strong>Pi Network</strong> (no other payments will be accepted).</li>
                <li>✅ Only authenticated and premium users will appear in global rankings.</li>
                <li>✅ You will always have control over what data you share and can opt-out of tournaments.</li>
              </ul>
            </li>
          </ol>

          <p>
            Your trust means everything to us. We promise never to misuse your data or compromise your privacy. If you have any questions or suggestions, feel free to reach us at:
            <br />
            <a href="mailto:mail.adityagames@gmail.com" className="email-link">
              mail.adityagames@gmail.com
            </a>
          </p>

          <div className="return-home">
            <Link to="/" className="home-link">← Return to Home</Link>
          </div>
        </div>
      </div>

      <FooterNav />
    </>
  );
}

export default Privacy;