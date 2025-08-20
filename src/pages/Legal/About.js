import "./about.css";
import { Link } from "react-router-dom";
import FooterNav from "../../components/FooterNav";
import { useEffect, useState } from "react";

function About() {
  const quotes = [
    "⚔️ A true warrior sharpens his aim, not his knife.",
    "🔥 Miss one throw, and the board laughs at you.",
    "🎯 Precision is the real power-up.",
    "🚀 One knife, one chance — make it count.",
    "💀 Fear the blade, not the board."
  ];
  const [quote, setQuote] = useState("");

  useEffect(() => {
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  return (
    <>
      <div className="about-page">
        <h2 className="page-title">About <span className="glow">Blade Rush</span></h2>

        <section className="card intro">
          <h3>🎮 Introduction</h3>
          <p>
            Welcome to <strong>Blade Rush</strong> — made with ❤️ by <strong>Aditya Games</strong>.
          </p>
          <p>
            Blade Rush is available on both <strong>Mainnet</strong> and <strong>Testnet</strong>.
          </p>
          <ul>
            <li>🔗 Mainnet → <a href="https://blade-rush.vercel.app/" target="_blank" rel="noreferrer">blade-rush.vercel.app</a></li>
            <li>🔗 Testnet → <a href="https://blade-rush-pi.vercel.app/" target="_blank" rel="noreferrer">blade-rush-pi.vercel.app</a></li>
          </ul>
        </section>

        <section className="card login">
          <h3>🔑 Login & Premium</h3>
          <p>
            Go to <strong>Settings → Login</strong> (top button) and click <strong>Login with Pi</strong>.
            Sometimes it takes a little longer ⏳, so please wait.
          </p>
          <p>
            After login, your <strong>username</strong> and <span className="premium">Premium status ✨</span> will be visible.
            You can buy Premium for <strong>2π / 30 days</strong>, which allows you to save scores and join tournaments.
          </p>
          <p>
            If login issues occur, please read the <strong>Note</strong> on the login page.  
            Still stuck? Contact 📧 <a href="mailto:mail.adityagames@gmail.com">mail.adityagames@gmail.com</a>.
          </p>
        </section>

        <section className="card howtoplay">
          <h3>🕹️ How to Play</h3>

          <div className="subsection rush">
            <h4 className="rush-title">🔥 Rush Mode</h4>
            <p className="warning">⚠️ Note: If you want to <strong>save your score</strong>, please login and buy Premium <strong>before starting the game</strong>.</p>
            <p>
              Tap anywhere (blank area or knife) to throw a knife. Each successful throw gives <strong>+1 score</strong>.
            </p>
            <p>
              Clear all knives without collision → Next Level (speed increases ⚡).  
              Top shows current level, remaining knives, and score.
            </p>
            <p>
              Bottom buttons: <strong>Restart</strong> (reset to Level 1, score 0) and <strong>Exit</strong> (go back to Home).  
              On collision → Game Over Popup with options:
              <ul>
                <li>📊 Check Score</li>
                <li>💾 Save Score (Premium only)</li>
                <li>🔄 Restart</li>
                <li>🚪 Exit</li>
              </ul>
            </p>
            <p>
              Extra features: Change <strong>Board & Knife themes</strong> in the <strong>Shop</strong> 🛒.
            </p>
          </div>

          <div className="subsection level">
            <h4 className="level-title">⚡ Level Mode</h4>
            <p>
              Top shows <strong>Level</strong>, <strong>Remaining Knives</strong>, and <strong>Exit</strong> button.
              Goal: Hit all 🍎 apples on the rotating board.
            </p>
            <p>
              If knives run out or collision happens → Retry from same level.
            </p>
            <p>
              Bug or issue? Mail 📧 <a href="mailto:mail.adityagames@gmail.com">mail.adityagames@gmail.com</a> with details (attach screenshot if possible).
            </p>
          </div>
        </section>

        <section className="card score">
          <h3>📊 Score Section</h3>
          <p>
            Shows <strong>current + last 5 scores</strong> of Rush Mode, and <strong>highest level reached</strong> in Level Mode.
          </p>
          <p>
            Buttons: <strong>Retry</strong> → Start Rush Mode, <strong>Exit</strong> → Back to Home.
          </p>
        </section>

        <section className="card tournament">
          <h3>🏆 Tournament Section</h3>
          <p>
            Available for <span className="premium">Premium users ✨</span>.  
            Shows your <strong>username</strong>, <strong>premium status</strong>, current <strong>ranking</strong>, and previous week winners.
          </p>
          <p>
            Tournaments are weekly and refresh automatically at <strong>0 UTC</strong>.
          </p>
        </section>

        <section className="card shop">
          <h3>🛒 Shop Section</h3>
          <p>
            Select your favorite <strong>Board theme 🎨</strong> and <strong>Knife style 🔪</strong>.  
            Click <strong>Save</strong> to apply instantly.
          </p>
        </section>

        <section className="card aboutme">
          <h3>👨‍💻 About Me</h3>
          <p>
            Hey! I’m <strong>Aditya</strong> from India 🇮🇳.  
            I’m a beginner game developer 🎮 with a non-technical graduation background.  
            Building games is my passion ❤️  
          </p>
          <p>
            Contact → 📧 <a href="mailto:mail.adityagames@gmail.com">mail.adityagames@gmail.com</a>
          </p>
        </section>

        <div className="quote-box">
          <em>{quote}</em>
        </div>

        <div className="return-home">
          <Link to="/" className="home-link">← Return to Home</Link>
        </div>
      </div>

      <FooterNav />
    </>
  );
}

export default About;