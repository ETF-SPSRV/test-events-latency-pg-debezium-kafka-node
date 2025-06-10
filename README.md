# postgres debezium_connect kafka node

## start

```sh
docker compose up -d
```

## pgsql

```sh
psql -U postgres -h localhost -d postgres
```

```sql
select * from test_events;
```

## tail kafka topic

```sh
kcat -b localhost:9093 -L|grep topic
```

```sh
kcat -b localhost:9093 -t test_events.public.test_events -C
```

## insert records

### prepare env

```sh
python3 -m venv venv
source ./venv/bin/activate
pip install --upgrade pip
pip install psycopg2-binary faker
```

### run inserts

```sh
python3 standard_test_events.py
python3 fast_test_events_generation.py
```

## backend logs

```sh
docker compose logs -f backend
```
