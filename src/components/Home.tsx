import { useRef } from "react"


const Home = () => {
  let context: string | null;
  const textAreaRef = useRef<HTMLDivElement | null>(null)
  const resultAreaRef = useRef<HTMLPreElement | null>(null)

  const onSubmit = async () => {
  

    if(textAreaRef.current) {
      context = textAreaRef.current.innerHTML
    }

    if(chrome && chrome.runtime){

      chrome.runtime.sendMessage(
        {
            type: "apiRequest",
            payload: { context },
        },
        (response) => {
            if (response.success) {
              setResponse(response.data.choices[0].message.content)
            } else {
                console.error("API Error:", response.error);
            }
        }
      ); 
    } else {
      console.error('Not found Chorme.runtime')
    }
    
  } 
  const setResponse = (response: string) => {
    if(textAreaRef.current  ) {
      textAreaRef.current.innerHTML = '';
    }
    if(resultAreaRef.current) {
      console.log(response)
      const formatedText = response.replace(/\\n/g, '\n');
      resultAreaRef.current.innerHTML = `${formatedText} <br /><br /><br /><br /><br /><br />`
    }
  }

  return (
    <div className='container'>
        <h2>Update Master AI</h2>
        <div className="main-area">

          <pre className="result-area" ref={resultAreaRef} aria-placeholder="Welcome to Update MAster AI.." />
    
          <div className="input-container">
            <div 
            className="textarea" 
            contentEditable="plaintext-only"
            ref={textAreaRef}
            aria-placeholder="Enter your message here!"
            />
          </div>

        </div>
        <div className="button-area">
          <button className="send-btn" onClick={onSubmit}>Send</button>
        </div>
    </div>
  )
}


export default Home
