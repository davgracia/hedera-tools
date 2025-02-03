const {
    Client,
    PrivateKey,
    TokenCreateTransaction,
    TokenMintTransaction,
    TokenBurnTransaction,
    TransferTransaction,
    TokenAssociateTransaction,
    TokenDissociateTransaction,
    TokenUpdateTransaction,
    TokenDeleteTransaction
} = require('@hashgraph/sdk');

const express = require('express');
const app = express();
app.use(express.json());

const { sendError } = require('../../utils/error');

/**
 * @api {post} /api/token Create Token
 * @apiName CreateToken
 * @apiGroup Token
 * @apiVersion 1.0.0
 * 
 * @apiParam {String} network Network to use (mainnet or testnet)
 * @apiParam {String} accountId Account ID of the operator
 * @apiParam {String} userPrivateKey Private key of the operator
 * @apiParam {String} tokenName Name of the token
 * @apiParam {String} tokenSymbol Symbol of the token
 * @apiParam {Number} initialSupply Initial supply of the token
 * @apiParam {Number} [decimals] Number of decimals for the token
 * @apiParam {Number} [maxSupply] Maximum supply of the token
 * @apiParam {Boolean} [freezeDefault] Whether the token should be frozen by default
 * @apiParam {String} [adminKey] Public key of the admin key
 * @apiParam {String} [kycKey] Public key of the KYC key
 * @apiParam {String} [freezeKey] Public key of the freeze key
 * @apiParam {String} [wipeKey] Public key of the wipe key
 * @apiParam {String} [supplyKey] Public key of the supply key
 * @apiParam {String} [feeScheduleKey] Public key of the fee schedule key
 * @apiParam {String} [pauseKey] Public key of the pause key
 * @apiParam {String} [autoRenewAccount] Account ID of the auto renew account
 * @apiParam {Number} [autoRenewPeriod] Auto renew period of the token
 * @apiParam {Number} [expirationTime] Expiration time of the token
 * @apiParam {String} [memo] Memo for the token
 * @apiParam {String} [tokenType] Type of the token (FungibleCommon, FungibleUnique, NonFungibleUnique)
 */
app.post('', async (req, res) => {
    try {
        const { network, accountId, userPrivateKey, tokenName, tokenSymbol, initialSupply, decimals, maxSupply, freezeDefault, adminKey, kycKey, freezeKey, wipeKey, supplyKey, feeScheduleKey, pauseKey, autoRenewAccount, autoRenewPeriod, expirationTime, memo, tokenType } = req.body;

        // Check if all required parameters are provided and send an error if they are not
        if(!network) return sendError(res, { status: 500, message: 'Network is required', code: 'network-error' });
        if(!accountId) return sendError(res, { status: 500, message: 'Account ID is required', code: 'accountId-error' });
        if(!userPrivateKey) return sendError(res, { status: 500, message: 'User private key is required', code: 'userPrivateKey-error' });
        if(!tokenName) return sendError(res, { status: 500, message: 'Token name is required', code: 'tokenName-error' });
        if(!tokenSymbol) return sendError(res, { status: 500, message: 'Token symbol is required', code: 'tokenSymbol-error' });
        if(!initialSupply) return sendError(res, { status: 500, message: 'Initial supply is required', code: 'initialSupply-error' });

        const client = network === 'mainnet' ? Client.forMainnet() : Client.forTestnet();
        client.setOperator(accountId, userPrivateKey);

        const transaction = new TokenCreateTransaction()
            .setTokenName(tokenName)
            .setTokenSymbol(tokenSymbol)
            .setTreasuryAccountId(accountId)
            .setTokenType(tokenType || TokenType.FungibleCommon)
            .setInitialSupply(initialSupply || 0);

        // Check if optional parameters are provided and set them if they are
        if (decimals) transaction.setDecimals(decimals);
        if (maxSupply) transaction.setMaxSupply(maxSupply);
        if (freezeDefault !== undefined) transaction.setFreezeDefault(freezeDefault);
        if (adminKey) transaction.setAdminKey(adminKey);
        if (kycKey) transaction.setKycKey(kycKey);
        if (freezeKey) transaction.setFreezeKey(freezeKey);
        if (wipeKey) transaction.setWipeKey(wipeKey);
        if (supplyKey) transaction.setSupplyKey(supplyKey);
        if (feeScheduleKey) transaction.setFeeScheduleKey(feeScheduleKey);
        if (pauseKey) transaction.setPauseKey(pauseKey);
        if (autoRenewAccount) transaction.setAutoRenewAccountId(autoRenewAccount);
        if (autoRenewPeriod) transaction.setAutoRenewPeriod(autoRenewPeriod);
        if (expirationTime) transaction.setExpirationTime(expirationTime);
        if (memo) transaction.setTokenMemo(memo);

        // Execute the transaction
        const transactionResponse = await transaction.execute(client);

        // Get the receipt of the transaction
        const receipt = await transactionResponse.getReceipt(client);

        // Get the new token ID from the receipt
        const newTokenId = receipt.tokenId;

        // Return the new token ID
        res.json({
            tokenId: newTokenId.toString(),
            tokenName,
            tokenSymbol,
            initialSupply,
            decimals,
            maxSupply,
            freezeDefault,
            adminKey,
            kycKey,
            freezeKey,
            wipeKey,
            supplyKey,
            feeScheduleKey,
            pauseKey,
            autoRenewAccount,
            autoRenewPeriod,
            expirationTime,
            memo
        });
    } catch (error) {
        sendError(res, { status: 500, message: error.message, code: 'add-token-error' });
    }
});

