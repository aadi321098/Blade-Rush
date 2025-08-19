import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Tournament.css";

const API_BASE = "https://score-bac.onrender.com"; // 🔒 hardcoded per your request

const getLocal = (k, def = null) => {
  try { return localStorage.getItem(k) ?? def; } catch { return def; }
};

const pretty = (n) => (n || n === 0) ? n.toLocaleString() : "-";

function nextWeekEndUTC() {
  // Tournament ends every Sunday 23:59:59 UTC
  const now = new Date();
  const day = now.getUTCDay(); // 0..6 (Sun..Sat)
  const diffToSunday = (7 - day) % 7; // days until Sunday
  const end = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate() + diffToSunday,
    23, 59, 59, 999
  ));
  // if already past this week's end, bump to next week
  if (end < now) end.setUTCDate(end.getUTCDate() + 7);
  return end;
}

const useCountdown = () => {
  const [target, setTarget] = useState(nextWeekEndUTC());
  const [left, setLeft] = useState(target - Date.now());

  useEffect(() => {
    const t = setInterval(() => {
      const ms = target - Date.now();
      if (ms <= 0) {
        setTarget(nextWeekEndUTC());
        setLeft(nextWeekEndUTC() - Date.now());
      } else setLeft(ms);
    }, 1000);
    return () => clearInterval(t);
  }, [target]);

  const d = Math.floor(left / (1000 * 60 * 60 * 24));
  const h = Math.floor((left / (1000 * 60 * 60)) % 24);
  const m = Math.floor((left / (1000 * 60)) % 60);
  const s = Math.floor((left / 1000) % 60);
  return { d, h, m, s };
};

const rankClass = (rank) => {
  if (rank === 1) return "rank rank-gold";
  if (rank === 2) return "rank rank-silver";
  if (rank === 3) return "rank rank-bronze";
  return "rank";
};

