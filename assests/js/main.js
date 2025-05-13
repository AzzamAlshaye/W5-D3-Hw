// main.js
const apiUrl = "https://68219a92259dad2655afc3d3.mockapi.io/images";
const imageUrl = document.getElementById("li-image");
const postText = document.getElementById("li-textarea");
const button = document.getElementById("submit");
const currentUser = localStorage.getItem("username");

// Hide the new-post form if not logged in
const formDiv = document.getElementById("form-div");
if (!currentUser) {
  formDiv.style.display = "none";
}

button.addEventListener("click", async () => {
  if (!postText.value.trim() || !imageUrl.value.trim()) return;
  await fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      imageUrl: imageUrl.value,
      text: postText.value,
      comments: [],
      owner: currentUser,
    }),
  });
  postText.value = "";
  imageUrl.value = "";
  getPosts();
});

async function getPosts() {
  const res = await fetch(apiUrl);
  let posts = await res.json();

  // ── NORMALIZE SCHEMA ─────────────────────────────────────
  posts = posts.map((p) => ({
    ...p,
    comments: Array.isArray(p.comments)
      ? p.comments
      : Array.isArray(p.comment)
      ? p.comment
      : [],
    owner: p.owner || p.username || "",
  }));
  // ─────────────────────────────────────────────────────────

  displayPosts(posts);
}
function displayPosts(posts) {
  const container = document.getElementById("container-main");
  container.innerHTML = "";

  posts.forEach((item) => {
    // Column wrapper for responsive grid
    const col = document.createElement("div");
    col.className = "col-12 col-sm-6 col-lg-4 mb-4";

    // Card container
    const card = document.createElement("div");
    card.className = "card h-100";

    // Post image
    const img = document.createElement("img");
    img.src = item.imageUrl;
    img.className = "card-img-top";

    // Card body
    const cardBody = document.createElement("div");
    cardBody.className = "card-body d-flex flex-column";

    // Post text
    const title = document.createElement("h5");
    title.innerText = item.text;
    title.className = "card-title";
    cardBody.appendChild(title);

    // Delete post button (only for owner)
    if (currentUser && item.owner === currentUser) {
      const delBtn = document.createElement("button");
      delBtn.className = "btn btn-danger btn-sm align-self-end mb-2";
      delBtn.innerText = "Delete";
      delBtn.addEventListener("click", async () => {
        await fetch(`${apiUrl}/${item.id}`, { method: "DELETE" });
        getPosts();
      });
      cardBody.appendChild(delBtn);
    }

    // Comments list
    const commentList = document.createElement("ul");
    commentList.className = "list-group list-group-flush mb-3";
    (item.comments || []).forEach((comm, idx) => {
      const li = document.createElement("li");
      li.className =
        "list-group-item d-flex justify-content-between align-items-center";
      li.innerText = `${comm.user}: ${comm.text}`;

      // Delete comment button (only for commenter)
      if (currentUser === comm.user) {
        const cDelBtn = document.createElement("button");
        cDelBtn.className = "btn btn-sm btn-outline-danger";
        cDelBtn.innerText = "Delete";
        cDelBtn.addEventListener("click", async () => {
          const updated = item.comments.filter((_, i) => i !== idx);
          await fetch(`${apiUrl}/${item.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ comments: updated }),
          });
          getPosts();
        });
        li.appendChild(cDelBtn);
      }

      commentList.appendChild(li);
    });
    cardBody.appendChild(commentList);

    // Add-comment form (only for logged-in users)
    if (currentUser) {
      const commentDiv = document.createElement("div");
      commentDiv.className = "mt-auto";

      const input = document.createElement("input");
      input.type = "text";
      input.className = "form-control form-control-sm mb-1";
      input.placeholder = "Add a comment...";

      const btn = document.createElement("button");
      btn.className = "btn btn-primary btn-sm";
      btn.innerText = "Comment";
      btn.addEventListener("click", async () => {
        if (!input.value.trim()) return;
        const newComment = { user: currentUser, text: input.value.trim() };
        const updated = [...(item.comments || []), newComment];
        await fetch(`${apiUrl}/${item.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ comments: updated }),
        });
        getPosts();
      });

      commentDiv.appendChild(input);
      commentDiv.appendChild(btn);
      cardBody.appendChild(commentDiv);
    }

    // Assemble card
    card.appendChild(img);
    card.appendChild(cardBody);
    col.appendChild(card);
    container.appendChild(col);
  });
}

getPosts();
