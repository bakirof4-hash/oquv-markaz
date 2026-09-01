$ErrorActionPreference = 'Stop'

$sdkPath = "$PWD\android-sdk"
$cmdlineToolsPath = "$sdkPath\cmdline-tools"
$latestPath = "$cmdlineToolsPath\latest"

if (-not (Test-Path $sdkPath)) {
    New-Item -ItemType Directory -Force -Path $latestPath | Out-Null
}

Write-Host "Downloading cmdline-tools..."
Invoke-WebRequest -Uri "https://dl.google.com/android/repository/commandlinetools-win-11076708_latest.zip" -OutFile "cmdline-tools.zip"

Write-Host "Extracting cmdline-tools..."
Expand-Archive -Path "cmdline-tools.zip" -DestinationPath "$cmdlineToolsPath\temp" -Force
Move-Item -Path "$cmdlineToolsPath\temp\cmdline-tools\*" -Destination "$latestPath\" -Force
Remove-Item -Recurse -Force "$cmdlineToolsPath\temp"
Remove-Item "cmdline-tools.zip"

Write-Host "Setting up JAVA_HOME..."
$env:JAVA_HOME = "$PWD\jdk17\jdk-17.0.10+7"

Write-Host "Accepting licenses and installing SDK packages..."
# Accept all licenses
$yesStr = "y`n" * 50
$yesStr | & "$latestPath\bin\sdkmanager.bat" --sdk_root=$sdkPath "platform-tools" "platforms;android-34" "build-tools;34.0.0"

Write-Host "Android SDK Setup Complete!"
