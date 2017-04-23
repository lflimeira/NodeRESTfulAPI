'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const md5 = require('md5');

const validateEmail = function(email) {
    const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

const checkPassword = (password) => {
	if (password.length < 5) { return password;}
	return md5(password);
}

const _schema = {
	name: {type: String, required: [true, 'Name is required.']},
	email: {
				type: String
				, trim: true
				, unique: true
				, required: [ true, 'Email is required.']
				, validate: {
					validator: validateEmail, 
					message: 'A valid email is required.'
				}
			},
	password: {
			type: String, 
			required: [
				true, 
				'Password is required.'
			],
			minlength: 5, 
			set: checkPassword
		},
	date_birth: {type: Date},
	token: {
		type: String, 
		required: [true, 'Token is required.']
	},
	created_at: {type: Date, default: Date.now}
}

const userSchema = new Schema(_schema);
module.exports = mongoose.model('user', userSchema);