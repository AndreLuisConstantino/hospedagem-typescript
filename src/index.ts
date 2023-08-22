import express from "express";
import socket from "socket.io";
import http from "http";

const PORT = process.env.PORT || 3000
const app = express();
app.use(express.static(__dirname + "./../public"))

const httpServer = http.createServer(app)
const io = socket(httpServer, {
    path: '/socket.io'
})

const clients: Array<any> = []

io.on('connection', (client) => {
    console.log(`Client connected ${client.id}`)
    clients.push(client)

    client.on('disconnect', () => {
        clients.splice(clients.indexOf(client), 1)
        console.log(`Client disconnected ${client.id}`)

    })
})

app.get("/msg", (req, res) => {
    const msg = req.query.msg || ''

    clients.forEach((client) => {
        client.emit('msg', msg)
    })

    res.json({
        'mensagem': msg
    })
})

httpServer.listen(PORT, () => console.log(`Servidor rodando ${PORT}`))