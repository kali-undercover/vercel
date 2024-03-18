async function toForYou() {
    var url = new URL(document.location.origin)
    url.searchParams.set("forYou", "")
    window.history.pushState("", "", url)
    if (window.innerWidth < 600) {
        content.classList.remove('none');
        you.classList.add('none')
    }
    content.innerHTML = `<div class="loading"></div>`;
    var url = new URL(document.location.origin + "/getPrivateUserData")
    url.searchParams.set("user", getItem("user"))
    url.searchParams.set("password", getItem("password"))
    var resp = await fetch(url)
    var res = await resp.json()
    var abboArray = []
    content.innerHTML = `<div id="otherPosts"></div>`;
    for (let index = 0; index < res.abbos.length; index++) {
        try {
            var url = new URL(document.location.origin + "/getPublicUserData")
            url.searchParams.set("user", res.abbos[index])
            var userResp = await fetch(url)
            var userRes = await userResp.json()
            abboArray.push(userRes)
            var randomIndex = getRandomInt(abboArray.length)
            var randomPostIndex = getRandomInt(abboArray[randomIndex].posts.length)
            renderPost(abboArray[randomIndex], randomPostIndex, res.abbos[randomIndex])
        } catch (error) {

        }
    }
    for (let index = 0; index < 100; index++) {
        try {
            var randomIndex = getRandomInt(abboArray.length)
            var randomPostIndex = getRandomInt(abboArray[randomIndex].posts.length)
            renderPost(abboArray[randomIndex], randomPostIndex, res.abbos[randomIndex])
        } catch (error) {

        }
        //getRandomInt(abboArray[randomIndex].posts.length)
    }
}

function renderPost(res, index, user) {
    if (res.error) return
    console.log(res);
    console.log(index);
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

function getRandomInt(max) {
    return Math.floor(Math.random() * max)
}

/*    var randomInts = []
    resize()
    if (!res?.error) {
        content.innerHTML = `<div id="otherPosts"></div>`
        for (let j = 0; j < 50; j++) {
            var index = getRandomInt(res.posts.length)

            if (randomInts.includes(index)) {
                index = getRandomInt(res.posts.length)
            }
            randomInts.push(index)

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
    }*/