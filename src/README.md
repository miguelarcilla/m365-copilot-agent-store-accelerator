# M365 Copilot Stock Price Agent

A Microsoft 365 Copilot Agent that provides real-time stock price information for companies mentioned in user messages. This agent demonstrates how to extend Microsoft 365 Copilot with custom functionality.

## Features

- **Intelligent Company Detection**: Automatically detects company names and stock symbols in user messages
- **Real-time Stock Data**: Fetches current stock prices, changes, and trading information
- **Rich Responses**: Displays stock information using Adaptive Cards with visual indicators
- **Fallback Support**: Works with mock data when external APIs are unavailable
- **Caching**: Implements intelligent caching to reduce API calls and improve performance

## Supported Companies

The agent recognizes major companies including:
- **Technology**: Microsoft (MSFT), Apple (AAPL), Google/Alphabet (GOOGL), Amazon (AMZN), Meta (META), Tesla (TSLA), NVIDIA (NVDA)
- **Financial**: JPMorgan (JPM), Visa (V), Mastercard (MA), Goldman Sachs (GS)
- **Consumer**: Walmart (WMT), Disney (DIS), Coca-Cola (KO), Nike (NKE), McDonald's (MCD)
- And many more...

## Quick Start

### Prerequisites

- Node.js 16+ 
- Microsoft Bot Framework registration
- Alpha Vantage API key (optional - falls back to mock data)

### Installation

1. **Clone and navigate to the src directory**:
   ```bash
   cd src
   npm install
   ```

2. **Configure environment variables**:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   MICROSOFT_APP_ID=your_app_id_here
   MICROSOFT_APP_PASSWORD=your_app_password_here
   STOCK_API_KEY=your_alpha_vantage_api_key_here
   PORT=3978
   ```

3. **Start the application**:
   ```bash
   npm start
   ```
   
   For development with auto-restart:
   ```bash
   npm run dev
   ```

## Usage Examples

Users can interact with the agent by mentioning companies in various ways:

- **Company Names**: "What's the price of Microsoft stock?"
- **Stock Symbols**: "How is AAPL doing today?"
- **Multiple Companies**: "Compare Tesla and Ford performance"
- **Casual Mentions**: "I heard Apple released new products"

The agent will automatically detect relevant companies and respond with current stock information.

## API Integration

### Alpha Vantage API (Recommended)

1. Sign up at [Alpha Vantage](https://www.alphavantage.co/support/#api-key)
2. Get your free API key
3. Add to `.env` file: `STOCK_API_KEY=your_key_here`

### Mock Data Mode

If no API key is provided, the agent will use realistic mock data for demonstration purposes.

## Architecture

```
src/
├── bot/
│   └── stockBot.js          # Main bot logic and message handling
├── services/
│   └── stockService.js      # Stock data fetching and caching
├── utils/
│   └── companyDetector.js   # Company name and symbol detection
├── index.js                 # Express server and bot framework setup
└── package.json             # Dependencies and scripts
```

## Key Components

### StockBot (`bot/stockBot.js`)
- Main bot activity handler
- Processes user messages and coordinates responses
- Creates rich Adaptive Card responses
- Handles welcome messages and error scenarios

### StockService (`services/stockService.js`)
- Integrates with Alpha Vantage API
- Implements caching for performance
- Provides fallback to mock data
- Handles API errors gracefully

### CompanyDetector (`utils/companyDetector.js`)
- Detects company names and stock symbols in text
- Supports fuzzy matching and partial name recognition
- Maintains mapping of company names to stock symbols
- Extensible for adding new companies

## Deployment

### Local Development
```bash
npm run dev
```
Access at: `http://localhost:3978/api/messages`

### Production Deployment
1. Set environment variables in your hosting platform
2. Deploy to Azure App Service, AWS, or your preferred platform
3. Configure the Bot Framework endpoint to point to your deployed URL

### Docker Support
Create `Dockerfile`:
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3978
CMD ["npm", "start"]
```

## Testing

The agent includes a health check endpoint:
```
GET /health
```

Test with Bot Framework Emulator:
1. Download [Bot Framework Emulator](https://aka.ms/botframework-emulator)
2. Connect to `http://localhost:3978/api/messages`
3. Test various company mentions

## Customization

### Adding New Companies
```javascript
// In utils/companyDetector.js
detector.addCompany('newcompany', 'New Company Inc.', 'NEWCO');
```

### Custom Stock Data Provider
Extend `StockService` to support additional APIs:
```javascript
// In services/stockService.js
async fetchFromCustomAPI(symbol) {
    // Implement your custom API integration
}
```

## Error Handling

The agent includes comprehensive error handling:
- API failures fall back to cached or mock data
- Invalid symbols return helpful error messages
- Network timeouts are handled gracefully
- All errors are logged for monitoring

## Performance Considerations

- **Caching**: Stock data is cached for 5 minutes to reduce API calls
- **Rate Limiting**: Respects Alpha Vantage API limits
- **Async Processing**: Non-blocking message processing
- **Timeout Handling**: API calls timeout after 10 seconds

## Security Best Practices

- Environment variables for sensitive data
- No API keys in source code
- Input validation for user messages
- Secure Bot Framework authentication

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For issues and questions:
1. Check the troubleshooting section below
2. Review Bot Framework documentation
3. Open an issue in the repository

## Troubleshooting

### Common Issues

**Bot not responding**:
- Check Bot Framework registration
- Verify `MICROSOFT_APP_ID` and `MICROSOFT_APP_PASSWORD`
- Ensure endpoint URL is correct

**No stock data**:
- Verify `STOCK_API_KEY` is valid
- Check Alpha Vantage API limits
- Confirm company names are in the detector mapping

**Performance issues**:
- Monitor API call frequency
- Check cache effectiveness
- Review server resources