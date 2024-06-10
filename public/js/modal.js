const createBtn = document.querySelector("#create-post-btn");
const modal = document.querySelector("#crud-modal");
const closeBtn = document.querySelector("#close-btn");
const submitBtn = document.querySelector("button[type='submit']");

async function handleSubmit(e) {
  e.preventDefault();

  const postTitle = document.querySelector("#title").value;
  const postContent = document.querySelector("#content").value;

  if (postTitle && postContent) {
    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: postTitle,
          content: postContent,
        }),
      });

      if (response.ok) {
        closeModal();

        //fetch the latest posts
        fetchPosts();
      } else {
        const errorMessage = await response.json();
        console.error("Error:", errorMessage);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }
}

async function fetchPosts() {
  try {
    const response = await fetch("/api/posts");
    const data = await response.json();

    renderPosts(data);
  } catch (error) {
    console.error("Error fetching the post:", error);
  }
}

function renderPosts(posts) {
  //   clearing the existing post container
  const postContainer = document.querySelector("#post-container");
  postContainer.innerHTML = "";

  //   rendering each post
  posts.forEach((post) => {
    const postEl = document.createElement("article");
    postEl.classList.add(
      "max-w-7xl",
      "p-6",
      "bg-white",
      "border",
      "border-gray-200",
      "rounded-lg",
      "shadow",
      "mx-auto",
      "my-3",
      "text-sm"
    );

    postEl.innerHTML = `

       <h5 class="mb-2 text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">${post.title}</h5>
        <p class="mb-3 font-normal text-gray-500 text-lg dark:text-gray-400">${post.content}</p>
        <div class="italic">
          <span class="font-bold text-purple-400">Posted@ ${post.createdAt}</span>
        </div>

      `;

    //appending the element to the container
    postContainer.appendChild(postEl);
  });
}

function openModal() {
  modal.classList.remove("hidden");
  modal.classList.add("flex");
}

function closeModal() {
  modal.classList.add("hidden");
  modal.classList.remove("flex");
}

function handleClick(e) {
  e.preventDefault();
  openModal();
}

function handleCloseClick(e) {
  e.preventDefault();
  closeModal();
}

submitBtn.addEventListener("click", handleSubmit);
createBtn.addEventListener("click", handleClick);
closeBtn.addEventListener("click", handleCloseClick);
