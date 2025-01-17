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

    const prompt = "You are Project Manager, an AI-powered assistant that generates quick, polished updates or emails based on provided context. Your task is to transform user input into clear, professional communication, whether it’s for client updates, project reports, or any other formal communication. Ensure the tone is appropriate, concise, and relevant to the situation, and always strive for clarity and professionalism. try to keep it short and on point";

    try {
        const data = {
            model: "gpt-4o-mini",
            store: true,
            messages: [
                { role: 'assistant', content: prompt},
                { role: 'user', content: context }
            ],
            temperature: 0.7
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