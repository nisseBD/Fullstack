const express = require('express');
const { get } = require('mongoose');
const bcrypt = require('bcryptjs');
const UserModel = require("./UserModel");
const leaderboardModel = require("./LeaderboardModel");
const databaseModule = require("./databaseModule.js");
const app = express();
const port = 6969;
const staticDir = __dirname + "\\static\\";

app.use(express.static(staticDir));
app.use(express.urlencoded());
app.use(express.json());

app.set("view engine", "ejs");

app.get('/', (req, res) => res.sendFile(staticDir + "html\\index.html"))
app.get('/user', (req, res) => res.sendFile(staticDir + "html\\user.html"))

app.post('/registerUser', async function (req, res) {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    console.log(hashedPassword);
    UserModel.saveUser(req.body.user, hashedPassword);
    res.redirect("/user");
})

app.post('/login', async function (req, res) {
    const user = await UserModel.getUser(req.body.user);
    await bcrypt.compare(req.body.password, user.password, (err, success) => {
        if (err) {
            console.log(err);
        }

        if (success) {
            console.log("Success");
            res.render("./spel.ejs", { username: user.user });
        } else {
            console.log("Fail");
            res.redirect('/');
        }
    });
})

app.get("/leaderboard", async function (req, res) {
    const records = await leaderboardModel.getRecord();
    records.sort((a, b) => {
        return a.points - b.points
    });
    records.reverse();
    console.log(records)
    res.render("./leaderboard.ejs", { leaderboard: records })
});

app.post("/leaderboard", async function (req, res) {
    let uname = req.body.user.trim();
    const userRecord = await leaderboardModel.getUserRecord(uname)
    if (userRecord) {
        await leaderboardModel.updateUserRecord(uname, req.body.points)
    }
    else {
        await leaderboardModel.saveRecord(uname, req.body.points);
    }
    res.sendStatus(200);
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))