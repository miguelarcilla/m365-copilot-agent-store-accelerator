#!/bin/bash

# M365 Copilot Stock Agent - Quick Start Script

echo "🚀 Starting M365 Copilot Stock Agent Setup..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ and try again."
    exit 1
fi

echo "✅ Node.js found: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm and try again."
    exit 1
fi

echo "✅ npm found: $(npm --version)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies. Please check the error messages above."
    exit 1
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚙️  Creating .env file from template..."
    cp .env.example .env
    echo "📝 Please edit .env file with your configuration before starting the agent."
    echo "   - Add your MICROSOFT_APP_ID and MICROSOFT_APP_PASSWORD"
    echo "   - Optionally add STOCK_API_KEY for Alpha Vantage API"
fi

# Run tests
echo "🧪 Running tests..."
npm test

if [ $? -ne 0 ]; then
    echo "❌ Tests failed. Please fix any issues before proceeding."
    exit 1
fi

echo "✅ All tests passed!"

# Start the application
echo "🎯 Starting the M365 Copilot Stock Agent..."
echo "📍 The agent will be available at: http://localhost:3978/api/messages"
echo "🔍 Health check endpoint: http://localhost:3978/health"
echo ""
echo "🔧 To stop the agent, press Ctrl+C"
echo ""

npm start