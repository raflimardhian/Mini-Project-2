const Joi = require("joi");

const createEtalaseProductSchema = Joi.object({
    etalaseId: Joi.number()
        .integer()
        .positive()
        .required(),

    resellerProductId: Joi.number()
        .integer()
        .positive()
        .required(),
});

module.exports = {
    createEtalaseProductSchema,
};
