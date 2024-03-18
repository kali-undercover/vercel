var http = require('http');
var multiparty = require('multiparty');
var fs = require('fs');
var s = require("./standard")
const path = require('path');
const { log } = require('console');
const Chars = "qwertzuiopasdfghjklyxcvbnmQWERTZUIOPASDFGHJKLYXCVBNM1234567890";
var RoomObj = {}

http.createServer(function (req, res) {
    var url = new URL("http://localhost" + req.url)
    if (req.method == 'POST') {
        if (url.pathname == "/Upload") {
            let form = new multiparty.Form();
            form.on('part', (part) => {
                var randPath = RandomString(20) + path.parse(part.filename).ext;
                log(randPath)
                if (path.parse(part.filename).ext != ".png") return
                part
                    .pipe(fs.createWriteStream(`./UploadImages/${randPath}`))
                    .on('close', () => {
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(randPath)
                    })
            })
            form.parse(req);
        }
        else {
            var body = '';

            req.on('data', function (data) {
                body += data;
            });

            req.on('end', function () {
                try {
                    var post = JSON.parse(body);
                    if (post?.function == "post") {
                        try {
                            newPost(post)
                        } catch (error) { }
                    }
                    else if (post?.function == "delete") {
                        try {
                            deletePost(post)
                        } catch (error) { }
                    }
                    else if (post?.function == "abbo") {
                        try {
                            addAbbonent(post)
                        } catch (error) { }
                    }
                    else if (post?.function == "dabbo") {
                        try {
                            removeAbbonent(post)
                        } catch (error) { }
                    }
                    else if (post?.function == "changeDescription") {
                        try {
                            changeDescription(post)
                        } catch (error) { log(error) }
                    }
                    else if (post?.function == "changeName") {
                        try {
                            changeName(post)
                        } catch (error) { }
                    }
                    else if (post?.function == "changeIcon") {
                        try {
                            changeIcon(post)
                        } catch (error) { }
                    }
                    else if (post?.function == "changeBackgroundIcon") {
                        try {
                            changeBackgroundIcon(post)
                        } catch (error) { }
                    }
                    else if (post?.function == "Komment" && post?.id != undefined && post?.comment != undefined && post?.kommentant != undefined) {
                        try {
                            Komment(post)
                        } catch (error) { }
                    }
                    else if (post?.function == "Like" && post?.id != undefined && post?.id != null && post?.kommentant != undefined && post?.kommentant != null) {
                        try {
                            Like(post)
                        } catch (error) { }
                    }
                    else if (post?.function == "DisLike" && post?.id != undefined && post?.id != null && post?.kommentant != undefined && post?.kommentant != null) {
                        try {
                            DisLike(post)
                        } catch (error) { }
                    }
                    checkNewUser(post, url, res)

                } catch (error) {
                    log(error)
                }
            });
        }
    }
    else {
        if (url.pathname == "/") {
            s.write(res, "html/index.html", "text/html")
        }
        else if (url.pathname == "/getName") {
            getName(url, res)
        }
        else if (url.pathname == "/getPrivateUserData") {
            getPrivateUserData(url, res)
        }
        else if (url.pathname == "/getPublicUserData") {
            getPublicUserData(url, res)
        }
        else if (url.pathname == "/chatt.js") {
            s.write(res, "html/chatt.js", "text/javascript")
        }
        else if (url.pathname == "/script.js") {
            s.write(res, "html/script.js", "text/javascript")
        }
        else if (url.pathname == "/4U.js") {
            s.write(res, "html/4U.js", "text/javascript")
        }
        else if (url.pathname == "/style.css") {
            s.write(res, "html/style.css", "text/css")
        }
        else if (url.pathname == "/userList") {
            s.write(res, "json/userList.json", "application/json")
        }
        else if (url.pathname == "/userIcon") {
            res.end(fs.readFileSync("html/User.png"));
        }
        else if (url.pathname == "/img") {
            res.end(fs.readFileSync("UploadImages/" + url.searchParams.get("src")))
        }
        else {
            s.write(res, "html/404.html", "text/html")
        }
    }
}).listen(80)

