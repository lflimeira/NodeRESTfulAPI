const express = require('express');
const router = express.Router();
const md5 = require('md5');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
	created_at: {type: Date, default: Date.now}
}

const userSchema = new Schema(_schema);
const userModel = mongoose.model('user', userSchema);

const callback = function (err, data, res) {
	if (err) {
		return res.json(err);
	}
	return res.json(data);
}

router.post('/', (req, res) => {

  	const user = req.body;

  	userModel.create(user, (err, data) => {
  		callback(err,data, res);
  	});
});

router.get('/', (req, res) => {
	userModel.find({}, (err, data) => {
		callback(err, data, res);
	});
});

router.get('/:id', (req, res) => {
	let query = {_id: req.params.id};
	userModel.findOne(query, (err, data) => {
		callback(err, data, res);
	});
});

router.put('/:id', (req, res) => {
	let query = {_id: req.params.id};
	const mod = req.body;

	if(mod.password !== undefined){
		mod.password = checkPassword(mod.password);
	}
  	
  	console.log(mod);
  	userModel.update(query, mod, { runValidators: true }, (err, data) => {
		callback(err, data, res);
	});
});

router.delete('/:id', (req, res) => {
	let query = {_id: req.params.id};
	userModel.remove(query, (err, data) => {
		callback(err, data, res);
	});
});

module.exports = router;
