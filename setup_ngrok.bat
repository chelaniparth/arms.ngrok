@echo off
echo Setting up ARMS Workflow System (Ngrok Folder)...

echo Installing Frontend Dependencies...
cd frontend
call npm install
cd ..

echo Setup Complete!
echo Starting Application...
call start_app.bat
