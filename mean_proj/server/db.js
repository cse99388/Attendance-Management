const mongoose = require('mongoose'); 

mongoose.connect('mongodb://localhost:27017/atnman',(err)=>{
    if(!err){
        console.log("Mongodb C0nnection succeeded");
    }
    else{
        console.log("Mongodb C0nnection failed");
    }
});
module.exports = mongoose;