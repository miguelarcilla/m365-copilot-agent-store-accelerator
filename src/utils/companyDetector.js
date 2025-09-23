/**
 * Company Detector Utility
 * Detects company names and stock symbols in user messages
 */
class CompanyDetector {
    constructor() {
        // Common company name to stock symbol mappings
        this.companyMap = new Map([
            // Tech Companies
            ['microsoft', { name: 'Microsoft Corporation', symbol: 'MSFT' }],
            ['apple', { name: 'Apple Inc.', symbol: 'AAPL' }],
            ['google', { name: 'Alphabet Inc.', symbol: 'GOOGL' }],
            ['alphabet', { name: 'Alphabet Inc.', symbol: 'GOOGL' }],
            ['amazon', { name: 'Amazon.com Inc.', symbol: 'AMZN' }],
            ['meta', { name: 'Meta Platforms Inc.', symbol: 'META' }],
            ['facebook', { name: 'Meta Platforms Inc.', symbol: 'META' }],
            ['tesla', { name: 'Tesla Inc.', symbol: 'TSLA' }],
            ['nvidia', { name: 'NVIDIA Corporation', symbol: 'NVDA' }],
            ['intel', { name: 'Intel Corporation', symbol: 'INTC' }],
            ['amd', { name: 'Advanced Micro Devices Inc.', symbol: 'AMD' }],
            ['oracle', { name: 'Oracle Corporation', symbol: 'ORCL' }],
            ['salesforce', { name: 'Salesforce Inc.', symbol: 'CRM' }],
            ['netflix', { name: 'Netflix Inc.', symbol: 'NFLX' }],
            ['adobe', { name: 'Adobe Inc.', symbol: 'ADBE' }],
            
            // Financial Companies
            ['berkshire', { name: 'Berkshire Hathaway Inc.', symbol: 'BRK.A' }],
            ['jpmorgan', { name: 'JPMorgan Chase & Co.', symbol: 'JPM' }],
            ['visa', { name: 'Visa Inc.', symbol: 'V' }],
            ['mastercard', { name: 'Mastercard Incorporated', symbol: 'MA' }],
            ['goldman', { name: 'Goldman Sachs Group Inc.', symbol: 'GS' }],
            ['american express', { name: 'American Express Company', symbol: 'AXP' }],
            
            // Other Major Companies
            ['walmart', { name: 'Walmart Inc.', symbol: 'WMT' }],
            ['disney', { name: 'Walt Disney Company', symbol: 'DIS' }],
            ['coca cola', { name: 'Coca-Cola Company', symbol: 'KO' }],
            ['pepsi', { name: 'PepsiCo Inc.', symbol: 'PEP' }],
            ['mcdonalds', { name: 'McDonald\'s Corporation', symbol: 'MCD' }],
            ['nike', { name: 'Nike Inc.', symbol: 'NKE' }],
            ['boeing', { name: 'Boeing Company', symbol: 'BA' }],
            ['johnson', { name: 'Johnson & Johnson', symbol: 'JNJ' }],
            ['pfizer', { name: 'Pfizer Inc.', symbol: 'PFE' }],
            ['exxon', { name: 'Exxon Mobil Corporation', symbol: 'XOM' }]
        ]);

        // Stock symbol pattern (2-5 uppercase letters, possibly with dots)
        this.symbolPattern = /\b[A-Z]{2,5}(?:\.[A-Z]{1,2})?\b/g;
        
        // Common stock symbols for direct recognition
        this.knownSymbols = new Set([
            'MSFT', 'AAPL', 'GOOGL', 'GOOG', 'AMZN', 'META', 'TSLA', 'NVDA', 
            'INTC', 'AMD', 'ORCL', 'CRM', 'NFLX', 'ADBE', 'BRK.A', 'BRK.B',
            'JPM', 'V', 'MA', 'GS', 'AXP', 'WMT', 'DIS', 'KO', 'PEP', 
            'MCD', 'NKE', 'BA', 'JNJ', 'PFE', 'XOM'
        ]);
    }

    /**
     * Detects companies mentioned in the user's message
     * @param {string} message - User message text
     * @returns {Promise<Array>} Array of detected companies with name and symbol
     */
    async detectCompanies(message) {
        const detectedCompanies = [];
        const processedSymbols = new Set(); // Prevent duplicates
        const lowerMessage = message.toLowerCase();

        // 1. Look for direct stock symbols (e.g., "MSFT", "AAPL")
        const symbolMatches = message.match(this.symbolPattern) || [];
        for (const match of symbolMatches) {
            const symbol = match.toUpperCase();
            if (this.knownSymbols.has(symbol) && !processedSymbols.has(symbol)) {
                const companyName = this.getCompanyNameBySymbol(symbol);
                detectedCompanies.push({
                    name: companyName,
                    symbol: symbol,
                    matchType: 'symbol'
                });
                processedSymbols.add(symbol);
            }
        }

        // 2. Look for company names
        for (const [companyName, companyInfo] of this.companyMap.entries()) {
            if (lowerMessage.includes(companyName) && !processedSymbols.has(companyInfo.symbol)) {
                detectedCompanies.push({
                    name: companyInfo.name,
                    symbol: companyInfo.symbol,
                    matchType: 'name'
                });
                processedSymbols.add(companyInfo.symbol);
            }
        }

        // 3. Look for partial matches (more flexible matching)
        if (detectedCompanies.length === 0) {
            for (const [companyName, companyInfo] of this.companyMap.entries()) {
                // Check if any word in the company name appears in the message
                const companyWords = companyName.split(' ');
                for (const word of companyWords) {
                    if (word.length > 3 && lowerMessage.includes(word) && !processedSymbols.has(companyInfo.symbol)) {
                        detectedCompanies.push({
                            name: companyInfo.name,
                            symbol: companyInfo.symbol,
                            matchType: 'partial'
                        });
                        processedSymbols.add(companyInfo.symbol);
                        break; // Only add once per company
                    }
                }
            }
        }

        return detectedCompanies;
    }

    /**
     * Gets company name by stock symbol
     * @param {string} symbol - Stock symbol
     * @returns {string} Company name
     */
    getCompanyNameBySymbol(symbol) {
        for (const [_, companyInfo] of this.companyMap.entries()) {
            if (companyInfo.symbol === symbol) {
                return companyInfo.name;
            }
        }
        return `${symbol} Company`; // Fallback name
    }

    /**
     * Adds a new company mapping
     * @param {string} companyName - Company name (lowercase)
     * @param {string} fullName - Full company name
     * @param {string} symbol - Stock symbol
     */
    addCompany(companyName, fullName, symbol) {
        this.companyMap.set(companyName.toLowerCase(), {
            name: fullName,
            symbol: symbol.toUpperCase()
        });
        this.knownSymbols.add(symbol.toUpperCase());
    }

    /**
     * Gets all known companies
     * @returns {Array} Array of all company mappings
     */
    getAllCompanies() {
        return Array.from(this.companyMap.entries()).map(([key, value]) => ({
            searchName: key,
            ...value
        }));
    }

    /**
     * Checks if a symbol is a known stock symbol
     * @param {string} symbol - Symbol to check
     * @returns {boolean} True if known symbol
     */
    isKnownSymbol(symbol) {
        return this.knownSymbols.has(symbol.toUpperCase());
    }
}

module.exports.CompanyDetector = CompanyDetector;