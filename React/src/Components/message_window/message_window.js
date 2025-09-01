import { useEffect, useRef } from 'react';
import './message_window.css'

const MessageWindow = props =>{

    const bottomRef = useRef(null);
    const scrollToBottom = () => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      };

      useEffect(()=>{
        scrollToBottom()
},[props?.message])
    return (<div className="messages">
        {props?.message?.map((data) => {
            return <div className={data.sender ? 'message sender' : 'message receiver'}> {data.message}</div>
        })}
                            <div ref={bottomRef} />
    </div>)
}

export default MessageWindow