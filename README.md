# Microsoft 365 Copilot Agent + Store Accelerator

## Overview

This repository contains examples of the approaches developers can take to build Agents for Microsoft 365 Copilot, and publish + monetize them through the Microsoft Commercial Marketplace.

Follow this guide to understand the repository structure, select your code approach, and determine your Marketplace publishing strategy.

## Directory Structure

```
├── docs/           # Documentation modules and guides
├── src/            # Source code for agent implementations
├── assets/         # Images, icons, and media resources
└── README.md       # This file
```

## Building Agents for Microsoft 365 Copilot

### 1. Gather your Pre-requisites

Before starting your agent development, you should have the following items provisioned:

- **Microsoft 365 Developer Environment** - This is the tenant against which you will deploy and test agents. Your options include:
  - A Microsoft 365 production tenant (ex. your actual work tenant) 
    - If you pursue this option, ensure you have administrator permissions to sideload apps to Copilot and Teams
    - If you with want to test advanced Microsoft 365 Copilot agent capabilities, you will also need a Microsoft 365 Copilot license.
  - A [Microsoft 365 Developer tenant](https://developer.microsoft.com/microsoft-365/dev-program). This non-production tenant is available for Visual Studio subscribers and Microsoft Partners.

- **Development Tools**
  - Visual Studio and VSCode are well-supported for agent development
  - [Microsoft 365 Agents Toolkit](https://learn.microsoft.com/en-us/microsoft-365/developer/overview-m365-agents-toolkit) is a supported add-in for VS, VSCode, and GitHub Copilot to streamline the development and publishing processes
  - Azure CLI to perform programmatic Azure tasks

- **Azure Subscription** - This is recommended to provision Entra applications, Azure Bot services, and your custom application services (that will run in web or container apps)

### 2. Choose your Agent Development Approach

- **Declarative Agent**
  - Declarative agents extend base M365 Copilot capability with custom instructions, additional knowledge, and actions to automate business processes. They leverage Copilot's existing AI infrastructure (no need to supply your own LLM), ensuring adherence to security, compliance, and responsible AI (RAI) requirements.
- **Custom Engine Agent**
  - Custom engine agents are fully customized AI assistants, suitable for scenarios requiring complex workflows, advanced orchestration, or specialized language models. They offer greater flexibility and control but require additional hosting and compliance measures (developers must supply a model, API endpoints, and ensure responsible AI requirements are met).

### 3. Development Process

#### Step 1: Set Up Development Environment
- Configure your development environment with necessary tools and SDKs
- Set up Azure resources (App Service, Key Vault, Application Insights)
- Initialize your agent project structure

#### Step 2: Implement Core Functionality
- Build conversational logic using Microsoft Bot Framework or Copilot Studio
- Implement data connectors and API integrations
- Add authentication and authorization mechanisms
- Create adaptive cards and rich media responses

#### Step 3: Testing and Validation
- Unit test individual components and conversation flows
- Integration testing with Microsoft 365 services
- User acceptance testing with target audiences
- Performance and scalability testing

#### Step 4: Security and Compliance
- Implement proper authentication (OAuth 2.0, Azure AD)
- Ensure data privacy and compliance requirements
- Add monitoring and logging capabilities
- Security vulnerability assessment and remediation

### 4. Agent Deployment

- **Azure Deployment**: Deploy to Azure App Service or Container Instances
- **Configuration Management**: Set up environment-specific configurations
- **Monitoring Setup**: Configure Application Insights and health checks
- **Testing in Production**: Validate functionality in production environment

## Packaging and Publishing in Microsoft Commercial Marketplace

### 1. Marketplace Preparation

#### Business Preparation
- **Partner Center Account**: Register as a Microsoft partner
- **Business Verification**: Complete identity verification process
- **Tax and Banking**: Set up payout and tax information
- **Offer Planning**: Define pricing strategy and subscription models

#### Technical Preparation
- **App Registration**: Register your agent in Azure AD
- **Compliance Review**: Ensure adherence to Microsoft marketplace policies
- **Documentation**: Prepare user guides, API documentation, and support materials
- **Testing**: Complete end-to-end testing in production-like environment

### 2. Creating Your Marketplace Offer

#### Step 1: Offer Setup
- Navigate to Partner Center and create a new offer
- Choose "Software as a Service (SaaS)" offer type
- Configure offer settings and marketplace presence

#### Step 2: Properties and Listings
- **Offer Properties**: Set categories, industries, and applicable products
- **Offer Listing**: Create compelling descriptions, screenshots, and videos
- **Preview Audience**: Define who can access your offer during preview phase

#### Step 3: Technical Configuration
- **Landing Page URL**: Configure post-purchase landing page
- **Webhook URL**: Set up marketplace webhook for subscription events
- **Tenant ID and App ID**: Provide Azure AD application details
- **API Version**: Specify SaaS fulfillment API version

#### Step 4: Plans and Pricing
- **Plan Configuration**: Define subscription plans (free trial, paid tiers)
- **Pricing Model**: Set up per-user, flat-rate, or usage-based pricing
- **Billing Terms**: Configure monthly or annual billing cycles
- **Plan Audience**: Set public or private plan visibility

### 3. Submission and Review Process

#### Pre-submission Checklist
- [ ] Agent functionality thoroughly tested
- [ ] All marketplace requirements met
- [ ] Marketing materials and documentation complete
- [ ] Technical integration validated
- [ ] Support processes established

#### Submission Process
1. **Submit for Preview**: Initial submission for internal review
2. **Preview Testing**: Test offer functionality in preview environment
3. **Publisher Sign-off**: Confirm offer is ready for live publication
4. **Microsoft Certification**: Microsoft reviews offer for compliance
5. **Go Live**: Offer becomes available in commercial marketplace

### 4. Post-Publication Management

- **Customer Onboarding**: Handle new customer subscriptions and setup
- **Usage Analytics**: Monitor adoption and usage patterns
- **Customer Support**: Provide ongoing technical and billing support
- **Updates and Maintenance**: Deploy updates and new features
- **Performance Monitoring**: Track offer performance and customer satisfaction

## Getting Started

1. **Clone this repository** to get started with the provided structure
2. **Review the documentation** in the `docs/` folder for detailed guides
3. **Explore sample implementations** in the `src/` folder
4. **Use provided assets** from the `assets/` folder for your marketplace listing

## Resources and Support

- [Microsoft 365 Developer Documentation](https://docs.microsoft.com/microsoft-365/)
- [Microsoft Commercial Marketplace Documentation](https://docs.microsoft.com/azure/marketplace/)
- [Copilot Studio Documentation](https://docs.microsoft.com/power-virtual-agents/)
- [Azure Bot Service Documentation](https://docs.microsoft.com/azure/bot-service/)

## Contributing

We welcome contributions to improve this accelerator. Please review our contribution guidelines and submit pull requests for enhancements.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