const Tournament = () => {
  const navigate = useNavigate();

  // Local auth-ish info
  const uid = getLocal("uid", "");
  const username = getLocal("username", "Guest");
  const isPremium = (getLocal("premium", "false") === "true");

  // State
  const [loading, setLoading] = useState(true);
  const [loadingPrev, setLoadingPrev] = useState(true);
  const [error, setError] = useState("");
  const [lb, setLb] = useState([]);              // current leaderboard
  const [prevWinners, setPrevWinners] = useState([]); // previous week winners
  const [refreshing, setRefreshing] = useState(false);

  // Countdown
  const { d, h, m, s } = useCountdown();

  const fetchJSON = async (url, opts) => {
    const ctrl = new AbortController();
    const id = setTimeout(() => ctrl.abort(), 10000);
    try {
      const r = await fetch(url, { ...opts, signal: ctrl.signal });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(data?.error || data?.message || `HTTP ${r.status}`);
      return data;
    } finally {
      clearTimeout(id);
    }
  };

  const loadLeaderboard = async () => {
    setError("");
    setLoading(true);
    try {
      const data = await fetchJSON(`${API_BASE}/scores/leaderboard`);
      setLb(Array.isArray(data.leaderboard) ? data.leaderboard : []);
    } catch (e) {
      setError(String(e.message || e));
    } finally {
      setLoading(false);
    }
  };

  const loadPrevWinners = async () => {
    setLoadingPrev(true);
    try {
      // If you later add a real endpoint in backend, keep this:
      // GET /scores/leaderboard?period=prev
      const data = await fetchJSON(`${API_BASE}/scores/leaderboard?period=prev`);
      const list = Array.isArray(data.leaderboard) ? data.leaderboard : [];
      setPrevWinners(list.slice(0, 3));
    } catch {
      // graceful fallback: take current leaderboard as “previous” placeholder (or empty)
      setPrevWinners([]);
    } finally {
      setLoadingPrev(false);
    }
  };

  useEffect(() => {
    loadLeaderboard();
    loadPrevWinners();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadLeaderboard();
    setRefreshing(false);
  };

  // Add rank index & computed flags
  const withRanks = useMemo(() => {
    return lb
      .map((row, idx) => ({
        ...row,
        _rank: idx + 1,
        _isYou: uid && row.uid === uid
      }));
  }, [lb, uid]);

  const yourRow = useMemo(() => withRanks.find(r => r._isYou), [withRanks]);

  return (
    <div className="tournament-page">
      {/* Top bar */}
      <div className="topbar">
        <div className="left">
          <button className="btn ghost" onClick={() => navigate("/")}>← Home</button>
        </div>
        <div className="center">
          <h1 className="title">🏆 Weekly Tournament</h1>
          <div className="rewards">
            <span className="badge gold">1st: 5π</span>
            <span className="badge silver">2nd: 3π</span>
            <span className="badge bronze">3rd: 1π</span>
          </div>
        </div>
        <div className="right">
          <div className="userchip">
            <span className="uname">👤 {username}</span>
            {isPremium
              ? <span className="premium ok">Premium</span>
              : <span className="premium no">Free</span>}
          </div>
          <button className="btn premium" onClick={() => navigate("/premium")}>💎 Go to Premium</button>
        </div>
      </div>

      {/* Countdown */}
      <div className="countdown">
        <div className="glass small">
          <div className="count-title">Ends in (UTC)</div>
          <div className="digits">
            <div><b>{d}</b><span>days</span></div>
            <div><b>{h.toString().padStart(2, "0")}</b><span>hrs</span></div>
            <div><b>{m.toString().padStart(2, "0")}</b><span>min</span></div>
            <div><b>{s.toString().padStart(2, "0")}</b><span>sec</span></div>
          </div>
        </div>

        {yourRow ? (
          <div className="glass small yourbox">
            <div className="count-title">Your Position</div>
            <div className="youline">
              <span className={rankClass(yourRow._rank)}>{yourRow._rank}</span>
              <span className="you-name">{yourRow.username || "You"}</span>
              <span className="you-score">{pretty(yourRow.score)} pts</span>
            </div>
          </div>
        ) : (
          <div className="glass small yourbox">
            <div className="count-title">Your Position</div>
            <div className="youline you-empty">
              <span>Play & save a score to appear here.</span>
            </div>
          </div>
        )}
      </div>

      {/* Leaderboard */}
      <div className={`glass board ${!isPremium ? "blurred" : ""}`}>
        <div className="board-head">
          <h2>Leaderboard (Top 50)</h2>
          <div className="actions">
            <button className="btn" onClick={onRefresh} disabled={refreshing}>
              {refreshing ? "Refreshing…" : "Refresh"}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="loading">Loading leaderboard…</div>
        ) : error ? (
          <div className="error">⚠️ {error}</div>
        ) : withRanks.length === 0 ? (
          <div className="empty">No scores yet. Be the first!</div>
        ) : (
          <div className="table-wrap">
            <table className="board-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>User</th>
                  <th className="right">Score</th>
                  <th className="hide-sm">Updated</th>
                </tr>
              </thead>
              <tbody>
                {withRanks.map((r) => (
                  <tr key={r.uid} className={r._isYou ? "me" : ""}>
                    <td><span className={rankClass(r._rank)}>{r._rank}</span></td>
                    <td className="usercell">
                      <span className="avatar">{(r.username || "?").slice(0,1).toUpperCase()}</span>
                      <span className="uname">{r.username || "Unknown"}</span>
                    </td>
                    <td className="right">{pretty(r.score)}</td>
                    <td className="hide-sm">{r.updatedAt ? new Date(r.updatedAt._seconds ? r.updatedAt._seconds * 1000 : r.updatedAt).toLocaleString() : "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!isPremium && (
          <div className="upgrade-overlay">
            <div className="overlay-card">
              <h3>Premium required</h3>
              <p>Only Premium users can save scores & join the tournament.</p>
              <button className="btn premium" onClick={() => navigate("/premium")}>
                Upgrade to Premium
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Previous week winners */}
      <div className="glass winners">
        <h2>Previous Week Winners</h2>
        {loadingPrev ? (
          <div className="loading">Loading…</div>
        ) : prevWinners.length === 0 ? (
          <div className="empty">No data yet.</div>
        ) : (
          <ol className="winners-list">
            {prevWinners.slice(0, 3).map((w, i) => (
              <li key={w.uid || i} className={`w${i+1}`}>
                <span className={rankClass(i+1)}>{i+1}</span>
                <span className="wname">{w.username || "Unknown"}</span>
                <span className="wscore">{pretty(w.score)} pts</span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
};

export default Tournament;