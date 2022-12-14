const mongoose = require('mongoose'); //
var Student_Courses = mongoose.model('student_Courses',{ 
    cid : {type:String},
    Section : {type:String},
    faculty:{type:String},
    sid : {type:String}
});
module.exports = Student_Courses;