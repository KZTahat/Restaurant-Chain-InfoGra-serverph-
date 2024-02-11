exports.databaseError = (res, status, message) => {
    res.status(status).json({
        status: 'failed',
        data: {
            Error_Message: message,
        },
    });
}