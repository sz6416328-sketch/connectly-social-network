/* =========================================================
   CONNECTLY SOCIAL NETWORK
   COMPLETE JAVASCRIPT
========================================================= */


/* =========================================================
   DEFAULT DATA
========================================================= */

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
        liked: false,
        saved: false
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
        liked: false,
        saved: false
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
        liked: false,
        saved: false
    }
];


/* =========================================================
   LOAD DATA
========================================================= */

let posts =
    JSON.parse(localStorage.getItem("connectlyPosts")) ||
    defaultPosts;

let friends =
    JSON.parse(localStorage.getItem("connectlyFriends")) || [
        {
            name: "Emma Wilson",
            username: "@emmawilson",
            avatar: "https://i.pravatar.cc/100?img=32",
            online: true
        },
        {
            name: "Alex Johnson",
            username: "@alexjohnson",
            avatar: "https://i.pravatar.cc/100?img=12",
            online: true
        },
        {
            name: "Sarah Miller",
            username: "@sarahmiller",
            avatar: "https://i.pravatar.cc/100?img=25",
            online: false
        }
    ];

let friendRequests =
    JSON.parse(localStorage.getItem("connectlyFriendRequests")) || [];

let messages =
    JSON.parse(localStorage.getItem("connectlyMessages")) || {};

let currentChat = null;


/* =========================================================
   DOM ELEMENTS
========================================================= */

const postsContainer = document.getElementById("postsContainer");
const postInput = document.getElementById("postInput");
const publishPost = document.getElementById("publishPost");
const imageInput = document.getElementById("imageInput");
const mediaPreview = document.getElementById("mediaPreview");

const themeBtn = document.getElementById("themeBtn");

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


/* =========================================================
   SAVE ALL DATA
========================================================= */

function savePosts() {
    localStorage.setItem(
        "connectlyPosts",
        JSON.stringify(posts)
    );
}

function saveFriends() {
    localStorage.setItem(
        "connectlyFriends",
        JSON.stringify(friends)
    );
}

function saveFriendRequests() {
    localStorage.setItem(
        "connectlyFriendRequests",
        JSON.stringify(friendRequests)
    );
}

function saveMessages() {
    localStorage.setItem(
        "connectlyMessages",
        JSON.stringify(messages)
    );
}


/* =========================================================
   TOAST
========================================================= */

function showToast(message) {

    if (!toast || !toastMessage) return;

    toastMessage.textContent = message;

    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}


/* =========================================================
   FORMAT TEXT
========================================================= */

function formatText(text) {

    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\n/g, "<br>")
        .replace(
            /#(\w+)/g,
            '<span style="color:var(--primary);">#$1</span>'
        );
}


/* =========================================================
   RENDER POSTS
========================================================= */

