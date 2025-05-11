@echo off
echo Creating QuickNotes folder structure...

REM Create folders
mkdir auth-service\routes
mkdir auth-service\models
mkdir auth-service\config
mkdir notes-service\routes
mkdir public-service\handlers
mkdir api-gateway

REM Create files
type nul > docker-compose.yml
type nul > README.md

type nul > auth-service\index.js
type nul > auth-service\.env
type nul > auth-service\routes\auth.js
type nul > auth-service\models\User.js
type nul > auth-service\config\passport.js

type nul > notes-service\app.py
type nul > notes-service\.env
type nul > notes-service\models.py
type nul > notes-service\routes\notes.py

type nul > public-service\main.go
type nul > public-service\handlers\public.go

REM Init gateway
cd api-gateway
npm init -y > nul
cd ..

echo ✅ Structure ready.
