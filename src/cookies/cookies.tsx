const DefaultURL = "http://localhost";

export async function setCookie(name:string, value:string) {
    await chrome.cookies.set({
        url: DefaultURL,
        name: name,
        value: value,
        expirationDate: Math.floor(Date.now() / 1000) + 6 * 60 * 60
    })
}

export async function getCookie(name:string, callback:(value: string | null) => void) {
    chrome.cookies.get({
        url: DefaultURL,
        name: name
    }, (cookie) => {
        if (cookie) {
            callback(cookie.value);
        } else {
            callback(null);
        }
    })
}