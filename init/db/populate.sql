CREATE TABLE test_events (
    id SERIAL PRIMARY KEY,
    message TEXT,
    trace_created_at TIMESTAMPTZ DEFAULT now()
);

INSERT INTO test_events (message, trace_created_at)
VALUES ('First Test message', now());
