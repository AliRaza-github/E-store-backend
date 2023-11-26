const joi = require("joi");
const { default: mongoose } = require("mongoose");
const string = joi.string().pattern(new RegExp('^[a-zA-Z]{3,30}$')).required();
const email = joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required();
const password = joi.string().pattern(new RegExp('^[a-zA-Z0-9]{6,8}$')).required();
const number = joi.number().positive().required();

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

const productSchema = joi.object({
    title: joi.string().pattern(new RegExp('^[a-zA-Z0-9\\s!@#$%^&*()_+{}|:;<>,.?~\\[\\]\\\\-]{3,30}$')).required(),
    description: joi.string().pattern(new RegExp('^[a-zA-Z0-9\\s!@#$%^&*()_+{}|:;<>,.?~\\[\\]\\\\-]{3,300}$')).required(),
    weight_in_grams: number,
    price: joi.number().positive().required(),
    brand: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    model: number,
});

const resetPasswordSchema = joi.object({
    password: password,

})

module.exports = { registerSchema, loginSchema, productSchema, resetPasswordSchema }