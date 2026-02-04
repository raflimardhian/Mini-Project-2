const Joi = require("joi");

const createOrderSchema = Joi.object({
    resellerProductId: Joi.number()
        .integer()
        .positive()
        .required(),

    quantity: Joi.number()
        .integer()
        .positive()
        .required(),
});

module.exports = {
    createOrderSchema,
};
