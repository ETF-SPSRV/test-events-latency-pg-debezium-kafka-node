const { Kafka } = require('kafkajs');
const fs = require('fs');

const kafka = new Kafka({
    clientId: 'latency-tester',
    brokers: ['<KAFKA-IP-ADDRESS/SERVICE>:9093']
});

const topic = 'test_events.public.test_events';
const consumer = kafka.consumer({ groupId: 'latency-measure-group' });

async function run() {
    await consumer.connect();
    await consumer.subscribe({ topic, fromBeginning: false });

    await consumer.run({
        eachMessage: async ({ message }) => {
            const value = JSON.parse(message.value.toString());
            console.log('Incoming Kafka message:', value);

            if (!value.trace_created_at) {
                console.warn('Missing trace_created_at in message:', value);
                return;
            }

            const createdAt = new Date(value.trace_created_at).getTime();
            if (isNaN(createdAt)) {
                console.warn('Invalid trace_created_at timestamp:', value.trace_created_at);
                return;
            }

            const now = Date.now();
            const latency = now - createdAt;

            //fs.appendFileSync('latency_raw.txt', `${latency}\n`);
            fs.appendFileSync('/app/logs/latency_raw.txt', `${latency}\n`);


            // console.log(`Latency: ${latency} ms | Message: ${value.message}`);
            console.log(latency);
        },
    });
}

run().catch(console.error);