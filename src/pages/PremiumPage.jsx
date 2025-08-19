// src/pages/PremiumPage.jsx
import React, { useState, useEffect } from "react";
import { API_BASE, APP_ID, } from "../config";
import "./PremiumPage.css";
import { useNavigate } from "react-router-dom";

const fmtDate = (s) => {
  try {
    return new Date(s).toLocaleString();
  } catch {
    return "-";
  }
};

const remText = (d) =>
  d > 0 ? `${d} day${d === 1 ? "" : "s"} left` : "expired";

const PremiumPage = () => {
  const [loggingIn, setLoggingIn] = useState(false);
  const [refreshing, setRefreshing] = useState(false); // ✅ new state
const [paymentStatus, setPaymentStatus] = useState("");
  const navigate = useNavigate();
  const [scopeWarning, setScopeWarning] = useState(false);

  const [loading, setLoading] = useState(true);
  const [piReady, setPiReady] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (window.Pi) {
      try {
        window.Pi.init({ version: "2.0", sandbox: false, appId: APP_ID });
        setPiReady(true);
      } catch (e) {
        setError("❌ Pi init failed. Check App ID & Allowed Origins.");
      }
    } else {
      setError("❌ Pi SDK not loaded. Open in Pi Browser.");
    }
    setLoading(false);

    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUser({
        uid: localStorage.getItem("uid"),
        username: storedUsername,
        walletAddress: localStorage.getItem("walletAddress"),
        premium: localStorage.getItem("premium") === "true",
        remainingDays: parseInt(localStorage.getItem("remainingDays")) || 0,
        transactions: JSON.parse(localStorage.getItem("transactions") || "[]"),
      });
    }
  }, []);

  async function fetchUser(uid) {
    const r = await fetch(`${API_BASE}/user/${uid}`);
    if (!r.ok) return null;
    return r.json();
  }

  async function login() {
    setError("");
    setLoggingIn(true);
    try {
      const scopes = ["username", "payments", "wallet_address"];
      const auth = await window.Pi.authenticate(scopes, (payment) =>
        console.log("Incomplete payment:", payment)
      );

      const res = await fetch(`${API_BASE}/auth/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken: auth.accessToken, user: auth.user }),
      });

      const data = await res.json();
      if (!res.ok || !data?.user) throw new Error("Auth verify failed");

      setUser(data.user);

      localStorage.setItem("uid", data.user.uid);
      localStorage.setItem("username", data.user.username);
      localStorage.setItem("walletAddress", data.user.walletAddress || "");
      localStorage.setItem("premium", data.user.premium ? "true" : "false");
      localStorage.setItem("remainingDays", data.user.remainingDays || 0);
      localStorage.setItem(
        "transactions",
        JSON.stringify(data.user.transactions || [])
      );
    } catch (e) {
      console.error(e);
      setError("Login failed. " + e.message);
    } finally {
      setLoggingIn(false);
    }
  }

  async function refresh() {
    if (!user?.uid) return;
    setRefreshing(true); // ✅ start refreshing
    const u = await fetchUser(user.uid);
    if (u?.user) {
      setUser(u.user);
      localStorage.setItem("uid", u.user.uid);
      localStorage.setItem("username", u.user.username);
      localStorage.setItem("walletAddress", u.user.walletAddress || "");
      localStorage.setItem("premium", u.user.premium ? "true" : "false");
      localStorage.setItem("remainingDays", u.user.remainingDays || 0);
      localStorage.setItem(
        "transactions",
        JSON.stringify(u.user.transactions || [])
      );
    }
    setRefreshing(false); // ✅ stop refreshing
  }

  async function buy(amount = 2) {
  setError("");
  setPaymentStatus("⏳ Processing payment...");
  try {
    const username = localStorage.getItem("username") || "";
    const paymentData = {
      amount,
      memo: `Premium 30 days${username ? ` (${username})` : ""}`, // <-- yahan username bracket me
      metadata: { plan: "premium_30d" },
    };

    const onReadyForServerApproval = async (paymentId) => {
      setPaymentStatus("🔄 Waiting for server approval...");
      await fetch(`${API_BASE}/payments/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId }),
      });
    };

    const onReadyForServerCompletion = async (paymentId, txid) => {
      setPaymentStatus("✅ Completing payment...");
      await fetch(`${API_BASE}/payments/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId, txid }),
      });
      await refresh();
      setPaymentStatus("🎉 Payment successful! Premium activated!");
      setTimeout(() => setPaymentStatus(""), 5000); // 5s me hide
    };

    await window.Pi.createPayment(paymentData, {
      onReadyForServerApproval,
      onReadyForServerCompletion,
      onCancel: (paymentId) => {
        console.log("Cancelled", paymentId);
        setPaymentStatus("⚠️ Payment cancelled by user.");
        setTimeout(() => setPaymentStatus(""), 5000);
      },
      onError: (err) => {
  console.error("Payment error", err);
  let msg = "❌ Payment failed: " + err.message;

  if (err.message.includes('payments" scope')) {
    setScopeWarning(true); // 🔑 warning flag set
  }

  setPaymentStatus(msg);
  setTimeout(() => setPaymentStatus(""), 7000);
},
      
    });
  } catch (e) {
    console.error(e);
    let msg = "❌ Payment failed: " + e.message;
  if (e.message.includes('payments" scope')) {
    setScopeWarning(true);
  }
  setPaymentStatus(msg);
  setTimeout(() => setPaymentStatus(""), 7000);
  }
}

  function logout() {
    setUser(null);
    localStorage.clear();
  }

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="premium-page">
      <h1 className="premium-title">💎 Pi Premium</h1>
      <button className="home-btn" onClick={() => navigate("/")}>
        Go Home
      </button>
      <p className="sub">2π / 30 days — simple subscription</p>

      {!user ? (
        <button
          className="btn login-btn"
          onClick={login}
          disabled={!piReady || loggingIn}
        >
          {loggingIn ? "⏳ Logging in..." : "🔐 Login with Pi"}
        </button>
      ) : (
        <div className="user-card">
          <div className="user-actions">
            <span className="pill">
              👤 {user.username} ({String(user.uid || "").slice(0, 6)}…)
            </span>
            <button className="btn ghost" onClick={refresh} disabled={refreshing}>
              {refreshing ? "🔄 Refreshing..." : "🔄 Refresh"}
            </button>
            <button className="btn ghost" onClick={logout}>
              🚪 Logout
            </button>
          </div>

          {error && <div className="error">{error}</div>}
{paymentStatus && <div className="payment-status">{paymentStatus}</div>}
          <div className="status-card">
            {user.premium && (user.remainingDays || 0) > 0 ? (
              <>
                <p>
                  🎉 Welcome <b className="ok">{user.username}</b>, you are
                  Premium!
                </p>
                <p>
                  Remaining: <b>{remText(user.remainingDays || 0)}</b>{" "}
                  {(user.remainingDays || 0) <= 3 ? " • expiring soon" : ""}
                </p>
                <p>
                  Wallet Address:{" "}
                  <b>
                    {user.walletAddress ||
                      user.wallet_address ||
                      localStorage.getItem("walletAddress") ||
                      "Not linked"}
                  </b>
                </p>

                <button className="btn success" onClick={() => buy(2)}>
                  Renew (2π)
                </button>
              </>
            ) : (
              <>
                <p>
                  ❌ Welcome <b className="bad">{user.username}</b>, you are not
                  Premium yet.
                </p>
                <p>
                  Get Premium for just <b>2π / 30 days</b>
                </p>
                <button className="btn primary" onClick={() => buy(2)}>
                  Buy Premium (2π)
                </button>
              </>
            )}
          </div>

          {/* Transactions table temporarily removed */}
          {/*
          <div className="transactions">
            ...
          </div>
          */}

          {/* ⚠️ Info note */}
          
          
          <div className="muted-note">
  ℹ️ If your premium status or info looks incorrect, please <b>Logout</b> and login again.
  {scopeWarning && (
    <>
      <br />
      ⚠️ <b>Important:</b> If you see "Cannot create a payment without payments scope",
      you must <b>Logout & re-login</b>.
    </>
  )}
</div>
        </div>
      )}
    </div>
  );
};

export default PremiumPage;
