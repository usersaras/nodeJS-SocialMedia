const express = require('express');
const controller = require('../controllers/loginAndRegsitration');

const router = express.Router();

//check authentication

router.get('/login', controller.get_login);
router.post('/login', controller.post_login);

router.get('/register', controller.get_register);

router.post('/register', controller.post_register);

router.delete('/logout', controller.delete_login);

module.exports = router;
