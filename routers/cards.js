const express = require("express");
const Router = express.Router();
const _ = require("lodash");
const CardModel = require("../models/cards");
const verify_logged_id = require("../middleware/auth");
const { validate } = require("../models/cardsJoi");




async function generateBizNumber() {
  while (true) {
    let randomNumber = _.random(1000, 999999);
    let card = await CardModel.findOne({ bizNumber: randomNumber });
    if (!card) return String(randomNumber);
  }
}


// Take number 4***
Router.post("/add_card", verify_logged_id, async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    
    let card = new CardModel({
      Name: req.body.Name,
      Description: req.body.Description,
      Address: req.body.Address,
      Phone: req.body.Phone,
      // If the user did not fill in this field, we will output a general image.
      Image: req.body.Image
      ? req.body.Image
      : "https://cdn.pixabay.com/photo/2016/11/22/23/09/fountain-pen-1851096_1280.jpg",
      //call the random function
      bizNumber: await generateBizNumber(),
      user_id: req.user.id,
      //  all the user information we received through the auth folder (veirfy_log_ in)
    });
    // crate new vairuble and save();
    const post = await card.save();
    
      res.status(200)
      .json({
        status: "You have successfully added your business card",
        data: post,
      });
    } catch (err) {
      res.status(400).send(err.message);
    }
  });
  
  // Task number 5
  Router.get("/find_card/:id/", verify_logged_id, async (req, res) => {
    try {
      const find_Card = await CardModel.findOne({ _id: req.params.id });
       res.status(200)
      .json({ status: "find your card succesfully!", data: find_Card });
    } catch (err) {
      res.status(404).json({
        status: "Fail",
        message: "the card with the given id wasnt defined/check id again.",
      });
    }
  });


  // Task number 6

  Router.put("/update_card/:id", verify_logged_id, async (req, res) => {
    try{
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    let card = await CardModel.findOneAndUpdate({
      _id: req.params.id,
      user_id: req.body,
    });
    if (!card)
    return res.status(404).send("The card with the given ID was not found.");
    card = await CardModel.findOne({ _id: req.params.id, user_id: req.user._id });
    res.send(card);
  }catch(err){
    res.status(400).send(err.message)
  }
  });


  // Task number 7
Router.delete("/delete_card/:id/", verify_logged_id, async (req, res) => {
  try {
    // const name=await CardModel.findOne({Name:req.body})
    const delete_Card = await CardModel.deleteOne({ _id: req.params.id });
    res.status(200).json({
      status: "deleted succesfully!",
      data: delete_Card,
      _id: req.params.id,
    });
  } catch (err) {
    res.status(404).json({
      status: "Fail",
      message: "the card with the given ID was not defined.",
    });
  }
});

// Take number 8
Router.get('/mycards',verify_logged_id,async(req,res)=>{
  try{
    const decoded=req.user
    const myCards=await CardModel.find({user_id:decoded.id})
    res.status(200).json({
      status:"success",
      results:myCards.length,
      data:myCards
    });

  }catch(err){
    res.status(400)
    .send(err.message)
  }

});


module.exports = Router;
