document
  .getElementById("create-chat-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value.trim();
    if (name) {
      localStorage.setItem("userId", name);
      const req = await fetch("/chat/create", {
        method: "POST",
        body: JSON.stringify({ userId: name }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const resp = await req.json();
      if (resp.success) {
        window.location.href = `/chat/${resp.id}?userId=${name}`;
        return;
      }
      alert("Failed to create chat");
    }
  });
