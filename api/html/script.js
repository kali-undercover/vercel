const randomChars = "QWERTZUIOPASDFGHJKLMNBVCXYqwertzuioplkjhgfdsayxcvbnm1234567890._@";
var content = document.getElementById("content");
var you = document.getElementById("you");
var Uploaddiv = document.getElementById("Upload");
var fileInput = document.getElementById("fileInput");
var icon = document.getElementById("icon")
var userData = []
var Url = new URL(document.location)
var isOnFullcsreen = false

var params = Url.searchParams.get("user")
var postParams = Url.searchParams.get("post")
var loginParam = Url.searchParams.get("Login")

if (loginParam == "") {
    toLogin();
    setTimeout(() => { toLogin(); }, 1000)
}

if (params != null) {
    if (params == "random") {
        getRandomUser()
    } else {
        openUser(params);
    }
}
else {
    openUser(getItem("user"))
}

function toggleClass(elem) {
    if (document.getSelection() == "") {
        elem.classList.toggle("postscroll");
    }
}

resize()
window.addEventListener("resize", resize)
function resize() {
    if (window.innerWidth > 600) {
        you.classList.remove("none")
        content.classList.remove("none")
    }
    /*if (window.innerWidth < 600) {
        you.classList.remove("none")
        content.classList.add("none")
    }*/
}

async function getRandomUser() {
    var url = new URL(document.location.origin)
    url.pathname = "/userList";
    var resp = await fetch(url)
    var res = await resp.json()
    openUser(res[Math.floor(Math.random() * res.length)])
}

async function goToUserList() {
    var url = new URL(document.location.origin)
    url.searchParams.set("Userlist", "")
    window.history.pushState("", "", url)
    content.innerHTML = ""
    var url = new URL(document.location.origin)
    url.pathname = "/userList";
    var resp = await fetch(url)
    var res = await resp.json()
    for (let index = 0; index < res.length; index++) {
        content.innerHTML += `<button id="button${res[index]}"><h3 style="cursor: pointer;" id="header${res[index]}"></h3></button>`
        document.getElementById(`header${res[index]}`).innerText = res[index]
        document.getElementById("button" + res[index]).setAttribute("onclick", `openUser('${res[index]}')`)
    }
}

if (getItem("user") == null) {
    toLogin();
    you.classList.remove('none');
    content.classList.add('none')
}
else {
    start()
}

async function start() {
    var url = new URL(document.location.origin + "/getPrivateUserData")
    url.searchParams.set("user", getItem("user"))
    url.searchParams.set("password", getItem("password"))
    var resp = await fetch(url)
    var res = await resp.json()
    userData = res;
    if (res?.error) {
        toLogin()
    }
    you.innerHTML = `
<div>
    <h1>${res.userName || getItem("user")}</h1>
    <p>${res.follower} Follower</p>
    <hr>
    <p>${res.abbos.length} Abbos</p>
    <div id="yourContentDivElem" class="abbo-div"></div>
    <hr>
    <div onclick="toChatt('${getItem("user")}')" id="latestNotification">
        <p id="latestNotificationMsg">Massage</p>
        <p id="latestNotificationUser">User</p>
        <hr>
    </div>
</div>`
    const yourContentDivElem = document.getElementById("yourContentDivElem");
    for (let index = 0; index < res.abbos.length; index++) {
        try {
            var NameUrl = new URL(document.location.origin + "/getName");
            NameUrl.searchParams.set("user", res.abbos[index]);
            var NameResultCt = await fetch(NameUrl);
            var NameResult = await NameResultCt.text()
            if (NameResult !== "error") {
                yourContentDivElem.innerHTML += `<p class="abbo" onclick="openUser('${res.abbos[index]}')">${NameResult} <button class="delete-abbo-button" onclick="DAbboniere('${res.abbos[index]}')"><svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg></button></p>`
            }
        } catch (e) { console.log(e) }
    }
}

