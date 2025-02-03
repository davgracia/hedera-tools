const {
    Client,
    PrivateKey,
    AccountCreateTransaction
} = require('@hashgraph/sdk');

const express = require('express');
const app = express.Router();
app.use(express.json());

const { sendError } = require('../../utils/error'); // Adjust the path as necessary

/**
 * @api {post} /api/v1/accounts Create Account
 * @apiName CreateAccount
 * @apiGroup Account
 * @apiVersion 1.0.0
 * 
 * @apiParam {String} network Network to use (mainnet or testnet)
 * @apiParam {String} accountId Account ID of the operator
 * @apiParam {String} userPrivateKey Private key of the operator
 * @apiParam {Number} initialBalance Initial balance of the new account
 */
app.post('', async (req, res) => {
    try {
        const { network, accountId, userPrivateKey, initialBalance } = req.body;

        // Check if all required parameters are provided and send an error if they are not
        if (!network) return sendError(res, { status: 500, message: 'Network is required', code: 'network-error' });
        if (!accountId) return sendError(res, { status: 500, message: 'Account ID is required', code: 'accountId-error' });
        if (!userPrivateKey) return sendError(res, { status: 500, message: 'User Private Key is required', code: 'userPrivateKey-error' });
        if (!initialBalance) return sendError(res, { status: 500, message: 'Initial Balance is required', code: 'initialBalance-error' });

        const client = network === 'mainnet' ? Client.forMainnet() : Client.forTestnet();
        client.setOperator(accountId, userPrivateKey);

        const newKey = PrivateKey.generate();
        const transaction = new AccountCreateTransaction()
            .setKey(newKey.publicKey)
            .setInitialBalance(initialBalance);

        const transactionResponse = await transaction.execute(client);
        const receipt = await transactionResponse.getReceipt(client);
        const newAccountId = receipt.accountId;

        res.json({
            status: 'success',
            newAccountId: newAccountId.toString(),
            newPrivateKey: newKey.toString(),
            newPublicKey: newKey.publicKey.toString()
        });
    } catch (error) {
        sendError(res, {
            status: 500,
            message: error.message,
            code: 'add-account-error'
        });
    }
});

/**
 * @api {put} /api/v1/accounts/:id/update Update Account
 * @apiName UpdateAccount
 * @apiGroup Account
 * @apiVersion 1.0.0
 * 
 * @apiParam {String} network Network to use (mainnet or testnet)
 * @apiParam {String} id Account ID of the operator
 * @apiParam {String} userPrivateKey Private key of the operator
 * @apiParam {String} newKey New public key for the account
 * @apiParam {Number} autoRenewPeriod Auto renew period for the account
 * @apiParam {Number} expirationTime Expiration time for the account
 * @apiParam {String} memo Memo for the account
 */
app.put('/:id/update', async (req, res) => {
    try {
        const accountId = req.params.id;
        const { network, userPrivateKey, newKey, autoRenewPeriod, expirationTime, memo } = req.body;

        // Check if all required parameters are provided and send an error if they are not
        if (!network) return sendError(res, { status: 500, message: 'Network is required', code: 'network-error' });
        if (!accountId) return sendError(res, { status: 500, message: 'Account ID is required', code: 'accountId-error' });
        if (!userPrivateKey) return sendError(res, { status: 500, message: 'User Private Key is required', code: 'userPrivateKey-error' });

        const client = network === 'mainnet' ? Client.forMainnet() : Client.forTestnet();
        client.setOperator(accountId, userPrivateKey);

        const transaction = new AccountUpdateTransaction()
            .setAccountId(accountId)
            .freezeWith(client);

        if (newKey) transaction.setKey(PrivateKey.fromString(newKey).publicKey);
        if (autoRenewPeriod) transaction.setAutoRenewPeriod(autoRenewPeriod);
        if (expirationTime) transaction.setExpirationTime(expirationTime);
        if (memo) transaction.setAccountMemo(memo);

        const signTx = await transaction.sign(PrivateKey.fromString(userPrivateKey));
        const transactionResponse = await signTx.execute(client);
        const receipt = await transactionResponse.getReceipt(client);

        res.json({
            status: 'success',
            accountId: accountId.toString(),
            transactionId: transactionResponse.transactionId.toString()
        });
    } catch (error) {
        sendError(res, {
            status: 500,
            message: error.message,
            code: 'update-account-error'
        });
    }
});

module.exports = app;