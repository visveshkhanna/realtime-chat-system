document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (!username || !password) {
    alert("Please fill in all the fields");
    return;
  }

  const _response = await fetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const response = await _response.json();

  if (response.status !== "success") {
    alert(response.message);
    return;
  }

  localStorage.setItem("jwt", response.token);
  localStorage.setItem("username", username);

  window.location.href = "/";
});
