chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if(message.type === 'apiRequest') {
        try {
            const { context }= message.payload;
            handleApiRequest(context)
            .then((response) => {
                sendResponse({success: true, data: response})
                console.log(response)
            })
            .catch((error) => {
                sendResponse({success: false, error: error.message})
            })
            return true
        } catch (error) {
            console.log(error)
        }
    }

})


async function handleApiRequest(context: string) {
    const url = "https://api.openai.com/v1/chat/completions";

    const prompt ="Analyze the provided context and draft a concise, professional update based on the input. Focus solely on crafting the update without providing commentary or explanations.";

    try {
        const data = {
            model: "gpt-4o-mini",
            store: false,
            messages: [
                { role: 'assistant', content: prompt},
                { role: 'user', content: `write an update: ${context}` }
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