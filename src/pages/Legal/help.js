// Help.jsx
import './Legal.css';
import FooterNav from '../../components/FooterNav';

function Help() {
  return (
    <>
      <div className="legal-page">
        <h2>🤝 Request for Help / Contribution</h2>
        <div className="content">
          <p>
            Hello Developers 👋,
          </p>

          <p>
            I am an independent developer working on <strong>Blade Rush</strong>, a free game project built with passion. Currently, I’m trying to improve and expand the app, but due to financial limitations, I’m seeking help from the developer community.
          </p>

          <p>
            If you have experience with <strong>React</strong> (frontend) and <strong>Node.js</strong> (backend), and would be willing to contribute — even a small part — it would mean a lot!
          </p>

          <h4>🛠️ What I need help with:</h4>
          <ul>
            <li>✔️ A clean <strong>Home Page</strong> with proper structure</li>
            <li>✔️ A <strong>Sign In page</strong> using <strong>Pi Network authentication</strong></li>
            <li>✔️ A <strong>Buy Premium</strong> page — where users can purchase using Pi coins</li>
            <li>✔️ Store data like: <br/>
              ▸ Username <br/>
              ▸ Premium purchase date <br/>
              ▸ Amount of Pi used <br/>
              ▸ Premium expiry logic (weekly/monthly) <br/>
              ▸ Firebase for data storage (MongoDB if needed for more secure payment IDs)
            </li>
            <li>✔️ Leaderboard to show Premium Users Weekly/Monthly</li>
            <li>✔️ <strong>Full commented code</strong> so I can understand and maintain it</li>
          </ul>

          <h4>📬 How to Help:</h4>
          <p>
            If you're interested in contributing, please email source code  at:<br/>
            <a className="email-link" href="mailto:mai.adityagames@gmail.com">
              mai.adityagames@gmail.com
            </a>
          </p>

          <p>
            Even small contributions or shared components will be highly appreciated 🙏. If you love open source, this is a great place to make a difference!
          </p>

          <p>
            Thank you for reading and considering. Let's build something great together! 💙
          </p>
        </div>
      </div>

      <FooterNav />
    </>
  );
}

export default Help;