async function openUser(user) {
    var url = new URL(document.location.origin)
    url.searchParams.set("user", user)
    window.history.pushState("", "", url)
    if (window.innerWidth < 600) {
        content.classList.remove('none');
        you.classList.add('none')
    }
    content.innerHTML = `<div class="loading"></div>`;
    document.title = user;
    var url = new URL(document.location.origin + "/getPublicUserData");
    url.searchParams.set("user", user);
    var resp = await fetch(url);
    var res = await resp.json();
    resize()
    if (!res?.error) {
        content.innerHTML =
            `<div class="content-black">
    <center>
        <h1 id="otherUserHeader"></h1>
        <img id="UserLogo">
        <p>${res.follower} Follower</p>
        <hr>
        <p id="description"></p><hr>
    </center>
    </div>
    <div style="display: flex;">
        <button id="abbo-button" onclick="Abboniere('${user}')">Abbonieren</button>
        <button style="width: 30px;height: 30px;" onclick="toChatt('${user}')"><svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M120-160v-640l760 320-760 320Zm80-120 474-200-474-200v140l240 60-240 60v140Zm0 0v-400 400Z" /></svg></button>
        <button style="width: 30px;height: 30px;" onclick="DAbboniere('${user}')"><svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg></button>
    </div><div id="otherPosts"></div>`

        setTimeout(() => {
            try {
                const abboButton = document.getElementById("abbo-button")
                if (userData.abbos.includes(user)) {
                    abboButton.innerHTML = "Abboniert"
                    abboButton.classList.add("abbo-focus")
                }
            } catch (error) { }
        }, 0)

        document.getElementById("otherUserHeader").innerText = res.userName || user;
        document.getElementById("UserLogo").src = res?.icon;
        if (res?.icon?.length < 5000000) {
            icon.href = res?.icon;
        } else {
            icon.href = "http://dreamworthsolutions.com/garwarealfa/student/dist/img/user.png";
        }
        document.querySelector(".content-black").style.backgroundImage = "url('" + res?.backgroundIcon + "')";

        document.getElementById("description").innerText = res.description
        for (let index = 0; index < res.posts.length; index++) {
            var likes = res.posts[index].likes.length - res.posts[index].dislikes.length
            if (!(likes > 0)) {
                likes = 0
            }
            document.getElementById("otherPosts").innerHTML += `
<div onmouseover="HoverPost('${user}', '${res.posts[index]?.id}')" class="post" id="${res.posts[index]?.id}">
    <button onclick="SharePost('${res.posts[index]?.id}','${user}')" class="share"><svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M720-80q-50 0-85-35t-35-85q0-7 1-14.5t3-13.5L322-392q-17 15-38 23.5t-44 8.5q-50 0-85-35t-35-85q0-50 35-85t85-35q23 0 44 8.5t38 23.5l282-164q-2-6-3-13.5t-1-14.5q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35q-23 0-44-8.5T638-672L356-508q2 6 3 13.5t1 14.5q0 7-1 14.5t-3 13.5l282 164q17-15 38-23.5t44-8.5q50 0 85 35t35 85q0 50-35 85t-85 35Zm0-640q17 0 28.5-11.5T760-760q0-17-11.5-28.5T720-800q-17 0-28.5 11.5T680-760q0 17 11.5 28.5T720-720ZM240-440q17 0 28.5-11.5T280-480q0-17-11.5-28.5T240-520q-17 0-28.5 11.5T200-480q0 17 11.5 28.5T240-440Zm480 280q17 0 28.5-11.5T760-200q0-17-11.5-28.5T720-240q-17 0-28.5 11.5T680-200q0 17 11.5 28.5T720-160Zm0-600ZM240-480Zm480 280Z" /></svg></button>
    <h1 id="postHeader${index}"></h1>
    <p id="postDate${index}" class="your-post-date"></p>
    <div onclick="document.getElementById('postContent${index}').classList.toggle('none')" style="display:flex;align-items: center; cursor: pointer;"><svg style="background-color: gold;fill:black;margin:5px 0px;" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M480-345 240-585l56-56 184 184 184-184 56 56-240 240Z"/></svg>Read Post</div>
    <p id="postContent${index}" class="none"></p>
    <br>
    <div class="like-menue">
        <div style="display: flex;align-items: center;margin-left: 5px;">
            <p id="LikeText${index}">${likes} Likes</p>
            <button id="disLikeButton${index}" onclick="DisLike('${res.posts[index]?.id}', '${user}',${index},${likes})" style="margin-left:auto;margin-right: -0px;" class="LikeButton"><svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M240-840h440v520L400-40l-50-50q-7-7-11.5-19t-4.5-23v-14l44-174H120q-32 0-56-24t-24-56v-80q0-7 2-15t4-15l120-282q9-20 30-34t44-14Zm360 80H240L120-480v80h360l-54 220 174-174v-406Zm0 406v-406 406Zm80 34v-80h120v-360H680v-80h200v520H680Z"/></svg></button>
            <button id="likeButton${index}" onclick="Like('${res.posts[index]?.id}', '${user}',${index},${likes})" class="LikeButton"><svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M720-120H280v-520l280-280 50 50q7 7 11.5 19t4.5 23v14l-44 174h258q32 0 56 24t24 56v80q0 7-2 15t-4 15L794-168q-9 20-30 34t-44 14Zm-360-80h360l120-280v-80H480l54-220-174 174v406Zm0-406v406-406Zm-80-34v80H160v360h120v80H80v-520h200Z"/></svg></button>
        </div>
        <form id="kommentForm${index}" onsubmit="Komment(event,${index},'${res.posts[index]?.id}','${user}',${res.posts[index].komments.length})" class="KommentForm">
            <input id="KommentInput${index}" placeholder="Komment..." class="small-komment-input">
            <button class="SendButton"><svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M120-160v-640l760 320-760 320Zm80-120 474-200-474-200v140l240 60-240 60v140Zm0 0v-400 400Z"/></svg></button>
        </form>
    </div>
    <div class="Komments">
        <p id="KommentText${index}">${res.posts[index].komments.length} Komments...</p>
        <div id="Komments${index}"></div>
    </div>
</div>`
            document.getElementById("postDate" + index).innerText = res.posts[index].date
            document.getElementById("postHeader" + index).innerText = res.posts[index].header
            document.getElementById("postContent" + index).innerText = res.posts[index].content
            if (res.posts[index].likes.includes(getItem("user"))) {
                document.getElementById("likeButton" + index).classList.add("selected");
            }
            if (res.posts[index].dislikes.includes(getItem("user"))) {
                document.getElementById("disLikeButton" + index).classList.add("selected");
            }
            for (let i = 0; i < res.posts[index].komments.length; i++) {
                document.getElementById("Komments" + index).innerHTML += `
<div id="Komment${index}${i}" class="Komment">
    <p id="K${index}${i}"></p>
    <p><b><i class="komment-to-user-button" id="U${index}${i}"></i></b></p>
</div>`
                document.getElementById(`K${index}${i}`).innerText = res.posts[index].komments[i].komment
                document.getElementById(`U${index}${i}`).innerText = res.posts[index].komments[i].user
                document.getElementById(`U${index}${i}`).setAttribute("onclick", "openUser('" + res.posts[index].komments[i].user + "')")
                if (res.posts[index].komments[i].user == user) {
                    document.getElementById(`Komment${index}${i}`).setAttribute("style", "background-color:dodgerblue;color:black;")
                }
                if (res.posts[index].komments[i].user == getItem("user")) {
                    document.getElementById(`Komment${index}${i}`).setAttribute("style", "background-color:yellowgreen;color:black;")
                }
            }
        }
    }
    try {
        document.getElementById(postParams).scrollIntoView();
        document.getElementById(postParams).style.backgroundColor = "rgb(0, 40, 80)"
        document.getElementById(postParams).style.color = "rgba(30, 143, 255)"
    } catch (error) { }
    if (res.follower == undefined || user == undefined) {
        content.innerHTML = `<button onclick="openUser(getItem("user"))">Open Your Account</button>`
    }
}

