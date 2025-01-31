# Hedera Tools

Welcome to the Hedera Tools repository. This project contains a collection of tools and utilities for working with the Hedera Hashgraph platform.

## Table of Contents

- [Introduction](#introduction)
- [Installation](#installation)
- [API Endpoints](#api-endpoints)
- [Usage](#usage)
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

## Introduction

Hedera Tools is designed to simplify the development and management of applications on the Hedera Hashgraph network. It includes various scripts, libraries, and utilities to help developers interact with the Hedera API.

## Installation

To install the necessary dependencies, run the following command:

```bash
npm install
```

## API Endpoints

The following table lists the available API endpoints for the Hedera Tools project:

| Endpoint                | Method | Description          | Parameters                                                                 |
|-------------------------|--------|----------------------|----------------------------------------------------------------------------|
| `/api/account`          | POST   | Create Account       | `network`, `accountId`, `userPrivateKey`, `initialBalance`                 |
| `/api/account/:id/update` | PUT    | Update Account       | `network`, `id`, `userPrivateKey`, `newKey`, `autoRenewPeriod`, `expirationTime`, `memo` |
| `/api/token`            | POST   | Create Token         | `network`, `accountId`, `userPrivateKey`, `tokenName`, `tokenSymbol`, `initialSupply`, `decimals`, `maxSupply`, `freezeDefault`, `adminKey`, `kycKey`, `freezeKey`, `wipeKey`, `supplyKey`, `feeScheduleKey`, `pauseKey`, `autoRenewAccount`, `autoRenewPeriod`, `expirationTime`, `memo`, `tokenType` |
| `/api/token/:id/mint`   | POST   | Mint Token           | `network`, `accountId`, `userPrivateKey`, `amount`, `metadata`, `supplyKey` |
| `/api/token/:id/burn`   | POST   | Burn Token           | `network`, `accountId`, `userPrivateKey`, `amount`, `metadata`, `supplyKey` |
| `/api/token/:id/transfer` | POST   | Transfer Token       | `network`, `accountId`, `userPrivateKey`, `amount`, `toAccountId`, `metadata` |
| `/api/token/:id/associate` | POST   | Associate Token      | `network`, `accountId`, `userPrivateKey`, `accountIdToAssociate`, `associateKey` |
| `/api/token/:id/dissociate` | POST   | Dissociate Token    | `network`, `accountId`, `userPrivateKey`, `accountIdToDissociate`, `dissociateKey` |
| `/api/token/:id/update` | PUT    | Update Token         | `network`, `accountId`, `userPrivateKey`, `tokenName`, `tokenSymbol`, `adminKey`, `kycKey`, `freezeKey`, `wipeKey`, `supplyKey`, `feeScheduleKey`, `pauseKey`, `autoRenewAccount`, `autoRenewPeriod`, `expirationTime`, `memo` |
| `/api/token/:id/delete` | DELETE | Delete Token         | `network`, `accountId`, `userPrivateKey`, `adminKey` |

## Usage

To use the API endpoints, you can send HTTP requests to the specified routes with the required parameters. Below are examples of how to use each endpoint.

### Create Account

```bash
curl -X POST http://localhost:3000/api/account \
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
curl -X PUT http://localhost:3000/api/account/0.0.1234/update \
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
curl -X POST http://localhost:3000/api/token \
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
curl -X POST http://localhost:3000/api/token/0.0.1234/mint \
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
curl -X POST http://localhost:3000/api/token/0.0.1234/burn \
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
curl -X POST http://localhost:3000/api/token/0.0.1234/transfer \
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
curl -X POST http://localhost:3000/api/token/0.0.1234/associate \
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
curl -X POST http://localhost:3000/api/token/0.0.1234/dissociate \
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
curl -X PUT http://localhost:3000/api/token/0.0.1234/update \
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
curl -X DELETE http://localhost:3000/api/token/0.0.1234/delete \
-H "Content-Type: application/json" \
-d '{
    "network": "testnet",
    "accountId": "0.0.1234",
    "userPrivateKey": "302e020100300506032b657004220420...",
    "adminKey": "302e020100300506032b657004220420..."
}'
```

## License

This project is licensed under the GPL-3.0-or-later License. See the [LICENSE](https://www.gnu.org/licenses/gpl-3.0.txt) file for details.
