const express = require('express');
const mongoose = require('mongoose');
//loading environment vairables to hide sensitive info
require('dotenv').config();
const port =process.env.PORT || 3000;
//loading schema and models for the databse
const data = require('./models/formdata');

//creating an express object
const app = express();

//initializing all middleware and static files
app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({extended:true}));


//setting view engine to ejs
app.set('view engine','ejs');

const dburi = process.env.DB_URI;
mongoose.connect(dburi,{useNewUrlParser:true,useUnifiedTopology:true})
  .then((result)=>{
      console.log("conected to database");
      app.listen(port,()=>{console.log("http://localhost:3000")});
    })
  .catch(err=>{console.log("error connectig to db:",err)})


  //home route and also viewing data on the database
app.get('/',(req,res)=>{
   data.find()
   .then(result=>{
     res.render('index',{title:'home',datas:result});
   })
   .catch(err=>{
       console.log("error on finding:",err);
   })
});


//route for entering the data
app.get('/create',(req,res)=>{
    res.render('create',{title:'creating form'});
});


//route for adding new form to database
app.post('/add',(req,res)=>{
    console.log(req.body);
    const formdata= new data(req.body);
    
    formdata.save()
    .then(result=>{console.log(result)})
    .catch(err=>{console.log(err)});
    res.redirect('/create');
});

//route for deleting single item 
app.delete('/delete/:id',(req,res)=>{
     const id = req.params.id;
     data.findByIdAndDelete(id)
     .then(result=>{
         res.json({ redirect:'/'});
     })
     .catch(err=>{console.log('error on deleting in server side',err)});
})
//404 landing page
app.use((req, res) => {
    res.status(404).render('404', { title: '404' });
  });

