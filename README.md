# Custom Notion -> Google Calendar Synchronization

Custom solution for pushing Notion database items to Google Calendar via API

## Requirements

- NodeJS
- Python3
- GPG

## Instructions

```bash
git clone https://github.com/azuda/notion_gcal
cd notion_gcal
gpg .env.gpg
./run.sh
```

## todo

- notion triggers
- event uuid matching
- delete / edit to match notion db
- auto cleanup old events
- deploy to server as cron job / scheduled task
