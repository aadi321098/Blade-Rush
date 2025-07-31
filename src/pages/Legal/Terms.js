import './Legal.css';
import FooterNav from '../../components/FooterNav';
import { Link } from 'react-router-dom';

function Terms() {
  return (
    <>
      <div className="legal-page">
        <h2>Terms of Service</h2>

        <p>
          By accessing or playing <strong>Blade Rush</strong>, developed by <strong>Aditya Games</strong>, you agree to the following terms:
        </p>

        <ul>
          <li>1. This game is provided for <strong>personal entertainment</strong> only. Commercial use is not permitted.</li>

          <li>2. You may <strong>not copy, modify, distribute, or resell</strong> any part of the game without written permission.</li>

          <li>3. All assets including code, graphics, audio, gameplay design, and UI are <strong>intellectual property</strong> of Aditya Games.</li>

          <li>4. We strive to provide a bug-free experience, but we are <strong>not liable</strong> for data loss, performance issues, or crashes caused by your device, browser, or system errors.</li>

          <li>5. Game settings and local scores are saved in your browser or device. Uninstalling or clearing storage will <strong>permanently erase</strong> your data.</li>

          <li>6. <strong>Premium and Tournament Features (Coming Soon):</strong>
            <ul>
              <li>• Users may optionally authenticate via <strong>Pi Network</strong> to participate in online tournaments.</li>
              <li>• Entry into tournaments may require a small Pi-based fee.</li>
              <li>• Leaderboards and score tracking will only include premium, authenticated users.</li>
              <li>• By joining a tournament, you agree to share your username and score publicly on the leaderboard.</li>
            </ul>
          </li>

          <li>7. We reserve the right to update these terms at any time. Continuing to use the app means you accept the current terms.</li>
        </ul>

        <p>
          For questions, feedback, or support, contact us at{" "}
          <a href="mailto:mail.adityagames@gmail.com">mail.adityagames@gmail.com</a>.
        </p>

        <div className="return-home">
          <Link to="/" className="home-link">← Return to Home</Link>
        </div>
      </div>

      <FooterNav />
    </>
  );
}

export default Terms;