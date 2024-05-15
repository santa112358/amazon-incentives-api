# Amazon Incentives API for Node.js
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

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

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://pub.dev/publishers/bookm.me/packages"><img src="https://avatars.githubusercontent.com/u/43510799?v=4?s=100" width="100px;" alt="Santa Takahashi"/><br /><sub><b>Santa Takahashi</b></sub></a><br /><a href="https://github.com/santa112358/amazon-incentives-api/commits?author=santa112358" title="Code">💻</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!