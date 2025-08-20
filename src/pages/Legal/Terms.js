import './Legal.css';
import FooterNav from '../../components/FooterNav';
import { Link } from 'react-router-dom';

function Terms() {
  return (
    <>
      <div className="legal-page">
        <h2 className="page-title">
          📜 Terms of Service
        </h2>

        <div className="legal-content">
          <p>
            By accessing or playing <strong>Blade Rush</strong>, developed by <strong>Aditya Games</strong>, 
            you agree to the following terms:
          </p>

          <ol className="legal-list">
            <li>
              <strong>Personal Use Only:</strong>  
              This game is provided for <em>personal entertainment</em> only.  
              Commercial use, resale, or redistribution is strictly prohibited.
            </li>

            <li>
              <strong>No Unauthorized Modifications:</strong>  
              You may <u>not copy, modify, distribute, or resell</u> any part of the game 
              (including code, graphics, audio, or gameplay design) without written permission.
            </li>

            <li>
              <strong>Intellectual Property:</strong>  
              All assets, including design, mechanics, and UI, are the 
              <strong> intellectual property of Aditya Games</strong>.
            </li>

            <li>
              <strong>No Liability:</strong>  
              While we strive to deliver a smooth experience, we are not liable for  
              data loss, crashes, or performance issues caused by device/browser/system errors.
            </li>

            <li>
              <strong>Local Data:</strong>  
              Game settings, preferences, and local scores are stored on your device/browser.  
              Clearing storage or uninstalling will permanently erase this data.
            </li>

            <li>
              <strong>Premium & Tournament Features:</strong>  
              <ul>
                <li>🎮 <strong>Login with Pi Network</strong> is required for tournaments and premium features.</li>
                <li>💎 Premium users get access to <em>exclusive themes, score saving, and global leaderboards</em>.</li>
                <li>🏆 Tournament entry may require a small <strong>Pi-based fee</strong>.</li>
                <li>📊 By joining a tournament, you agree that your <strong>username & score</strong> may appear publicly on leaderboards.</li>
                <li>🔄 Leaderboards reset automatically every <strong>week at 0 UTC</strong>.</li>
              </ul>
            </li>

            <li>
              <strong>Updates to Terms:</strong>  
              We may update these terms from time to time.  
              Continued use of Blade Rush means you accept the latest version.
            </li>
          </ol>

          {/* ⚠️ Important Legal Note */}
          <div className="legal-note">
            ⚠️ <strong>Important Note:</strong>  
            All payments and authentication are processed securely through the official <strong>Pi Network SDK</strong>.  
            Blade Rush never accesses your wallet’s private keys or sensitive financial data.
          </div>

          <p className="legal-contact">
            For questions, feedback, or support, contact us at:  
            <br />
            📧 <a href="mailto:mail.adityagames@gmail.com">mail.adityagames@gmail.com</a>
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

export default Terms;