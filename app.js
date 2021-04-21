const express = require('express');
const { get } = require('mongoose');
const bcrypt = require('bcryptjs');
const UserModel = require("./UserModel");
const databaseModule = require("./databaseModule.js");
const app = express()
const port = 6969
const staticDir = __dirname + "\\static\\";

app.use(express.static(staticDir));
app.use(express.urlencoded());
app.use(express.json());

app.get('/', (req, res) => res.sendFile(staticDir + "html\\index.html"))
app.get('/spel', (req, res) => res.sendFile(staticDir + "html\\spel.html"))
app.get('/register', (req, res) => res.sendFile(staticDir + "html\\register.html"))
app.get('/login', (req, res) => res.sendFile(staticDir + "html\\login.html"))



app.post('/registerUser', async function (req, res) {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    console.log(hashedPassword);
    UserModel.saveUser(req.body.user, hashedPassword);
    res.redirect("/");
})

app.post('/login', async function (req, res) {
    const user = await UserModel.getUser(req.body.user);
    await bcrypt.compare(req.body.password, user.password, (err, success) => {
        if (err) {
            console.log(err);
        }

        if (success) console.log("Success");
        else console.log("Fail");
    });
    res.redirect("/");
})



app.listen(port, () => console.log(`Example app listening on port ${port}!`))