function toChatt(room) {
    content.innerHTML = `
    <div class="chattroom">
        <div id="messages"></div>
        <form id="form">
            <input id="message" placeholder="Message">
            <button id="send">
                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
                    <path d="M120-160v-640l760 320-760 320Zm80-120 474-200-474-200v140l240 60-240 60v140Zm0 0v-400 400Z" />
                </svg>
            </button>
        </form>
    </div>`
    toSocket(room)
}

function HoverPost(user, id) {
    var url = new URL(document.location.origin)
    url.searchParams.set("user", user)
    url.searchParams.set("post", id)
    window.history.pushState("", "", url)
}

window.addEventListener("keydown", e => {
    var isf = false
    var inputs = document.querySelectorAll("input")
    inputs.forEach(input => {
        if (input.value != "") {
            isf = true
        }
    });
    if (!isf && e.key == "f") {
        toggleFullscreen()
    }
    if (!isf && window.innerWidth > 400) {
        try {
            content.scrollTop = content.scrollHeight * 0.1 * parseInt(e.key)
        } catch (error) {
            console.log(error)
        }
    }
})

function toggleFullscreen() {
    console.log(isOnFullcsreen);
    if (!isOnFullcsreen) {
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        } else if (document.documentElement.webkitRequestFullscreen) { /* Safari */
            document.documentElement.webkitRequestFullscreen();
        } else if (document.documentElement.msRequestFullscreen) { /* IE11 */
            document.documentElement.msRequestFullscreen();
        }
        isOnFullcsreen = true
        document.getElementById("FullscreenButton").innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M320-200v-120H200v-80h200v200h-80Zm240 0v-200h200v80H640v120h-80ZM200-560v-80h120v-120h80v200H200Zm360 0v-200h80v120h120v80H560Z"/></svg>`
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) { /* Safari */
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { /* IE11 */
            document.msExitFullscreen();
        }
        isOnFullcsreen = false
        document.getElementById("FullscreenButton").innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M200-200v-200h80v120h120v80H200Zm0-360v-200h200v80H280v120h-80Zm360 360v-80h120v-120h80v200H560Zm120-360v-120H560v-80h200v200h-80Z" /></svg>`
    }
}

