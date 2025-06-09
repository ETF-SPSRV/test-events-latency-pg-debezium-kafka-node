import psycopg2
import time
import random
from faker import Faker

fake = Faker()

AUCTION_IDS = [1]
USER_IDS = [1, 2, 3, 4, 5]
auction_state = {
    1: 100,
}

conn = psycopg2.connect(
    host="157.230.31.228",
    database="postgres",
    user="postgres",
    password="postgres",
    port=5432
)
cur = conn.cursor()

def insert_realistic_bid():
    auction_id = random.choice(AUCTION_IDS)
    user_id = random.choice(USER_IDS)
    current = auction_state[auction_id]
    increment = random.randint(5, 50)
    new_bid = current + increment

    cur.execute(
        "INSERT INTO bids (auction_id, user_id, bid_amount) VALUES (%s, %s, %s)",
        (auction_id, user_id, new_bid)
    )
    conn.commit()

    auction_state[auction_id] = new_bid
    print(f"💸 Auction #{auction_id}: ${new_bid} by user {user_id}")

# def run_load_test(count=5000, delay=0.001):
def run_load_test(count=5000, delay=1):    
    for _ in range(count):
        insert_realistic_bid()
        time.sleep(delay)

    cur.close()
    conn.close()
    print("✅ Load test finished.")

run_load_test()
