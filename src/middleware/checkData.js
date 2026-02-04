function checkData(schema) {
    return function (req, res, next) {
        const result = schema.validate(req.body);
        if (result.error) {
        return res.status(400).json({
            success: false,
            message: result.error,
        });
        }
        
        next();
    };
}


module.exports = checkData;