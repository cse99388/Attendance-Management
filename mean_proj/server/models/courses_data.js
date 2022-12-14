const mongoose = require('mongoose'); //
var Courses = mongoose.model('Courses',{ 
    faculty : {type:String},
    cname : {type: String},
    cid : {type:String},
    Section : {type:String},
    csd : {type:Date}
});
module.exports = Courses;