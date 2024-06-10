const signupForm = document.querySelector("#signup-form");

const username = document.querySelector("#name");
const email = document.querySelector("#email");
const password = document.querySelector("#password");

async function handleSubmit(e) {
  e.preventDefault();

  if (username && email && password) {
    username = username.value.trim();
    email = email.value.trim();
    password = password.value.trim();

    const newUserToCreate = {
      username,
      email,
      password,
    };

    try {
      const response = await fetch("/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUserToCreate),
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
