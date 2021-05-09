const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const razorpay = require('razorpay');
const crypto = require('crypto');
//loading environment vairables to hide sensitive info
require('dotenv').config();
const port =process.env.PORT || 3000;
const dburi = process.env.DB_URI;
let cartData = [];

//loading schema and models for the databse
const productData = require('./models/products');
const formData = require('./models/formdata');

//creating an express object
const app = express();

//initializing all middleware and static files
app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({extended:true}));


//setting view engine to ejs
app.set('view engine','ejs');
require('./config/mongoose')(app,dburi,port);

  //home route and also viewing data on the database
app.get('/',(req,res)=>{
   productData.find()
   .then(result=>{
     res.render('index',{title:'home',datas:result});
   })
   .catch(err=>{
       console.log("error on finding:",err);
   })
});
app.get('/view',(req,res)=>{
  res.render('view',{title:'creating form'});
})
//route for entering the data
app.get('/view/:name/:id/',(req,res)=>{
    const id = req.params.id;
    let data;
    productData.findById(id)
    .then(result=>{
      console.log(result);
      res.render('view',{title:'creating form',product:result});
    }).catch(err=>{console.log("error in finding the product",err)})
});

  app.get('/pay/:price',async (req,res)=>{
    const price = req.params.price *100;
    try{
      const instance = new razorpay({
        key_id:process.env.RAZOR_ID,
        key_secret:process.env.RAZOR_KEY,
      });
  
      const options ={
        amount:price,
        currency: "INR",
        receipt:"order_receipt_11"
      }
  
    instance.orders.create(options)
    .then(order => {
       console.log("order generated",order);
       res.render('pay',{title:"payement",data:order,keyid:process.env.RAZOR_ID,price:price});
      }).catch(err=>{
        console.log("error on generating order:",err);
       res.status(500).send(err)});
    }catch(err){
      res.status(500).send(err);
    }
  }) 
  // app.post('/',async (req,res)=>{
    
  // })
//route for adding new form to database
app.post('/add',(req,res)=>{
    console.log(req.body);
    cartData.push(req.body);
    let response;
    const formdata= new formData(req.body);
    formdata.save()
    .then(result=>{
      console.log(result);
      response ={
        success:"true"
      };
      res.json(response);
      })
    .catch(err=>{console.log(err);
     response={
       success:"false"
     }
     res.json(response);
    });
});

//route for deleting single item 
app.delete('/delete/:id',(req,res)=>{
     const id = req.params.id;
     formData.findByIdAndDelete(id)
     .then(result=>{
         res.json({ redirect:'/'});
     })
     .catch(err=>{console.log('error on deleting in server side',err)});
});

app.get('/cart',(req,res)=>{
  try{
    let price = 0;
    cartData.forEach(cart=>{
      price+=cart.totalprice;
    });
    res.render('cart',{title:'cart',products:cartData,total:price});
  }catch(err){
    console.log("error in finding final amout",err);
    res.status(500);
  } 
})
app.post('/success',async (req,res)=>{
  try{
    const data = req.body;
    const shaum = crypto.createHmac('sha256',process.env.RAZOR_KEY);
    shaum.update(`${data.orderid}|${data.payid}`);
    const digest = shaum.digest("hex");
    if(digest !== data.sig){
      return res.status(400).json({ msg: "Transaction not legit!" });
    }
    res.json({
      msg: "success",
      orderId: data.orderid,
      paymentId: data.payid,
  });
  }catch(err){
    res.status(500).send(error);
  }
  
})
//404 landing page
app.use((req, res) => {
    res.status(404).render('404', { title: '404' });
  });


 
