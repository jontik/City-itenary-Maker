const mysql = require('mysql');
const axios = require("axios").create();
var k=0;
const db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
});

// Connect
db.connect((err) => {
    if(err){throw err;}
        console.log('MySql Connected...');
});

function g(city){
    var latArray=[];
    var lonArray = [];
    var ids = [];
    var query1 = `SELECT id,Latitude,Longitude FROM sys.Places WHERE city ="${city}"`;

    db.query(query1,(err,res)=>{
        for(var i=0;i<res.length;i++){
            latArray.push(res[i]["Latitude"]);
            lonArray.push(res[i]["Longitude"]);  
            ids.push(res[i]["id"]);
        }

        // console.log(latArray.length);

        var tempString = "";
        tempString+=latArray[0]+","+lonArray[0];
        for(var i=1;i<latArray.length;i++){
            tempString+= ";"+latArray[i]+","+lonArray[i];
        }

        var apiString = "https://dev.virtualearth.net/REST/v1/Routes/DistanceMatrix?origins="+tempString+"&destinations="+tempString+"&travelMode=driving&startTime=2022-09-01T13:00:00-07:00&timeUnit=minute&key=AtjaG3eKTRWPUpg3GgfwOMDvNMy6bw8wYW0UBS8m6QmspYaOC0A6gAKWlAFjsiQv";
        console.log(apiString);
        
        axios.get(apiString).then((res)=>{
            var q1 = 'INSERT INTO sys.time(idtime,source_id,destination_id,time) VALUES ';
            var results = res.data.resourceSets[0].resources[0].results;
            for(var i=0;i<results.length;i++){

                // console.log(latArray[results[i].originIndex],lonArray[results[i].originIndex]);
                // console.log(latArray[results[i].destinationIndex],lonArray[results[i].destinationIndex]);
                // console.log(results[i].travelDuration);
                // console.log(" ");
                var str = "("+k+","+ ids[results[i].originIndex] +","+ ids[results[i].destinationIndex] + "," + results[i].travelDuration + "),";
                k=k+1;
                q1=q1+str;
            }
            q1 = q1.slice(0, -1);
            q1=q1+';';
            console.log(q1);
            db.query(q1,(err,res)=>{
                if(err){throw err;}
                console.log("Success");
            })
       });
    });

}






var files= ['amsterdam','hong-kong','Bangkok','barcelona','dubai','Istanbul','London','los-angeles','milan','Mumbai','new-york-city','Paris','riyadh',
'rome','seoul','shanghai','taipei','tokyo','vienna'];

for(var i=0;i<files.length;i++){g(files[i]);}
