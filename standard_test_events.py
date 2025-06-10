import psycopg2
import time
import random
from faker import Faker
from concurrent.futures import ThreadPoolExecutor

fake = Faker()

# Database configuration
DB_CONFIG = {
    "host": "localhost",
    "database": "postgres",
    "user": "postgres",
    "password": "postgres",
    "port": 5432
}

def insert_realistic_event():
    conn = psycopg2.connect(**DB_CONFIG)
    cur = conn.cursor()

    try:
        message = fake.sentence(nb_words=random.randint(5, 10))

        cur.execute(
            "INSERT INTO test_events (message) VALUES (%s)",  # trace_created_at defaults to now()
            (message,)
        )
        conn.commit()

        print(f"📨 Inserted: '{message}'")

    except Exception as e:
        print("❗ Error inserting:", e)
    finally:
        cur.close()
        conn.close()

def run_load_test(total_events=1000, concurrency=5, delay_per_insert=0.002):
    start = time.time()

    with ThreadPoolExecutor(max_workers=concurrency) as executor:
        futures = []
        for _ in range(total_events):
            futures.append(executor.submit(insert_realistic_event))
            time.sleep(delay_per_insert)  # Global throttle

        for f in futures:
            f.result()  # Wait for all to complete

    duration = time.time() - start
    print(f"✅ Inserted {total_events} events in {duration:.2f} sec "
          f"({int(total_events/duration)} events/sec)")

# if __name__ == "__main__":
#     run_load_test(total_events=5000, concurrency=10, delay_per_insert=0.003)

if __name__ == "__main__":
    run_load_test(total_events=500, concurrency=1, delay_per_insert=0.001)
