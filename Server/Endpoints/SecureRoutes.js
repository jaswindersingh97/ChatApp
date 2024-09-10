const express = require('express');
const router = express.Router();

const {searchUser,Users,getChat,Chats, createGroupChat, renameGrp} = require('./../controllers/SecureController')

router.get('/search', searchUser); //Searching the users
router.get('/users', Users); //getting all the users
router.post('/chat',getChat); //getting particular chat of 1 to 1 user
router.get("/chats",Chats); //getting all the chats of the user
router.post("/gChat",createGroupChat); //creating group chat 
router.put("/renameGrpName",renameGrp); // rename the groupname
module.exports = router;
