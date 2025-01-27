
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    try {
        switch (message.type) {
            case 'apiRequest': {
                const { context } = message.payload;
                handleApiRequest(context)
                    .then((response) => {
                        sendResponse({ success: true, data: response });
                        console.log('API Response:', response);
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

    const prompt ="Analyze the provided user input create a corporate update based on the input, keep it on point, precise and professional use easy words.";

    try {
        const data = {
            model: "gpt-4o-mini",
            store: false,
            messages: [
                { role: 'assistant', content: prompt},
                { role: 'user', content: `write it better: ${context}` }
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