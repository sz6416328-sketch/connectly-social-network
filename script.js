/* ==========================================
   CONNECTLY SOCIAL NETWORK
   JavaScript
========================================== */


/* ==========================================
   DEFAULT POSTS
========================================== */

const defaultPosts = [

    {
        id: 1,

        author: "Emma Wilson",

        username: "@emmawilson",

        avatar: "https://i.pravatar.cc/100?img=32",

        time: "2 hours ago",

        text:
            "Just finished designing a new landing page! ✨\n\n" +
            "Really enjoying experimenting with modern UI design and responsive layouts.",

        image:
            "https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&w=1200&q=80",

        likes: 128,

        comments: [
            {
                author: "Alex Johnson",
                avatar: "https://i.pravatar.cc/80?img=12",
                text: "This looks amazing!"
            }
        ],

        liked: false
    },


    {
        id: 2,

        author: "Alex Johnson",

        username: "@alexjohnson",

        avatar: "https://i.pravatar.cc/100?img=12",

        time: "4 hours ago",

        text:
            "JavaScript tip of the day 💡\n\n" +
            "Keep your functions small and focused. It makes your code easier to understand and maintain.",

        image: "",

        likes: 76,

        comments: [],

        liked: false
    },


    {
        id: 3,

        author: "Sarah Miller",

        username: "@sarahmiller",

        avatar: "https://i.pravatar.cc/100?img=25",

        time: "Yesterday",

        text:
            "Working on my next web development project. " +
            "The goal is to create something simple, useful and beautiful. 🚀",

        image:
            "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",

        likes: 214,

        comments: [],

        liked: false
    }

];


/* ==========================================
   LOAD POSTS
========================================== */

let posts =
    JSON.parse(localStorage.getItem("connectlyPosts"))
    || defaultPosts;


/* ==========================================
   DOM ELEMENTS
========================================== */

const postsContainer =
    document.getElementById("postsContainer");

const postInput =
    document.getElementById("postInput");

const publishPost =
    document.getElementById("publishPost");

const imageInput =
    document.getElementById("imageInput");

const mediaPreview =
    document.getElementById("mediaPreview");

const themeBtn =
    document.getElementById("themeBtn");

const notificationBtn =
    document.getElementById("notificationBtn");

const notificationPanel =
    document.getElementById("notificationPanel");

const profileBtn =
    document.getElementById("profileBtn");

const viewProfileBtn =
    document.getElementById("viewProfileBtn");

const profileModal =
    document.getElementById("profileModal");

const settingsModal =
    document.getElementById("settingsModal");

const settingsLink =
    document.getElementById("settingsLink");

const searchInput =
    document.getElementById("searchInput");

const sortPosts =
    document.getElementById("sortPosts");

const toast =
    document.getElementById("toast");

const toastMessage =
    document.getElementById("toastMessage");


/* ==========================================
   SAVE POSTS
========================================== */

function savePosts() {

    localStorage.setItem(
        "connectlyPosts",
        JSON.stringify(posts)
    );

}


/* ==========================================
   SHOW TOAST
========================================== */

function showToast(message) {

    toastMessage.textContent = message;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    }, 2500);

}


/* ==========================================
   RENDER POSTS
========================================== */

function renderPosts(list = posts) {

    postsContainer.innerHTML = "";


    if (list.length === 0) {

        postsContainer.innerHTML = `

            <div class="post">

                <p style="text-align:center;color:var(--muted);">
                    No posts found.
                </p>

            </div>

        `;

        return;

    }


    list.forEach(post => {

        const postElement =
            document.createElement("article");

        postElement.className = "post";

        postElement.dataset.id = post.id;


        let commentsHTML = "";


        post.comments.forEach(comment => {

            commentsHTML += `

                <div class="comment">

                    <img
                        src="${comment.avatar}"
                        alt=""
                    >

                    <div class="comment-body">

                        <strong>
                            ${comment.author}
                        </strong>

                        ${comment.text}

                    </div>

                </div>

            `;

        });


        postElement.innerHTML = `

            <div class="post-header">

                <img
                    class="post-author-img"
                    src="${post.avatar}"
                    alt="${post.author}"
                >

                <div class="post-author">

                    <strong>
                        ${post.author}
                    </strong>

                    <span>
                        ${post.username} · ${post.time}
                    </span>

                </div>

                <button
                    class="post-menu"
                    onclick="deletePost(${post.id})"
                >

                    <i class="fa-solid fa-ellipsis"></i>

                </button>

            </div>


            <div class="post-text">
                ${formatText(post.text)}
            </div>


            ${
                post.image
                ?
                `<img
                    class="post-image"
                    src="${post.image}"
                    alt="Post image"
                >`
                :
                ""
            }


            <div class="post-stats">

                <span>
                    ❤️ ${post.likes} likes
                </span>

                <span>
                    ${post.comments.length} comments
                </span>

            </div>


            <div class="post-actions">

                <button
                    class="post-action ${post.liked ? "liked" : ""}"
                    onclick="toggleLike(${post.id})"
                >

                    <i class="${
                        post.liked
                        ? "fa-solid"
                        : "fa-regular"
                    } fa-heart"></i>

                    Like

                </button>


                <button
                    class="post-action"
                    onclick="toggleComments(${post.id})"
                >

                    <i class="fa-regular fa-comment"></i>

                    Comment

                </button>


                <button
                    class="post-action"
                    onclick="sharePost(${post.id})"
                >

                    <i class="fa-solid fa-share"></i>

                    Share

                </button>

            </div>


            <div
                class="comments-section"
                id="comments-${post.id}"
            >

                ${commentsHTML}


                <div class="comment-input">

                    <input
                        type="text"
                        id="commentInput-${post.id}"
                        placeholder="Write a comment..."
                    >

                    <button
                        onclick="addComment(${post.id})"
                    >

                        <i class="fa-solid fa-paper-plane"></i>

                    </button>

                </div>

            </div>

        `;


        postsContainer.appendChild(postElement);

    });

}


