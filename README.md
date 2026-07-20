# Custom Notion -> Google Calendar Synchronization

Custom solution for pushing Notion database items to Google Calendar via API

## Requirements

- macOS or Windows
- NodeJS
- Python3
- GPG (Gpg4win on Windows)

## Instructions

macOS:

```bash
git clone https://github.com/azuda/notion_gcal
cd notion_gcal
gpg .env.gpg
./run.sh
```

Windows (PowerShell):

```powershell
git clone https://github.com/azuda/notion_gcal
cd notion_gcal
gpg .env.gpg
powershell -ExecutionPolicy Bypass -File .\run.ps1
```

Set up scheduled task with launchd (macOS):

```bash
# need to edit .plist to point to correct paths - use absolute paths
cp com.notiongcal.daemon.plist ~/Library/LaunchAgents
launchctl load ~/Library/LaunchAgents/com.notiongcal.daemon.plist
```

Set up scheduled task with Task Scheduler (Windows):

```powershell
# use absolute path to run.ps1
schtasks /create /tn "notion_gcal" /sc hourly /tr "powershell -NoProfile -ExecutionPolicy Bypass -File C:\path\to\notion_gcal\run.ps1"
```

## todo

- notion triggers?
- ~~event uuid matching~~
- ~~allow editing existing events~~
- ~~auto cleanup old events~~
- ~~reduce api calls when pushing events to gcal~~
- ~~handle deleted events~~
- ~~fix single day events updating~~
- ~~deploy to server as cron job / scheduled task~~
