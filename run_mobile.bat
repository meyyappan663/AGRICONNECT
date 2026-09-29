@echo off
echo Starting HackDude-Logistics Flutter Mobile App...
set "PATH=%PATH%;E:\flutter\bin"
set "FLUTTER_STORAGE_BASE_URL=https://storage.flutter-io.cn"
set "PUB_HOSTED_URL=https://pub.flutter-io.cn"
cd /d %~dp0mobile_app
flutter run -d chrome
pause