function Komment(post) {
    if (post?.user != undefined && post?.password != undefined && post?.comment?.length < 500) {
        if (fs.existsSync("json/user/" + post?.user + ".json")) {
            try {
                fs.readFile("json/user/" + post?.user + ".json", "utf-8", (err, d) => {
                    if (err) { }
                    else {
                        try {
                            var data = JSON.parse(d)
                            if (data?.password == post?.password) {
                                try {
                                    var LikedPersonFile = `json/user/${post?.kommentant}.json`
                                    if (fs.existsSync(LikedPersonFile)) {
                                        fs.readFile(LikedPersonFile, "utf-8", (err, ud) => {
                                            if (err) { }
                                            else {
                                                try {
                                                    var udata = JSON.parse(ud)
                                                    for (let index = 0; index < udata.posts.length; index++) {
                                                        if (udata.posts[index]?.id == post?.id) {
                                                            udata.posts[index].komments.unshift({
                                                                komment: post?.comment,
                                                                user: post?.user
                                                            })
                                                            fs.writeFile(LikedPersonFile, JSON.stringify(udata), () => { });
                                                        }
                                                    }
                                                } catch (error) { }

                                            }
                                        })

                                    }
                                } catch (error) {

                                }
                            }
                        } catch (error) { console.log(error) }
                    }
                })
            } catch (error) { }
        }
    }
}

function DisLike(post) {
    if (post?.user != undefined && post?.password != undefined) {
        if (fs.existsSync("json/user/" + post?.user + ".json")) {
            try {
                fs.readFile("json/user/" + post?.user + ".json", "utf-8", (err, d) => {
                    if (err) { }
                    else {
                        try {
                            var data = JSON.parse(d)
                            if (data?.password == post?.password) {
                                try {
                                    var LikedPersonFile = `json/user/${post?.kommentant}.json`
                                    if (fs.existsSync(LikedPersonFile) && data?.LikedContend != null & data?.LikedContend != undefined & data?.userName != undefined && data?.userName != null) {
                                        fs.readFile(LikedPersonFile, "utf-8", (err, ud) => {
                                            if (err) { }
                                            else {
                                                try {
                                                    var udata = JSON.parse(ud)
                                                    for (let index = 0; index < udata.posts.length; index++) {
                                                        if (udata.posts[index]?.id != undefined && udata.posts[index]?.id != null && post?.id != undefined && post?.id != null) {
                                                            if (udata.posts[index].id == post.id) {
                                                                try {
                                                                    if (!udata.posts[index].dislikes.includes(post.user) && udata.posts[index].likes.includes(post.user)) {
                                                                        try {
                                                                            for (let elemIndex = 0; elemIndex < udata.posts[index].likes.length; elemIndex++) {
                                                                                if (udata.posts[index].likes[elemIndex] == post.user) {
                                                                                    udata.posts[index].likes.splice(elemIndex, 1)
                                                                                    fs.writeFileSync(LikedPersonFile, JSON.stringify(udata));
                                                                                }
                                                                            }
                                                                        } catch (error) { log(error) }
                                                                    }
                                                                    if (!udata.posts[index].dislikes.includes(post.user)) {
                                                                        udata.posts[index].dislikes.unshift(post.user);
                                                                        fs.writeFileSync(LikedPersonFile, JSON.stringify(udata), () => { });
                                                                    }
                                                                    else if (udata.posts[index].likes.includes(post.user)) {
                                                                        try {
                                                                            for (let elemIndex = 0; elemIndex < udata.posts[index].dislikes.length; elemIndex++) {
                                                                                if (udata.posts[index].dislikes[elemIndex] == post.user) {
                                                                                    udata.posts[index].dislikes.splice(elemIndex, 1)
                                                                                    fs.writeFileSync(LikedPersonFile, JSON.stringify(udata));
                                                                                }
                                                                            }
                                                                        } catch (error) { log(error) }
                                                                    }
                                                                } catch (error) { log(error) }
                                                            }
                                                        }
                                                    }
                                                } catch (error) { }

                                            }
                                        })
                                    }
                                } catch (error) {

                                }
                            }
                        } catch (error) { console.log(error) }
                    }
                })
            } catch (error) { }
        }
    }
}

