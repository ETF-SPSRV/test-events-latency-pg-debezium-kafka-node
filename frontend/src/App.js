import React, { useEffect, useRef, useState } from 'react';
import WinnerBar from './components/WinnerBar';
import BidInput from './components/BidInput';
import BidList from './components/BidList';
import './styles.css';

const App = () => {
  const [bids, setBids] = useState([]);
  const [highestBid, setHighestBid] = useState(0);
  const socketRef = useRef(null);

  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const host = window.location.hostname;
    socketRef.current = new WebSocket(`${protocol}://${host}/ws`);

    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const after = data.after || data;

      const newBid = {
        id: Date.now(),
        userId: after.user_id,
        auctionId: after.auction_id,
        amount: after.highest_bid,
        timestamp: new Date(after.recorded_at / 1000).toLocaleTimeString(),
      };

      setBids((prev) => {
        const updated = [newBid, ...prev];
        return updated.slice(0, 3);
      });

      setHighestBid((prev) => (after.highest_bid > prev ? after.highest_bid : prev));
    };

    socketRef.current.onerror = (err) => {
      console.error('WebSocket error:', err);
    };

    socketRef.current.onclose = () => {
      console.warn('WebSocket closed');
    };

    return () => {
      if (socketRef.current) socketRef.current.close();
    };
  }, []);

  return (
    <div className="container">
      <h1>🔥 Live Auction</h1>
      <WinnerBar highestBid={highestBid} />
      <BidList bids={bids} />
      <BidInput />
    </div>
  );
};

export default App;
