var express=require('express');
var app=express();
const bodyparser=require('body-parser');
app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json());
let server=require('./server');
let middleware=require('./middleware');

const MongoClient=require('mongodb').MongoClient;
const url='mongodb://127.0.0.1:27017';
const dbname='HospitalManagement';

let db
/*
app.get('/',(req,res)=>{
    res.write("<html><body> <h1>Enter '/Hospital' in url to get Hospital details</h1>");
    res.write(" <h1>Enter '/Ventilators' in url to get Ventilators details</h1>");
    res.write("<h1>Enter '/Hospital' in url to get Hospital details</h1>");
    res.write("<h1>Enter 'Ventilators_stat_name' stat nm in url to get Hospital details</h1>");
    res.write("<h1>Enter 'Ventilators_update' id sts in url to get Hospital details</h1>");
    res.write("<h1>Enter 'Ventilators_del' id in url to get Hospital details</h1>");

    res.write(" <br><h1>Enter 'Ventilators_add' hi vi stat nm in url to get table details<h1></body></html>");
    res.end();
});*/

MongoClient.connect(url,{useUnifiedTopology: true},(err,client)=>{
    if(err) return console.log(err);

    db=client.db(dbname);
   
    console.log(`Connected Database: ${url}`);
    console.log(`Database: ${dbname}`);

    app.post('/Ventilators_status',middleware.checkToken,(req,res)=>{
    var query={status:req.body.status};
    db.collection(`Ventilators`).find(query,{projection :{_id:0}}).toArray(function(err,result){
        if(err) return console.log(err);
        console.log(result);
        res.send(result);});
        
    });

    app.get('/Ventilators_Hospitalname',middleware.checkToken,(req,res)=>{
        var query={hname:new RegExp(req.body.name,'i')};
        db.collection(`Ventilators`).find(query,{projection :{_id:0}}).toArray(function(err,result){
            if(err) return console.log(err);
            console.log(result);
            res.send(result);});
            
        });

    app.get('/Ventilators',middleware.checkToken,(req,res)=>{
        db.collection(`Ventilators`).find({},{projection :{_id:0}}).toArray(function(err,result){
            if(err) return console.log(err);
            console.log(JSON.stringify(result))
            res.send(result);;});
           
        });
    
    app.get('/Hospital',middleware.checkToken,(req,res)=>{
    db.collection(`Hospital`).find({},{projection :{_id:0}}).toArray(function(err,result){
        if(err) return console.log(err);
        console.log(JSON.stringify(result));
        res.send(result);});
       
    });


    app.put('/Ventilators_update',middleware.checkToken,(req,res)=>{
        var i={vid:req.body.vid};
        var n={$set:{status:req.body.status}};
        db.collection(`Ventilators`).updateOne(i,n,function(err,result){
            if(err) return console.log(err);
            console.log(result);
            res.send(`Updated`);});
            
        });


    app.delete('/Ventilators_del',middleware.checkToken,(req,res)=>{
            var mquery={vid:req.body.vid};
            db.collection(`Ventilators`).deleteOne(mquery,function(err,result){
                if(err) return console.log(err);
                console.log(result);
               
                res.send(`deleted`);});
                
    });

    app.put('/Ventilators_add',middleware.checkToken,(req,res)=>{
                var query={hid:req.body.hid,vid:req.body.vid,status:req.body.status,hname:req.body.name};
        db.collection(`Ventilators`).insertOne(query,function(err,result){
                    if(err) return console.log(err);
                    console.log(result);
                    res.send(`inserted`);});
                    
                });
   

});

app.listen(3000);
