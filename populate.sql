-- 1. KREIRANJE TABELA

-- USERS (korisnici koji prave ponude)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username TEXT NOT NULL UNIQUE
);

-- AUCTIONS (aukcije na kojima se prave ponude)
CREATE TABLE auctions (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- BIDS (ponude koje korisnici daju na aukcijama)
CREATE TABLE bids (
    id SERIAL PRIMARY KEY,
    auction_id INT NOT NULL REFERENCES auctions(id),
    user_id INT NOT NULL REFERENCES users(id),
    bid_amount INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TOP BIDS (historija top ponuda po aukciji)
CREATE TABLE top_bids (
    id SERIAL PRIMARY KEY,
    auction_id INT NOT NULL,
    highest_bid INT NOT NULL,
    user_id INT NOT NULL,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE OR REPLACE FUNCTION update_top_bid()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if the new bid is the highest for this auction
    PERFORM 1 FROM top_bids
    WHERE auction_id = NEW.auction_id AND highest_bid >= NEW.bid_amount;

    -- If no record is found (i.e., the new bid is the highest), insert it into the top_bids table
    IF NOT FOUND THEN
        INSERT INTO top_bids (auction_id, highest_bid, user_id)
        VALUES (NEW.auction_id, NEW.bid_amount, NEW.user_id);
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER after_bid_insert
AFTER INSERT ON bids
FOR EACH ROW
EXECUTE FUNCTION update_top_bid();


-- Insert some sample users
INSERT INTO users (username) VALUES ('Alice'), ('Bob'), ('Mirza'), ('Ajla'), ('Nedim');

-- Insert an auction
INSERT INTO auctions (title, description) VALUES ('Art Auction', 'Auction for valuable art pieces'),
('Car Auction', 'Auction for classic cars'),
('Watch Auction', 'Auction for luxury watches'),
('Guitar Auction', 'Auction for vintage guitars');
('Vintage Sat', 'Omega Speedmaster iz 1972. godine'),
('Gitara Fender', 'Original Fender Stratocaster, kao nov');

-- Insert bids
INSERT INTO bids (auction_id, user_id, bid_amount) VALUES (1, 1, 100);
INSERT INTO bids (auction_id, user_id, bid_amount) VALUES (1, 2, 150);
INSERT INTO bids (auction_id, user_id, bid_amount) VALUES (1, 3, 200);
INSERT INTO bids (auction_id, user_id, bid_amount) VALUES (2, 1, 300);
INSERT INTO bids (auction_id, user_id, bid_amount) VALUES (2, 2, 250);
INSERT INTO bids (auction_id, user_id, bid_amount) VALUES (3, 1, 400);