
// Method to send standard error response to the client
module.exports.sendError = (res, error) => {
    res.status(error.status).send({
        status: error.status,
        message: error.message,
        code: error.code
    });
}