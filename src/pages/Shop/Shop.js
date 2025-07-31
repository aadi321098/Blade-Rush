import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Shop.css'; // ✅ make sure this exists

function Shop() {
  const navigate = useNavigate();

  return (
    <div className="shop-wrapper">
      <h1 className="shop-title">🎨 Rush Mode Shop</h1>

      <div className="shop-options">
        <div className="shop-card" onClick={() => navigate("/shop/board")}>
          <h2>🌀 Choose Board Theme</h2>
          <p>Select your favorite board design</p>
        </div>

        <div className="shop-card" onClick={() => navigate("/shop/knife")}>
          <h2>🗡️ Choose Knife Style</h2>
          <p>Customize your knife appearance</p>
        </div>
      </div>
    </div>
  );
}

export default Shop;