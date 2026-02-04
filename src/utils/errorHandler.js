const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const code = err.code || 'INTERNAL_SERVER_ERROR';
    const message = err.message || 'Something went wrong';
    const details = err.details ?? null;

    res.status(statusCode).json({
        status: 'error',
        code: code,
        message: message,
        details: details,
    });
};

module.exports = errorHandler;