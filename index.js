const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");


const app = express();


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


//URL to connect to local database
mongoose.connect("mongodb://127.0.0.1:27017/toDoListDB");

//to create a new Schema for database
const itemsSchema = new mongoose.Schema({
  name: String,
});


const Item = mongoose.model("Item", itemsSchema);

// two item when its first appereance
const item1 = new Item({
  name: "Do your Homework!"
});
const item2 = new Item({
  name: "Do your Homework!"
});

//a list for saving our new data from the input text
const addItems = [item1, item2];

//to insert our two item
/* item.insertMany([
  item1,
  item2
]); */



app.get("/", function(req, res){

  //to find our all items
  Item.find({}).then(foundedItems =>{

    if(foundedItems.length === 0){
      
      //to insert our two item
      Item.insertMany([
        item1,
        item2
      ]);

      res.redirect("/");
    }

    else{

      res.render("index", {
        
        newListItems: foundedItems,
      });

    }
  
  });  
    
});


/* app.get("/:whereOnPage",function(req,res){
  const link = req.params.whereOnPage;

}); */




app.post("/", function(req, res){

  const itemName = req.body.newItem;

  const item = new Item({
    name: itemName,
  });
  
  //to save the item that to get from the input text
  item.save();
  //to show the item on the list from the input text as soon as to get
  res.redirect("/");
  
});



//to delete the List item that its checkbox is selected
app.post("/delete",function(req,res){

  const checkedId = req.body.checkbox;
  console.log(checkedId);

  Item.findByIdAndRemove(checkedId)
    .then(function (Item) {

      res.redirect("/");
      console.log("Selected item "+checkedId+" is deleted.")

    })
    .catch(function (err) {
      console.log(err);
    });

});




app.listen(3000, function() {

  console.log("Server started on port 3000");

});