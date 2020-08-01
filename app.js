const express = require("express");
const app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.use(express.static("public"));

const https = require("https");
const request = require("request");
const { readlink } = require("fs");
const { isAbsolute } = require("path");
const Today = require("./dates");

const date = require(__dirname+"/dates.js"); 

var i = [];
var workList = [];

// function NormalList() {
//   if (req.body.input === "") {
//     return "";
//   }
//   i.push(req.body.input);

//   res.redirect("/");
// }

app.get("/", (req, res) => {
  let today = date.today();
  res.render("list", { TODAY: today, ITEMS: i });
});

app.post("/", (req, res) => {
  if (req.body.buttonVal === "WORK") {
    workList.push(req.body.input);
    res.redirect("/work");
  } else {
    function NormalList() {
        if (req.body.input === "") {
          return"";
        }
        i.push(req.body.input);
      
        res.redirect("/");
      }
  }
  NormalList();
});

app.get("/work", (req, res) => {
  res.render("list", { TODAY: "WORK", ITEMS: workList });
});

// const url="";

//  https.get(url, (response) => {
//     response.on("data", (data) => {

//   });
// });

app.listen(3000, () => {
  console.log("server has just started at port 3000");
});