async function SharePost(id, user) {
    var url = new URL(document.location.origin)
    url.searchParams.set("user", user)
    url.searchParams.set("post", id)
    window.history.pushState("", "", url)
    const shareData = {
        title: "Hacker Post",
        text: "visit" + user,
        url: url,
    }
    try {
        var x = prompt("Send With Whatsapp?  y|n")
    } catch (error) {
        var wa = new URL("https://api.whatsapp.com/send")
        wa.searchParams.set("text", url)
        window.location = wa;
    }
    if (x == "y") {
        var wa = new URL("https://api.whatsapp.com/send")
        wa.searchParams.set("text", url)
        window.open(wa)
    }
    else {
        try {
            await navigator.share(shareData)
        } catch (error) {
            console.log(error)
        }
    }
}

async function DisLike(id, user, index, likes) {
    document.getElementById("disLikeButton" + index).classList.add("selected");
    document.getElementById("likeButton" + index).classList.remove("selected");
    likes > 0 ? document.getElementById(`LikeText${index}`).innerText = (likes - 1) + " Likes" : document.getElementById(`LikeText${index}`).innerText = "0 Likes"
    var newPost = JSON.stringify({
        user: getItem("user"),
        password: getItem("password"),
        function: "DisLike",
        id: id,
        kommentant: user
    })
    await fetch(document.location.origin, {
        method: "POST",
        body: newPost
    })
    //openUser(user)
}

async function Like(id, user, index, likes) {
    document.getElementById("disLikeButton" + index).classList.remove("selected");
    document.getElementById("likeButton" + index).classList.add("selected");
    document.getElementById(`LikeText${index}`).innerText = (likes + 1) + " Likes"
    var newPost = JSON.stringify({
        user: getItem("user"),
        password: getItem("password"),
        function: "Like",
        id: id,
        kommentant: user
    })
    await fetch(document.location.origin, {
        method: "POST",
        body: newPost
    })
    //openUser(user)
}