function Like(post) {
    if (post?.user != undefined && post?.password != undefined) {
        if (fs.existsSync("json/user/" + post?.user + ".json")) {
            try {
                fs.readFile("json/user/" + post?.user + ".json", "utf-8", (err, d) => {
                    if (err) { }
                    else {
                        try {
                            var data = JSON.parse(d)
                            if (data?.password == post?.password) {
                                try {
                                    var LikedPersonFile = `json/user/${post?.kommentant}.json`
                                    if (fs.existsSync(LikedPersonFile) && data?.LikedContend != null & data?.LikedContend != undefined & data?.userName != undefined && data?.userName != null) {
                                        fs.readFile(LikedPersonFile, "utf-8", (err, ud) => {
                                            if (err) { }
                                            else {
                                                try {
                                                    var udata = JSON.parse(ud)
                                                    for (let index = 0; index < udata.posts.length; index++) {
                                                        if (udata.posts[index]?.id != undefined && udata.posts[index]?.id != null && post?.id != undefined && post?.id != null) {
                                                            if (udata.posts[index].id == post.id) {
                                                                try {
                                                                    if (udata.posts[index].dislikes.includes(post.user) && !udata.posts[index].likes.includes(post.user)) {
                                                                        try {
                                                                            for (let elemIndex = 0; elemIndex < udata.posts[index].dislikes.length; elemIndex++) {
                                                                                if (udata.posts[index].dislikes[elemIndex] == post.user) {
                                                                                    udata.posts[index].dislikes.splice(elemIndex, 1)
                                                                                    fs.writeFileSync(LikedPersonFile, JSON.stringify(udata));
                                                                                }
                                                                            }
                                                                        } catch (error) { log(error) }
                                                                    }
                                                                    if (!udata.posts[index].likes.includes(post.user)) {
                                                                        udata.posts[index].likes.unshift(post.user)
                                                                        fs.writeFileSync(LikedPersonFile, JSON.stringify(udata));
                                                                    }
                                                                    else if (udata.posts[index].likes.includes(post.user)) {
                                                                        try {
                                                                            for (let elemIndex = 0; elemIndex < udata.posts[index].likes.length; elemIndex++) {
                                                                                if (udata.posts[index].likes[elemIndex] == post.user) {
                                                                                    udata.posts[index].likes.splice(elemIndex, 1)
                                                                                    fs.writeFileSync(LikedPersonFile, JSON.stringify(udata));
                                                                                }
                                                                            }
                                                                        } catch (error) { log(error) }
                                                                    }
                                                                } catch (error) { log(error) }
                                                            }
                                                        }
                                                    }
                                                } catch (error) { }

                                            }
                                        })
                                    }
                                } catch (error) {

                                }
                            }
                        } catch (error) { console.log(error) }
                    }
                })
            } catch (error) { }
        }
    }
}

function changeBackgroundIcon(post) {
    if (post?.user != undefined && post?.password != undefined) {
        if (fs.existsSync("json/user/" + post?.user + ".json")) {
            try {
                fs.readFile("json/user/" + post?.user + ".json", "utf-8", (err, d) => {
                    if (err) { }
                    else {
                        try {
                            var data = JSON.parse(d)
                            if (data?.password == post?.password) {
                                try {
                                    if (data?.userName != undefined && data?.userName != null) {
                                        data.backgroundIcon = post?.iconUrl;
                                        fs.writeFile("json/user/" + post?.user + ".json", JSON.stringify(data), () => { });
                                    }
                                } catch (error) {

                                }
                            }
                        } catch (error) { console.log(error) }
                    }
                })
            } catch (error) { }
        }
    }
}