/**
 * @api {post} /:id/mint Mint Token
 * @apiName MintToken
 * @apiGroup Token
 * @apiVersion 1.0.0
 * 
 * @apiParam {String} id Token ID
 * @apiParam {String} network Network to use (mainnet or testnet)
 * @apiParam {String} accountId Account ID of the operator
 * @apiParam {String} userPrivateKey Private key of the operator
 * @apiParam {Number} amount Amount of tokens to mint
 * @apiParam {String} [metadata] Metadata for the token
 * @apiParam {String} supplyKey Private key of the supply key
 */
app.post('/:id/mint', async (req, res) => {
    try {
        const tokenId = req.params.id;
        const { network, accountId, userPrivateKey, amount, metadata, supplyKey } = req.body;

        // Check if all required parameters are provided and send an error if they are not
        if (!network) return sendError(res, { status: 500, message: 'Network is required', code: 'network-error' });
        if (!accountId) return sendError(res, { status: 500, message: 'Account ID is required', code: 'accountId-error' });
        if (!userPrivateKey) return sendError(res, { status: 500, message: 'User Private Key is required', code: 'userPrivateKey-error' });
        if (!tokenId) return sendError(res, 500, { status: 500, message: 'Token ID is required', code: 'tokenId-error' });
        if (!supplyKey) return sendError(res, 500, { status: 500, message: 'Supply Key is required', code: 'supplyKey-error' });

        const client = network === 'mainnet' ? Client.forMainnet() : Client.forTestnet();
        client.setOperator(accountId, userPrivateKey);

        const transaction = new TokenMintTransaction()
            .setTokenId(tokenId)
            .freezeWith(client);

        if (amount) transaction.setAmount(amount);
        if (metadata) transaction.setMetadata(metadata);

        const signTx = await transaction.sign(PrivateKey.fromString(supplyKey));
        const transactionResponse = await signTx.execute(client);

        const receipt = await transactionResponse.getReceipt(client);

        res.json({
            status: 'success',
            tokenId: tokenId.toString(),
            amount,
            metadata,
            transactionId: transactionResponse.transactionId.toString()
        });
    } catch (error) {
        sendError(res, { status: 500, message: error.message, code: 'mint-token-error' });
    }
});

/**
 * @api {post} /:id/burn Burn Token
 * @apiName BurnToken
 * @apiGroup Token
 * @apiVersion 1.0.0
 * 
 * @apiParam {String} id Token ID
 * @apiParam {String} network Network to use (mainnet or testnet)
 * @apiParam {String} accountId Account ID of the operator
 * @apiParam {String} userPrivateKey Private key of the operator
 * @apiParam {Number} amount Amount of tokens to burn
 * @apiParam {String} [metadata] Metadata for the token
 * @apiParam {String} supplyKey Private key of the supply key
 */
