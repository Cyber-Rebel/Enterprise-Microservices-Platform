const express = require('express');
const createauthMiddleware = require('../middleware/auth.middleware');
const controller = require('../controller/selller.controller.js');
const router = express.Router()

    router.get('/matrics',createauthMiddleware(['seller']),controller.getMatrics)




module.exports =router