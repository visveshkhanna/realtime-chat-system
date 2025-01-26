const joinButton = document.getElementById("join-button");

joinButton.addEventListener("click", () => {
  const user = localStorage.getItem("username");
  if (!user) {
    window.location.href = `/auth/login`;
  }
  window.location.href = `/chat/${chatId}?user=${user}`;
});