app.post('/:id/burn', async (req, res) => {
    try {
        const tokenId = req.params.id;
        const { network, accountId, userPrivateKey, amount, metadata, supplyKey } = req.body;

        // Check if all required parameters are provided and send an error if they are not
        if (!network) return sendError(res, { status: 500, message: 'Network is required', code: 'network-error' });
        if (!accountId) return sendError(res, { status: 500, message: 'Account ID is required', code: 'accountId-error' });
        if (!userPrivateKey) return sendError(res, { status: 500, message: 'User Private Key is required', code: 'userPrivateKey-error' });
        if (!tokenId) return sendError(res, { status: 500, message: 'Token ID is required', code: 'tokenId-error' });
        if (!supplyKey) return sendError(res, { status: 500, message: 'Supply Key is required', code: 'supplyKey-error' });

        const client = network === 'mainnet' ? Client.forMainnet() : Client.forTestnet();
        client.setOperator(accountId, userPrivateKey);

        const transaction = new TokenBurnTransaction()
            .setTokenId(tokenId)
            .freezeWith(client);

        if (amount) transaction.setAmount(amount);
        if (metadata) transaction.setMetadata(metadata);

        const signTx = await transaction.sign(PrivateKey.fromString(supplyKey));
        const transactionResponse = await signTx.execute(client);

        const receipt = await transactionResponse.getReceipt(client);

        res.json({
            status: 'success',
            tokenId: tokenId.toString(),
            amount,
            metadata,
            transactionId: transactionResponse.transactionId.toString()
        });
    } catch (error) {
        sendError(res, { status: 500, message: error.message, code: 'burn-token-error' });
    }
});

/**
 * @api {post} /:id/transfer Transfer Token
 * @apiName TransferToken
 * @apiGroup Token
 * @apiVersion 1.0.0
 * 
 * @apiParam {String} id Token ID
 * @apiParam {String} network Network to use (mainnet or testnet)
 * @apiParam {String} accountId Account ID of the operator
 * @apiParam {String} userPrivateKey Private key of the operator
 * @apiParam {Number} amount Amount of tokens to transfer
 * @apiParam {String} toAccountId Account ID to transfer tokens to
 * @apiParam {String} [metadata] Metadata for the token
 */
app.post('/:id/transfer', async (req, res) => {
    try {
        const tokenId = req.params.id;
        const { network, accountId, userPrivateKey, amount, toAccountId, metadata } = req.body;

        // Check if all required parameters are provided and send an error if they are not
        if (!network) return sendError(res, { status: 500, message: 'Network is required', code: 'network-error' });
        if (!accountId) return sendError(res, { status: 500, message: 'Account ID is required', code: 'accountId-error' });
        if (!userPrivateKey) return sendError(res, { status: 500, message: 'User Private Key is required', code: 'userPrivateKey-error' });
        if (!tokenId) return sendError(res, { status: 500, message: 'Token ID is required', code: 'tokenId-error' });
        if (!toAccountId) return sendError(res, { status: 500, message: 'Receipt Account ID is required', code: 'toAccountId-error' });

        const client = network === 'mainnet' ? Client.forMainnet() : Client.forTestnet();
        client.setOperator(accountId, userPrivateKey);

        const transaction = new TransferTransaction()
            .addTokenTransfer(tokenId, accountId, -amount)
            .addTokenTransfer(tokenId, toAccountId, amount)
            .execute(client);

        if (metadata) transaction.addNftTransfer(tokenId, accountId, toAccountId, metadata);

        const transactionResponse = await transaction.execute(client);

        const receipt = await transactionResponse.getReceipt(client);

        res.json({
            status: 'success',
            tokenId: tokenId.toString(),
            amount,
            toAccountId,
            metadata,
            transactionId: transactionResponse.transactionId.toString()
        });
    } catch (error) {
        sendError(res, { status: 500, message: error.message, code: 'transfer-token-error' });
    }
});

/**
 * @api {post} /:id/associate Associate Token
 * @apiName AssociateToken
 * @apiGroup Token
 * @apiVersion 1.0.0
 * 
 * @apiParam {String} id Token ID
 * @apiParam {String} network Network to use (mainnet or testnet)
 * @apiParam {String} accountId Account ID of the operator
 * @apiParam {String} userPrivateKey Private key of the operator
 * @apiParam {String} accountIdToAssociate Account ID to associate with the token
 * @apiParam {String} associateKey Private key of the associate key
 */
app.post('/:id/associate', async (req, res) => {
    try {
        const tokenId = req.params.id;
        const { network, accountId, userPrivateKey, accountIdToAssociate, associateKey } = req.body;

        // Check if all required parameters are provided and send an error if they are not
        // Check if all required parameters are provided and send an error if they are not
        if (!network) return sendError(res, { status: 500, message: 'Network is required', code: 'network-error' });
        if (!accountId) return sendError(res, { status: 500, message: 'Account ID is required', code: 'accountId-error' });
        if (!userPrivateKey) return sendError(res, { status: 500, message: 'User Private Key is required', code: 'userPrivateKey-error' });
        if (!tokenId) return sendError(res, { status: 500, message: 'Token ID is required', code: 'tokenId-error' });
        if (!accountIdToAssociate) return sendError(res, { status: 500, message: 'Account ID to associate is required', code: 'accountIdToAssociate-error' });
        if (!associateKey) return sendError(res, { status: 500, message: 'Associate Key is required', code: 'associateKey-error' });

        const client = network === 'mainnet' ? Client.forMainnet() : Client.forTestnet();
        client.setOperator(accountId, userPrivateKey);

        const transaction = new TokenAssociateTransaction()
            .setAccountId(accountId)
            .setTokenIds([tokenId])
            .freezeWith(client);

        const signTx = await transaction.sign(PrivateKey.fromString(associateKey));
        const transactionResponse = await signTx.execute(client);

        const receipt = await transactionResponse.getReceipt(client);

        res.json({
            status: 'success',
            tokenId: tokenId.toString(),
            accountIdToAssociate,
            transactionId: transactionResponse.transactionId.toString()
        });
    } catch (error) {
        sendError(res, { status: 500, message: error.message, code: 'associate-token-error' });
    }
});