function renderPosts(list = posts) {

    if (!postsContainer) return;

    postsContainer.innerHTML = "";

    if (!list.length) {

        postsContainer.innerHTML = `
            <div class="post">
                <p style="
                    text-align:center;
                    color:var(--muted);
                    padding:20px;
                ">
                    No posts found.
                </p>
            </div>
        `;

        return;
    }


    list.forEach(post => {

        if (typeof post.saved === "undefined") {
            post.saved = false;
        }

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

                        ${formatText(comment.text)}

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
                    title="Delete post"
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
                `
                    <img
                        class="post-image"
                        src="${post.image}"
                        alt="Post image"
                    >
                `
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


                <button
                    class="post-action ${
                        post.saved ? "saved-post-btn" : ""
                    }"
                    onclick="toggleSavePost(${post.id})"
                    title="${post.saved ? "Remove from saved" : "Save post"}"
                >

                    <i class="${
                        post.saved
                        ? "fa-solid"
                        : "fa-regular"
                    } fa-bookmark"></i>

                    ${post.saved ? "Saved" : "Save"}

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


/* =========================================================
   LIKE
========================================================= */

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


/* =========================================================
   COMMENTS
========================================================= */

function toggleComments(id) {

    const section =
        document.getElementById(`comments-${id}`);

    if (!section) return;

    section.classList.toggle("show");
}


function addComment(id) {

    const input =
        document.getElementById(`commentInput-${id}`);

    if (!input) return;

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


/* =========================================================
   SHARE
========================================================= */

function sharePost(id) {

    const post =
        posts.find(post => post.id === id);

    if (!post) return;


    if (navigator.share) {

        navigator.share({

            title: "Connectly Post",

            text: post.text

        }).catch(() => {});

    } else if (navigator.clipboard) {

        navigator.clipboard
            .writeText(post.text)
            .then(() => {
                showToast(
                    "Post text copied to clipboard!"
                );
            })
            .catch(() => {
                showToast("Unable to copy post.");
            });

    } else {

        showToast("Sharing is not supported here.");

    }
}


/* =========================================================
   SAVE / UNSAVE POST
========================================================= */

function toggleSavePost(id) {

    const post =
        posts.find(post => post.id === id);

    if (!post) return;


    post.saved = !post.saved;

    savePosts();

    renderPosts();


    if (post.saved) {

        showToast("Post saved 🔖");

    } else {

        showToast("Post removed from Saved.");

    }
}


/* =========================================================
   DELETE POST
========================================================= */

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


    if (!confirm("Delete this post?")) return;


    posts =
        posts.filter(post => post.id !== id);

    savePosts();

    renderPosts();

    showToast("Post deleted.");
}


/* =========================================================
   CREATE POST
========================================================= */

let selectedImage = "";


if (publishPost) {

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

                text:
                    text ||
                    "Shared a photo 📸",

                image: selectedImage,

                likes: 0,

                comments: [],

                liked: false,

                saved: false
            };


            posts.unshift(newPost);

            savePosts();

            renderPosts();


            postInput.value = "";

            selectedImage = "";

            if (mediaPreview) {

                mediaPreview.innerHTML = "";

                mediaPreview.style.display =
                    "none";
            }

            if (imageInput) {
                imageInput.value = "";
            }


            showToast(
                "Your post has been published! 🎉"
            );
        }
    );
}


/* =========================================================
   IMAGE UPLOAD
========================================================= */

if (imageInput) {

    imageInput.addEventListener(
        "change",
        function () {

            const file =
                this.files[0];

            if (!file) return;


            const reader =
                new FileReader();


            reader.onload = function(event) {

                selectedImage =
                    event.target.result;


                if (mediaPreview) {

                    mediaPreview.innerHTML = `
                        <img
                            src="${selectedImage}"
                            alt="Preview"
                        >
                    `;

                    mediaPreview.style.display =
                        "block";
                }
            };


            reader.readAsDataURL(file);
        }
    );
}


/* =========================================================
   DARK MODE
========================================================= */

const savedTheme =
    localStorage.getItem("connectlyTheme");


if (
    savedTheme === "dark" &&
    document.body
) {

    document.body.classList.add("dark");

    if (themeBtn) {

        themeBtn.innerHTML =
            '<i class="fa-solid fa-sun"></i>';
    }
}


if (themeBtn) {

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
}


/* =========================================================
   NOTIFICATIONS
========================================================= */

if (notificationBtn && notificationPanel) {

    notificationBtn.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            notificationPanel.classList.toggle(
                "show"
            );
        }
    );


    document.addEventListener(
        "click",
        event => {

            if (
                !notificationPanel.contains(
                    event.target
                ) &&
                event.target !== notificationBtn
            ) {

                notificationPanel.classList.remove(
                    "show"
                );
            }
        }
    );
}


const clearNotifications =
    document.getElementById(
        "clearNotifications"
    );


if (clearNotifications) {

    clearNotifications.addEventListener(
        "click",
        () => {

            const list =
                document.getElementById(
                    "notificationList"
                );

            if (list) {

                list.innerHTML = `
                    <p style="
                        padding:20px;
                        text-align:center;
                        color:var(--muted);
                        font-size:12px;
                    ">
                        No new notifications.
                    </p>
                `;
            }


            const count =
                document.querySelector(
                    ".notification-count"
                );

            if (count) {
                count.style.display = "none";
            }


            showToast(
                "Notifications cleared."
            );
        }
    );
}


