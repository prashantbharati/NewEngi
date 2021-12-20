var express    = require('express');
var bodyParser = require('body-parser');
var pdf        = require('html-pdf');
var fs         = require('fs');
var options    = {format:'A4'};

//init app
var app = express();
const users=[];
//set the templat engine
app.set('view engine','ejs');

app.use(express.static("public"))
//fetch data from the request
app.use(bodyParser.urlencoded({extended:false}));

app.get('/',(req,res)=>{
    // res.render('home')
    res.sendFile(__dirname+"/index.html")
});

app.post('/',(req,res)=>{

    // console.log(req.body.fname,req.body.lname,req.body.email)

   if(users.includes(req.body.email))
   {
       res.sendFile(__dirname+"/failure.html");
   }else{ 
       users.push(req.body.email);
    res.render('answer',{Fname:req.body.fname, Lname:req.body.lname, Email:req.body.email},function(err,html){
        pdf.create(html, options).toFile('./public/uploads/demopdf.pdf', function(err, result) {
            if (err){
                return console.log(err);
            }
             else{
            console.log(res);
            var datafile = fs.readFileSync('./public/uploads/demopdf.pdf');
            res.header('content-type','application/pdf');
            res.send(datafile);
             }
          });
    })
  }
})

//assign port
var port = process.env.PORT || 3000;
app.listen(port,()=>console.log('server run at port '+port));