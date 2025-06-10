const { Kafka } = require('kafkajs');

const kafka = new Kafka({
    clientId: 'latency-tester',
    brokers: ['kafka:9092']
});

const topic = 'test_events.public.test_events';
const consumer = kafka.consumer({ groupId: 'latency-measure-group' });

async function run() {
    await consumer.connect();
    await consumer.subscribe({ topic, fromBeginning: true });

    await consumer.run({
        eachMessage: async ({ message }) => {
            const value = JSON.parse(message.value.toString());
            const createdAt = new Date(value.trace_created_at).getTime();
            const now = Date.now();
            const latency = now - createdAt;

            console.log(`Latency: ${latency} ms | Message: ${value.message}`);
        },
    });
}

run().catch(console.error);
