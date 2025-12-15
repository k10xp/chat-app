const socket = io("http://localhost:8080");

const form = document.getElementById("form");
const input = document.getElementById("input");
const messages = document.getElementById("messages");

let myId = null;

//message bubble with nickname above
function addMessage(text, nickname, isOwn = false) {
  const li = document.createElement("li");
  li.classList.add("flex", isOwn ? "justify-end" : "justify-start");

  const wrapper = document.createElement("div");
  wrapper.classList.add("flex", "flex-col", "items-start", "max-w-xs");

  //nickname
  const nameTag = document.createElement("span");
  nameTag.textContent = isOwn ? "You" : nickname;
  nameTag.className = isOwn
    ? "text-right text-xs text-gray-400 mb-1 self-end"
    : "text-xs text-gray-400 mb-1";

  //message
  const bubble = document.createElement("div");
  bubble.textContent = text;
  bubble.className = isOwn
    ? "bg-blue-500 text-white px-4 py-2 rounded-2xl rounded-tr-none break-words"
    : "bg-gray-800 text-gray-200 px-4 py-2 rounded-2xl rounded-tl-none break-words";

  wrapper.appendChild(nameTag);
  wrapper.appendChild(bubble);
  li.appendChild(wrapper);
  messages.appendChild(li);
  messages.scrollTop = messages.scrollHeight;
}

//incoming messages from server
socket.on("message", (msg) => {
  //"<shortId> said <message>"
  const [shortId, ...rest] = msg.split(" ");
  const messageText = rest.slice(1).join(" "); // removes “said”

  //skip own duplicate message (own said ...)
  if (shortId === myId?.substring(0, 4)) return;

  addMessage(messageText, shortId, false);
});

//send message
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  socket.emit("message", text);

  //user sent message, right side
  addMessage(text, "You", true);

  input.value = "";
  input.focus();
});

//connection events
socket.on("connect", () => {
  myId = socket.id;
  addMessage("Connected to chat.", "System", false);
});

socket.on("disconnect", () => {
  addMessage("Disconnected from chat.", "System", false);
});
