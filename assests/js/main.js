const apiUrl = "https://68219a92259dad2655afc3d3.mockapi.io";
const imageUrl = document.getElementById("li-image");
const postText = document.getElementById("li-textarea");
const button = document.getElementById("submit");

button.addEventListener("click", async (e) => {
  // post create post
  const response = await fetch(`${apiUrl}/images`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      imageUrl: imageUrl.value,
      text: postText.value,
      comment: [],
    }),
  });

  getPosts();
});

async function getPosts() {
  const res = await fetch(`${apiUrl}/images`);
  const posts = await res.json();
  dsipalyPosts(posts);
}
function dsipalyPosts(posts) {
  const container = document.getElementById("container-main");
  container.innerHTML = "";
  const commentsDiv = document.createElement("div");
  const comeentUl = document.createElement("ul");
  posts.forEach((item) => {
    const card = document.createElement("div");
    card.classList.add("product-card");
    const img = document.createElement("img");
    img.src = item.imageUrl;

    const title = document.createElement("h4");
    title.innerText = item.text;
    title.classList.add("title");
    // const commentLi = document.createElement("li");
    card.appendChild(img);
    card.appendChild(title);
    // comeentUl.appendChild(commentLi);
    card.appendChild(comeentUl);
    container.appendChild(card);
  });
}

getPosts();
