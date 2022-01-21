const express = require("express");
const app = express();
const path = require("path");
require('dotenv').config({ path: path.resolve(__dirname, './.env') });
app.use(express.static(path.join(__dirname, "views")));
const mongoose = require("mongoose");
const TaskModel = require("./models/task");
const expressSession = require("express-session")
const UserModel = require("./models/user");
const taskController = require("./controllers/task");
const userController = require("./controllers/user")
const { WEB_PORT, MONGODB_URI } = process.env;
const bodyParser = require("body-parser");

mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

mongoose.connection.on("error", (err) => {
    console.error(err);
    console.log("MongoDB connection error. Please make sure MongoDB is running.");
    process.exit();
});

app.set("view engine", "ejs");

// MIDDLEWARE
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressSession({ secret: 'foo barr', cookie: { expires: new Date(253402300000000) } }))


app.use("*", async (req, res, next) => {
    global.user = false;
    if (req.session.userID && !global.user) {
      UserModel.findById(req.session.userID);
      global.user = UserModel;
    }
    next();
});


const authMiddleware = async (req, res, next) => {
    UserModel.findById(req.session.userID);
    if (!UserModel) {
      return res.redirect('/create-task');
    }
    next()
}

app.get("/logout", async (req, res) => {
    req.session.destroy();
    global.user = false;
    res.redirect('/login');
});

app.get("/create-task", authMiddleware, (req, res) => {
    res.render("create-task", { errors: {} });
});


app.get("/", (req, res) => {
    res.render("create-task");
});

 
app.get("/created-task", (req, res) => {
    TaskModel.find({}, (err, tasks) => {
        res.render("created-task", { tasks: tasks });
    });
});

app.get("/create-user", (req, res) => {
    UserModel.find({}, (err, users) => {
        res.render("create-user", { users: users });
    });
});

app.get("/update", (req, res) => {
    res.render("created-task")
});

app.post("/created-task", taskController.create);
app.get("/created-task/delete/:id", taskController.delete);
app.get("/created-task/update/:id", taskController.edit);
app.post("/created-task/update/:id", taskController.update);

app.get("/join", (req, res) => {
    res.render('create-user', { errors: {} })
  });
  
app.post("/join", userController.create);
app.get("/login", (req, res) => {
    res.render('user-login', { errors: {} })
  });
app.post("/login", userController.login) 

app.get("/about", (req, res) => {
    res.render("about");
});

app.listen(WEB_PORT, () => {
    console.log(`ToDoList App is ready and listening at: http://localhost:${WEB_PORT}`)
});