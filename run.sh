#!/bin/bash

LOG_FILE="script.log"
> "$LOG_FILE"
echo "Script started at $(date)" >> "$LOG_FILE"

npm install >> "$LOG_FILE" 2>&1
node queryDB.js >> "$LOG_FILE" 2>&1
python3 output_to_json.py >> "$LOG_FILE" 2>&1
node pushToGcal.js >> "$LOG_FILE" 2>&1

echo "Script finished at $(date)" >> "$LOG_FILE"
