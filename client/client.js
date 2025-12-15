const socket = io("http://localhost:8080");

const form = document.getElementById("form");
const input = document.getElementById("input");
const messages = document.getElementById("messages");
const sendBtn = document.getElementById("send");

//add a message to the list
function addMessage(text) {
  const li = document.createElement("li");
  li.textContent = text;
  messages.appendChild(li);
  messages.scrollTop = messages.scrollHeight;
}

//handle incoming messages
socket.on("message", (msg) => {
  addMessage(msg);
});

//handle send message
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  socket.emit("message", text);

  input.value = "";
  input.focus();
});

//handle connection events
socket.on("connect", () => {
  addMessage("Connected to chat.");
});

socket.on("disconnect", () => {
  addMessage("Disconnected from chat.");
});
