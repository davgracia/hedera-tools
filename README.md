# Hedera API

Welcome to the Hedera API repository. This project allows you to set up your own API server to interact with the Hedera network using the official Hedera SDK. Please note that this is not the official Hedera API.

![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)
![Version](https://img.shields.io/badge/version-0.0.2-green)
![GitHub last commit](https://img.shields.io/github/last-commit/davgracia/hedera-api)
[![made-with-javascript](https://img.shields.io/badge/Made%20with-JavaScript-1f425f.svg)](https://www.javascript.com)
[![GPLv3 license](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0.txt)
[![Ask Me Anything !](https://img.shields.io/badge/Ask%20me-anything-1abc9c.svg)](https://github.com/davgracia)

## Author

David G.
[davgracia](https://github.com/davgracia)
[LinkedIn](https://www.linkedin.com/in/davgracia/)

## Contributing

We welcome contributions! Please see the [CONTRIBUTING.md](CONTRIBUTING.md) file for guidelines on how to contribute to this project.

## Table of Contents

- [Hedera API](#hedera-api)
  - [Author](#author)
  - [Contributing](#contributing)
  - [Table of Contents](#table-of-contents)
  - [Packages](#packages)
  - [Running the Project](#running-the-project)
  - [API Endpoints (v1)](#api-endpoints-(v1))
  - [Usage](#usage)
    - [Hedera Networks](#hedera-networks)
      - [Mainnet](#mainnet)
      - [Testnet](#testnet)
      - [Previewnet](#previewnet)
    - [Create Account](#create-account)
    - [Update Account](#update-account)
    - [Create Token](#create-token)
    - [Mint Token](#mint-token)
    - [Burn Token](#burn-token)
    - [Transfer Token](#transfer-token)
    - [Associate Token](#associate-token)
    - [Dissociate Token](#dissociate-token)
    - [Update Token](#update-token)
    - [Delete Token](#delete-token)
  - [License](#license)

## Packages

The following table lists the main packages used in this project:

| Package             | Version | Description                                      |
|---------------------|---------|--------------------------------------------------|
| `@hashgraph/sdk`    | ^2.26.0 | Official Hedera SDK for JavaScript/TypeScript    |
| `dotenv`            | ^16.4.7 | Loads environment variables from a `.env` file   |
| `express`           | ^4.21.2 | Web framework for Node.js                        |
| `nodemon`           | ^3.1.9  | Tool for automatically restarting the server     |
| `express-session`   | ^1.18.1 | Session middleware for Express                   |
| `express-useragent` | ^1.0.15 | User agent middleware for Express                |


## Running the Project

To run the project, follow these steps:

1. Ensure you have Node.js installed on your machine. You can download it from [Node.js official website](https://nodejs.org/).

2. Clone the repository to your local machine:

```bash
git clone https://github.com/davgracia/hedera-api.git
cd hedera-api
```

3. Install the necessary dependencies:

```bash
npm install
```

4. Create a `.env` file in the root directory of the project and add the required environment variables. Refer to the `.env.example` file for the necessary variables.

5. Start the server:

```bash
# Start with Node in production mode
npm start
```

```bash
# Start with nodemon in development mode
npm run dev
```

The server will start running on `http://localhost:3000` by default. You can now use the API endpoints as described in the documentation.

Make sure to configure the port and other settings in the `.env` file if you need to customize the server port configuration.

## API Endpoints (v1)

The following table lists the available API endpoints for the Hedera Tools project:

| Endpoint                | Method | Description          | Parameters                                                                 |
|-------------------------|--------|----------------------|----------------------------------------------------------------------------|
| `/api/v1/accounts`          | POST   | Create Account       | `network`, `accountId`, `userPrivateKey`, `initialBalance`                 |
| `/api/v1/accounts/:id/update` | PUT    | Update Account       | `network`, `id`, `userPrivateKey`, `newKey`, `autoRenewPeriod`, `expirationTime`, `memo` |
| `/api/v1/tokens`            | POST   | Create Token         | `network`, `accountId`, `userPrivateKey`, `tokenName`, `tokenSymbol`, `initialSupply`, `decimals`, `maxSupply`, `freezeDefault`, `adminKey`, `kycKey`, `freezeKey`, `wipeKey`, `supplyKey`, `feeScheduleKey`, `pauseKey`, `autoRenewAccount`, `autoRenewPeriod`, `expirationTime`, `memo`, `tokenType` |
| `/api/v1/tokens/:id/mint`   | POST   | Mint Token           | `network`, `accountId`, `userPrivateKey`, `amount`, `metadata`, `supplyKey` |
| `/api/v1/tokens/:id/burn`   | POST   | Burn Token           | `network`, `accountId`, `userPrivateKey`, `amount`, `metadata`, `supplyKey` |
| `/api/v1/tokens/:id/transfer` | POST   | Transfer Token       | `network`, `accountId`, `userPrivateKey`, `amount`, `toAccountId`, `metadata` |
| `/api/v1/tokens/:id/associate` | POST   | Associate Token      | `network`, `accountId`, `userPrivateKey`, `accountIdToAssociate`, `associateKey` |
| `/api/v1/tokens/:id/dissociate` | POST   | Dissociate Token    | `network`, `accountId`, `userPrivateKey`, `accountIdToDissociate`, `dissociateKey` |
| `/api/v1/tokens/:id/update` | PUT    | Update Token         | `network`, `accountId`, `userPrivateKey`, `tokenName`, `tokenSymbol`, `adminKey`, `kycKey`, `freezeKey`, `wipeKey`, `supplyKey`, `feeScheduleKey`, `pauseKey`, `autoRenewAccount`, `autoRenewPeriod`, `expirationTime`, `memo` |
| `/api/v1/tokens/:id/delete` | DELETE | Delete Token         | `network`, `accountId`, `userPrivateKey`, `adminKey` |

## Usage

To use the API endpoints, you can send HTTP requests to the specified routes with the required parameters. Below are examples of how to use each endpoint.

### Hedera Networks

Hedera Hashgraph offers different networks for various purposes. Here are the main networks:

#### Mainnet
The Mainnet is the primary network where real transactions occur. It is a public network used for deploying and running production applications. Transactions on the Mainnet require actual HBAR tokens.

#### Testnet
The Testnet is a public network used for testing applications. It mirrors the Mainnet's functionality but uses test HBAR tokens, which have no real-world value. Developers use the Testnet to test their applications without incurring costs.

#### Previewnet
The Previewnet is a public network that provides a preview of upcoming features and updates. It allows developers to test new functionalities before they are released on the Mainnet and Testnet. Like the Testnet, it uses test HBAR tokens.

Each network serves a specific purpose, allowing developers to choose the appropriate environment for development, testing, and production deployment.

### Create Account

```bash
curl -X POST http://localhost:3000/api/v1/accounts \
-H "Content-Type: application/json" \
-d '{
    "network": "testnet",
    "accountId": "0.0.1234",
    "userPrivateKey": "302e020100300506032b657004220420...",
    "initialBalance": 1000
}'
```

### Update Account

```bash
curl -X PUT http://localhost:3000/api/v1/accounts/0.0.1234/update \
-H "Content-Type: application/json" \
-d '{
    "network": "testnet",
    "userPrivateKey": "302e020100300506032b657004220420...",
    "newKey": "302a300506032b6570032100...",
    "autoRenewPeriod": 7890000,
    "expirationTime": 1625097600,
    "memo": "Updated account"
}'
```

### Create Token

```bash
curl -X POST http://localhost:3000/api/v1/tokens \
-H "Content-Type: application/json" \
-d '{
    "network": "testnet",
    "accountId": "0.0.1234",
    "userPrivateKey": "302e020100300506032b657004220420...",
    "tokenName": "MyToken",
    "tokenSymbol": "MTK",
    "initialSupply": 1000,
    "decimals": 2,
    "maxSupply": 1000000,
    "freezeDefault": false,
    "adminKey": "302a300506032b6570032100...",
    "kycKey": "302a300506032b6570032100...",
    "freezeKey": "302a300506032b6570032100...",
    "wipeKey": "302a300506032b6570032100...",
    "supplyKey": "302a300506032b6570032100...",
    "feeScheduleKey": "302a300506032b6570032100...",
    "pauseKey": "302a300506032b6570032100...",
    "autoRenewAccount": "0.0.5678",
    "autoRenewPeriod": 7890000,
    "expirationTime": 1625097600,
    "memo": "My first token",
    "tokenType": "FungibleCommon"
}'
```

### Mint Token

```bash
curl -X POST http://localhost:3000/api/v1/tokens/0.0.1234/mint \
-H "Content-Type: application/json" \
-d '{
    "network": "testnet",
    "accountId": "0.0.1234",
    "userPrivateKey": "302e020100300506032b657004220420...",
    "amount": 100,
    "metadata": "Additional data",
    "supplyKey": "302e020100300506032b657004220420..."
}'
```

### Burn Token

```bash
curl -X POST http://localhost:3000/api/v1/tokens/0.0.1234/burn \
-H "Content-Type: application/json" \
-d '{
    "network": "testnet",
    "accountId": "0.0.1234",
    "userPrivateKey": "302e020100300506032b657004220420...",
    "amount": 50,
    "metadata": "Burn data",
    "supplyKey": "302e020100300506032b657004220420..."
}'
```

### Transfer Token

```bash
curl -X POST http://localhost:3000/api/v1/tokens/0.0.1234/transfer \
-H "Content-Type: application/json" \
-d '{
    "network": "testnet",
    "accountId": "0.0.1234",
    "userPrivateKey": "302e020100300506032b657004220420...",
    "amount": 100,
    "toAccountId": "0.0.5678",
    "metadata": "Transfer data"
}'
```

### Associate Token

```bash
curl -X POST http://localhost:3000/api/v1/tokens/0.0.1234/associate \
-H "Content-Type: application/json" \
-d '{
    "network": "testnet",
    "accountId": "0.0.1234",
    "userPrivateKey": "302e020100300506032b657004220420...",
    "accountIdToAssociate": "0.0.5678",
    "associateKey": "302e020100300506032b657004220420..."
}'
```

### Dissociate Token

```bash
curl -X POST http://localhost:3000/api/v1/tokens/0.0.1234/dissociate \
-H "Content-Type: application/json" \
-d '{
    "network": "testnet",
    "accountId": "0.0.1234",
    "userPrivateKey": "302e020100300506032b657004220420...",
    "accountIdToDissociate": "0.0.5678",
    "dissociateKey": "302e020100300506032b657004220420..."
}'
```

### Update Token

```bash
curl -X PUT http://localhost:3000/api/v1/tokens/0.0.1234/update \
-H "Content-Type: application/json" \
-d '{
    "network": "testnet",
    "accountId": "0.0.1234",
    "userPrivateKey": "302e020100300506032b657004220420...",
    "tokenName": "UpdatedToken",
    "tokenSymbol": "UTK",
    "adminKey": "302a300506032b6570032100...",
    "kycKey": "302a300506032b6570032100...",
    "freezeKey": "302a300506032b6570032100...",
    "wipeKey": "302a300506032b6570032100...",
    "supplyKey": "302a300506032b6570032100...",
    "feeScheduleKey": "302a300506032b6570032100...",
    "pauseKey": "302a300506032b6570032100...",
    "autoRenewAccount": "0.0.5678",
    "autoRenewPeriod": 7890000,
    "expirationTime": 1625097600,
    "memo": "Updated token memo"
}'
```

### Delete Token

```bash
curl -X DELETE http://localhost:3000/api/v1/tokens/0.0.1234/delete \
-H "Content-Type: application/json" \
-d '{
    "network": "testnet",
    "accountId": "0.0.1234",
    "userPrivateKey": "302e020100300506032b657004220420...",
    "adminKey": "302e020100300506032b657004220420..."
}'
```

## License

This project is licensed under the GNU General Public License v3.0 or later (GPL-3.0-or-later). This license allows you to:

- Use, study, and modify the software.
- Distribute copies of the original software.
- Distribute copies of your modified versions.

However, any distributed copies or modifications must also be licensed under the GPL-3.0-or-later. For more details, see the [full license text](https://www.gnu.org/licenses/gpl-3.0.txt).