async function Komment(e, index, id, user, kommentsLength) {
    e.preventDefault()
    const comment = document.getElementById("KommentInput" + index).value
    if (comment.length > 500) {
        alert("Komment Too Long... Max 500Chars");
        return
    }
    document.getElementById("KommentInput" + index).value = ""
    const i = kommentsLength + Math.floor(Math.random() * 100)
    document.getElementById("Komments" + index).innerHTML = `
    <div style="background-color:yellowgreen;color:black;" id="Komment${index}${kommentsLength + 1}" class="Komment">
        <p id="K${index}${i}"></p>
        <p><b><i class="komment-to-user-button" id="U${index}${i}"></i></b></p>
    </div>` + document.getElementById("Komments" + index).innerHTML;

    document.getElementById(`K${index}${i}`).innerText = comment
    document.getElementById(`U${index}${i}`).innerText = getItem("user")
    document.getElementById(`U${index}${i}`).setAttribute("onclick", "openUser('" + getItem("user") + "')")
    document.getElementById(`KommentText${index}`).innerText = (kommentsLength + 1) + " Komments"
    document.getElementById(`kommentForm${index}`).setAttribute("onsubmit", `Komment(event,${index},'${id}','${user}',${kommentsLength + 1})`)
    var newPost = JSON.stringify({
        user: getItem("user"),
        password: getItem("password"),
        function: "Komment",
        id: id,
        comment: comment,
        kommentant: user
    })
    await fetch(document.location.origin, {
        method: "POST",
        body: newPost
    })
}

async function editProfile() {
    content.innerHTML = `<div class="loading"></div>`
    var url = new URL(document.location.origin)
    url.searchParams.set("Edit", "");
    window.history.pushState("", "", url)
    var url = new URL(document.location.origin + "/getPrivateUserData")
    url.searchParams.set("user", getItem("user"))
    url.searchParams.set("password", getItem("password"))
    var resp = await fetch(url)
    var res = await resp.json()
    if (res.error) {
        toLogin()
    }
    console.log(res)
    content.innerHTML = `
<div>
    <div style="display: flex;"><h1 contenteditable="" id="newNameInput">${res.userName || getItem("user")}</h1>
    <button onclick="uploadName()" class="update-name-button"><svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M440-320v-326L336-542l-56-58 200-200 200 200-56 58-104-104v326h-80ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z"/></svg></button></div>
    <hr>
    <div class="edit-background-i" style="background-image: url('${res?.backgroundIcon}');">
        <img class="edit-image" onclick="ChangeIcon()" src="${res?.icon}" alt="Image">
    </div>
    <button onclick="ChangeIcon()">Change Change Icon</button>
    <button onclick="ChangeBackgroundIcon()">Change Background Image</button>
    <hr>
    <p>${res.follower} Follower</p>
    <hr>
    <p>Your Description</p>
    <p contenteditable="" id="changeDescriptionDiv" style="border-bottom: 1px solid;padding: 10px;">${res.description}</p>
    <button class="uploadDescriptionButton" onclick="changeDescription()"><svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M440-320v-326L336-542l-56-58 200-200 200 200-56 58-104-104v326h-80ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z"/></svg>Upload Description</button>
    <hr>
    <p>${res.posts.length} Your Posts</p>
    <button onclick="Upload()"><svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>Post</button>
    <div id="your-post-div" class="your-post-div"></div>`
    for (let index = 0; index < res.posts.length; index++) {
        document.getElementById("your-post-div").innerHTML += `
<div class="your-post">
    <h2>${res.posts[index].header}</h2>
    <hr>
    <div onclick="document.getElementById('myPostContent${index}').classList.toggle('none')" style="display:flex;align-items: center;"><svg style="background-color: gold;fill:black;margin:5px 0px;" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M480-345 240-585l56-56 184 184 184-184 56 56-240 240Z"/></svg>Read Post</div>
    <p class="none" id="myPostContent${index}">${res.posts[index].content}</p>
    <hr>
    <p class="your-post-date">${res.posts[index].date}</p>
    <hr>
    <button onclick="Delete(${index})"><svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>Delete</button>
</div>
`}
}

