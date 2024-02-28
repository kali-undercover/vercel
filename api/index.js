const ws = require("ws")

const wss = new ws.WebSocketServer({ port: 8080 })

wss.on("connection", s => {
    s.send("Test 1234")
})