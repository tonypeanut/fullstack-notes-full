#!/bin/bash

set -e  # Stop the script if any error occurs

echo "Starting setup..."

# Define environment variables for the backend
export SECRET_KEY="secretkeyisverysecret"
export FRONTEND_URL="http://localhost:3000"

# Backend setup
echo "Setting up backend..."
cd backend

# Create and activate the virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Migrate the database
echo "Migrating database..."
flask db upgrade || flask db init && flask db migrate && flask db upgrade && flask create-default-user

# Start the backend
echo "Starting backend..."
FLASK_APP=app FLASK_ENV=development flask run &

# Go back to the root directory
deactivate
cd ..

# Define environment variables for the frontend
export REACT_APP_API_BASE_URL="http://localhost:5000"

# Frontend setup
echo "Setting up frontend..."
cd frontend

# Install frontend dependencies
npm install

# Start the frontend
echo "Starting frontend..."
npm start &

echo "Setup complete! Visit http://localhost:3000 to view the app."
