const { CompanyDetector } = require('../utils/companyDetector');

describe('CompanyDetector', () => {
    let detector;

    beforeEach(() => {
        detector = new CompanyDetector();
    });

    test('should detect company by name', async () => {
        const message = "What's the stock price of Microsoft?";
        const companies = await detector.detectCompanies(message);
        
        expect(companies).toHaveLength(1);
        expect(companies[0].name).toBe('Microsoft Corporation');
        expect(companies[0].symbol).toBe('MSFT');
        expect(companies[0].matchType).toBe('name');
    });

    test('should detect company by stock symbol', async () => {
        const message = "How is AAPL performing today?";
        const companies = await detector.detectCompanies(message);
        
        expect(companies).toHaveLength(1);
        expect(companies[0].symbol).toBe('AAPL');
        expect(companies[0].matchType).toBe('symbol');
    });

    test('should detect multiple companies', async () => {
        const message = "Compare Microsoft and Apple stock prices";
        const companies = await detector.detectCompanies(message);
        
        expect(companies).toHaveLength(2);
        expect(companies.map(c => c.symbol)).toContain('MSFT');
        expect(companies.map(c => c.symbol)).toContain('AAPL');
    });

    test('should not detect non-existent companies', async () => {
        const message = "I like cats and dogs";
        const companies = await detector.detectCompanies(message);
        
        expect(companies).toHaveLength(0);
    });

    test('should avoid duplicate detections', async () => {
        const message = "Microsoft MSFT Microsoft Corporation";
        const companies = await detector.detectCompanies(message);
        
        expect(companies).toHaveLength(1);
        expect(companies[0].symbol).toBe('MSFT');
    });

    test('should check if symbol is known', () => {
        expect(detector.isKnownSymbol('MSFT')).toBe(true);
        expect(detector.isKnownSymbol('UNKNOWN')).toBe(false);
    });

    test('should add new company', () => {
        detector.addCompany('testcorp', 'Test Corporation', 'TEST');
        expect(detector.isKnownSymbol('TEST')).toBe(true);
        
        const companyName = detector.getCompanyNameBySymbol('TEST');
        expect(companyName).toBe('Test Corporation');
    });
});