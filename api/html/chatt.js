function toSocket(room) {
    var url = new URL(document.location.origin)
    url.port = 8000;
    url.protocol = "ws:"
    //(document.location.protocol == "http:") ? url.protocol = "ws://" : url.protocol = "wss://"
    var ws = new WebSocket(url);
    var i = 0;
    var user = localStorage.getItem("user")
    var roomMates = []
    var mateColors = []

    window.addEventListener("offline", () => {
        renderMassage({ user, msg: "You Are Offline" })
        massages.innerHTML += '<a href="">RELOAD</a>'
    })
    window.addEventListener("online", () => { renderMassage({ user, msg: "You Are online" }) })

    ws.onopen = function () {
        ws.send(JSON.stringify({
            fun: "room",
            room: room
        }));
        ws.send(JSON.stringify({
            fun: "send",
            msg: user + " ist beigetreten...",
            user
        }));
        document.querySelector('#form').addEventListener('submit', function (e) {
            e.preventDefault()
            try {
                ws.send(JSON.stringify({
                    fun: "send",
                    msg: document.querySelector('#message').value,
                    user
                }));
            } catch (error) {
                window.location = ""
            }
            document.querySelector("#message").value = ""
        });
    };

    ws.onmessage = function (msg) {
        var data = JSON.parse(msg.data)
        renderMassage(data)
    };

    function renderMassage(data) {
        try {
            i++;
            var massages = document.getElementById('messages')
            massages.innerHTML += `<div id="msg${i}" class="msg"><h3><a href id="link${i}"><span id="header${i}"></spn></a></h3><p id="massage${i}"></div><br id="under${i}">` //+ document.querySelector('#messages').innerHTML;
            document.getElementById("massage" + i).innerText = data.msg;
            document.getElementById("header" + i).innerText = data.user;
            document.getElementById("link" + i).setAttribute("href", `/?user=${data.user}`)
            if (i > 2) {
                document.getElementById("under" + i).scrollIntoView()
            }
            if (data.user == user) {
                document.getElementById("msg" + i).classList.add("your")
                document.getElementById("header" + i).innerText = "Ich"
            }
            else {
                if (roomMates.includes(data.user)) {
                    document.getElementById("msg" + i).classList.add("other")
                    const randomColorInt = mateColors[roomMates.indexOf(data.user)]
                    document.getElementById("msg" + i).style.backgroundColor = `hsl(${randomColorInt}, 70%, 50%)`
                    document.getElementById("msg" + i).style.boxShadow = `0px 0px 15px 1px hsl(${randomColorInt},70%,30%)`
                }
                else {
                    document.getElementById("msg" + i).classList.add("other")
                    const randomColorInt = Math.floor(Math.random() * 250)
                    document.getElementById("msg" + i).style.backgroundColor = `hsl(${randomColorInt}, 70%, 50%)`
                    document.getElementById("msg" + i).style.boxShadow = `0px 0px 15px 1px hsl(${randomColorInt},70%,30%)`
                    roomMates.push(data.user)
                    mateColors.push(randomColorInt)
                }
            }
        } catch (error) {

        }
    }
}

//BackgroundSocket()

function BackgroundSocket() {
    try {
        var url = new URL(document.location.origin)
        url.port = 8000
        url.protocol = "ws://"
        var ws = new WebSocket(url);
        var user = localStorage.getItem("user")

        ws.onopen = function () {
            ws.send(JSON.stringify({
                fun: "room",
                room: user
            }));
            ws.send(JSON.stringify({
                fun: "send",
                msg: user + " ist online...",
                user
            }));
        };

        ws.onmessage = function (msg) {
            var data = JSON.parse(msg.data)
            renderMassage(data)
        };

        function renderMassage(data) {
            try {
                document.getElementById("latestNotificationMsg").innerText = data.msg;
                document.getElementById("latestNotificationUser").innerText = data.user;
            } catch (e) { console.log(e); }
        }
    } catch (error) {

    }
}