/* ==========================================
   FORMAT TEXT
========================================== */

function formatText(text) {

    return text
        .replace(/\n/g, "<br>")
        .replace(
            /#(\w+)/g,
            '<span style="color:var(--primary);">#$1</span>'
        );

}


/* ==========================================
   LIKE POST
========================================== */

function toggleLike(id) {

    const post =
        posts.find(post => post.id === id);

    if (!post) return;


    if (post.liked) {

        post.likes--;

        post.liked = false;

    } else {

        post.likes++;

        post.liked = true;

        showToast("Post liked ❤️");

    }


    savePosts();

    renderPosts();

}


/* ==========================================
   COMMENTS
========================================== */

function toggleComments(id) {

    const section =
        document.getElementById(`comments-${id}`);

    if (!section) return;

    section.classList.toggle("show");

}


function addComment(id) {

    const input =
        document.getElementById(`commentInput-${id}`);

    const text =
        input.value.trim();


    if (!text) {

        showToast("Write something first.");

        return;

    }


    const post =
        posts.find(post => post.id === id);


    if (!post) return;


    post.comments.push({

        author: "Saira Zafar",

        avatar:
            "https://i.pravatar.cc/80?img=47",

        text: text

    });


    input.value = "";

    savePosts();

    renderPosts();

    showToast("Comment added 💬");


    setTimeout(() => {

        const section =
            document.getElementById(`comments-${id}`);

        if (section) {

            section.classList.add("show");

        }

    }, 50);

}


/* ==========================================
   SHARE POST
========================================== */

function sharePost(id) {

    const post =
        posts.find(post => post.id === id);

    if (!post) return;


    if (navigator.share) {

        navigator.share({

            title: "Connectly Post",

            text: post.text

        }).catch(() => {});

    } else {

        navigator.clipboard.writeText(
            post.text
        );

        showToast(
            "Post text copied to clipboard!"
        );

    }

}


/* ==========================================
   DELETE POST
========================================== */

function deletePost(id) {

    const post =
        posts.find(post => post.id === id);


    if (!post) return;


    if (post.author !== "Saira Zafar") {

        showToast(
            "You can only delete your own posts."
        );

        return;

    }


    const confirmDelete =
        confirm("Delete this post?");


    if (!confirmDelete) return;


    posts =
        posts.filter(post => post.id !== id);


    savePosts();

    renderPosts();

    showToast("Post deleted.");


}


/* ==========================================
   CREATE POST
========================================== */

let selectedImage = "";


publishPost.addEventListener(
    "click",
    () => {

        const text =
            postInput.value.trim();


        if (!text && !selectedImage) {

            showToast(
                "Write something or select an image."
            );

            return;

        }


        const newPost = {

            id: Date.now(),

            author: "Saira Zafar",

            username: "@sairazafar",

            avatar:
                "https://i.pravatar.cc/100?img=47",

            time: "Just now",

            text: text || "Shared a photo 📸",

            image: selectedImage,

            likes: 0,

            comments: [],

            liked: false

        };


        posts.unshift(newPost);


        savePosts();

        renderPosts();


        postInput.value = "";

        selectedImage = "";

        mediaPreview.innerHTML = "";

        mediaPreview.style.display = "none";

        imageInput.value = "";


        showToast(
            "Your post has been published! 🎉"
        );

    }
);


/* ==========================================
   IMAGE UPLOAD
========================================== */