/**
 * @api {post} /:id/dissociate Dissociate Token
 * @apiName DissociateToken
 * @apiGroup Token
 * @apiVersion 1.0.0
 * 
 * @apiParam {String} id Token ID
 * @apiParam {String} network Network to use (mainnet or testnet)
 * @apiParam {String} accountId Account ID of the operator
 * @apiParam {String} userPrivateKey Private key of the operator
 * @apiParam {String} accountIdToDissociate Account ID to dissociate from the token
 * @apiParam {String} dissociateKey Private key of the dissociate key
 */
app.post('/:id/dissociate', async (req, res) => {
    try {
        const tokenId = req.params.id;
        const { network, accountId, userPrivateKey, accountIdToDissociate, dissociateKey } = req.body;

        // Check if all required parameters are provided and send an error if they are not
        if (!network) return sendError(res, { status: 500, message: 'Network is required', code: 'network-error' });
        if (!accountId) return sendError(res, { status: 500, message: 'Account ID is required', code: 'accountId-error' });
        if (!userPrivateKey) return sendError(res, { status: 500, message: 'User Private Key is required', code: 'userPrivateKey-error' });
        if (!tokenId) return sendError(res, { status: 500, message: 'Token ID is required', code: 'tokenId-error' });
        if (!accountIdToDissociate) return sendError(res, { status: 500, message: 'Account ID to dissociate is required', code: 'accountIdToDissociate-error' });
        if (!dissociateKey) return sendError(res, { status: 500, message: 'Dissociate key is required', code: 'dissociateKey-error' });

        const client = network === 'mainnet' ? Client.forMainnet() : Client.forTestnet();
        client.setOperator(accountId, userPrivateKey);

        const transaction = new TokenDissociateTransaction()
            .setAccountId(accountId)
            .setTokenIds([tokenId])
            .freezeWith(client);

        const signTx = await transaction.sign(PrivateKey.fromString(dissociateKey));
        const transactionResponse = await signTx.execute(client);

        const receipt = await transactionResponse.getReceipt(client);

        res.json({
            status: 'success',
            tokenId: tokenId.toString(),
            accountIdToDissociate,
            transactionId: transactionResponse.transactionId.toString()
        });
    } catch (error) {
        sendError(res, { status: 500, message: error.message, code: 'dissociate-token-error' });
    }
});

/**
 * @api {put} /:id/update Update Token
 * @apiName UpdateToken
 * @apiGroup Token
 * @apiVersion 1.0.0
 * 
 * @apiParam {String} id Token ID
 * @apiParam {String} network Network to use (mainnet or testnet)
 * @apiParam {String} accountId Account ID of the operator
 * @apiParam {String} userPrivateKey Private key of the operator
 * @apiParam {String} [tokenName] Name of the token
 * @apiParam {String} [tokenSymbol] Symbol of the token
 * @apiParam {String} [adminKey] Public key of the admin key
 * @apiParam {String} [kycKey] Public key of the KYC key
 * @apiParam {String} [freezeKey] Public key of the freeze key
 * @apiParam {String} [wipeKey] Public key of the wipe key
 * @apiParam {String} [supplyKey] Public key of the supply key
 * @apiParam {String} [feeScheduleKey] Public key of the fee schedule key
 * @apiParam {String} [pauseKey] Public key of the pause key
 * @apiParam {String} [autoRenewAccount] Account ID of the auto renew account
 * @apiParam {Number} [autoRenewPeriod] Auto renew period of the token
 * @apiParam {Number} [expirationTime] Expiration time of the token
 * @apiParam {String} [memo] Memo for the token
 */
