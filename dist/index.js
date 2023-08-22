"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const socket_io_1 = __importDefault(require("socket.io"));
const http_1 = __importDefault(require("http"));
const PORT = process.env.PORT || 3000;
const app = (0, express_1.default)();
app.use(express_1.default.static(__dirname + "./../public"));
const httpServer = http_1.default.createServer(app);
const io = (0, socket_io_1.default)(httpServer, {
    path: '/socket.io'
});
const clients = [];
io.on('connection', (client) => {
    console.log(`Client connected ${client.id}`);
    clients.push(client);
    client.on('disconnect', () => {
        clients.splice(clients.indexOf(client), 1);
        console.log(`Client disconnected ${client.id}`);
    });
});
app.get("/msg", (req, res) => {
    const msg = req.query.msg || '';
    clients.forEach((client) => {
        client.emit('msg', msg);
    });
    res.json({
        'mensagem': msg
    });
});
httpServer.listen(PORT, () => console.log(`Servidor rodando ${PORT}`));