function changeIcon(post) {
    if (post?.user != undefined && post?.password != undefined) {
        if (fs.existsSync("json/user/" + post?.user + ".json")) {
            try {
                fs.readFile("json/user/" + post?.user + ".json", "utf-8", (err, d) => {
                    if (err) { }
                    else {
                        try {
                            var data = JSON.parse(d)
                            if (data?.password == post?.password) {
                                try {
                                    if (data?.userName != undefined && data?.userName != null) {
                                        data.icon = post?.iconUrl;
                                        fs.writeFile("json/user/" + post?.user + ".json", JSON.stringify(data), () => { });
                                    }
                                } catch (error) {

                                }
                            }
                        } catch (error) { console.log(error) }
                    }
                })
            } catch (error) { }
        }
    }
}

function getName(url, res) {
    if (url.searchParams.get("user") != null && fs.existsSync("json/user/" + url.searchParams.get("user") + ".json")) {
        try {
            fs.readFile("json/user/" + url.searchParams.get("user") + ".json", "utf-8", (err, d) => {
                try {
                    if (err) {
                        res.writeHead(200, { 'Content-Type': "application/json" });
                        res.write("error");
                        res.end();
                    } else {
                        var data = JSON.parse(d);
                        res.writeHead(200, { 'Content-Type': "application/json" });
                        res.write(data?.userName);
                        res.end();
                    }
                } catch (error) {
                    res.writeHead(200, { 'Content-Type': "application/json" });
                    res.write("error");
                    res.end();
                }
            })
        } catch (error) {
            res.writeHead(200, { 'Content-Type': "application/json" });
            res.write("error");
            res.end();
        }
    }
    else {
        res.writeHead(200, { 'Content-Type': "application/json" });
        res.write("error");
        res.end();
    }
}

function changeName(post) {
    if (post?.user != undefined && post?.password != undefined) {
        if (fs.existsSync("json/user/" + post?.user + ".json")) {
            try {
                fs.readFile("json/user/" + post?.user + ".json", "utf-8", (err, d) => {
                    if (err) { }
                    else {
                        try {
                            var data = JSON.parse(d)
                            if (data?.password == post?.password) {
                                try {
                                    if (data?.userName != undefined && data?.userName != null) {
                                        data.userName = post?.newName;
                                        fs.writeFile("json/user/" + post?.user + ".json", JSON.stringify(data), () => { });
                                    }
                                } catch (error) {

                                }
                            }
                        } catch (error) { console.log(error) }
                    }
                })
            } catch (error) { }
        }
    }
}

function changeDescription(post) {
    if (post?.user != undefined && post?.password != undefined) {
        if (fs.existsSync("json/user/" + post?.user + ".json")) {
            try {
                fs.readFile("json/user/" + post?.user + ".json", "utf-8", (err, d) => {
                    if (err) { }
                    else {
                        try {
                            var data = JSON.parse(d)
                            if (data?.password == post?.password) {
                                data.description = post?.description;
                                fs.writeFile("json/user/" + post?.user + ".json", JSON.stringify(data), () => { })
                            }
                        } catch (error) { console.log(error) }
                    }
                })
            } catch (error) { }
        }
        else { }
    }
    else { }
}

