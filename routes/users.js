const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userModel = require('./../models/user');
const jwt = require('jsonwebtoken');
const md5 = require('md5');

const checkPassword = (password) => {
	if (password.length < 5) { return password;}
	return md5(password);
}

const callback = function (err, data, res,	token = '') {
	if (err) {
		return res.json(err);
	}
	if (token !== '') {
		return res.json({token: token,data:data});
	}

	return res.json(data);
}

const validateToken = (res, token) => {
	try {
      	let decoded = jwt.verify(token, 'apisecretnode0293');
    	return 'ok';
    } catch(err) {

    	if (err.name === 'TokenExpiredError') {
        	return res.status(401).json({ mensagem: 'Sessão inválida' });
      	} else {
        	return res.status(401).json({ mensagem: 'Não autorizado' });
      	}

    }
}

router.post('/', (req, res) => {

	let tokenStatus = validateToken(res, req.headers.token);
	if (tokenStatus !== 'ok') {
		return tokenStatus;
	}

  	const user = req.body;
  	user.token = jwt.sign(user.email, 'apisecretnode0293');

  	userModel.create(user, (err, data) => {
  		callback(err,data, res);
  	});
});

router.get('/', (req, res) => {
	
	let tokenStatus = validateToken(res, req.headers.token);
	if (tokenStatus !== 'ok') {
		return tokenStatus;
	}

	userModel.find({}, (err, data) => {
		callback(err, data, res);
	});
});

router.get('/:id', (req, res) => {
	
	let tokenStatus = validateToken(res, req.headers.token);
	if (tokenStatus !== 'ok') {
		return tokenStatus;
	}

	let query = {_id: req.params.id};
	userModel.findOne(query, (err, data) => {
		callback(err, data, res);
	});
});

router.put('/login', (req, res) => {
	
	const query = req.body;
  	let token = jwt.sign({ email: query.email }, 'apisecretnode0293', {expiresIn: 1800});
	const mod = {token: token};

	if(query.password !== undefined || query.password !== ''){
		query.password = checkPassword(query.password);
	}

	userModel.update(query, mod, (err, data) => {
		callback(err, data, res, token);
	});
});

router.put('/:id', (req, res) => {
	
	let tokenStatus = validateToken(res, req.headers.token);
	if (tokenStatus !== 'ok') {
		return tokenStatus;
	}

	let query = {_id: req.params.id};
	const mod = req.body;

	if(mod.password !== undefined){
		mod.password = checkPassword(mod.password);
	}
  	
  	userModel.update(query, mod, { runValidators: true }, (err, data) => {
		callback(err, data, res);
	});
});

router.delete('/:id', (req, res) => {
	
	let tokenStatus = validateToken(res, req.headers.token);
	if (tokenStatus !== 'ok') {
		return tokenStatus;
	}

	let query = {_id: req.params.id};
	userModel.remove(query, (err, data) => {
		callback(err, data, res);
	});
});

module.exports = router;
