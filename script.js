
const input = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");
const newChatBtn = document.getElementById("new-chat");
const searchBtn = document.getElementById("search-chats");
const libraryBtn = document.getElementById("open-library");
const shareBtn = document.getElementById("share-btn");
const attachBtn = document.getElementById("attach-btn");
const fileInput = document.getElementById("file-input");
const fileStatus = document.getElementById("file-status");
const welcome = document.getElementById("welcome-section");
const messageList = document.getElementById("message-list");
const chatHistory = document.getElementById("chat-history");
const profileBtn = document.getElementById("user-profile");

let currentFile = null;
let currentChatTitle = "New Chat";

// Demo responses: this is not a real AI connection.
const demoResponses = [
    {
        keywords: ["html", "website", "webpage"],
        answer: "HTML structures a webpage. Start with elements such as <h1> for headings, <p> for paragraphs, <a> for links, and <button> for buttons."
    },
    {
        keywords: ["css", "design", "style", "color"],
        answer: "CSS styles your webpage. Try Flexbox for layouts, Grid for cards, :hover for interactive effects, and media queries for responsive design."
    },
    {
        keywords: ["javascript", " js ", "programming"],
        answer: "JavaScript adds functionality to websites. Start with variables, functions, events, DOM selection, and event listeners."
    },
    {
        keywords: ["study", "notes", "exam"],
        answer: "A good study method is to divide the topic into small sections, write key definitions, add examples, and practise questions."
    }
];

// Add a message safely to the page.
function addMessage(text, sender) {
    const message = document.createElement("div");
    message.className = `message ${sender}`;

    const label = document.createElement("div");
    label.className = "message-label";
    label.textContent = sender === "user" ? "You" : "My AI";

    const bubble = document.createElement("div");
    bubble.className = "message-bubble";
    bubble.textContent = text;

    message.append(label, bubble);
    messageList.appendChild(message);
}

// Start or display a chat.
function startChat(title = "New Chat", showWelcome = false) {
    currentChatTitle = title;
    messageList.replaceChildren();
    messageList.classList.remove("visible");
    welcome.style.display = showWelcome ? "block" : "none";
    input.value = "";
    input.focus();

    document.querySelectorAll(".chat-item").forEach(item => {
        item.classList.toggle("active", item.textContent === title);
    });
}

// Create a clickable chat-history entry.
function addChatToHistory(title) {
    let heading = [...chatHistory.querySelectorAll("h4")]
        .find(h => h.textContent === "Today");

    let item = [...chatHistory.querySelectorAll(".chat-item")]
        .find(el => el.textContent === title);

    if (item) return;

    item = document.createElement("div");
    item.className = "chat-item";
    item.textContent = title;
    item.tabIndex = 0;
    item.setAttribute("role", "button");

    item.addEventListener("click", () => {
        startChat(title);
        addMessage(`You opened "${title}". This demo does not save previous messages yet.`, "assistant");
        messageList.classList.add("visible");
    });

    item.addEventListener("keydown", event => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            item.click();
        }
    });

    if (heading) {
        heading.after(item);
    } else {
        chatHistory.prepend(item);
    }
}

// Send a message.
function sendMessage() {
    const text = input.value.trim();

    if (!text && !currentFile) {
        input.focus();
        return;
    }

    if (welcome.style.display !== "none") {
        welcome.style.display = "none";
    }

    messageList.classList.add("visible");

    let messageText = text;

    if (currentFile) {
        messageText += (messageText ? "\n" : "") +
            "Attached file: " + currentFile.name;
    }

    addMessage(messageText, "user");

    if (currentChatTitle === "New Chat") {
        currentChatTitle = text.slice(0, 30) || "File conversation";
        addChatToHistory(currentChatTitle);
    }

    input.value = "";
    input.style.height = "auto";
    currentFile = null;
    fileInput.value = "";
    fileStatus.textContent = "";

    // Find a matching sample response.
    const normalizedText = " " + text.toLowerCase() + " ";
    const match = demoResponses.find(response =>
        response.keywords.some(keyword =>
            normalizedText.includes(keyword)
        )
    );

    const reply = match
        ? match.answer
        : "This is a demo response. Connect an AI API to My AI to generate real, context-aware answers.";

    // Simulate a short response delay.
    setTimeout(() => {
        addMessage(reply, "assistant");
        messageList.scrollTop = messageList.scrollHeight;
    }, 350);
}

sendBtn.addEventListener("click", sendMessage);

// Enter sends; Shift + Enter creates a new line.
input.addEventListener("keydown", event => {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
});

// Automatically resize the text box.
input.addEventListener("input", () => {
    input.style.height = "auto";
    input.style.height = Math.min(input.scrollHeight, 150) + "px";
});

// New Chat.
newChatBtn.addEventListener("click", () => {
    startChat("New Chat", true);
    currentFile = null;
    fileStatus.textContent = "";
    fileInput.value = "";
});

// Search Chats.
searchBtn.addEventListener("click", () => {
    const query = prompt("Search your chats:");

    if (query === null) return;

    const searchTerm = query.toLowerCase().trim();

    document.querySelectorAll(".chat-item").forEach(item => {
        item.style.display = item.textContent
            .toLowerCase()
            .includes(searchTerm) ? "block" : "none";
    });
});

// Library.
libraryBtn.addEventListener("click", () => {
    startChat("Library");
    messageList.classList.add("visible");
    addMessage(
        "📚 Your Library\n\nYour saved items will appear here. Saving and loading library items can be added next.",
        "assistant"
    );
});

// Suggested prompt cards.
document.querySelectorAll(".suggestion-card").forEach(card => {
    card.addEventListener("click", () => {
        startChat("New Chat");
        input.value = card.dataset.prompt;
        sendMessage();
    });
});

// Share the page.
shareBtn.addEventListener("click", async () => {
    try {
        if (navigator.share) {
            await navigator.share({
                title: "My AI",
                text: "Check out my AI assistant website!",
                url: window.location.href
            });
        } else {
            await navigator.clipboard.writeText(window.location.href);
            shareBtn.textContent = "✓ Link copied";
            setTimeout(() => {
                shareBtn.textContent = "↗ Share";
            }, 1800);
        }
    } catch (error) {
        if (error.name !== "AbortError") {
            alert("Sharing isn't available here. Copy the page URL from your browser.");
        }
    }
});

// Attach a file.
attachBtn.addEventListener("click", () => fileInput.click());

fileInput.addEventListener("change", () => {
    currentFile = fileInput.files[0] || null;
    fileStatus.textContent = currentFile
        ? "Selected: " + currentFile.name
        : "";
});

// Profile.
profileBtn.addEventListener("click", () => {
    alert("My AI Account\n\nPlan: Free\nProfile settings can be added here.");
});

// Make initial history entries keyboard accessible.
document.querySelectorAll(".chat-item").forEach(item => {
    item.tabIndex = 0;
    item.setAttribute("role", "button");

    item.addEventListener("click", () => {
        startChat(item.textContent);
        messageList.classList.add("visible");
        addMessage(
            `You opened "${item.textContent}". This demo does not save previous messages yet.`,
            "assistant"
        );
    });

    item.addEventListener("keydown", event => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            item.click();
        }
    });
});
