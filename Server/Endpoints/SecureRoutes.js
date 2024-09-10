const express = require('express');
const router = express.Router();

const {searchUser,Users} = require('./../controllers/SecureController')

router.get('/search', searchUser);
router.get('/users', Users);

module.exports = router;
