import React, {useState, useRef, useEffect} from 'react'

const useSpeechToText = (options) => {

    const [isListening, setIsListening] = useState(false)
    const [transcript, setTranscript] = useState([])
    const recognitionRef = useRef(null)
    const [chatMessages, setChatMessages] = useState([])

    useEffect(() => {
        console.log("state");
    }, [chatMessages])

    useEffect(() => {

        if (!('webkitSpeechRecognition' in window)) {

            console.error("Web speech api is not supported.")
            return;
        }

        recognitionRef.current = new window.webkitSpeechRecognition();
        const recognition = recognitionRef.current;
        recognition.interimResults = false;
        recognition.lang = options.lang || "en-US"
        recognition.continuous = options.continuous || false

        if("webkitSpeechGrammarList" in window){
            const grammar = "#JSGF V1.0; grammar punctuation; public ‹punc> = . | , | ? | ! | ; | : ; ";
            const speechRecognitionList = new window.webkitSpeechGrammarList();
            speechRecognitionList.addFromString(grammar, 1)
            recognition.grammars = speechRecognitionList
        }

        recognition.onresult = async (event) => {
            let text = "";
          
            length = event.results.length
            text = event.results[length - 1][0].transcript
            const newMessage = {
                message: text,
                sender: "user",
                direction: "outgoing"
            };

            const newMessages = [...chatMessages, newMessage]
            setChatMessages(newMessages);
            setTranscript((transcript) => [...transcript, text])
            

            // const newMessages = [...chatMessages, newMessage];


            // await processMessageToChatGPT(chatMessages);

            // console.log("gpt responded");
            console.log("trying state");
            
        }

        recognition.onerror = (event) => {

            console.error("Speech recognition error: ", event.error);
        }
        
        recognition.onend = () => {

            setIsListening(false);
            setTranscript("");
        }

        return () => {
            recognition.stop();
        }
    }, [])

    const startListening = () => {
        if (recognitionRef.current && !isListening) {
            recognitionRef.current.start();
            setIsListening(true);
        }
    }

    const stopListening = () => {
        if (recognitionRef.current && isListening) {
            recognitionRef.current.stop()
            setIsListening(false);
        }
    }

    async function processMessageToChatGPT(chatMessages) {

        let apiMessages = chatMessages.map((messageObject) => {
          let role = messageObject.sender === "ChatGPT" ? "assistant" : "user";
          let apiMessage = messageObject.message;
    
          return { role : role, content : apiMessage }
    
        });
    
        const systemMessage = {
          role: "system",
          content: "You are a helpful assistant."
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

        const newMessage = {
            message: await data.choices[0].message.content,
            sender: "ChatGPT",
            direction: "incoming"
        }
    
        setChatMessages((chatMessages) => {
              [...chatMessages, newMessage]}
        )
      }
    

    return ({
        isListening,
        transcript,
        startListening,
        stopListening}
    )
}

export default useSpeechToText;

// import React, { useState, useRef, useEffect } from 'react';

// const useSpeechToText = (options) => {
//   const [isListening, setIsListening] = useState(false);
//   const [transcripts, setTranscripts] = useState([]); // Store all transcripts
//   const recognitionRef = useRef(null);

//   useEffect(() => {
//     if (!('webkitSpeechRecognition' in window)) {
//       console.error('Web speech API is not supported.');
//       return;
//     }

//     // Initialize the speech recognition API
//     recognitionRef.current = new window.webkitSpeechRecognition();
//     const recognition = recognitionRef.current;
    
//     // Set options for the recognition
//     recognition.interimResults = options.interimResults || false;
//     recognition.lang = options.lang || 'en-US';
//     recognition.continuous = options.continuous || false;

//     // Handle results
//     recognition.onresult = (event) => {
//       let text = '';

//       // Accumulate the results from the event
//       for (let i = 0; i < event.results.length; i++) {
//         if (event.results[i].isFinal) {
//           text += event.results[i][0].transcript;
//         }
//       }

//       if (text) {
//         // Add the final transcript to the list
//         setTranscripts((prevTranscripts) => [...prevTranscripts, text]);
//       }
//     };

//     // Handle errors
//     recognition.onerror = (event) => {
//       console.error('Speech recognition error: ', event.error);
//     };

//     // When the user stops speaking, restart listening
//     recognition.onend = () => {
//       setIsListening(false);
//       // Restart the recognition if it's meant to poll continuously
//       if (options.pollForever) {
//         recognition.start();
//         setIsListening(true);
//       }
//     };

//     return () => {
//       recognition.stop();
//     };
//   }, [options]); // Ensure the options are passed correctly

//   const startListening = () => {
//     if (recognitionRef.current && !isListening) {
//       recognitionRef.current.start();
//       setIsListening(true);
//     }
//   };

//   const stopListening = () => {
//     if (recognitionRef.current && isListening) {
//       recognitionRef.current.stop();
//       setIsListening(false);
//     }
//   };

//   return {
//     isListening,
//     transcripts, // Return all accumulated transcripts
//     startListening,
//     stopListening,
//   };
// };

// export default useSpeechToText;
