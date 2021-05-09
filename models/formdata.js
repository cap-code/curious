const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const formSchema = new Schema({
    product_id:{
        type:String,
        required:true
    },
    product_name:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true
    },
    number:{
        type:String,
        required:true
    },
    totalprice:{
        type:Number,
        required:true
    },
    image:{
        type:String,
        required:true
    }
},{timestamps:true});

const Form = mongoose.model('formdata',formSchema);

module.exports = Form; 