async function uploadName() {
    var cont = document.getElementById("newNameInput").innerText;
    var newPost = JSON.stringify({
        user: getItem("user"),
        password: getItem("password"),
        function: "changeName",
        newName: cont
    })
    await fetch(document.location.origin, {
        method: "POST",
        body: newPost
    })
    openUser(getItem("user"))
}

async function changeDescription() {
    var newPost = JSON.stringify({
        user: getItem("user"),
        password: getItem("password"),
        function: "changeDescription",
        description: document.getElementById("changeDescriptionDiv").textContent
    })
    await fetch(document.location.origin, {
        method: "POST",
        body: newPost
    })
    openUser(getItem("user"))
}

async function Search() {
    var s = prompt("Search User...");
    openUser(s);
    /*
    var url = new URL(document.location.origin);
    url.searchParams.set("user", s);
    window.location = url;
    */
}

async function Share(user) {
    var url = new URL(document.location.origin)
    url.searchParams.set("user", user)
    const shareData = {
        title: "Hacker Post",
        text: "visit" + user,
        url: url,
    }
    try {
        var x = prompt("Send With Whatsapp?  y|n")
    } catch (error) {
        var wa = new URL("https://api.whatsapp.com/send")
        wa.searchParams.set("text", url)
        window.location = wa;
    }
    if (x == "y") {
        var wa = new URL("https://api.whatsapp.com/send")
        wa.searchParams.set("text", url)
        window.open(wa)
    }
    else {
        try {
            await navigator.share(shareData)
        } catch (error) {
            console.log(error)
        }
    }
}

async function Abboniere(user) {
    var newPost = JSON.stringify({
        user: getItem("user"),
        password: getItem("password"),
        function: "abbo",
        abbonent: user
    })
    await fetch(document.location.origin, {
        method: "POST",
        body: newPost
    })
    start()
    openUser(user)
}

async function ChangeIcon() {
    fileInput.click()
    fileInput.addEventListener("change", async (e) => {
        e.preventDefault()
        var fd = new FormData()
        fd.append("file", fileInput.files[0]);
        var u = new URL(document.location.origin)
        u.pathname = "/Upload"
        var res = await fetch(u, {
            method: "POST",
            body: fd
        })
        var path = await res.text();
        console.log(path);

        var newPost = JSON.stringify({
            user: getItem("user"),
            password: getItem("password"),
            function: "changeIcon",
            iconUrl: "img?src=" + path
        })
        await fetch(document.location.origin, {
            method: "POST",
            body: newPost
        })
        editProfile()
        openUser(getItem("user"));
        window.location.reload()
    })
}

async function ChangeBackgroundIcon() {
    fileInput.click()
    fileInput.addEventListener("change", async (e) => {
        e.preventDefault()
        var fd = new FormData()
        fd.append("file", fileInput.files[0]);
        var u = new URL(document.location.origin)
        u.pathname = "/Upload"
        var res = await fetch(u, {
            method: "POST",
            body: fd
        })
        var path = await res.text();
        console.log(path);

        var newPost = JSON.stringify({
            user: getItem("user"),
            password: getItem("password"),
            function: "changeBackgroundIcon",
            iconUrl: "img?src=" + path
        })
        await fetch(document.location.origin, {
            method: "POST",
            body: newPost
        })
        editProfile()
        openUser(getItem("user"));
        window.location.reload()
    })
}

async function DAbboniere(user) {
    var newPost = JSON.stringify({
        user: getItem("user"),
        password: getItem("password"),
        function: "dabbo",
        abbonent: user
    })
    await fetch(document.location.origin, {
        method: "POST",
        body: newPost
    })
    console.log(user)
    start()
}

function Upload() {
    var url = new URL(document.location.origin)
    url.searchParams.set("Upload", "")
    window.history.pushState("", "", url)
    Uploaddiv.classList.remove("none")
}

