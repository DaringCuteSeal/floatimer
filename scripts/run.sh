#!/bin/sh

set -e

echo "Migrating DB schema..."
node migrate-db.js

echo "Starting application..."
exec node build/index.js
