import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator} from '@chatscope/chat-ui-kit-react'
import personalities from './personalities.jsx';
import InteractionSurveyForm from './Form';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_API_KEY; 
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function saveFormToSupabase(form) {
  try {
    const { data, error } = await supabase
      .from('responses') // Your Supabase table name
      .insert([
        { 
          age: form.age,
          major: form.major,
          engagementLevel: form.engagementLevel,
          conversationLeader: form.conversationLeader,
          responseAccuracy: form.responseAccuracy,
          responseReadPercentage: form.responseReadPercentage,
          likelihoodToInteract: form.likelihoodToInteract,
          interactionQuality: form.interactionQuality,
          promptId: form.promptId,
          created_at: new Date()
        }
      ]);

    if (error) {
      console.error('Error saving conversation to Supabase:', error);
    } else {
      console.log('Conversation saved successfully:', data);
    }
  } catch (error) {
    console.error('Error during Supabase insertion:', error);
  }
}


async function saveConversationToSupabase(conversation, prompt_id) {
  try {
    const { data, error } = await supabase
      .from('conversations') // Your Supabase table name
      .insert([
        { 
          conversation: conversation, // Save the conversation as JSON
          created_at: new Date(), // Optional: Add a timestamp if you have a `created_at` column
          prompt_id: prompt_id,
        }
      ]);

    if (error) {
      console.error('Error saving conversation to Supabase:', error);
    } else {
      console.log('Conversation saved successfully:', data);
    }
  } catch (error) {
    console.error('Error during Supabase insertion:', error);
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
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + import.meta.env.VITE_GPT_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(apiRequestBody)
    })

    const data = await response.json();

    setMessages(
          [...chatMessages, 
            {
              message: await data.choices[0].message.content,
              sender: "ChatGPT",
              direction: "incoming"
            }
          ]
    )
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
      <p>A project by Robert Tezock, Nicolas Osgnach, Aditya Ramaswamy, and Shankarsh Narayanan</p>

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
