import React, { useEffect, useState } from 'react'
import senticon from './../assets/senticon.png'
import style from './Right.module.css';
import getMessage from '../api/getMessage';
import { useAuth } from '../context/AuthContext';
function Right({selectedChat}) {
    const {token}= useAuth();
    const array =[1,2,3,]
    const [message,setMessage] = useState("")

    const onKeysDown=(e)=>{
      if (e.key === 'Enter' && (e.shiftKey || e.ctrlKey))
        {onformSubmit(e);}
    };

    const getChats = async()=>{
      console.log(token)
      const data=await getMessage({chatId:selectedChat,token:token});
      console.log(data);
    }

    const onformSubmit = (e) =>{
        e.preventDefault();
        console.log(message)
        setMessage("")
    };

  return (
    <div className={style.container}>
    <div className={style.header}>
      <h1>{selectedChat}</h1>
    </div>
      <div className={style.content}>
        {array.map((item,index)=>(
            <div key={index} className={`${style.element} ${style.recieve}`}>
                <p>{item}  Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
                <span>date:xx-yy-zzzz</span>
        </div>
        ))}
        {array.map((item,index)=>(
            <div key={index} className={`${style.element} ${style.sent}`}>
                <p>{item}Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
                <span>date:xx-yy-zzzz</span>
        </div>
        ))}
      </div>
      <div className={style.messageContainer}>
      <form onSubmit={onformSubmit} >
      <textarea onKeyDown={onKeysDown} value={message} onChange={(e)=>setMessage(e.target.value)}/>
      <button type='submit'><img src={senticon} alt='send'/></button>
      </form>
      </div>
    </div>
  )
}

export default Right
