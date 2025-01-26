document
  .getElementById("create-chat-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const jwt = localStorage.getItem("jwt");

    if (!jwt) {
      alert("Please login first");
      window.location.href = "/auth/login";
      return;
    }

    const chatName = document.getElementById("name").value.trim();
    if (chatName) {
      const req = await fetch("/chat/create", {
        method: "POST",
        body: JSON.stringify({ chatName: chatName }),
        headers: {
          jwt: jwt,
          "Content-Type": "application/json",
        },
      });
      const resp = await req.json();
      if (resp.success) {
        window.location.href = `/chat/${resp.id}`;
        return;
      }
      alert("Failed to create chat");
    }
  });
