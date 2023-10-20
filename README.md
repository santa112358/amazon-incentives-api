# Amazon Incentives API for Node.js

[![Version](https://img.shields.io/npm/v/amazon-incentives-api.svg)](https://www.npmjs.org/package/amazon-incentives-api)
<a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/license-MIT-purple.svg" alt="License: MIT"></a>

Amazon Incentives API for Node.js to provide a type-safe interface to create and cancel Amazon digital gift cards. Built with TypeScript, it ensures reliability and seamless integration for your projects. Suitable for both sandbox and production environments.

## Installation

```bash
npm install amazon-incentives-api
```

## Usage

For a comprehensive guide on gift card operations, visit [Amazon's Developer Portal](https://developer.amazon.com/ja/docs/incentives-api/digital-gift-cards.html).

### Initialization

```typescript
import {IncentivesAPI} from 'amazon-incentives-api';

const client = new IncentivesAPI({
  accessKeyId: 'YOUR_ACCESS_KEY_ID',
  secretAccessKey: 'YOUR_SECRET_ACCESS_KEY',
  partnerId: 'YOUR_PARTNER_ID',
  endpoint: IncentivesAPI.Endpoint.JapanSandbox, // Or any other endpoint as needed
});
```

### Creating a Gift Card

For gift card creation, you need a unique `creationRequestId` starting with your `partnerId` and not exceeding 40 characters. Specify the gift card amount and currency code as well.

```typescript
const creationRequestResponse = await client.createGiftCard({
  creationRequestId: 'YOUR_UNIQUE_REQUEST_ID',
  amount: 100,
  currencyCode: 'JPY',
});

console.log(creationRequestResponse);
```

### Canceling a Gift Card

Gift cards can be canceled as long as they remain unclaimed by an Amazon customer. Note that this operation is only possible within 15 minutes of the creation request timestamp.

```javascript
const cancelRequestResponse = await client.cancelGiftCard(
  'YOUR_UNIQUE_REQUEST_ID'
);
console.log(cancelRequestResponse);
```
