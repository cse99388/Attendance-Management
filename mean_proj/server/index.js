const express = require('express');
// const localStorage =  require('localStorage').LocalStorage
const mongoose = require("./db.js");
const path = require('path');
const bodyParser = require('body-parser');
const user = require('./models/user_data');
const messenger = require('./models/message')
const studentcourse = require('./models/student_course')
const attendance = require('./models/attendance')
const course_det = require('./models/courses_data')
const nodemailer = require("nodemailer")
var app = express();
app.use(bodyParser.json());
app.set('views',path.join(__dirname,'views'));
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs')
app.use(express.urlencoded());
app.use(express.static("assets"));
app.listen("8010",()=>console.log("server running in port 8010"));
const LocalStorage = require('node-localstorage').LocalStorage,
localStorage = new LocalStorage('./scratch');

app.post('/register',(req,res) => {
    console.log(req.body)
             user.create({
                username : req.body.userName,
                password : req.body.password,
                Name : req.body.Name,
                Contact_number : req.body.pnumber,
                Mail_ID : req.body.pmail,
                Section : req.body.Section,
                DateofB : req.body.DateofB,
                Gender : req.body.gender


            }, function(err,newu)
            {
                if(err)
                {
                    console.log('User not added');
                    return res.render("register1");
                }
                return res.render("index")
            });
            
})

app.get('/', async(req,res) => {
    res.render('index');
});


app.get('/register',async(req,res) => {
    res.render('register');
});

app.post('/login', async(req, res)=>{
    var username = req.body.username;
    var password = req.body.password;
    var user_data = await user.find({username : req.body.username});
    // console.log(req.body,user_data)
    user_data  = user_data[0]
    console.log(req.body,user_data)
    if(password == user_data.password){
        var message_data = await messenger.find({receiver : username})
        localStorage.setItem('username', username) 
        return res.render("Add_Course", {username})
        // res.send("Successfull")
    }
    else{
        return res.render("index1")
    }

})
app.post("/index1",async(req,res) => {
    return res.render("index1")
})
app.post('/api/forgotpassword',async(req,res) => {
    // try{
        var user_data = await user.findOne({username : req.body.username});
        if((req.body.password != req.body.cpassword) || (user_data == null)){
            return res.json({status : 'error'})
        }
        
        console.log(user_data.username);
        var nuser = {_id : user_data._id,username : user_data.username,password : req.body.password}
        console.log(nuser)
        user.findByIdAndUpdate({ _id: nuser._id }, nuser, { new: true }, (err, doc) => {
            if (!err) { 
                console.log("Password updated successfully")
                return res.json({status : 'success'}); }
            else {
                return res.json({status : 'error'});
            }
        });
      

});

app.post('/api/addmessagedata',async(req,res) => {
    console.log(req.body)
             messenger.create({
                sender : req.body.sender,
                receiver : req.body.receiver,
                message : req.body.message  
            },function(err,mu)
            {
                if(err)
                {
                    console.log('message not sent');
                    return res.json({status : 'error'})
                }
                
                console.log("message : ",mu);
                return res.json({status : 'ok'})
            });
            
});

app.post('/receivedmessages',async(req,res) => {
    const messages = await messenger.find({
        receiver : req.body.receiver,
    })
    try{
        console.log("Messages : ", messages);
        return res.render('messenger')
    }
    catch(e) {
        return res.render('messenger')
    }  
});
app.get('/receivedmessages', (req, res)=>{
    res.render('messenger')
})


app.post('/api/sendmessages',async(req,res) => {
    const messages = await messenger.find({
        sender : req.body.sender
    })
    try{
        console.log("Messages : ", messages);
        return res.json({status : 'ok'})
    }
    catch(e) {
        return res.json({status : 'error'})
    }  
});

app.post("/profile",async(req,res) =>{
    var user_data = await user.findOne({username : localStorage.getItem("username")});
    // console.log(user_data)
    return res.render('profile',user_data)
})
app.get("/profile",async(req,res) =>{
    var user_data = await user.findOne({username : localStorage.getItem("username")});
    if(user_data.Section != "faculty"){
        user_data.Section = "Student from " +  user_data.Section
    }
    else{
        user_data.Section = "faculty"
    }
    console.log(user_data)
    return res.render('profile',{user_data})
})

app.get("/editprofile",async(req,res) =>{
    var user_data = await user.findOne({username : localStorage.getItem("username")});
    return res.render('edit_profile',{un : user_data.username,username:user_data.Name})
})