function addAbbonent(post) {
    if (post?.user != undefined && post?.password != undefined && post.abbonent != undefined) {
        if (fs.existsSync("json/user/" + post?.user + ".json")) {
            try {
                fs.readFile("json/user/" + post?.user + ".json", "utf-8", (err, d) => {
                    if (err) { }
                    else {
                        try {
                            try {
                                var data = JSON.parse(d)
                            } catch (error) { }
                            if (data?.password == post?.password) {
                                try {
                                    if (!data.abbos.includes(post?.abbonent)) {
                                        if (fs.existsSync("json/user/" + post?.abbonent + ".json")) {
                                            try {
                                                fs.readFile("json/user/" + post?.abbonent + ".json", "utf-8", (err, ad) => {
                                                    if (err) { } else {
                                                        var abbodata = JSON.parse(ad);
                                                        abbodata.follower++;
                                                        data.abbos.unshift(post?.abbonent)
                                                        fs.writeFile("json/user/" + post?.abbonent + ".json", JSON.stringify(abbodata), () => {
                                                            fs.writeFile("json/user/" + post?.user + ".json", JSON.stringify(data), () => { })
                                                        })
                                                    }
                                                })
                                            } catch (error) { }
                                        }
                                    }
                                } catch (error) {

                                }
                            }
                        } catch (error) { console.log(error) }
                    }
                })
            } catch (error) { }
        }
    }
    else { }
}

function removeAbbonent(post) {
    if (post?.user != undefined && post?.password != undefined && post.abbonent != undefined) {
        if (fs.existsSync("json/user/" + post?.user + ".json")) {
            try {
                fs.readFile("json/user/" + post?.user + ".json", "utf-8", (err, d) => {
                    if (err) { }
                    else {
                        try {
                            try {
                                var data = JSON.parse(d)
                            } catch (error) { }
                            if (data?.password == post?.password) {
                                try {
                                    if (data.abbos.indexOf(post?.abbonent) != -1) {
                                        if (fs.existsSync("json/user/" + post?.abbonent + ".json")) {
                                            try {
                                                fs.readFile("json/user/" + post?.abbonent + ".json", "utf-8", (err, ad) => {
                                                    if (err) { } else {
                                                        try {
                                                            var abbodata = JSON.parse(ad);
                                                            try {
                                                                abbodata.follower--;
                                                                data.abbos.splice(data.abbos.indexOf(post?.abbonent), 1)
                                                            } catch (error) {
                                                                console.log(error);
                                                            }
                                                            fs.writeFile("json/user/" + post?.abbonent + ".json", JSON.stringify(abbodata), () => {
                                                                fs.writeFile("json/user/" + post?.user + ".json", JSON.stringify(data), () => { })
                                                            })
                                                        } catch (error) { }
                                                    }
                                                })
                                            } catch (error) { }
                                        }
                                    }
                                } catch (error) {

                                }
                            }
                        } catch (error) { console.log(error) }
                    }
                })
            } catch (error) { }
        }
    }
    else { }
}

function deletePost(post) {
    if (post?.user != undefined && post?.password != undefined) {
        if (fs.existsSync("json/user/" + post?.user + ".json")) {
            try {
                fs.readFile("json/user/" + post?.user + ".json", "utf-8", (err, d) => {
                    if (err) { }
                    else {
                        try {
                            var data = JSON.parse(d)
                            if (data?.password == post?.password) {
                                try {
                                    data.posts.splice(post?.index, 1)
                                } catch (error) {

                                }
                                fs.writeFile("json/user/" + post?.user + ".json", JSON.stringify(data), () => { })
                            }
                        } catch (error) { console.log(error) }
                    }
                })
            } catch (error) { }
        }
        else { }
    }
    else { }
}

function newPost(post) {
    if (post?.user != undefined && post?.password != undefined) {
        if (fs.existsSync("json/user/" + post?.user + ".json")) {
            try {
                fs.readFile("json/user/" + post?.user + ".json", "utf-8", (err, d) => {
                    if (err) { }
                    else {
                        try {
                            var data = JSON.parse(d)
                            if (data?.password == post?.password) {
                                data.posts.unshift({
                                    type: post?.type,
                                    header: post?.content?.header,
                                    content: post?.content?.content,
                                    date: new Date(),//`J ${new Date().getFullYear()} | M ${new Date().getMonth()} | D ${new Date().getDay()} | H ${new Date().getHours()} | M ${new Date().getMinutes()}`
                                    likes: [],
                                    dislikes: [],
                                    komments: [],
                                    id: RandomString(25)
                                })
                                fs.writeFile("json/user/" + post?.user + ".json", JSON.stringify(data), () => { })
                            }
                        } catch (error) { console.log(error) }
                    }
                })
            } catch (error) { }
        }
        else { }
    }
    else { }
}

