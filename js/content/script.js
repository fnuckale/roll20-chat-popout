let initialized,
    rightSideBar,
    textChatTab,
    textChatTabButton,
    textChat,
    textChatInput,
    textArea,
    fakeTextArea,
    popup;

initialize();

async function initialize() {
    if (!initialized) {
        await jQueryIsAvailable();
        initialized = true;
        rightSideBar = document.getElementById("rightsidebar");
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

async function openPopup() {
    if (!popup || popup.closed) {
        popup = await getPopupWindow(window.allChildWindows);
        const onLoad = popup.onload,
            onBeforeUnload = popup.onbeforeunload;

        popup.onload = () => {
            onLoad();
            popup.onbeforeunload = () => {
                onBeforeUnload();
                destroyFakeTextArea();
            };

            // Dressing
            const doc = popup.document;

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
                        const $el = $(e.target),
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

            // Allow blurring missing element
            attachFakeTextArea();
        };

        popup.onbeforeunload = null;
    }
}

function getPopupWindow(source) {
    return new Promise((resolve) => {
        let chatPopup = source.filter((w) => w.name == "ChatPopout")[0];

        if (chatPopup) {
            resolve(chatPopup);
        } else {
            const push = source.push.bind(source);
            source.push = (...args) => {
                chatPopup = args.filter((w) => w.name == "ChatPopout")[0];

                push(...args);

                if (chatPopup) {
                    source.push = push;
                    resolve(chatPopup);
                }
            };
        }
    });
}

function jQueryIsAvailable() {
    return new Promise((resolve) => {
        if (window.$) {
            resolve();
        } else {
            setTimeout(() => {
                jQueryIsAvailable().then(resolve);
            }, 100);
        }
    });
}

function destroyFakeTextArea() {
    fakeTextArea.remove();
    fakeTextArea = null;
}

function attachFakeTextArea() {
    const textArea = document.createElement("textarea"),
        wrapper = document.createElement("div");
    wrapper.id = "textchat-input";
    wrapper.style.display = "none";
    wrapper.append(textArea);
    fakeTextArea = wrapper;
    rightSideBar.append(fakeTextArea);
}

function getResetStyle() {
    const style = document.createElement("style");
    style.setAttribute("type", "text/css");
    style.innerText =
        "table { border-collapse: inherit; text-indent: inherit; white-space: inherit; line-height: inherit; font-weight: inherit; font-size: inherit; font-style: inherit; color: inherit; text-align: inherit; border-spacing: inherit; font-variant: inherit; }";
    return style;
}

function getPopupStyle() {
    const style = document.createElement("style");
    style.setAttribute("type", "text/css");
    style.innerText =
        "#containerdiv { padding: 0; } #textchat { border-radius: 0; } #textchat-input { left: 0; padding: 5px; box-sizing: border-box; } #textchat-input textarea { width: 100% !important; height: 60px; box-sizing: border-box; }";
    return style;
}

function getTitle() {
    return (document.title || "Roll20").replace("Roll20", "Roll20 Chat");
}

function isAdvShortcuts() {
    return window.currentPlayer.get("advShortcuts");
}
