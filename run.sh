#!/bin/bash

npm install
node queryDB.js
python3 output_to_json.py
node pushToGcal.js
