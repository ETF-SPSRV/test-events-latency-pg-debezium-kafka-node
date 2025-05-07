# debezium

## start

```sh
docker compose up -d
```

## pgsql

```sh
psql -U postgres -h localhost -d postgres
```

## insert bids

```sh
npm i
node insert-bids.js
```

## tail kafka topic

```sh
kcat -b localhost:9093 -L|grep topic
```

```sh
kcat -b localhost:9093 -t auction.public.top_bids -C
```
