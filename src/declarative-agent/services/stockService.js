const axios = require('axios');

/**
 * Stock Service for fetching stock price data
 * Uses Alpha Vantage API as the default provider
 */
class StockService {
    constructor() {
        this.apiKey = process.env.STOCK_API_KEY;
        this.baseUrl = process.env.STOCK_API_BASE_URL || 'https://www.alphavantage.co/query';
        
        // Cache for storing recent stock data (5 minute cache)
        this.cache = new Map();
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
    }

    /**
     * Gets stock price data for a given symbol
     * @param {string} symbol - Stock symbol (e.g., 'MSFT', 'AAPL')
     * @returns {Promise<Object>} Stock price data
     */
    async getStockPrice(symbol) {
        const cacheKey = symbol.toUpperCase();
        
        // Check cache first
        const cachedData = this.cache.get(cacheKey);
        if (cachedData && (Date.now() - cachedData.timestamp) < this.cacheTimeout) {
            console.log(`Returning cached data for ${symbol}`);
            return cachedData.data;
        }

        try {
            let stockData;
            
            if (this.apiKey) {
                // Use Alpha Vantage API if key is available
                stockData = await this.fetchFromAlphaVantage(symbol);
            } else {
                // Use mock data for demonstration purposes
                console.warn('No STOCK_API_KEY provided, using mock data');
                stockData = this.getMockStockData(symbol);
            }

            // Cache the result
            this.cache.set(cacheKey, {
                data: stockData,
                timestamp: Date.now()
            });

            return stockData;
        } catch (error) {
            console.error(`Error fetching stock data for ${symbol}:`, error);
            
            // Return cached data if available, even if expired
            if (cachedData) {
                console.log(`Returning expired cached data for ${symbol}`);
                return cachedData.data;
            }
            
            // Fallback to mock data
            console.log(`Falling back to mock data for ${symbol}`);
            return this.getMockStockData(symbol);
        }
    }

    /**
     * Fetches stock data from Alpha Vantage API
     * @param {string} symbol - Stock symbol
     * @returns {Promise<Object>} Formatted stock data
     */
    async fetchFromAlphaVantage(symbol) {
        const url = `${this.baseUrl}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${this.apiKey}`;
        
        const response = await axios.get(url, {
            timeout: 10000 // 10 second timeout
        });

        const data = response.data;
        
        if (data['Error Message']) {
            throw new Error(`Alpha Vantage API Error: ${data['Error Message']}`);
        }

        if (data['Note']) {
            throw new Error('Alpha Vantage API rate limit reached');
        }

        const quote = data['Global Quote'];
        if (!quote || !quote['05. price']) {
            throw new Error(`No data found for symbol: ${symbol}`);
        }

        // Format the data for our bot
        return {
            symbol: quote['01. symbol'],
            price: parseFloat(quote['05. price']).toFixed(2),
            change: parseFloat(quote['09. change']).toFixed(2),
            changePercent: parseFloat(quote['10. change percent'].replace('%', '')).toFixed(2),
            open: parseFloat(quote['02. open']).toFixed(2),
            high: parseFloat(quote['03. high']).toFixed(2),
            low: parseFloat(quote['04. low']).toFixed(2),
            volume: parseInt(quote['06. volume']),
            lastUpdated: quote['07. latest trading day']
        };
    }

    /**
     * Returns mock stock data for demonstration purposes
     * @param {string} symbol - Stock symbol
     * @returns {Object} Mock stock data
     */
    getMockStockData(symbol) {
        const mockData = {
            'MSFT': {
                symbol: 'MSFT',
                price: '342.56',
                change: '2.45',
                changePercent: '0.72',
                open: '340.11',
                high: '345.20',
                low: '339.85',
                volume: 28450000,
                lastUpdated: new Date().toISOString().split('T')[0]
            },
            'AAPL': {
                symbol: 'AAPL',
                price: '178.90',
                change: '-1.23',
                changePercent: '-0.68',
                open: '180.13',
                high: '181.45',
                low: '177.32',
                volume: 52340000,
                lastUpdated: new Date().toISOString().split('T')[0]
            },
            'GOOGL': {
                symbol: 'GOOGL',
                price: '128.45',
                change: '0.89',
                changePercent: '0.70',
                open: '127.56',
                high: '129.12',
                low: '126.78',
                volume: 31200000,
                lastUpdated: new Date().toISOString().split('T')[0]
            },
            'AMZN': {
                symbol: 'AMZN',
                price: '145.32',
                change: '3.21',
                changePercent: '2.26',
                open: '142.11',
                high: '146.78',
                low: '141.90',
                volume: 45600000,
                lastUpdated: new Date().toISOString().split('T')[0]
            }
        };

        const upperSymbol = symbol.toUpperCase();
        if (mockData[upperSymbol]) {
            return mockData[upperSymbol];
        }

        // Generate random mock data for unknown symbols
        const basePrice = Math.random() * 200 + 50; // Random price between $50-$250
        const change = (Math.random() - 0.5) * 10; // Random change between -$5 to +$5
        const changePercent = (change / basePrice) * 100;

        return {
            symbol: upperSymbol,
            price: basePrice.toFixed(2),
            change: change.toFixed(2),
            changePercent: changePercent.toFixed(2),
            open: (basePrice - change + (Math.random() - 0.5) * 2).toFixed(2),
            high: (basePrice + Math.random() * 5).toFixed(2),
            low: (basePrice - Math.random() * 5).toFixed(2),
            volume: Math.floor(Math.random() * 50000000) + 1000000,
            lastUpdated: new Date().toISOString().split('T')[0]
        };
    }

    /**
     * Clears the cache (useful for testing)
     */
    clearCache() {
        this.cache.clear();
    }
}

module.exports.StockService = StockService;