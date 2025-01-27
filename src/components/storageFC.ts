// save temprary data 
export const setStorage = (key: string, value:string) => {
    chrome.storage.session.set({[key] : value})
    // console.log("setting storage",key, value)
} 

// get saved data
export const getStorage = (key: string) => {
    // console.log("getting storage", key)
    return new Promise((resolve) => {
        chrome.storage.session.get(key, (data) => {
            
            const value = data[key]
             resolve(value)
        })
    })
}

