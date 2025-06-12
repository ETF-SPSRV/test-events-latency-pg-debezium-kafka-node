import psycopg2
from psycopg2.extras import execute_batch
import random
import string
import time
from concurrent.futures import ThreadPoolExecutor

# Database configuration
DB_CONFIG = {
    "host": "localhost",
    "database": "postgres",
    "user": "postgres",
    "password": "postgres",
    "port": 5432
}

def random_message(length=20):
    return ''.join(random.choices(string.ascii_letters + string.digits, k=length))

def generate_event_batch(batch_size):
    events = []
    for _ in range(batch_size):
        message = f"MSG-{random_message()}"
        events.append((message,))
    return events

def insert_batch(event_batch):
    conn = psycopg2.connect(**DB_CONFIG)
    cur = conn.cursor()
    execute_batch(
        cur,
        "INSERT INTO test_events (message) VALUES (%s)",  # trace_created_at defaults to now()
        event_batch
    )
    conn.commit()
    cur.close()
    conn.close()

def run_test(total_events=10000, batch_size=100, workers=10):
    batches = total_events // batch_size
    start = time.time()

    with ThreadPoolExecutor(max_workers=workers) as executor:
        futures = []
        for _ in range(batches):
            event_batch = generate_event_batch(batch_size)
            futures.append(executor.submit(insert_batch, event_batch))

        for f in futures:
            f.result()

    duration = time.time() - start
    print(f"✅ Inserted {total_events} events in {duration:.2f} sec "
          f"({int(total_events/duration)} events/sec)")

if __name__ == "__main__":
    run_test()
