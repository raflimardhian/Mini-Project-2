const Joi = require("joi");

const createResellerProductSchema = Joi.object({
    productId: Joi.number()
        .integer()
        .positive()
        .required(),

    basePrice: Joi.number()
        .integer()
        .positive()
        .required(),

    isActive: Joi.boolean().optional(),
});

const updateResellerProductSchema = Joi.object({
    basePrice: Joi.number().integer().positive().optional(),
    sellingPrice: Joi.number().integer().positive().optional(),
    isActive: Joi.boolean().optional(),
}).min(1);

module.exports = {
    createResellerProductSchema,
    updateResellerProductSchema,
};
