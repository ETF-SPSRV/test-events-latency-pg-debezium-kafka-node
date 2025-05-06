import React, { useEffect, useRef } from 'react';

const getColor = (id) => {
    const colors = ['#ff6b6b', '#6bff95', '#6bc2ff', '#c96bff', '#ffe66b'];
    return colors[id % colors.length];
};

const BidList = ({ bids }) => {
    const prevLength = useRef(bids.length);

    useEffect(() => {
        prevLength.current = bids.length;
    }, [bids]);

    return (
        <div className="bid-list">
            {bids.map((bid, index) => (
                <div
                    key={bid.id}
                    className={`bid-bubble ${index === bids.length - 1 && bids.length === 3 ? 'puff-out' : ''}`}
                >
                    <span className="user" style={{ color: getColor(bid.userId) }}>
                        User {bid.userId}
                    </span>{' '}
                    bid <strong>${bid.amount}</strong> on auction #{bid.auctionId}
                    <div className="timestamp">{bid.timestamp}</div>
                </div>
            ))}
        </div>
    );
};

export default BidList;
