import axios from "axios"

const CreateMessage =async ({token,message,_id})=> {
    try{
        let data = JSON.stringify({
            "content": message,
            "chatId": _id
          });
          let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'http://localhost:3000/secureRoute/createMessage',
            headers: { 
              'Content-Type': 'application/json', 
              'Authorization': token
            },
            data : data
          };
        
        const response = await axios.request(config)  
        return response.data;
    }catch(error)
    {
        throw error;
    }
}

export default CreateMessage
