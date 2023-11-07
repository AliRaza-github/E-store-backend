const joi = require("joi");

const registerSchema = joi.object({
    first_name: joi.string().pattern(new RegExp('^[a-zA-Z]{3,30}$')).required(),
    last_name: joi.string().pattern(new RegExp('^[a-zA-Z]{3,30}$')).required(),
    email: joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    password: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{6,8}$')).required()
});

const loginSchema = joi.object({
    email: joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    password: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{6,8}$')).required()
});

module.exports = { registerSchema, loginSchema }