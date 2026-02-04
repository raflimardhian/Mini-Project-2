const Joi = require("joi");

const createUserSchema = Joi.object({
    username: Joi.string()
        .min(3)
        .max(50)
        .required(),

    password: Joi.string()
        .min(6)
        .required(),
});

const updateUserSchema = Joi.object({
    username: Joi.string()
        .min(3)
        .max(50)
        .optional(),

    password: Joi.string()
        .min(6)
        .optional(),
}).min(1);

module.exports = {
    createUserSchema,
    updateUserSchema,
};
