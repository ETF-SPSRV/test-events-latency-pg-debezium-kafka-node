const express = require('express');
const { Kafka } = require('kafkajs');
const cors = require('cors');
const pool = require('./db');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.post('/bid', async (req, res) => {
    const { auction_id, user_id, bid_amount } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO bids (auction_id, user_id, bid_amount, created_at)
             VALUES ($1, $2, $3, NOW()) RETURNING *`,
            [auction_id, user_id, bid_amount]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'DB insert failed' });
    }
});


let latestHighestBid = null;

const WebSocket = require('ws');

// Kafka configuration
const kafka = new Kafka({
    clientId: 'node-backend',
    brokers: ['kafka:9092'], // Adjust to your Kafka brokers
});

const consumer = kafka.consumer({ groupId: 'auction-consumer-group' });

// WebSocket server setup
const wss = new WebSocket.Server({ port: 5001 }); // WebSocket server running on port 5000

// This will store the connected WebSocket clients
let clients = [];

// When a WebSocket client connects
wss.on('connection', (ws) => {
    console.log('New WebSocket client connected');
    clients.push(ws);

    // When the WebSocket client disconnects
    ws.on('close', () => {
        clients = clients.filter(client => client !== ws);
    });
});

// Function to send messages to all connected WebSocket clients
function sendToClients(message) {
    clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
}

// Kafka consumer to consume messages from the Kafka topic
async function consume() {
    await consumer.connect();
    //   await consumer.subscribe({ topic: 'auction-consumer-group', fromBeginning: true });
    await consumer.subscribe({ topic: 'auction.public.top_bids', fromBeginning: true });

    console.log('Kafka consumer connected to topic');

    // Start consuming messages from Kafka
    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            try {
                const rawValue = message.value.toString();
                const parsed = JSON.parse(rawValue);

                const payload = parsed?.payload;

                if (payload) {
                    console.log('🟢 Payload:', payload);
                    //             // Send the message to WebSocket clients in real-time
                    // sendToClients(payload.value());
                    sendToClients(JSON.stringify(payload));

                } else {
                    console.log('⚪ No "payload" field in message');
                }

            } catch (err) {
                console.error('❌ Error parsing message:', err.message);
            }
        }
    });
}


// API to get the latest highest bid
app.get('/api/highest-bid', (req, res) => {
    if (latestHighestBid) {
        res.json(latestHighestBid);
    } else {
        res.status(404).json({ message: 'No bids yet' });
    }
});

app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
    // Start consuming from Kafka
    consume().catch(console.error);
});