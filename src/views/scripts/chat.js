const Message = (from, message) => {
  const isSender = from === chatInfo.sender;

  return `
    <div class="flex ${isSender ? "justify-end" : "justify-start"}">
      <div
        class="px-4 py-2 max-w-xs rounded-lg text-white ${
          isSender
            ? "bg-blue-500 text-right"
            : "bg-gray-300 text-left text-black"
        }"
      >
        <span class="block text-sm font-semibold mb-1">${
          isSender ? "You" : from
        }</span>
        <span>${message}</span>
      </div>
    </div>
  `;
};

let typingTimeout;
const input = document.getElementById("chat-input");
const sendButton = document.getElementById("send-button");
const actionView = document.getElementById("action-view");
const messagesContainer = document.getElementById("messages-container");

const socket = io("ws://localhost:3001", {
  query: {
    id: chatInfo.id,
    jwt: localStorage.getItem("jwt"),
    username: localStorage.getItem("username"),
  },
});

let typing = [];

/**
 * Update the typing indicator text based on the `typing` array.
 */
function updateTypingStatus() {
  if (typing.length === 0) {
    actionView.innerText = "";
    return;
  }

  const isPlural = typing.length > 1;
  actionView.innerText = `${typing.join(", ")} ${
    isPlural ? "are" : "is"
  } typing...`;
}

input.addEventListener("keydown", () => {
  if (!typingTimeout) {
    socket.emit(chatInfo.id, {
      type: "action",
      action: "typingStart",
      from: chatInfo.sender,
    });
  }

  clearTimeout(typingTimeout);

  typingTimeout = setTimeout(() => {
    socket.emit(chatInfo.id, {
      type: "action",
      action: "typingStop",
      from: chatInfo.sender,
    });
    typingTimeout = null;
  }, 1000);
});

chatInfo.messages.forEach((message) => {
  messagesContainer.innerHTML += Message(message.from, message.content);
});

// Listen for server events
socket.on(chatInfo.id, (message) => {
  if (message.type === "message") {
    messagesContainer.innerHTML += Message(message.from, message.content);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
  if (message.type === "action") {
    if (message.action === "typingStart") {
      // Add user if not already in array
      if (!typing.includes(message.from)) {
        typing.push(message.from);
      }
    } else if (message.action === "typingStop") {
      // Remove user if present
      typing = typing.filter((username) => username !== message.from);
    }
    updateTypingStatus();
  }
});

const sendMessage = () => {
  const message = input.value.trim();
  if (message) {
    socket.emit(chatInfo.id, {
      type: "action",
      action: "typingStop",
      from: chatInfo.sender,
    });
    socket.emit(chatInfo.id, {
      type: "message",
      content: message,
      from: chatInfo.sender,
    });
    messagesContainer.innerHTML += Message(chatInfo.sender, message);
    input.value = "";
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
};

input.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    sendMessage();
  }
});

sendButton.addEventListener("click", sendMessage);
