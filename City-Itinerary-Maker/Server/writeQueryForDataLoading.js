module.exports.log =  function(filePath,k){
    const reader = require('xlsx');
    const file = reader.readFile(filePath);

     var data = [];
    
    const sheets = file.SheetNames

    var q1 = 'INSERT INTO sys.Places(id,City,Latitude,Longitude,Rating,ImageURL,Address,Category,Title,Time) VALUES ';

    //var parameters = ['city','location/lat','location/lng','rating','imageUrls/0','address','categoryName'];
    for(var i = 0; i < sheets.length; i++)
    {
    const temp = reader.utils.sheet_to_json(file.Sheets[file.SheetNames[i]]);
    

    temp.forEach((res) => {
        if(res['totalScore']==undefined){res['totalScore']=2.5;}
        
        q1+='('+k+',"'+res['city']+'",'+res['location/lat']+','+res['location/lng']+','+res['totalScore']+',"'
        +res['imageUrls/0']+'","'+res['address']+'","'+res['categoryName']+'","'+res['title']+'"';

        k=k+1;
        var t;
        if(res['rating']>4.0){t=1.0;}
        else if(res['rating']>3.5){t=0.75;}
        else{t=0.5;}

        q1+=','+t+'),';

         data.push(res)
    })

    }

    q1 = q1.slice(0, -1);
    q1=q1+';';
    console.log(k);
    return q1;
    // Printing data
    // console.log(data)
}


///    FOR PUSHING INTO DB CODE--
// let q1 = 'INSERT INTO sys.Places(id,Place,Latitude,Longitude,Gratification,time,imageURL) VALUES (2,"Mumbai",1.1,8.3,10,11,"www.facebook.com")';
// db.query(q1,(err,res)=>{
//     if(err){throw err;}
//     console.log('Row Added !! ');
// });

// var files= ['./data2.xlsx','./data3.xlsx','./data4.xlsx'];
// for(var i=2;i<3;i++){
//     db.query(writeQueryForDataLoading.log(files[i],200),(err,res)=>{  // change this 300 according to iteration
//         if(err){throw err;}
//     })
    
// }