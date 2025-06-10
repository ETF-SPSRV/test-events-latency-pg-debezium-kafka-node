CREATE TABLE test_events (
    id SERIAL PRIMARY KEY,
    message TEXT,
    trace_created_at TIMESTAMP DEFAULT now()
);

INSERT INTO test_events (message, trace_created_at)
VALUES ('Test message2', now());

-- CREATE TABLE users (
--     id SERIAL PRIMARY KEY,
--     username TEXT NOT NULL UNIQUE
-- );

-- CREATE TABLE auctions (
--     id SERIAL PRIMARY KEY,
--     title TEXT NOT NULL,
--     description TEXT,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- CREATE TABLE bids (
--     id SERIAL PRIMARY KEY,
--     auction_id INT NOT NULL REFERENCES auctions(id),
--     user_id INT NOT NULL REFERENCES users(id),
--     bid_amount INT NOT NULL,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- CREATE TABLE top_bids (
--     id SERIAL PRIMARY KEY,
--     auction_id INT NOT NULL,
--     highest_bid INT NOT NULL,
--     user_id INT NOT NULL,
--     recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- CREATE OR REPLACE FUNCTION update_top_bid()
-- RETURNS TRIGGER AS $$
-- BEGIN
--     PERFORM 1 FROM top_bids
--     WHERE auction_id = NEW.auction_id AND highest_bid >= NEW.bid_amount;

--     IF NOT FOUND THEN
--         INSERT INTO top_bids (auction_id, highest_bid, user_id)
--         VALUES (NEW.auction_id, NEW.bid_amount, NEW.user_id);
--     END IF;

--     RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql;


-- CREATE TRIGGER after_bid_insert
-- AFTER INSERT ON bids
-- FOR EACH ROW
-- EXECUTE FUNCTION update_top_bid();

-- INSERT INTO users (username) VALUES ('Alice'), ('Bob'), ('Mirza'), ('Ajla'), ('Nedim');

-- INSERT INTO auctions (title, description) VALUES ('Art Auction', 'Auction for valuable art pieces'),
-- ('Car Auction', 'Auction for classic cars'),
-- ('Watch Auction', 'Auction for luxury watches'),
-- ('Guitar Auction', 'Auction for vintage guitars'),
-- ('Vintage Sat', 'Omega Speedmaster iz 1972. godine'),
-- ('Gitara Fender', 'Original Fender Stratocaster, kao nov');

-- INSERT INTO bids (auction_id, user_id, bid_amount) VALUES (1, 1, 10);
-- INSERT INTO bids (auction_id, user_id, bid_amount) VALUES (1, 2, 15);
-- INSERT INTO bids (auction_id, user_id, bid_amount) VALUES (1, 3, 20);
-- INSERT INTO bids (auction_id, user_id, bid_amount) VALUES (2, 1, 30);
-- INSERT INTO bids (auction_id, user_id, bid_amount) VALUES (2, 2, 25);
-- INSERT INTO bids (auction_id, user_id, bid_amount) VALUES (3, 1, 40);
