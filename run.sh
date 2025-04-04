#!/bin/bash

LOG_DIR="./logs"
LOG_FILE="$LOG_DIR/$(date '+%Y-%m-%d_%H-%M-%S').log"
mkdir -p "$LOG_DIR"
ls -1t "$LOG_DIR" | tail -n +5 | xargs -I {} rm -f "$LOG_DIR/{}"

echo "Script started at $(date)" >> "$LOG_FILE"

npm install >> "$LOG_FILE" 2>&1
node queryDB.js >> "$LOG_FILE" 2>&1
python3 output_to_json.py >> "$LOG_FILE" 2>&1
node pushToGcal.js >> "$LOG_FILE" 2>&1

echo -e "\nScript finished at $(date)" >> "$LOG_FILE"
