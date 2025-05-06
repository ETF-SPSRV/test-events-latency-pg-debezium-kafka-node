import React from 'react';

const WinnerBar = ({ highestBid }) => (
  <div className="winner-bar">
    🏆 Highest Bid: <span className="highlight">${highestBid}</span>
  </div>
);

export default WinnerBar;
