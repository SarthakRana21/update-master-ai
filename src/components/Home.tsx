import React, { useEffect, useRef, useState } from "react";
import Loader from "./Loader";
import CopyText from "./CopyText";
import { getStorage } from "./storageFC";

const Home = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [context, setContext] = useState<string>('');
  const [clipboardText, setClipboardText] = useState<string | null>(null)
  const [port, setPort] = useState<chrome.runtime.Port | null>(null)

  const textAreaRef = useRef<HTMLDivElement | null>(null);
  const resultAreaRef = useRef<HTMLDivElement | null>(null);

  // On submit Function
  const onSubmit = async () => {

    if (resultAreaRef.current) {
      resultAreaRef.current.innerHTML = "";
    }
    if (textAreaRef.current) {
      textAreaRef.current.innerHTML = "";
    }
    setLoading(true);

    if (chrome && chrome.runtime) {
      chrome.runtime.sendMessage(
        {
          type: "apiRequest",
          payload: { context: context },
        },
        (response) => {
          if (response.success) {
            setResponse(response.data.choices[0].message.content);
          } else {
            console.error("API Error:", response.error);
          }
        }
      );
    } else {
      console.error("Chrome.runtime not found");
    }
    port?.postMessage({key: 'textAreaContext', value: ''})
  };

  // Set Response from OpenAI function
  const setResponse = async (response: string) => {
    setLoading(false);
    if (resultAreaRef.current) {
      const formattedText = response.replace(/\\n/g, "\n");
      resultAreaRef.current.innerHTML = `${formattedText} <br /><br /><br /><br /><br />`;
      setClipboardText(formattedText)
      // console.log('set loading', response)
      port?.postMessage({key: 'resultAreaContext', value: response})
    }
  };

  const handleInputOnChange = (e: React.ChangeEvent<HTMLDivElement>) => {
    const value = e.target.textContent || '';
    setContext(value)
    port?.postMessage({key: 'textAreaContext', value: value})
  } 

  // use effect to set storage
  useEffect(() => {
    getStorage('textAreaContext')
      .then((res) => {
        // setContext(res as string)
        if(textAreaRef.current) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const data = res as any
          if(data) textAreaRef.current.innerHTML = res as string
        }
      })

    getStorage('resultAreaContext')
      .then((res) => {
        if(resultAreaRef.current) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const data = res as any
          if(data){
            resultAreaRef.current.innerHTML = res as string
            setClipboardText(data)
          }
        }
      })

    const port = chrome.runtime.connect({name: "popup"}); 
    setPort(port)

    return () => {
      console.log('disconnection..')
      port.disconnect();
    }
  }, [])

  
  // Copy text component with position absolute
  const CopyTextComp: React.FC = () => {
    return (
      <div className="absolute z-20 right-8 top-6 p-2">
          <CopyText text={clipboardText} />
      </div>
      )
    }


  return (
    // Root Container
    <div className="w-full h-full flex flex-col items-center justify-between">
      <h1 className="text-2xl font-semibold mt-4">Update Master AI</h1>

      {/* Main container */}
      <div className="flex flex-col h-full w-full items-center justify-between relative">
        {/* copy button */}
        {clipboardText && !loading && <CopyTextComp />}
        {/* Loader */}
        <div className="absolute z-20 top-28">
          {loading && <Loader />}
        </div>

        {/* Result Area */}
        <div
          className="block max-w-[320px] min-w-[320px] h-[300px] overflow-auto whitespace-pre-wrap cursor-text break-words my-5 z-9 bg-[#333333] p-[7px] px-2.5 rounded-lg"
          ref={resultAreaRef}
          aria-placeholder="Welcome to Update Master AI..."
        />

        {/* User Input Area */}
        <div className="flex flex-col-reverse w-full items-center mb-5">
          <div
            className="absolute block w-80 min-h-[20px] max-h-[150px] border border-whitesmoke overflow-auto outline-none rounded-lg p-[7px] px-2.5 cursor-text break-words z-10 bg-[#2b2b2b]"
            contentEditable="plaintext-only"
            ref={textAreaRef}
            aria-placeholder="Enter your message here!"
            onInput={handleInputOnChange}
          />
        </div>
      </div>

      {/* Buttons Section */}
      <div>
        <button
          className="rounded-lg border border-transparent px-5 py-2 text-base font-medium bg-black text-sm text-white cursor-pointer transition-colors duration-200 mb-5 hover:border-indigo-500"
          onClick={onSubmit}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Home;