app.put('/:id/update', async (req, res) => {
    try {
        const tokenId = req.params.id;
        const { network, accountId, userPrivateKey, tokenName, tokenSymbol, adminKey, kycKey, freezeKey, wipeKey, supplyKey, feeScheduleKey, pauseKey, autoRenewAccount, autoRenewPeriod, expirationTime, memo } = req.body;

        // Check if all required parameters are provided and send an error if they are not
        if (!network) return sendError(res, { status: 500, message: 'Network is required', code: 'network-error' });
        if (!accountId) return sendError(res, { status: 500, message: 'Account ID is required', code: 'accountId-error' });
        if (!userPrivateKey) return sendError(res, { status: 500, message: 'User Private Key is required', code: 'userPrivateKey-error' });
        if (!tokenId) return sendError(res, { status: 500, message: 'Token ID is required', code: 'tokenId-error' });

        const client = network === 'mainnet' ? Client.forMainnet() : Client.forTestnet();
        client.setOperator(accountId, userPrivateKey);

        const transaction = new TokenUpdateTransaction()
            .setTokenId(tokenId)
            .freezeWith(client);

        if (tokenName) transaction.setTokenName(tokenName);
        if (tokenSymbol) transaction.setTokenSymbol(tokenSymbol);
        if (adminKey) transaction.setAdminKey(adminKey);
        if (kycKey) transaction.setKycKey(kycKey);
        if (freezeKey) transaction.setFreezeKey(freezeKey);
        if (wipeKey) transaction.setWipeKey(wipeKey);
        if (supplyKey) transaction.setSupplyKey(supplyKey);
        if (feeScheduleKey) transaction.setFeeScheduleKey(feeScheduleKey);
        if (pauseKey) transaction.setPauseKey(pauseKey);
        if (autoRenewAccount) transaction.setAutoRenewAccountId(autoRenewAccount);
        if (autoRenewPeriod) transaction.setAutoRenewPeriod(autoRenewPeriod);
        if (expirationTime) transaction.setExpirationTime(expirationTime);
        if (memo) transaction.setTokenMemo(memo);

        const transactionResponse = await transaction.execute(client);

        const receipt = await transactionResponse.getReceipt(client);

        res.json({
            status: 'success',
            tokenId: tokenId.toString(),
            tokenName,
            tokenSymbol,
            adminKey,
            kycKey,
            freezeKey,
            wipeKey,
            supplyKey,
            feeScheduleKey,
            pauseKey,
            autoRenewAccount,
            autoRenewPeriod,
            expirationTime,
            memo,
            transactionId: transactionResponse.transactionId.toString()
        });
    } catch (error) {
        sendError(res, { status: 500, message: error.message, code: 'update-token-error' });
    }
});

/**
 * @api {delete} /:id/delete Delete Token
 * @apiName DeleteToken
 * @apiGroup Token
 * @apiVersion 1.0.0
 * 
 * @apiParam {String} id Token ID
 * @apiParam {String} network Network to use (mainnet or testnet)
 * @apiParam {String} accountId Account ID of the operator
 * @apiParam {String} userPrivateKey Private key of the operator
 * @apiParam {String} adminKey Private key of the admin key
 */
app.delete('/:id/delete', async (req, res) => {
    try {
        const tokenId = req.params.id;
        const { network, accountId, userPrivateKey, adminKey } = req.body;

        // Check if all required parameters are provided and send an error if they are not
        if (!network) return sendError(res, { status: 500, message: 'Network is required', code: 'network-error' });
        if (!accountId) return sendError(res, { status: 500, message: 'Account ID is required', code: 'accountId-error' });
        if (!userPrivateKey) return sendError(res, { status: 500, message: 'User Private Key is required', code: 'userPrivateKey-error' });
        if (!tokenId) return sendError(res, { status: 500, message: 'Token ID is required', code: 'tokenId-error' });
        if (!adminKey) return sendError(res, { status: 500, message: 'Admin key is required', code: 'adminKey-error' });

        const client = network === 'mainnet' ? Client.forMainnet() : Client.forTestnet();
        client.setOperator(accountId, userPrivateKey);

        const transaction = new TokenDeleteTransaction()
            .setTokenId(tokenId)
            .freezeWith(client);

        const signTx = await transaction.sign(PrivateKey.fromString(adminKey));
        const transactionResponse = await signTx.execute(client);

        const receipt = await transactionResponse.getReceipt(client);

        res.json({
            status: 'success',
            tokenId: tokenId.toString(),
            transactionId: transactionResponse.transactionId.toString()
        });
    } catch (error) {
        sendError(res, { status: 500, message: error.message, code: 'remove-token-error' });
    }
});

module.exports = app;