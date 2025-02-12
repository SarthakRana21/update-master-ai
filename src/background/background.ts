import { setStorage } from "../components/storageFC";

chrome.storage.session.setAccessLevel({
    accessLevel: "TRUSTED_AND_UNTRUSTED_CONTEXTS"
  })

chrome.runtime.onConnect.addListener((port) => {
    if(port.name === 'popup') {
        console.log('pop up opned')
        
        port.onMessage.addListener((message) => {
            // console.log("Port on message",message)
            setStorage(message.key, message.value)
        })

        port.onDisconnect.addListener(() => {
            console.log("Port disconnect")
        })
    }
})

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    try {
        switch (message.type) {
            case 'apiRequest': {
                const { context } = message.payload;
                handleApiRequest(context)
                    .then((response) => {
                        sendResponse({ success: true, data: response });
                        // console.log('API Response:', response);
                    })
                    .catch((error) => {
                        sendResponse({ success: false, error: error.message });
                        console.error('API Request Error:', error);
                    });
                return true; // Keep the message channel open for async response
            }

            default: {
                console.warn('Unhandled message type:', message.type);
            }
        }
    } catch (error) {
        console.error('Error in message listener:', error);
        sendResponse({ success: false});
    }
});


async function handleApiRequest(context: string) {
    const url = "https://api.openai.com/v1/chat/completions";

    const prompt ="You are Update Master ai agent Analyze the provided context and draft a clear, concise, and professional corporate update or repy. Ensure the tone is formal, the content is straight to the point, and avoid unnecessary details or flair. Focus on delivering key information effectively.";

    try {
        const data = {
            model: "gpt-4o-mini",
            store: false,
            messages: [
                { role: 'assistant', content: prompt},
                { role: 'user', content: `context: ${context}` }
            ],
            temperature: 0.1
        }

        const response = await fetch(url, 
            {method: "POST",
            headers: {
                'Authorization': `Bearer ${import.meta.env.VITE_API_KEY}`,
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            }
            
         )
         if(!response.ok) {
            console.error('error in response :', response);
         }
         const responseData = await response.json();
         return responseData

    } catch (error) {
        console.error('handleApiRequesterror', error)
    }
}