function checkNewUser(post, url, res) {
    try {
        if (post?.function == undefined && post?.newUser != undefined && post?.newPassword != undefined) {
            if (!(fs.existsSync("json/user/" + post?.newUser + ".json"))) {
                fs.writeFileSync("json/user/" + post?.newUser + ".json", JSON.stringify({
                    "icon": "http://dreamworthsolutions.com/garwarealfa/student/dist/img/user.png",
                    "backgroundIcon": "",
                    "userName": post.newUser,
                    "password": post?.newPassword,
                    "abbos": [],
                    "follower": 0,
                    "description": "",
                    "posts": [],
                    "LikedContend": []
                }))
                res.writeHead(200, { 'Content-Type': "application/json" });
                res.write(JSON.stringify({
                    "UserCreated": true,
                    "UserForgiven": false
                }));
                res.end();
            }
            else {
                res.writeHead(200, { 'Content-Type': "application/json" });
                res.write(JSON.stringify({
                    "UserCreated": false,
                    "UserForgiven": true
                }));
                res.end();
            }
        }
        else if (post?.function == "login" && post?.user != undefined && post?.password != undefined && fs.existsSync("json/user/" + post?.user + ".json")) {
            try {
                fs.readFile("json/user/" + post?.user + ".json", "utf-8", (err, d) => {
                    if (err) {
                        res.writeHead(200, { 'Content-Type': "application/json" });
                        res.write(JSON.stringify({
                            wrongPassword: true
                        }));
                        res.end();
                    }
                    else {
                        try {
                            var data = JSON.parse(d)
                            if (data.password == post.password) {
                                log("h")
                                res.writeHead(200, { 'Content-Type': "application/json" });
                                res.write(JSON.stringify({
                                    wrongPassword: false
                                }));
                                res.end();
                            }
                            else {
                                res.writeHead(200, { 'Content-Type': "application/json" });
                                res.write(JSON.stringify({
                                    wrongPassword: true
                                }));
                                res.end();
                            }
                        } catch (error) { }
                    }
                })
            } catch (error) {
                fs.readFile("json/user/" + post?.user + ".json", "utf-8", (err, d) => {
                    res.writeHead(200, { 'Content-Type': "application/json" });
                    res.write(JSON.stringify({
                        wrongPassword: true
                    }));
                    res.end();
                })
            }
        }
        else {
            res.writeHead(200, { 'Content-Type': "application/json" });
            res.write(JSON.stringify({
                "UserCreated": false,
                "UserForgiven": true
            }));
            res.end();
        }
    } catch (error) {
        res.writeHead(200, { 'Content-Type': "application/json" });
        res.write(JSON.stringify({
            "UserCreated": false,
            "UserForgiven": true
        }));
        res.end();
    }
}

function getPublicUserData(url, res) {
    if (url.searchParams.get("user") != null) {
        if (fs.existsSync("json/user/" + url.searchParams.get("user") + ".json")) {
            try {
                fs.readFile("json/user/" + url.searchParams.get("user") + ".json", "utf-8", (err, d) => {
                    if (err) {
                        res.writeHead(200, { 'Content-Type': ("application/json") })
                        res.write(JSON.stringify({ "error;": true }));
                        res.end();
                    }
                    else {
                        try {
                            var data = JSON.parse(d)
                            res.writeHead(200, { 'Content-Type': ("application/json") })
                            res.write(JSON.stringify({
                                "icon": data?.icon,
                                "backgroundIcon": data?.backgroundIcon,
                                "userName": data?.userName,
                                "follower": data?.follower,
                                "description": data?.description,
                                "posts": data?.posts
                            }));
                            res.end();
                        } catch (error) {
                            res.writeHead(200, { 'Content-Type': ("application/json") })
                            res.write(JSON.stringify({ "error;": true }));
                            res.end();
                            console.log(error)
                        }
                    }
                })
            } catch (error) {
                res.writeHead(200, { 'Content-Type': ("application/json") })
                res.write(JSON.stringify({ "error;": true }));
                res.end();
            }
        }
        else {
            res.writeHead(200, { 'Content-Type': ("application/json") })
            res.write(JSON.stringify({ "error;": true }));
            res.end();
        }
    }
    else {
        res.writeHead(200, { 'Content-Type': ("application/json") })
        res.write(JSON.stringify({ "error;": true }));
        res.end();
    }
}

