'use client';

import { useState, useEffect } from 'react'
import './App.css'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator} from '@chatscope/chat-ui-kit-react'
import personalities from './personalities.jsx';
import InteractionSurveyForm from './Form';
import { createClient } from '@supabase/supabase-js';
import './App.css';

// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
// const supabaseAnonKey = import.meta.env.VITE_SUPABASE_API_KEY; 
// const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function saveFormToSupabase(form) {

  try {
    const response = await fetch('/api/save-form', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    });

    const result = await response.json();

    if (response.ok) {
      alert('Form saved successfully!');
    } else {
      console.error('Error saving form:', result);
      alert('Error saving form. Please try again. Continue if error persists.');
    }
  } catch (error) {
    console.error('Error during API call:', error);
    alert('Error during API call. Please try again. Continue if error persists.');
  }
}


async function saveConversationToSupabase(conversation, prompt_id) {

  try {
    const response = await fetch('/api/save-chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt_id: prompt_id,
        conversation: conversation
      }),
    });

    const result = await response.json();

    if (response.ok) {
    } else {
    }
  } catch (error) {
  }  
}

const getConversation = (messages) => {

  return messages.map((item) => {
    return `${item.sender}: ${item.message}`;
  })
}

function App() {

  const [step, setStep] = useState(0);
  const [messages, setMessages] = useState([
    // {
    //   message: "",
    //   sender: "ChatGPT"
    // }
  ])
  const [typing, setTyping] = useState(false);
  const [id, setId] = useState(0);

  const handleRandomizeId = () => {

    setId(Math.floor(Math.random() * 10));
  }

  const handleStartConversation = () => {

    setStep(1);
    handleRandomizeId();
  }

  const handleEndConversation = async () => {

    setStep(2);
    console.log(getConversation(messages));
    console.log("Personality ID: " + id)

    await saveConversationToSupabase(getConversation(messages), id)
    console.log("Saved!");
  }

  const handleSend = async (message) => {

    const newMessage = {
      message: message,
      sender: "user",
      direction: "outgoing"
    };

    const newMessages = [...messages, newMessage]; // all the old messages and the new messages

    // update our messages state
    setMessages(newMessages);

    // set a typing indicator
    setTyping(true);

    // send the request to chatGPT.
    await processMessageToChatGPT(newMessages);

    // update typing status after the figure responds.
    setTyping(false);
  }

  async function processMessageToChatGPT(chatMessages) {

    let apiMessages = chatMessages.map((messageObject) => {
      let role = messageObject.sender === "ChatGPT" ? "assistant" : "user";
      let apiMessage = messageObject.message;

      return { role : role, content : apiMessage }

    });

    const systemMessage = {
      role: "system",
      content: personalities[id]
    }

    const apiRequestBody = {
      "model": "gpt-4-turbo",
      "messages": [
        systemMessage,
        ...apiMessages
      ]
    }

    // make api call to chatgpt
    const response = await fetch("api/get-response", {
      method: "POST",
      body: JSON.stringify(apiRequestBody)
    })

    const data = await response.json();

    setMessages(
          [...chatMessages, 
            {
              message: data.choices[0].message.content,
              sender: "ChatGPT",
              direction: "incoming"
            }
          ]
    )
    console.log("updated messages");
  }

  const handleReset = () => {

    setStep(0);
    setMessages([]);
    setTyping(false);
    handleRandomizeId();
  }


  return (
    <>

    {step == 0 && 

     (
     <>
      <h1>Say Hi to <span>Dobby!</span></h1>
      <p>This chatbot is in use for a research project, consent is implied by continuing.</p>
      <p>We capture anonymized data regarding chatlogs and the experience, including nothing tracing back to users.</p>

      <button onClick={handleStartConversation}>Click here if you're ready to chat with Dobby!</button>
     </>
     )
    }
    {step == 1 && 
    (
      <>

      <h1>Chat Freely with Dobby!</h1>

      <h2>Try saying something!</h2>
      <div style={{ position: "relative", height: "70vh", width: "80vw"}}>

        <MainContainer className="chatbot-container">
          <ChatContainer>
            <MessageList typingIndicator={typing ? <TypingIndicator content={`Dobby is typing...`} /> : null} >
              {messages.map((message, i) => {
                return <Message key={i} model={message} className='message-left'/>
              })}
            </MessageList>
            <MessageInput placeholder={`Type a message here. For example, Hey Dobby!`} onSend={handleSend} attachButton={false} />
          </ChatContainer>
        </MainContainer>

      </div>

      <button onClick={handleEndConversation}>Click here if you're done!</button>
      </>
    )}
    {step == 2 && 
    (
      <>

      <h1>Thank you!</h1>

      <h3>Please fill out feedback of your interaction here below, and talk to Dobby again!</h3>

      <InteractionSurveyForm onSave={saveFormToSupabase} />
      <br />
      <button onClick={handleReset}>Back to Beginning</button>
      </>
    )}
    </>
  )
}

export default App
