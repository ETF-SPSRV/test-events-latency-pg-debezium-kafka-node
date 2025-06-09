import psycopg2
from psycopg2.extras import execute_batch
import random
import time
from concurrent.futures import ThreadPoolExecutor

AUCTION_IDS = [1]
USER_IDS = [1, 2, 3, 4, 5]
auction_state = {1: 100}

# DB config
DB_CONFIG = {
    "host": "157.230.31.228",
    "database": "postgres",
    "user": "postgres",
    "password": "postgres",
    "port": 5432
}

def generate_bid_batch(batch_size):
    bids = []
    for _ in range(batch_size):
        auction_id = random.choice(AUCTION_IDS)
        user_id = random.choice(USER_IDS)
        current = auction_state[auction_id]
        increment = random.randint(5, 50)
        new_bid = current + increment
        auction_state[auction_id] = new_bid
        bids.append((auction_id, user_id, new_bid))
    return bids

def insert_batch(bid_batch):
    conn = psycopg2.connect(**DB_CONFIG)
    cur = conn.cursor()
    execute_batch(cur, "INSERT INTO bids (auction_id, user_id, bid_amount) VALUES (%s, %s, %s)", bid_batch)
    conn.commit()
    cur.close()
    conn.close()

def run_fast_test(total_bids=100000, batch_size=100, workers=10):
    batches = total_bids // batch_size
    start = time.time()

    with ThreadPoolExecutor(max_workers=workers) as executor:
        futures = []
        for _ in range(batches):
            bid_batch = generate_bid_batch(batch_size)
            futures.append(executor.submit(insert_batch, bid_batch))

        for f in futures:
            f.result()  # wait for completion

    duration = time.time() - start
    print(f"✅ Inserted {total_bids} bids in {duration:.2f} sec "
          f"({int(total_bids/duration)} bids/sec)")

run_fast_test()
