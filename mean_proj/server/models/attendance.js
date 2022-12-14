const mongoose = require('mongoose'); //
var Attendance = mongoose.model('Attendance',{ 
    cid : {type:String},
    Section : {type:String},
    faculty:{type:String},
    sid : {type:String},
    stat:{type:String},
    Date1:{type:Date}
});
module.exports = Attendance;