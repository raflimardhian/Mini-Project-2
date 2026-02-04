const Joi = require("joi");

const createProductSchema = Joi.object({
    name: Joi.string().required(),

    description: Joi.string().allow(null, ""),

    basePrice: Joi.number()
        .integer()
        .positive()
        .required(),

    stock: Joi.number()
        .integer()
        .min(0)
        .required(),
});

const updateProductSchema = Joi.object({
    name: Joi.string().optional(),
    description: Joi.string().allow(null, "").optional(),
    basePrice: Joi.number().integer().positive().optional(),
    stock: Joi.number().integer().min(0).optional(),
    isActive: Joi.boolean().optional(),
}).min(1);

module.exports = {
    createProductSchema,
    updateProductSchema,
};
