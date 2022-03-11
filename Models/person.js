const mongoose = require('mongoose')
const Schema= mongoose.Schema;
// Creating a person schema
const personSchema= new Schema({
    name:{
        type: String,
        required: true
    },
    age:{
        type: Number,
    },
    favouriteFoods:[{
        type: String
    }]
},{timestamps: true});

const Person=mongoose.model('Person',personSchema);
module.exports=Person;