async function Delete(index) {
    var x = prompt("Do You Want To Delete || write y")
    if (x == "y") {
        var newPost = JSON.stringify({
            user: getItem("user"),
            password: getItem("password"),
            function: "delete",
            index: index
        })
        await fetch(document.location.origin, {
            method: "POST",
            body: newPost
        })
        console.log("DELETE " + index)
        editProfile();
        openUser(getItem("user"))
    }
}

async function Post() {
    Uploaddiv.classList.add("none")
    var newPost = JSON.stringify({
        user: getItem("user"),
        password: getItem("password"),
        type: document.getElementById("newPostType").value,
        function: "post",
        content: {
            header: document.getElementById("newPostHeader").textContent,
            content: document.getElementById("newPostContent").textContent
        }
    })
    await fetch(document.location.origin, {
        method: "POST",
        body: newPost
    })
    editProfile()
    openUser(getItem("user"))
}

function toLogin() {
    var url = new URL(document.location.origin)
    url.searchParams.set("Login", "")
    window.history.pushState("", "", url)
    you.innerHTML = `
        <center>
    <h1>Login</h1>
    <form id="form">
        <input id="user" placeholder="Username...">
        <input id="password" placeholder="Password...">
        <p style="color: red;" id="error"></p>
        <button>Login</button>
        <br>
        <hr>
        <button class="focus" onclick="toLogin()">to Login</button>
        <button onclick="toSignUp()">to Sign Up</button>
    </form>
</center>
`
    document.getElementById("user").focus()
    document.getElementById("form").addEventListener("submit", async (e) => {
        e.preventDefault()
        var u = document.getElementById("user").value
        var p = document.getElementById("password").value
        var resp = await fetch(document.location.origin, {
            method: 'POST',
            body: JSON.stringify({
                user: u,
                password: p,
                function: "login"
            })
        })
        var res = await resp.json()
        console.log(res)
        if (res?.wrongPassword == true) {
            document.getElementById("error").innerHTML = `Wrong Password`;
        }
        if (res?.wrongPassword == false) {
            setItem("user", u);
            setItem("password", p);
            document.getElementById("form").innerHTML = "Right Password... Please WAIT"
            window.location = ""
        }
    })
}
function toSignUp() {
    var url = new URL(document.location.origin)
    url.searchParams.set("SignUp", "")
    window.history.pushState("", "", url)
    you.innerHTML =
        `
<center>
    <h1>Sign Up</h1>
    <form id="form">
        <input id="user" placeholder="New Username...">
        <p style="color: red;" id="error"></p>
        <input id="password" placeholder="New Password...">
        <button>Sign Up</button>
        <br>
        <hr>
        <button onclick="toLogin()">to Login</button>
        <button class="focus" onclick="toSignUp()">to Sign Up</button>
    </form>
</center>
`
    document.getElementById("user").focus()
    document.getElementById("user").addEventListener("input", () => {
        var userN = document.getElementById("user").value
        var can = true
        for (let index = 0; index < userN.length; index++) {
            if (!randomChars.includes(userN[index])) {
                can = false
            }
        }
        if (!can) {
            document.getElementById("error").innerHTML = `Username Darf Keine Sonderzeichen Enthalten`
        }
        else {
            document.getElementById("error").innerHTML = ""
        }
    })

    document.getElementById("form").addEventListener("submit", async (e) => {
        e.preventDefault()
        var u = document.getElementById("user").value
        var p = document.getElementById("password").value
        try {
            var resp = await fetch(document.location.origin, {
                method: 'POST',
                body: JSON.stringify({
                    newUser: u,
                    newPassword: p
                })
            })
            var res = await resp.json()
            console.log(res)
            if (res.UserForgiven == true) {
                document.getElementById("error").innerHTML = `Username Vergeben`
            }
            if (res.UserCreated == true) {
                document.getElementById("form").innerHTML = "User Created... Please WAIT.."
                setItem("user", u)
                setItem("password", p)
                openUser(u)
                start()
            }
        } catch (error) {
            console.log(error)
        }
    })
}

function setItem(path, str) {
    localStorage.setItem(path, str)
}

function getItem(path) {
    var str = localStorage.getItem(path)
    return str;
}