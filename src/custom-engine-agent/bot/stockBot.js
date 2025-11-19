const { ActivityHandler, MessageFactory, CardFactory } = require('botbuilder');
const { StockService } = require('../services/stockService');
const { CompanyDetector } = require('../utils/companyDetector');

/**
 * M365 Copilot Stock Agent Bot
 * Detects company names in user messages and provides stock price information
 */
class StockBot extends ActivityHandler {
    constructor() {
        super();

        this.stockService = new StockService();
        this.companyDetector = new CompanyDetector();

        // See https://aka.ms/about-bot-activity-message to learn more about the message and other activity types
        this.onMessage(async (context, next) => {
            const userMessage = context.activity.text;
            console.log(`Processing message: ${userMessage}`);

            try {
                // Detect company names or stock symbols in the message
                const companies = await this.companyDetector.detectCompanies(userMessage);

                if (companies.length === 0) {
                    await context.sendActivity(MessageFactory.text(
                        "I can help you get stock prices! Try mentioning a company name like 'Microsoft' or 'Apple', or use stock symbols like 'MSFT' or 'AAPL'."
                    ));
                } else {
                    // Process each company found
                    for (const company of companies) {
                        try {
                            const stockData = await this.stockService.getStockPrice(company.symbol);
                            const response = this.createStockPriceResponse(company, stockData);
                            await context.sendActivity(response);
                        } catch (error) {
                            console.error(`Error fetching stock data for ${company.symbol}:`, error);
                            await context.sendActivity(MessageFactory.text(
                                `Sorry, I couldn't fetch the stock price for ${company.name} (${company.symbol}). Please try again later.`
                            ));
                        }
                    }
                }
            } catch (error) {
                console.error('Error processing message:', error);
                await context.sendActivity(MessageFactory.text(
                    'Sorry, I encountered an error while processing your request. Please try again.'
                ));
            }

            // By calling next() you ensure that the next BotHandler is run
            await next();
        });

        this.onMembersAdded(async (context, next) => {
            const membersAdded = context.activity.membersAdded;
            const welcomeText = `Hello! I'm your M365 Copilot Stock Agent. I can provide you with the latest stock prices for companies you mention. Try asking me about companies like Microsoft, Apple, Google, or use their stock symbols like MSFT, AAPL, GOOGL.`;

            for (let cnt = 0; cnt < membersAdded.length; ++cnt) {
                if (membersAdded[cnt].id !== context.activity.recipient.id) {
                    await context.sendActivity(MessageFactory.text(welcomeText));
                }
            }

            // By calling next() you ensure that the next BotHandler is run
            await next();
        });
    }

    /**
     * Creates a rich response with stock price information
     * @param {Object} company - Company information with name and symbol
     * @param {Object} stockData - Stock price data
     * @returns {Object} Bot Framework message activity
     */
    createStockPriceResponse(company, stockData) {
        const priceChange = stockData.change >= 0 ? '+' : '';
        const changeColor = stockData.change >= 0 ? 'good' : 'attention';
        const changeEmoji = stockData.change >= 0 ? '📈' : '📉';

        // Create an Adaptive Card for rich display
        const card = CardFactory.adaptiveCard({
            $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
            type: 'AdaptiveCard',
            version: '1.2',
            body: [
                {
                    type: 'TextBlock',
                    size: 'Medium',
                    weight: 'Bolder',
                    text: `${changeEmoji} ${company.name} (${company.symbol})`
                },
                {
                    type: 'ColumnSet',
                    columns: [
                        {
                            type: 'Column',
                            width: 'stretch',
                            items: [
                                {
                                    type: 'TextBlock',
                                    text: 'Current Price',
                                    size: 'Small',
                                    color: 'Default'
                                },
                                {
                                    type: 'TextBlock',
                                    text: `$${stockData.price}`,
                                    size: 'Large',
                                    weight: 'Bolder',
                                    color: 'Good'
                                }
                            ]
                        },
                        {
                            type: 'Column',
                            width: 'stretch',
                            items: [
                                {
                                    type: 'TextBlock',
                                    text: 'Change',
                                    size: 'Small',
                                    color: 'Default'
                                },
                                {
                                    type: 'TextBlock',
                                    text: `${priceChange}${stockData.change} (${stockData.changePercent}%)`,
                                    size: 'Medium',
                                    weight: 'Bolder',
                                    color: changeColor
                                }
                            ]
                        }
                    ]
                },
                {
                    type: 'FactSet',
                    facts: [
                        {
                            title: 'Open:',
                            value: `$${stockData.open}`
                        },
                        {
                            title: 'High:',
                            value: `$${stockData.high}`
                        },
                        {
                            title: 'Low:',
                            value: `$${stockData.low}`
                        },
                        {
                            title: 'Volume:',
                            value: stockData.volume.toLocaleString()
                        }
                    ]
                },
                {
                    type: 'TextBlock',
                    text: `Last updated: ${new Date(stockData.lastUpdated).toLocaleString()}`,
                    size: 'Small',
                    color: 'Default',
                    isSubtle: true
                }
            ]
        });

        return MessageFactory.attachment(card);
    }
}

module.exports.StockBot = StockBot;