function getPrivateUserData(url, res) {
    if (url.searchParams.get("user") != null && url.searchParams.get("password") != null) {
        if (fs.existsSync("json/user/" + url.searchParams.get("user") + ".json")) {
            try {
                fs.readFile("json/user/" + url.searchParams.get("user") + ".json", "utf-8", (err, d) => {
                    if (err) {
                        res.writeHead(200, { 'Content-Type': ("application/json") })
                        res.write(JSON.stringify({ "error": true }));
                        res.end();
                    }
                    else {
                        try {
                            var data = JSON.parse(d)
                            if (data?.password == url.searchParams.get("password")) {
                                res.writeHead(200, { 'Content-Type': ("application/json") })
                                res.write(d);
                                res.end();
                            }
                        } catch (error) {
                            res.writeHead(200, { 'Content-Type': ("application/json") })
                            res.write(JSON.stringify({ "error": true }));
                            res.end();
                            console.log(error)
                        }
                    }
                })
            } catch (error) {
                res.writeHead(200, { 'Content-Type': ("application/json") })
                res.write(JSON.stringify({ "error": true }));
                res.end();
            }
        }
        else {
            res.writeHead(200, { 'Content-Type': ("application/json") })
            res.write(JSON.stringify({ "error": true }));
            res.end();
        }
    }
    else {
        res.writeHead(200, { 'Content-Type': ("application/json") })
        res.write(JSON.stringify({ "error": true }));
        res.end();
    }
}

function RandomString(l) {
    var str = ""
    for (let index = 0; index < l; index++) {
        str += Chars[Math.floor(Math.random() * Chars.length)]
    }
    return str
}

const ws = require('ws');
const server = new ws.Server({
    port: 8000
});

server.on('connection', function (socket) {
    var room = ""

    socket.on("message", function (msg) {
        try {
            var massage = bufferToString(msg)
            var parsed = JSON.parse(massage)
            if (parsed?.fun == "room") {
                room = parsed?.room
                if (room in RoomObj) {
                    RoomObj[room].push(socket)
                }
                else {
                    RoomObj[room] = [socket]
                }
            }
            else if (parsed?.fun == "send") {
                for (let index = 0; index < RoomObj[room].length; index++) {
                    RoomObj[room][index].send(massage)
                }
            }
        } catch (error) {
            log(error)
        }
    });

    socket.on("close", () => {
        try {
            for (let index = 0; index < RoomObj[room].length; index++) {
                if (RoomObj[room][index] == socket) {
                    RoomObj[room].splice(index, 1)
                    //log(RoomObj[room].length + " Pernonen in Room: " + room)
                    if (RoomObj[room].length !== 0) break;
                    delete RoomObj[room];
                    break;
                }
            }
        } catch (error) {
            log(error)
        }
    })
});


function bufferToString(bufferOne) {
    let json = JSON.stringify(bufferOne);
    let bufferOriginal = Buffer.from(JSON.parse(json).data);
    return bufferOriginal.toString('utf8');
}

setInterval(() => {
    fs.readdir("json/user", "utf8", (err, files) => {
        if (!err) {
            for (let index = 0; index < files.length; index++) {
                files[index] = path.parse(files[index]).name;
            }
            fs.writeFile("json/userList.json", JSON.stringify(files), () => { })
        }
    })
}, 60000)

process.on("uncaughtException", (err) => {
    log(err)
})