const mongoose = require('mongoose'); //
var Messages = mongoose.model('Messages',{ 
    sender : {type : String},
    receiver : {type : String},
    message : {type:String}
});
module.exports = Messages;