import './privacy.css';
import { Link } from 'react-router-dom';
import FooterNav from '../../components/FooterNav';

function Privacy() {
  return (
    <>
      <div className="privacy-page">
        <h2>🔒 Privacy Policy</h2>
        <div className="privacy-content">
          <p>
            At <strong>Aditya Games</strong>, your privacy and trust are very important to us. 
            <strong> Blade Rush</strong> is designed to deliver a secure, fun, and transparent experience for all users.
          </p>

          <ol className="privacy-list">
            <li>
              <strong>No Personal Data (General Gameplay):</strong>  
              During normal gameplay (<em>Level Mode</em> or <em>Rush Mode</em>), we do not collect, store, or transmit any personal data.  
              Preferences, scores, and selected themes (e.g., knife or board) are saved only on your device using local storage.
            </li>

            <li>
              <strong>Login & Premium:</strong>  
              If you choose to log in via <strong>Pi Network SDK</strong>, we securely collect and store:
              <ul>
                <li>👤 <strong>Username</strong></li>
                <li>🆔 <strong>User ID (UID)</strong></li>
                <li>💳 <strong>Wallet Address</strong></li>
              </ul>
              This information is required for <em>Premium purchase</em>, <em>score saving</em>, and <em>tournament participation</em>.  
              All data is stored securely and never shared with third parties.
            </li>

            <li>
              <strong>Payments:</strong>  
              All in-game payments (Premium subscription, tournament fees, etc.) are processed <strong>only through Pi Network</strong> using the official <strong>Pi SDK</strong>.  
              No other payment methods are accepted.
            </li>

            <li>
              <strong>Tournaments:</strong>  
              Tournaments are now live 🏆. To participate:
              <ul>
                <li>✅ Login with Pi Network is required.</li>
                <li>✅ Your <strong>username, UID, wallet address, and scores</strong> are securely stored in our backend.</li>
                <li>✅ Rankings and winners are displayed publicly in-game.</li>
                <li>✅ Weekly reset happens automatically at <strong>0 UTC</strong>.</li>
              </ul>
              Only authenticated and Premium users are eligible for global rankings.
            </li>

            <li>
              <strong>Advertisements:</strong>  
              Currently, Blade Rush has no ads.  
              In future updates, only <strong>Pi SDK Ads</strong> may be integrated (no third-party ad networks will be used).
            </li>

            <li>
              <strong>Data Deletion:</strong>  
              - Local data (themes, scores, preferences) is erased if you uninstall the app or clear browser storage.  
              - Tournament/login data can be removed by contacting us directly with your UID and wallet address.
            </li>
          </ol>

          {/* ✅ Data & Security Note */}
          <div className="privacy-note">
            ⚠️ <strong>Data & Security Note:</strong>  
            All <strong>Pi SDK authentication</strong> and <strong>transactions</strong> are handled by Pi’s secure system.  
            <u>Blade Rush never accesses your wallet’s private keys</u> or sensitive payment data.  
            We only receive your <em>username, UID, wallet address</em>, and game-related details required for Premium and tournaments.
          </div>

          <p className="privacy-contact">
            Your trust means everything to us. We will always prioritize transparency, fairness, and your privacy.  
            For any questions, issues, or data removal requests, contact us at:  
            <br />
            📧 <a href="mailto:mail.adityagames@gmail.com" className="email-link">
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