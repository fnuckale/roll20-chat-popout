let s = document.createElement("script");
s.src = chrome.runtime.getURL("js/content/script.js");
(document.head || document.documentElement).appendChild(s);
