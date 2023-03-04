const express=require('express');
const app=express();
const port=3000;
const Router=express.Router();
const verify_logged_in=require('./middleware/auth')
const usersRoutes=require('./routers/users')
const cardsRoutes=require('./routers/cards')
const  cors = require('cors');
const bodyParser=require('body-parser')
const mongoose = require("mongoose");



mongoose.set('strictQuery', true);
function connectAsync() {
    return new Promise((resolve, reject) => {

        // Connect options - prevent console warnings:
        const options = { useNewUrlParser: true, useUnifiedTopology: true };

        // Connect to MongoDB:
        mongoose.connect("mongodb://localhost:27017/project_node", options, (err, db) => {
            if(err) {
                reject(err);
                return;
            }
            resolve(db);
        });
    });
}

connectAsync()
    .then(db => console.log("We're connected to MongoDB."))
    .catch(err => console.log(err));




app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.json());
app.use(cors());


app.use('/users',usersRoutes)
app.use('/cards',cardsRoutes)



app.listen(port,()=>{
    console.log(`you are listning to port ${port}`);
})