/* =========================================================
   MODALS
========================================================= */

function openModal(modal) {

    if (modal) {
        modal.classList.add("show");
    }
}


function closeModal(modal) {

    if (modal) {
        modal.classList.remove("show");
    }
}

/* =========================================================
   PROFILE MODAL
========================================================= */

if (profileBtn && profileModal) {

    profileBtn.addEventListener("click", function () {
        openModal(profileModal);
    });
}


/* =========================================================
   VIEW PROFILE
========================================================= */

if (viewProfileBtn && profileModal) {

    viewProfileBtn.addEventListener("click", function () {
        openModal(profileModal);
    });
}


/* =========================================================
   CLOSE MODALS
========================================================= */

document.querySelectorAll(".modal-close").forEach(button => {

    button.addEventListener("click", function () {

        const modal = this.closest(".modal-overlay");

        if (modal) {
            closeModal(modal);
        }

    });

});


/* =========================================================
   CLOSE MODAL BY CLICKING OUTSIDE
========================================================= */

document.querySelectorAll(".modal-overlay").forEach(overlay => {

    overlay.addEventListener("click", function (event) {

        if (event.target === overlay) {
            closeModal(overlay);
        }

    });

});


/* =========================================================
   SETTINGS
========================================================= */

if (settingsLink && settingsModal) {

    settingsLink.addEventListener("click", function (event) {

        event.preventDefault();

        openModal(settingsModal);

    });

}


/* =========================================================
   PRIVATE ACCOUNT
========================================================= */

const privateAccount =
    document.getElementById("privateAccount");

if (privateAccount) {

    const savedPrivate =
        localStorage.getItem("connectlyPrivateAccount");

    if (savedPrivate === "true") {
        privateAccount.checked = true;
    }

    privateAccount.addEventListener("change", function () {

        localStorage.setItem(
            "connectlyPrivateAccount",
            this.checked
        );

        showToast(
            this.checked
                ? "Private account enabled."
                : "Private account disabled."
        );

    });

}


/* =========================================================
   FRIEND REQUESTS
========================================================= */

document.querySelectorAll(".add-friend").forEach(button => {

    button.addEventListener("click", function () {

        const suggestion =
            this.closest(".suggestion");

        if (!suggestion) return;

        const nameElement =
            suggestion.querySelector(".suggestion-info strong");

        const name =
            nameElement
                ? nameElement.textContent.trim()
                : "User";

        this.innerHTML =
            '<i class="fa-solid fa-check"></i>';

        this.disabled = true;

        friendRequests.push({
            name: name,
            time: Date.now()
        });

        saveFriendRequests();

        showToast(
            `Friend request sent to ${name}`
        );

    });

});


/* =========================================================
   SEARCH
========================================================= */

if (searchInput) {

    searchInput.addEventListener("input", function () {

        const query =
            this.value.trim().toLowerCase();

        if (!query) {

            renderPosts(posts);

            return;
        }

        const filtered =
            posts.filter(post => {

                return (
                    post.author.toLowerCase().includes(query) ||
                    post.username.toLowerCase().includes(query) ||
                    post.text.toLowerCase().includes(query)
                );

            });

        renderPosts(filtered);

    });

}


/* =========================================================
   SORT POSTS
========================================================= */

if (sortPosts) {

    sortPosts.addEventListener("change", function () {

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

    });

}


/* =========================================================
   INITIAL RENDER
========================================================= */

renderPosts();


// =====================================================
// SIDEBAR NAVIGATION
// =====================================================

