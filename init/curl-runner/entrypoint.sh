#!/bin/bash

echo "Waiting for Kafka Connect to be fully ready..."

until [ "$(curl -s -o /dev/null -w '%{http_code}' http://connect:8083/connectors/)" -eq 200 ]; do
  echo "Still waiting for Kafka Connect REST API..."
  sleep 2
done

echo "Kafka Connect is fully ready!"

echo "Registering Debezium PostgreSQL connector..."
curl -i -X POST \
  -H "Accept:application/json" \
  -H "Content-Type:application/json" \
  http://connect:8083/connectors/ \
  -d @/config/register-postgres.json
