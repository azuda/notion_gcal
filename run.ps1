# Windows equivalent of run.sh
$ErrorActionPreference = "Continue"
Set-Location -Path $PSScriptRoot

$LogDir = Join-Path $PSScriptRoot "logs"
New-Item -ItemType Directory -Path $LogDir -Force | Out-Null

# keep only the 6 most recent logs
Get-ChildItem -Path $LogDir -File |
  Sort-Object LastWriteTime -Descending |
  Select-Object -Skip 6 |
  Remove-Item -Force

$LogFile = Join-Path $LogDir ("{0}.log" -f (Get-Date -Format "yyyy-MM-dd_HH-mm-ss"))

# find a working python (skip the Microsoft Store alias stubs in WindowsApps)
$Python = $null
foreach ($name in "py", "python", "python3") {
  $cmd = Get-Command $name -ErrorAction SilentlyContinue
  if ($cmd -and $cmd.Source -notmatch "WindowsApps") {
    $Python = $name
    break
  }
}

"Script started at $(Get-Date)" | Out-File -FilePath $LogFile -Append

npm install *>> $LogFile
node queryDB.js *>> $LogFile
if ($Python) {
  & $Python output_to_json.py *>> $LogFile
} else {
  "ERROR: no Python installation found on PATH" | Out-File -FilePath $LogFile -Append
}
node pushToGcal.js *>> $LogFile

"`nScript finished at $(Get-Date)" | Out-File -FilePath $LogFile -Append
