const Joi = require("joi");

const createEtalaseSchema = Joi.object({
    name: Joi.string().required(),

    isActive: Joi.boolean().optional(),

    startAt: Joi.date().optional(),
    endAt: Joi.date().optional(),
}).custom((value, helpers) => {
    if (value.startAt && value.endAt && value.startAt >= value.endAt) {
        return helpers.error("any.invalid");
    }
    return value;
}, "Date validation");

const updateEtalaseSchema = Joi.object({
    name: Joi.string().optional(),
    isActive: Joi.boolean().optional(),
    startAt: Joi.date().optional(),
    endAt: Joi.date().optional(),
}).min(1);

module.exports = {
    createEtalaseSchema,
    updateEtalaseSchema,
};
