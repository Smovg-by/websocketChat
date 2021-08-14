import './App.css';
import {useEffect, useRef, useState} from "react";

export function App() {

  let messagesBlockRef = useRef()

  const [ws, setWs] = useState(null)
  const [message, setMessage] = useState('')
  const [users, setUsers] = useState([])

  if (ws) {
    ws.onmessage = (messageEvent) => {
      let messages = JSON.parse(messageEvent.data)
      setUsers([...users, ...messages])
      messagesBlockRef.current.scrollTo(0, messagesBlockRef.current.scrollHeight) // автоскролл при появлении нового сообщения
    }
  }

  useEffect(() => {
    let localWS = new WebSocket('wss://social-network.samuraijs.com/handlers/ChatHandler.ashx') // объект websocket
    setWs(localWS)
  }, [])

  const onChange = (e) => {
    setMessage(e.currentTarget.value)
  }

  const sendMessage = () => {
    ws.send(message)
    setMessage('')
  }

  return (
    <div className="App">
      <div className={"chat"}>
        <div className={"messages"} ref={messagesBlockRef}>
          {users.map((u, index) => {
            return (<div key={index} className={"message"}>
              <img src={u.photo}/><b>{u.userName} </b><span>{u.message}</span>
            </div>)
          })}
        </div>
        <div className={"footer"}>
          <textarea value={message} onChange={onChange}/>
          <button onClick={sendMessage}>Send message</button>
        </div>
      </div>
    </div>
  );
}

