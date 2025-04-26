# debezium

## start

```sh
docker compose up -d
```

## register pgsql

```sh
curl -i -X POST -H "Accept:application/json" -H  "Content-Type:application/json" http://localhost:8083/connectors/ -d @register-postgres.json
```

```sh
kcat -b localhost:9093 -L|grep topic
```

## populate db

```sh
psql -U postgres -h localhost -d postgres
```

```sql
-- Check the top_bids table to see the highest bid for auction 1
SELECT * FROM top_bids WHERE auction_id = 1;
```


## tail kafka topic

```sh
kcat -b localhost:9093 -t auction.public.top_bids -C
```