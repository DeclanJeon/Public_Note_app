import "../config.js";

import express from "express";
import http from "http";
import path from "path";

const __dirname = path.resolve();
import router from "./routes/router.js";
import note_router from "./routes/note.js";

const app = express();

const port = process.env.PORT || 5001;

let server;
server = http.createServer(app);

const dir = {
    public: path.join(__dirname, "public"),
    css: path.join(__dirname, "public/assets/css"),
    js: path.join(__dirname, "public/assets/js"),
    client: path.join(__dirname, "public/src/views"),
};

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.set("view engine", "ejs");
app.set("views", dir.client);

app.use(router);
app.use("/note", note_router);

app.use(express.static(dir.client));
app.use(express.static(dir.css));
app.use(express.static(dir.js));

server.listen(port, () => {
    console.log("Server listening on port " + port);
});
