import { useEffect, useRef, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import MessageWindow from "../message_window/message_window"
import io from 'socket.io-client';
import './message.css'
import ProtectedRoute from "../protected_route";
import { useSelector } from 'react-redux';

const socket = io('http://localhost:5001');

const Message = ()=>{
     
    const navigate = useNavigate()
     const senderId = useSelector(state => state.login_id)
     const recieverId = localStorage.getItem('messageId') && localStorage.getItem('messageId');

     const [message, newMessage]= useState()

     const inputMessage = useRef();
    useEffect(()=>{

        socket.on('receiveMessage',(message)=>{
            if(message == senderId)
                getMessages();
        })
        getMessages()

        if(!localStorage.getItem('messageId') || !localStorage.getItem(`${recieverId}`)){
            navigate('/user')
        }


    return () => {
        // This cleanup function will run when the component is about to unmount
        localStorage.removeItem(`${recieverId}`);
        localStorage.removeItem('messageId')
      };
    },[])

    const getMessages = ()=>{
        fetch('http://localhost:5000/api/getmessages',{
            method: 'Post',
            headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                userId: senderId,
                reciepentId : recieverId
              })
        }).then((response)=>response.json()).then((data)=>{
            newMessage(()=>{
                data.forEach((value)=>{
                    if(value.sender_id == senderId){
                        value.sender = true;
                    }
                    else{
                        value.sender = false;
                    }
                })
                console.log(data)
                return data
            })
        })
    }

    const sendMessage = ()=>{
        if(!inputMessage.current?.value){
            return;
        }
        fetch('http://localhost:5000/api/messages',{
            method:"Post",
            headers:{
                'Content-Type': 'application/json'
            },
            body:JSON.stringify({
                userId: senderId,
                reciepentId: recieverId,
                message: inputMessage.current.value
            })
        }).then((response)=>{response.json()}).then((data)=>{
            console.log(data)
            getMessages();
            socket.emit('sendMessage',recieverId);
            inputMessage.current.value = '';
        })
    }

    const handlekeyDown = (event)=>{
        if(event.key === 'Enter'){
            sendMessage();
        }
    }

    return (<div className="message-main">
        <header className="message-header">
            {localStorage.getItem(`${recieverId}`)}
        </header>
        <div className="chat-container">
            <MessageWindow message={message}></MessageWindow>
            <div className="input-container">
                <input ref={inputMessage} type="text" onKeyDown={handlekeyDown} placeholder="Type your message..."></input>
                <button type="button" onClick={sendMessage}>Send</button>
            </div>
        </div>
    </div>)
}

export default Message