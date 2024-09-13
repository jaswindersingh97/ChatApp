const express = require('express');
const router = express.Router();

const {searchUser,Users,getChat,Chats, createGroupChat, renameGrp, addMembers,removeMember, createMessage,getMessages} = require('./../controllers/SecureController')

router.get('/search', searchUser); //Searching the users
router.get('/users', Users); //getting all the users
router.post('/chat',getChat); //getting particular chat of 1 to 1 user
router.get("/chats",Chats); //getting all the chats of the user
router.post("/gChat",createGroupChat); //creating group chat 
router.put("/renameGrpName",renameGrp); // rename the groupname
router.put("/addMembers",addMembers); //add a member to group
router.delete("/removeMember",removeMember); //remove a group

router.post("/createMessage", createMessage); //to create a message 
router.get("/getMessages/:chatId",getMessages); // to get messages from chat
 
module.exports = router;
