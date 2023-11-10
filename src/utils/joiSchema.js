const joi = require("joi");
const string = joi.string().pattern(new RegExp('^[a-zA-Z]{3,30}$')).required();
const email = joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required();
const password = joi.string().pattern(new RegExp('^[a-zA-Z0-9]{6,8}$')).required();
const number = joi.number().required();

const registerSchema = joi.object({
    first_name: string,
    last_name: string,
    email: email,
    password: password,
});

const loginSchema = joi.object({
    email: email,
    password: password,
});

const createProductSchema = joi.object({
    title: string,
    description: string,
    weight_in_grams: joi.number().integer().required(),
    price: number,
    brand: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    model: number,
});

module.exports = { registerSchema, loginSchema, createProductSchema }