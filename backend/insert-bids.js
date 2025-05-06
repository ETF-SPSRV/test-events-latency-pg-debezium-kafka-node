const { Pool } = require('pg');
const { faker } = require('@faker-js/faker');

const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: 'postgres',
    database: 'postgres',
    port: 5432,
});

const AUCTION_IDS = [1, 2, 3];
// const AUCTION_IDS = [1];
const USER_IDS = [1, 2, 3, 4, 5];

// We'll store current bid state in memory
const auctionState = {
    1: 100,
    2: 200,
    3: 150,
};

async function insertRealisticBid() {
    const auctionId = faker.helpers.arrayElement(AUCTION_IDS);
    const userId = faker.helpers.arrayElement(USER_IDS);

    // Simulate next bid as a slight increase
    const current = auctionState[auctionId];
    const increment = faker.number.int({ min: 5, max: 50 }); // more realistic increment
    const newBid = current + increment;

    // Save to DB
    await pool.query(
        'INSERT INTO bids (auction_id, user_id, bid_amount) VALUES ($1, $2, $3)',
        [auctionId, userId, newBid]
    );

    // Update local state
    auctionState[auctionId] = newBid;

    console.log(`💸 Auction #${auctionId}: $${newBid} by user ${userId}`);
}

async function runLoadTest(count = 5000, delay = 500) {
    for (let i = 0; i < count; i++) {
        await insertRealisticBid();
        await new Promise((res) => setTimeout(res, delay));
    }

    console.log('✅ Load test finished.');
    await pool.end();
}

runLoadTest();
