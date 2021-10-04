chrome.tabs.onUpdated.addListener((tabId) => {
    chrome.scripting.executeScript({
        target: { tabId },
        func: () => {
            document.dispatchEvent(new Event("ready:r20poc"));
        },
    });
});
