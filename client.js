document.addEventListener("DOMContentLoaded", () => {
  const userName = prompt("Enter your name to join");

  if (!userName) {
    alert("Please refresh and enter your name!");
    throw new Error("User cancelled prompt");
  }

  const messageContainer = document.querySelector(".container");

  const append = (message, position) => {
    const messageElement = document.createElement("div");
    messageElement.innerText = message;
    messageElement.classList.add("message", position);
    messageContainer.append(messageElement);
    const userList = document.getElementById("user-list");
    if (userList && position === "right") {
        const userElement = document.createElement("div");
        userElement.innerText = message.split(" ")[0]; 
        const audio = new Audio('iphone.mp3');
        audio.play();
        userElement.classList.add("user");
        userList.prepend(userElement); 
    }
    messageContainer.scrollTop = messageContainer.scrollHeight;
  };

  const socket = io("http://localhost:8000", { transports: ["websocket"] });

  const form = document.getElementById("send-container");
  const messageInput = document.getElementById("messageInp");

  socket.emit("new-user-joined", userName);

  socket.on('user-joined', (name) => {
    if (name !== userName) {
      append(`${name} joined the chat`, "right");
    }
  });

  socket.on("receive", data => {
    append(`${data.name}: ${data.message}`, "left");
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const message = messageInput.value.trim();
    if (message === "") return;

    append(`You: ${message}`, "right");
    socket.emit("send", message);
    messageInput.value = "";
  });

  socket.on("user-left", (name) => {
    append(`${name} left the chat`, "left");
  });
});
