chrome.tabs.onUpdated.addListener((tabId, change, tab) => {
    if (tab.url.indexOf("https://app.roll20.net/editor/") == 0) {
        chrome.scripting.executeScript({
            target: { tabId },
            func: () => {
                document.dispatchEvent(new Event("ready:r20poc"));
            },
        });
    }
});
