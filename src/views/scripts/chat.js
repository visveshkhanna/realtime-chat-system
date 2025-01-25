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

const input = document.getElementById("chat-input");
const sendButton = document.getElementById("send-button");

const messagesContainer = document.getElementById("messages-container");
const socket = io("ws://localhost:3001", {
  query: {
    id: chatInfo.id,
    user: JSON.stringify({
      name: "Visvesh",
    }),
  },
});

chatInfo.messages.forEach((message) => {
  messagesContainer.innerHTML += Message(message.from, message.content);
});

socket.on(chatInfo.id, (message) => {
  messagesContainer.innerHTML += Message(message.from, message.content);
});

sendButton.addEventListener("click", () => {
  const message = input.value;
  if (message) {
    socket.emit(chatInfo.id, {
      from: chatInfo.sender,
      content: message,
    });
    messagesContainer.innerHTML += Message(chatInfo.sender, message);
    input.value = "";
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
});