app.post("/updateprofile",async(req,res) => {
    var user_data = await user.findOne({username : localStorage.getItem("username")});
    var nuser = {_id : user_data._id,Mail_ID : req.body.pmail,Name : req.body.Name,Contact_number : req.body.pnumber, Section : req.body.Section, Gender:req.body.gender, DateofB : req.body.DateofB}
    console.log(nuser)
    user.findByIdAndUpdate({ _id: nuser._id }, nuser, { new: true }, (err, doc) =>{
        if(err){
            return res.send("error")
        }
        else{
            console.log("Profile Update Succefully")
        }
    })
    var user_data = await user.findOne({username : localStorage.getItem("username")});
    if(user_data.Section != "faculty"){
        user_data.Section = "Student from " +  user_data.Section
    }
    else{
        user_data.Section = "faculty"
    }
    // console.log(user_data)
    return res.render('profile',{user_data})

})


app.get('/addcourse',async(req,res)=> {
    return res.render('Add_Course',{username : localStorage.getItem("username")})
})
app.post('/addcoursedata',async(req,res) => {
    // console.log(req.body)
    var username = localStorage.getItem("username")
             await course_det.create({
                faculty : username,
                cname : req.body.cname,
                cid : req.body.cid,
                Section : req.body.Section,
                csd : req.body.csd

            }, function(err,newu)
            {
                if(err)
                {
                    console.log('course not added');
                    return res.render("Add_Course1");
                }
                else{
                    console.log("Course added succesfully")
                    var pt = course_det.find({faculty : username})
                    // console.log(pt)
                    return res.render("courses_list",{username,pt})
                }
                

            });
           

            
    
            
})
app.post("/addstudents", async (req,res) => {
    t = req.body.allst
    // console.log(t)
    t = t.split(",")
    // console.log(t)
    for(i = 0 ;i < t.length;i++){
        var pt = await studentcourse.findOne({
            faculty : localStorage.getItem("username"),
            Section: req.body.section,
            sid: t[i],
            cid:req.body.cid
        })
        // console.log(pt)
        if(pt == null){
            // console.log("hi",pt)
            await studentcourse.create({
                faculty : localStorage.getItem("username"),
                Section: req.body.section,
                sid: t[i],
                cid:req.body.cid
            }, function(err,newu)
            {
                if(err)
                {
                    console.log("not added");
                    
                }
                else{
                    console.log("added succesfully")
                    
                }
                
            })
        }
        
    }
    // alert("Students added succesfully")
    return res.render("Add_Course")
})

app.get("/addstudents",(req,res) => {
    return res.render("addstudents")
})

app.get("/takeattendance",async(req,res)=>{
    t = localStorage.getItem("username")
    var pt = await course_det.find({faculty : t})
    return res.render("take_attendance",{pt,t,username:t})
})
app.post("/takeattendance",async(req,res)=>{
    let ff = localStorage.getItem("username")
    var pt = await studentcourse.find({
        faculty : ff,
        Section: req.body.section,
        cid:req.body.course
        
    })
    return res.render("attendance",{pt,sec : req.body.section, cid1 : req.body.course, dt : req.body.date,username:ff})
})
app.post("/attendancesave",async(req,res)=>{
    let ff = localStorage.getItem("username")
    console.log(req.body)
    var pt = await studentcourse.find({
        faculty : ff,
        Section: req.body.sec1,
        cid:req.body.cid2
    })
    // console.log(pt)
    t = []
    ke=Object.keys(req.body)
    // console.log(ke,"hi")
    for(i = 0 ; i<ke.length;i++){
        if((ke[i] != "sec1") && (ke[i] != "cid2") && (ke[i] != "dt")){
            k=ke[i]
            await attendance.create({
                faculty : ff,
                Section: req.body.sec1,
                cid:req.body.cid2,
                sid : k,
                stat : req.body[k],
                Date1:req.body.dt
            })
        }
    //    console.log(ke)
        // t.push(pt[i])
    }
    // console.log(req.body)
    t = localStorage.getItem("username")
    var pt = await course_det.find({faculty : t})
    return res.render("take_attendance",{pt,t,username:t})
})

app.get("/course_list",async(req,res) => {
    var username = localStorage.getItem("username")
    var pt = await course_det.find({faculty : username})
    return res.render("courses_list",{username,pt})
})

app.get('/delete_course',async(req,res) => {
    var username = localStorage.getItem("username")
    return res.render("delete_Course",{username})
})
app.post('/delete_course',async(req,res) => {
    var username = localStorage.getItem("username")
    // console.log(req.body)e
    await course_det.deleteOne({faculty:username,
        cid : req.body.cid,
        Section : req.body.Section}),function(error){
            if(err){
                return res.send("error")
            }
        }
    var pt = await course_det.find({faculty : username})
    return res.render("courses_list",{username,pt})
})
app.post('/search_course',async (req, res) => {
    var username = localStorage.getItem("username")
    pt = await course_det.find(
        {faculty:username,
        cid : req.body.search
        }),function(error){
            if(err){
                return res.send("error")
            }
        }
    console.log(pt)
    return res.render("courses_list",{username,pt})
})


































