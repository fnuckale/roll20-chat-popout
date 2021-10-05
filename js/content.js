const s = document.createElement("script");
s.type = "text/javascript";
s.src = chrome.runtime.getURL("js/content/script.js");
s.onload = () => s.remove();
document.head.appendChild(s);
