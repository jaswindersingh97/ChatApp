import axios from "axios";
const getMessage = async ({chatId,token}) => {
    try{
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: 'http://localhost:3000/secureRoute/getMessages/'+chatId,
            headers: {
                'Authorization': token,
             },
          };
          const response = await axios.request(config);
          return response.data;
    }catch(error){
        throw error;
    }      
}

export default getMessage

