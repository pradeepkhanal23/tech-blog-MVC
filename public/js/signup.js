const signupForm = document.querySelector("#signup-form");

async function handleSubmit(e) {
  e.preventDefault();

  let username = document.querySelector("#name");
  let email = document.querySelector("#email");
  let password = document.querySelector("#password");

  if (username && email && password) {
    email = email.value.trim();
    password = password.value.trim();
    username = username.value.trim();

    try {
      const response = await fetch("/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
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
      console.log("Error signing up", error);
    }
  }
}

signupForm.addEventListener("submit", handleSubmit);