document.addEventListener("DOMContentLoaded", function () {

    const friendsLink =
        document.getElementById("friendsLink");

    const messagesLink =
        document.getElementById("messagesLink");

    const exploreLink =
        document.getElementById("exploreLink");

    const savedLink =
        document.getElementById("savedLink");

    const homeLink =
        document.getElementById("homeLink");


    // =====================================================
    // CREATE PANEL
    // =====================================================

    function createPanel(title, content) {

        const oldPanel =
            document.getElementById(
                "connectlyDynamicPanel"
            );

        if (oldPanel) {
            oldPanel.remove();
        }


        const overlay =
            document.createElement("div");

        overlay.id =
            "connectlyDynamicPanel";

        overlay.className =
            "modal-overlay";


        overlay.innerHTML = `
            <div class="modal connectly-panel">

                <button
                    class="modal-close connectly-panel-close"
                >
                    <i class="fa-solid fa-xmark"></i>
                </button>

                <h2>${title}</h2>

                <div class="connectly-panel-content">
                    ${content}
                </div>

            </div>
        `;


        document.body.appendChild(overlay);


        // IMPORTANT:
        // Existing modal CSS uses "show"
        overlay.classList.add("show");


        const closeButton =
            overlay.querySelector(
                ".connectly-panel-close"
            );


        if (closeButton) {

            closeButton.addEventListener(
                "click",
                function () {
                    overlay.remove();
                }
            );

        }


        overlay.addEventListener(
            "click",
            function (event) {

                if (event.target === overlay) {
                    overlay.remove();
                }

            }
        );


        return overlay;
    }


    // =====================================================
    // FRIENDS
    // =====================================================

    if (friendsLink) {

        friendsLink.addEventListener(
            "click",
            function (event) {

                event.preventDefault();


                createPanel(
                    "Friends",
                    `
                    <div class="feature-list">

                        <div class="feature-item">

                            <img
                                src="https://i.pravatar.cc/100?img=32"
                            >

                            <div>
                                <strong>Emma Wilson</strong>
                                <small>
                                    12 mutual friends
                                </small>
                            </div>

                            <button class="feature-btn">
                                Friends
                            </button>

                        </div>


                        <div class="feature-item">

                            <img
                                src="https://i.pravatar.cc/100?img=12"
                            >

                            <div>
                                <strong>Alex Johnson</strong>
                                <small>
                                    8 mutual friends
                                </small>
                            </div>

                            <button class="feature-btn">
                                Friends
                            </button>

                        </div>


                        <div class="feature-item">

                            <img
                                src="https://i.pravatar.cc/100?img=25"
                            >

                            <div>
                                <strong>Sarah Miller</strong>
                                <small>
                                    5 mutual friends
                                </small>
                            </div>

                            <button class="feature-btn">
                                Friends
                            </button>

                        </div>

                    </div>
                    `
                );

            }
        );

    }


    // =====================================================
    // MESSAGES
    // =====================================================

    if (messagesLink) {

        messagesLink.addEventListener(
            "click",
            function (event) {

                event.preventDefault();


                const panel =
                    createPanel(
                        "Messages",
                        `
                        <div class="messages-box">

                            <div
                                class="message-user"
                                data-name="Emma Wilson"
                            >

                                <img
                                    src="https://i.pravatar.cc/100?img=32"
                                >

                                <div>
                                    <strong>
                                        Emma Wilson
                                    </strong>

                                    <small>
                                        Hey! How are you?
                                    </small>
                                </div>

                            </div>


                            <div
                                class="message-user"
                                data-name="Alex Johnson"
                            >

                                <img
                                    src="https://i.pravatar.cc/100?img=12"
                                >

                                <div>
                                    <strong>
                                        Alex Johnson
                                    </strong>

                                    <small>
                                        Are you working on the project?
                                    </small>
                                </div>

                            </div>


                            <div
                                class="message-user"
                                data-name="Sarah Miller"
                            >

                                <img
                                    src="https://i.pravatar.cc/100?img=25"
                                >

                                <div>
                                    <strong>
                                        Sarah Miller
                                    </strong>

                                    <small>
                                        Nice post!
                                    </small>
                                </div>

                            </div>

                        </div>
                        `
                    );


                panel
                    .querySelectorAll(".message-user")
                    .forEach(user => {

                        user.addEventListener(
                            "click",
                            function () {

                                openChat(
                                    this.dataset.name
                                );

                            }
                        );

                    });

            }
        );

    }


    // =====================================================
    // CHAT
    // =====================================================

    function openChat(name) {

        const panel =
            createPanel(
                name,
                `
                <div class="chat-box">

                    <div class="chat-messages">

                        <div class="chat-message received">
                            Hi! How are you?
                        </div>

                        <div class="chat-message received">
                            Are you working on your project?
                        </div>

                    </div>


                    <div class="chat-input-row">

                        <input
                            type="text"
                            id="chatInput"
                            placeholder="Write a message..."
                        >

                        <button id="sendChatBtn">
                            <i class="fa-solid fa-paper-plane"></i>
                        </button>

                    </div>

                </div>
                `
            );


        const input =
            panel.querySelector("#chatInput");

        const sendButton =
            panel.querySelector("#sendChatBtn");

        const chatMessages =
            panel.querySelector(".chat-messages");


        function sendMessage() {

            const message =
                input.value.trim();

            if (!message) return;


            const newMessage =
                document.createElement("div");

            newMessage.className =
                "chat-message sent";

            newMessage.textContent =
                message;


            chatMessages.appendChild(
                newMessage
            );


            input.value = "";

            chatMessages.scrollTop =
                chatMessages.scrollHeight;

        }


        sendButton.addEventListener(
            "click",
            sendMessage
        );


        input.addEventListener(
            "keydown",
            function (event) {

                if (event.key === "Enter") {
                    sendMessage();
                }

            }
        );

    }


    // =====================================================
    // EXPLORE
    // =====================================================

    if (exploreLink) {

        exploreLink.addEventListener(
            "click",
            function (event) {

                event.preventDefault();


                createPanel(
                    "Explore",
                    `
                    <div class="explore-grid">

                        <div class="explore-card">
                            <i class="fa-solid fa-code"></i>
                            <h3>Web Development</h3>
                            <p>18.4K posts</p>
                        </div>

                        <div class="explore-card">
                            <i class="fa-solid fa-robot"></i>
                            <h3>Artificial Intelligence</h3>
                            <p>12.8K posts</p>
                        </div>

                        <div class="explore-card">
                            <i class="fa-brands fa-js"></i>
                            <h3>JavaScript</h3>
                            <p>8.2K posts</p>
                        </div>

                        <div class="explore-card">
                            <i class="fa-solid fa-laptop-code"></i>
                            <h3>Frontend</h3>
                            <p>7.5K posts</p>
                        </div>

                    </div>
                    `
                );

            }
        );

    }


    // =====================================================
    // SAVED POSTS
    // =====================================================

    if (savedLink) {

        savedLink.addEventListener(
            "click",
            function (event) {

                event.preventDefault();


                const saved =
                    posts.filter(
                        post => post.saved === true
                    );


                let content = "";


                if (!saved.length) {

                    content = `
                        <div class="empty-feature">

                            <i class="fa-regular fa-bookmark"></i>

                            <h3>No Saved Posts</h3>

                            <p>
                                Save a post and it will appear here.
                            </p>

                        </div>
                    `;

                } else {

                    content =
                        saved.map(post => {

                            return `
                                <div class="saved-post-item">

                                    <strong>
                                        ${post.author}
                                    </strong>

                                    <p>
                                        ${formatText(post.text)}
                                    </p>

                                    <small>
                                        Saved post
                                    </small>

                                </div>
                            `;

                        }).join("");

                }


                createPanel(
                    "Saved Posts",
                    content
                );

            }
        );

    }


    // =====================================================
    // HOME
    // =====================================================

    if (homeLink) {

        homeLink.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            }
        );

    }


    // =====================================================
    // ACTIVE SIDEBAR
    // =====================================================

    const sidebarLinks =
        document.querySelectorAll(
            ".side-nav a"
        );


    sidebarLinks.forEach(link => {

        link.addEventListener(
            "click",
            function () {

                sidebarLinks.forEach(item => {
                    item.classList.remove("active");
                });

                this.classList.add("active");

            }
        );

    });

});
