import './Legal.css';
import { Link } from 'react-router-dom';
import FooterNav from '../../components/FooterNav';

function About() {
  return (
    <>
      <div className="legal-page">
        <h2>About Blade Rush</h2>
        <div className="content">
          <p>
            Welcome to <strong>Blade Rush</strong> — a thrilling knife-throwing game that tests your precision and timing. Designed for players who enjoy quick reflex games with stylish visuals and engaging mechanics.
          </p>
          <p>
            Choose between two exciting modes: <strong>Rush Mode</strong> for infinite challenges and <strong>Level Mode</strong> for progressing through increasingly difficult stages. Unlock new <strong>knife styles</strong> and <strong>board themes</strong> to personalize your experience.
          </p>
          <p>
            Enjoy smooth animations, <strong>sound & vibration feedback</strong>, responsive gameplay, and an offline, ad-free experience — perfect for casual or competitive play.
          </p>
          <p>
            <strong>🏆 Tournaments Coming Soon:</strong> We're working on a competitive mode where you can join weekly tournaments, climb leaderboards, and earn exclusive rewards. Stay tuned!
          </p>
          <p>
            At <strong>Aditya Games</strong>, we respect your privacy. No data is tracked or uploaded. All scores and preferences are saved locally on your device.
            You can <Link to="/privacy">read our Privacy Policy here</Link>.
          </p>
          <p>
            Got feedback or feature requests? Contact us at
            {' '}
            <a href="mailto:mail.adityagames@gmail.com" className="email-link">
              mail.adityagames@gmail.com
            </a>
            . We'd love to hear from you!
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

export default About;