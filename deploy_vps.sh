#!/bin/bash
echo "==================================================="
echo "       Deploying IT Academy to Linux VPS Server"
echo "==================================================="

# Update system & install dependencies
sudo apt-get update
sudo apt-get install -y python3-pip python3-venv nodejs npm docker.io docker-compose

# Build Frontend
echo "[1/3] Building React Frontend..."
cd Hitler/frontend
npm install
npm run build

# Setup Backend Virtual Environment & Install Requirements
echo "[2/3] Setting up Python Backend..."
cd ../Backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate

# Run with Gunicorn or Docker
echo "[3/3] Starting Server on Port 8000..."
gunicorn config.wsgi:application --bind 0.0.0.0:8000 --daemon

echo "Server is successfully running at http://YOUR_SERVER_IP:8000"