imageInput.addEventListener(
    "change",
    function () {

        const file = this.files[0];

        if (!file) return;


        const reader =
            new FileReader();


        reader.onload = function(event) {

            selectedImage =
                event.target.result;


            mediaPreview.innerHTML = `

                <img
                    src="${selectedImage}"
                    alt="Preview"
                >

            `;


            mediaPreview.style.display = "block";

        };


        reader.readAsDataURL(file);

    }
);


/* ==========================================
   DARK MODE
========================================== */

const savedTheme =
    localStorage.getItem("connectlyTheme");


if (savedTheme === "dark") {

    document.body.classList.add("dark");

    themeBtn.innerHTML =
        '<i class="fa-solid fa-sun"></i>';

}


themeBtn.addEventListener(
    "click",
    () => {

        document.body.classList.toggle("dark");


        const dark =
            document.body.classList.contains("dark");


        localStorage.setItem(
            "connectlyTheme",
            dark ? "dark" : "light"
        );


        themeBtn.innerHTML =
            dark
            ?
            '<i class="fa-solid fa-sun"></i>'
            :
            '<i class="fa-solid fa-moon"></i>';

    }
);


/* ==========================================
   NOTIFICATIONS
========================================== */

notificationBtn.addEventListener(
    "click",
    (event) => {

        event.stopPropagation();

        notificationPanel.classList.toggle("show");

    }
);


document.addEventListener(
    "click",
    (event) => {

        if (
            !notificationPanel.contains(event.target) &&
            event.target !== notificationBtn
        ) {

            notificationPanel.classList.remove(
                "show"
            );

        }

    }
);


document.getElementById(
    "clearNotifications"
).addEventListener(
    "click",
    () => {

        document.getElementById(
            "notificationList"
        ).innerHTML = `

            <p style="
                padding:20px;
                text-align:center;
                color:var(--muted);
                font-size:12px;
            ">
                No new notifications.
            </p>

        `;


        document.querySelector(
            ".notification-count"
        ).style.display = "none";


        showToast(
            "Notifications cleared."
        );

    }
);


/* ==========================================
   PROFILE MODAL
========================================== */

function openModal(modal) {

    modal.classList.add("show");

}


function closeModal(modal) {

    modal.classList.remove("show");

}


profileBtn.addEventListener(
    "click",
    () => openModal(profileModal)
);


viewProfileBtn.addEventListener(
    "click",
    () => openModal(profileModal)
);


document.querySelector(
    ".modal-close"
).addEventListener(
    "click",
    () => closeModal(profileModal)
);


/* ==========================================
   SETTINGS
========================================== */

settingsLink.addEventListener(
    "click",
    (event) => {

        event.preventDefault();

        openModal(settingsModal);

    }
);


document.querySelector(
    ".settings-close"
).addEventListener(
    "click",
    () => closeModal(settingsModal)
);


/* ==========================================
   CLOSE MODAL ON BACKDROP
========================================== */

window.addEventListener(
    "click",
    event => {

        if (event.target === profileModal) {

            closeModal(profileModal);

        }


        if (event.target === settingsModal) {

            closeModal(settingsModal);

        }

    }
);


/* ==========================================
   FRIEND REQUESTS
========================================== */

document.querySelectorAll(
    ".add-friend"
).forEach(button => {

    button.addEventListener(
        "click",
        () => {

            button.classList.toggle("sent");


            if (button.classList.contains("sent")) {

                button.innerHTML =
                    '<i class="fa-solid fa-check"></i>';

                showToast(
                    "Friend request sent! 🤝"
                );

            } else {

                button.innerHTML =
                    '<i class="fa-solid fa-plus"></i>';

            }

        }
    );

});


/* ==========================================
   SEARCH
========================================== */

searchInput.addEventListener(
    "input",
    function () {

        const query =
            this.value.toLowerCase().trim();


        if (!query) {

            renderPosts();

            return;

        }


        const filtered =
            posts.filter(post =>

                post.author
                    .toLowerCase()
                    .includes(query)

                ||

                post.text
                    .toLowerCase()
                    .includes(query)

                ||

                post.username
                    .toLowerCase()
                    .includes(query)

            );


        renderPosts(filtered);

    }
);


/* ==========================================
   SORT POSTS
========================================== */

sortPosts.addEventListener(
    "change",
    function () {

        let sorted = [...posts];


        if (this.value === "popular") {

            sorted.sort(
                (a, b) => b.likes - a.likes
            );

        } else {

            sorted.sort(
                (a, b) => b.id - a.id
            );

        }


        renderPosts(sorted);

    }
);


/* ==========================================
   PRIVATE ACCOUNT
========================================== */

document.getElementById(
    "privateAccount"
).addEventListener(
    "change",
    function () {

        if (this.checked) {

            showToast(
                "Your account is now private 🔒"
            );

        } else {

            showToast(
                "Your account is now public."
            );

        }

    }
);


/* ==========================================
   INITIAL RENDER
========================================== */

renderPosts();