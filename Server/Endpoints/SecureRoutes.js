const express = require('express');
const router = express.Router();

const {searchUser} = require('./../controllers/SecureController')

router.get('/search', searchUser);
module.exports = router;
