const apiUrl = "https://68219a92259dad2655afc3d3.mockapi.io";
const imageUrl = document.getElementById("imageUrl");
const postText = document.getElementById("postText");
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

  // const data = await response.json();
  // console.log("تم نشر", data);
  // alert("تم النشر");
  getPosts();
});

async function getPosts() {
  const res = await fetch(`${apiUrl}/images`);
  const posts = await res.json();
  dsipalyPosts(posts);
}
function dsipalyPosts(posts) {
  const container = document.getElementById("posts-container");
  container.innerHTML = "";
  const commentsDiv = document.createElement("div");
  const comeentUl = document.createElement("ul");
  posts.forEach((item) => {
    const card = document.createElement("div");
    card.className = "card";
    const img = document.createElement("img");
    img.src = item.imageUrl;
    img.style.width = "150px";
    const title = document.createElement("h4");
    title.innerText = item.text;
    const commentLi = document.createElement("li");
    card.appendChild(img);
    card.appendChild(title);
    comeentUl.appendChild(commentLi);
    card.appendChild(comeentUl);
    container.appendChild(card);
  });
}

getPosts();
