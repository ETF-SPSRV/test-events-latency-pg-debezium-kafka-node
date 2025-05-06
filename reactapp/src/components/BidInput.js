import React, { useState } from 'react';

const BidInput = () => {
    const [value, setValue] = useState('');

    const handleSubmit = async (e) => {
        if (e.key === 'Enter') {
            const amount = parseFloat(value);
            if (!isNaN(amount) && amount > 0) {
                try {
                    await fetch('/bid', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            auction_id: 1,
                            user_id: Math.floor(Math.random() * 5) + 1,
                            bid_amount: amount,
                        }),
                    });
                    setValue('');
                } catch (err) {
                    console.error('Error submitting bid:', err);
                }
            }
        }
    };

    return (
        <div className="input-area">
            <input
                type="number"
                placeholder="💰 Enter your bid..."
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={handleSubmit}
            />
        </div>
    );
};

export default BidInput;
