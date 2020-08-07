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

const date = require(__dirname + "/dates.js");

const mongoose = require("mongoose");
const _ = require("lodash");

async function mongo() {
  const m = await mongoose.connect("mongodb+srv://nadershbib:test123@todolist.xr4pi.mongodb.net/todolistDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}
mongo()
  .then(console.log("Working just fine!"))
  .catch((err) => console.log("error is : " + err));

const itemsSchema = new mongoose.Schema({
  name: String,
});

const listSchema = new mongoose.Schema({
  name:String,
  items:[itemsSchema]
});

const List = new mongoose.model("List",listSchema);

const Item = new mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name: "Welcome to your to do list!",
});

const item2 = new Item({
  name: "Hit the + button to add a new item.",
});

const item3 = new Item({
  name: "<-- Hit this to delete an item.",
});

const defaultItems = [item1, item2, item3];

app.get("/", (req, res) => {
  let today = date.today();
  Item.find({}, (err, foundItems) => {
    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log("successfuly inserted the default Items!");
          res.redirect("/");
        }
      });
    } else {
      res.render("list", { TODAY: today, ITEMS: foundItems });
    }
  });
});

app.post("/", (req, res) => {
  if (req.body.input === "") {
    return "";
  }
  
  const inputt = req.body.input;
  const listName = req.body.buttonVal;
     
  const item = new Item({
    name:inputt
  });


  if(listName===date.today()){

  item.save();

  res.redirect("/");
}else{
  List.findOne({name:listName},(err,foundList)=>{
    foundList.items.push(item);
    foundList.save();
    res.redirect("/"+listName);
  })
}
});

app.post("/delete",(req,res)=>{

const checkItemid = req.body.checkbox;
const listName = req.body.listName;

if(listName===date.today()){
Item.findByIdAndRemove(checkItemid,(err)=>{
  if(err){
    console.log(err)
  }else{
    res.redirect("/");
  }
})

}
else{

List.findOneAndUpdate({name:listName},{$pull:{items:{_id:checkItemid}}}, (err,foundList)=>{
  if(!err){
    res.redirect("/"+listName);
  }
});


}








});

app.get("/:customListName",(req,res)=>{
  const customListName = _.capitalize(req.params.customListName);

  List.findOne({name:customListName},(err,foundList)=>{
    if(err){
        console.log(err)
    }else{
       if(foundList){
         console.log("exists!")
         res.render("list",{TODAY:foundList.name, ITEMS:foundList.items});
       }else{
          console.log("Doesn't exists!");
          const list = new List({
            name:customListName,
            items:defaultItems
          });
          list.save();
          res.redirect("/"+customListName);
       } 
    
    }
  });
  
  
  
});


app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
