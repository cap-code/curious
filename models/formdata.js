const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const formSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    test:{
        type:Number,
        required:true,
    }
},{timestamps:true});

const Form = mongoose.model('formdata',formSchema);

module.exports = Form; 