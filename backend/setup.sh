#!/bin/bash

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    python3 -m venv venv
fi

# Activate it if not already active
if [ "$VIRTUAL_ENV" != "$(pwd)/venv" ]; then
    source venv/bin/activate
fi

# Initialize the database only if it doesn't exist
if [ ! -f "data.db" ]; then
    python3 init_db.py
fi