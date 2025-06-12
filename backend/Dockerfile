FROM node:alpine

LABEL org.opencontainers.image.source=https://github.com/ETF-SPSRV/test-events-latency-pg-debezium-kafka-node
LABEL org.opencontainers.image.description="A Node.js application for processing events with PostgreSQL, Debezium, and Kafka."
LABEL org.opencontainers.image.vendor="ETF SPSRV"
LABEL org.opencontainers.image.version=1.0.0
LABEL org.opencontainers.image.title="Test Events Latency Node.js App"
LABEL org.opencontainers.image.licenses=MIT

WORKDIR /app

COPY package.json ./

RUN npm install

COPY . .

CMD ["node", "index.js"]
