const { query } = require('express');
const express = require('express')
const app = express();
const XLSX = require('xlsx') ;
// var pathUsingBacktrack = require('./CalculatePath.js');
// var findPathUsingGreedy = require('./findPathUsingGreedy');
var PathUsingGreedy2 = require('./pathUsingGreedy2');
var TravelingSalesman = require('./TravellingSalesmanProblem');
var CalculateTime =require('./CalculateTime');
//var writeQueryForDataLoading = require("./writeQueryForDataLoading.js");
const parseExcel = (filename) => { const excelData = XLSX.readFile(filename);  return excelData.Sheets.Data;}
app.set('view engine','ejs');  // path to views set to render from get ----
app.use(express.static(__dirname + '/public'));
var co = require('co');
var async = require('async');
// self defined DB Class--
const Database = require("./db");
const createVisitedArray = require('./createVisitedArray.js');
const createAdjacencyMatrix = require('./createAdjacencyMatrix.js');
const returnFormat = require('./returnFormat');
const { format } = require('mysql-await');
const db = new Database();

//---

app.get('/',(req,res) => {
    //console.log("Hello World!!!!")
    res.render("ok",{a:"Hello Bro"});
})

// app.get('/a///',(req,res)=>{
//     res.send("<h1>Construct Path Before Seeing it in Map !</h1>")
// })

app.get('/a',(req,res) => {
     res.render("index");
})
app.get('/main/',(req,res)=>{
    res.render("new_main");
})

app.get('/c/:start/:end/:places/:startDate',(req,res) => {

    var startDate =(new Date(req.params.startDate+"T12:00:00")).getTime();
    var startArray = req.params.start;
    var endArray = req.params.end;

    var z = req.params.places.split(',');
    var places = [];
    for(var i=0;i<z.length-1;i++){
        if(i>0) places.push(z[i]);
        places.push("Traveling from "+ z[i] + " to "+ z[i+1]+" !");
    }
    places.push(z[z.length-1]);



    startArray = startArray.split(',')
    endArray = endArray.split(',')

    function ConvertTimeToDate(x){
        x = parseFloat(x);
        var days = Math.trunc(x/8);
        x= x - days*8;
        return new Date(startDate+86400000*days+x*60000*60);
    }

    function format(x){
        x = x.split(',');
        var res="";
        var z = x[0].split('/');
        for(var i=2;i>=0;i--){res=res+z[i]; if(i>0){res=res+"-";}}
        res=res+"T";
        res= res + x[1].substring(1);
        return res;
    }

    for(var i=0;i<startArray.length;i++){
        startArray[i] = format(ConvertTimeToDate(startArray[i]).toLocaleString());
        endArray[i] = format(ConvertTimeToDate(endArray[i]).toLocaleString());
    }
    

    // var a=[],b=[],c=[];
    // for()
    res.render("calender_index",{'places':places,'startArray':startArray,'endArray': endArray});

})

app.get('/search/:city/:duration',async (req,result)=>{
    var city = req.params.city;
    var time = req.params.duration;

            var lat=[],lon=[],timeRequired=[],places=[],rating=[],imageURL=[],address=[],Category=[],website=[],description = [];
            var z = await db.getAllLocationOfCity(city);
            
            for(var i=0;i<z.length;i++){
                lat.push(z[i]["Latitude"]);
                lon.push(z[i]["Longitude"]);
                timeRequired.push(z[i]["Time"]);
                places.push(z[i]["Title"]);
                rating.push(z[i]["Rating"]);
                imageURL.push(z[i]["ImageURL"]);
                address.push(z[i]["Address"]);
                Category.push(z[i]["Category"]);     
                website.push(z[i]["Website"]);
                description.push(z[i]["Description"]);
            }

            var N = lat.length;    

            // Building Adjacency Matrix Object---

            var adjacencyObj = new createAdjacencyMatrix(N);
            await adjacencyObj.Build(lat,lon,db);

            // create object of visitedArray
            var visitedObj = new createVisitedArray(N);

            //z = await pathUsingBacktrack.log(rating,lat,lon,timeRequired,time,db);
            // z = await pathUsingGreedy.log(rating,lat,lon,timeRequired,time,db)
            var path1 = PathUsingGreedy2.log(rating,timeRequired,time,adjacencyObj,visitedObj,0);
            console.log(path1);

            path1 = TravelingSalesman.log(path1,adjacencyObj);
            var t = CalculateTime.log(path1,adjacencyObj,timeRequired);
            var path2 = PathUsingGreedy2.log(rating,timeRequired,time-t,adjacencyObj,visitedObj,path1[path1.length-1]);
            for(var i=1;i<path2.length;i++){path1.push(path2[i]);}

            // var count=3;
            // while(count>0){
            //     path1 = TravelingSalesman.log(path1,adjacencyObj);
            //     var t = CalculateTime.log(path1,adjacencyObj,timeRequired);
            //     console.log(time-t);
            //     //if(time-t<0){break;}
            //     var path2 = PathUsingGreedy2.log(rating,timeRequired,time-t,adjacencyObj,visitedObj,path1[path1.length-1]);
                
            //     if(path2.length<=1){break;}
            //     for(var i=1;i<path2.length;i++){path1.push(path2[i]);}
            //     count=count-1;
            // }

            console.log(path1);
            var res = returnFormat.log(path1,imageURL,Category,address,website,places,timeRequired,lat,lon,adjacencyObj,description);
            console.log(description);
            result.send(res);
        });


// const UserRouter = require('./routes/users');
// app.use("/users",UserRouter); // /users is a link to join them---
// var x = writeQueryForDataLoading.log('./singapore.xlsx',427);
// console.log(x);
// db.query(x,(err,res)=>{
//     if(err){console.log(err);}
// }
app.listen(3000)