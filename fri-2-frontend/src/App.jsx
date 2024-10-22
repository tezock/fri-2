import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import useSpeechToText from './hooks/useSpeechToText'
function App() {
  const [count, setCount] = useState(0)
  const {isListening, transcript, startListening, stopListening} = useSpeechToText({continuous: true});

  const toggleListen = () => {
    isListening ? stopListening() : startListening();
  }

  // for (let i = 0; i < transcript.length; i++) {

  //   // console.log(i, transcript[i]);
  // }
  console.log(transcript)

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <button
      onClick={toggleListen}
      >

      </button>
      <p>
        {isListening ? transcript : "Not listening"}
      </p>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
