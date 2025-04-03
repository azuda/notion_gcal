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

- notion triggers?
- ~~event uuid matching~~
- ~~allow editing existing events~~
- ~~auto cleanup old events~~
- ~~reduce api calls when pushing events to gcal~~
- ~~handle deleted events~~
- ~~fix single day events updating~~
- deploy to server as cron job / scheduled task
