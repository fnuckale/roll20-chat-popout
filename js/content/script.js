let initialized,
    textChatTab,
    textChatTabButton,
    textChat,
    textChatInput,
    textArea,
    popup;

document.addEventListener("ready:r20poc", initialize);

function initialize() {
    if (!initialized) {
        initialized = true;
        textChat = document.getElementById("textchat");
        textChatTab = document.getElementById("textchattab");

        if (textChatTab) {
            textChatTabButton = textChatTab.children[0];
            textChatInput = document.getElementById("textchat-input");
            textArea = document.querySelector("#textchat-input textarea");

            $(textChatTab).on("dblclick", openPopup);
        }
    }
}

function openPopup() {
    if (!popup || popup.closed) {
        popup = window.allChildWindows[window.allChildWindows.length - 1];
        let onLoad = popup.onload,
            onBeforeUnload = popup.onbeforeunload;

        popup.onload = () => {
            onLoad();
            popup.onbeforeunload = onBeforeUnload;

            // Dressing
            let doc = popup.document;

            doc.title = getTitle();
            doc.head.prepend(getResetStyle());
            doc.head.append(getPopupStyle());

            $(doc)
                .on("keydown", (e) => {
                    if (e.key == "c" && isAdvShortcuts()) {
                        if (
                            doc.activeElement != textArea &&
                            doc.activeElement.value === undefined
                        ) {
                            return textArea.focus(), false;
                        }
                    }
                })
                .on(
                    "hover",
                    ".showtip:not([original-title]),.userscript-showtip:not([original-title])",
                    function (e) {
                        let $el = $(e.target),
                            isUserScript = $el.hasClass("userscript-showtip");
                        $el.tipsy({
                            html: true,
                            filterhtml: isUserScript,
                            userscript: isUserScript,
                            containerel: doc,
                        }).trigger("mouseenter");
                    }
                );

            if (textChatTab.classList.contains("ui-state-active")) {
                textChatTab.nextElementSibling.children[0].click();
            }
        };

        popup.onbeforeunload = null;
    }
}

function getResetStyle() {
    let style = document.createElement("style");
    style.setAttribute("type", "text/css");
    style.innerText =
        "table { border-collapse: inherit; text-indent: inherit; white-space: inherit; line-height: inherit; font-weight: inherit; font-size: inherit; font-style: inherit; color: inherit; text-align: inherit; border-spacing: inherit; font-variant: inherit; }";
    return style;
}

function getPopupStyle() {
    let style = document.createElement("style");
    style.setAttribute("type", "text/css");
    style.innerText =
        "#containerdiv { padding: 0; } #textchat { border-radius: 0; } #textchat-input { left: 0; padding: 5px; box-sizing: border-box; } #textchat-input textarea { width: 100% !important; height: 60px; box-sizing: border-box; }";
    return style;
}

function getTitle() {
    let [titleEl] = document.getElementsByTagName("title");
    return titleEl
        ? titleEl.innerText.replace("Roll20", "Roll20 Chat")
        : "Roll20 Chat";
}

function isAdvShortcuts() {
    try {
        return !Mousetrap.stopCallback();
    } catch (e) {
        return true;
    }
}
