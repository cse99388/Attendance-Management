const mongoose = require('mongoose'); 
var Quick_reg = mongoose.model('Quick_reg',{ 
    username : {type : String,unique : true},
    Name : {type:String},
    password : {type : String},
    Contact_number : {type:Number},
    Mail_ID : {type:String},
    Gender : {type:String},
    Section : {type: String},
    DateofB : {type : Date}
});
module.exports = Quick_reg;