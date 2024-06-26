const loginForm = document.querySelector("#login-form");

async function handleSubmit(e) {
  e.preventDefault();

  let email = document.querySelector("#email");
  let password = document.querySelector("#password");

  if (email && password) {
    email = email.value.trim();
    password = password.value.trim();
    try {
      const response = await fetch("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (response.ok) {
        document.location.replace("/dashboard");
      } else {
        const message = await response.json();
        console.error(message);
      }
    } catch (error) {
      console.log("Error logging in", error);
    }
  }
}

loginForm.addEventListener("submit", handleSubmit);
