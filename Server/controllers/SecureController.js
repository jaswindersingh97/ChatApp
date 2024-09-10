const Chat = require('../models/ChatModel');
const User = require('./../models/User');

const searchUser = async (req, res) => {
    const { query } = req.query; // Extract the query from URL query string
    
    try {
        // Validate the query parameter
        if (!query) {
            return res.status(400).json({ error: 'Query parameter is required' });
        }

        // Search in both 'name' and 'email' fields using regex and case-insensitivity
        const users = await User.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } }
            ]
        });

        // Handle case when no users are found
        if (users.length === 0) {
            return res.status(200).json({ message: 'No users found', users: [] });
        }

        // Return the found users
        res.status(200).json({ message: "Users found", users });
    } catch (error) {
        console.error('Error while searching users:', error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const Users = async (req, res) =>{
    try {
        
        const users = await User.find();

        // Handle case when no users are found
        if (users.length === 0) {
            return res.status(200).json({ message: 'No users found', users: [] });
        }

        // Return the found users
        res.status(200).json({ message: "Users found", users });
    } catch (error) {
        console.error('Error while searching users:', error);
        res.status(500).json({ error: "Internal server error" });
    }

};

const getChat = async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ message: "userId not available" });
    }

    try {
        // Check if a one-on-one chat already exists between the two users
        var isChat = await Chat.findOne({
            isGroupChat: false,
            users: { $all: [req.user._id, userId] }
        })
        .populate("users", "name email") // Ensure all users are populated with name and email
        .populate("latestMessage");

        // Populate the sender of the latest message
        isChat = await User.populate(isChat, {
            path: 'latestMessage.sender',
            select: 'name email'
        });

        // If chat exists, return it
        if (isChat) {
            console.log(isChat)
            return res.status(200).send(isChat);
        }

        // If no chat exists, create a new one
        const chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [req.user._id, userId], // Add both users to the chat
        };

        const createChat = await Chat.create(chatData);
        const fullChat = await Chat.findOne({ _id: createChat._id })
            .populate("users", "name email"); // Populate both users
        return res.status(200).send(fullChat);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error while fetching or creating chat", error });
    }
};

const Chats = async (req, res) => {
    try {
      const result = await Chat.find({
        users: { $elemMatch: { $eq: req.user._id } }
      }).populate("users")
        .populate("groupAdmin")
        .populate("latestMessage")
        .sort({updatedAt:-1});
      res.status(200).send(result);
    } catch (error) {
      res.status(400).json({
        message: "Error something went wrong in chats",
        error: error.message
      });
    }
  };
  
const createGroupChat = async(req,res) =>{
    if(!req.body.users || !req.body.name){
        res.status(400).message("share all the fields");
    }
    const users = req.body.users;

    if(users.length <2){
        res.status(400).message("at least 2 users")
    }
    users.push(req.user);

    try{
        const groupChat = await Chat.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user,
        });
        const fullGroupChat = await Chat.findOne({_id:groupChat._id})
        .populate("users")
        .populate("groupAdmin")
        
        res.status(200).json(fullGroupChat);
    }
    catch(error){
        res.status(400)
        throw error.message
    }
}
const renameGrp = async(req,res) =>{
    const { chatId, chatName} = req.body;
    
    const updatedChat = await Chat.findByIdAndUpdate(
        chatId,
        {
            chatName,
        },
        {
            new: true,
        }
    ).populate("users")
    .populate("groupAdmin")

    if(!updatedChat){
        res.status(400)
        throw new Error("chat not found")
    }
    else{
        res.status(200).json(updatedChat);
    }
}
module.exports = { searchUser ,Users ,getChat ,Chats,createGroupChat,renameGrp};
