# Custom Notion -> Google Calendar Synchronization

Custom solution for pushing Notion database items to Google Calendar via API

## Requirements

- macOS
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

Set up scheduled task with launchd (macOS):

```bash
# use absolute paths
# need to edit .plist to point to correct paths
cp com.notiongcal.daemon.plist ~/Library/LaunchAgents
launchctl load ~/Library/LaunchAgents/com.notiongcal.daemon.plist
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
