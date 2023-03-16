var k=0;
const mysql = require('mysql');
function f(filePath){
    // module.exports.log =  function(filePath,k){    
    const reader = require('xlsx');
    const file = reader.readFile(filePath);

     var data = [];
    
    const sheets = file.SheetNames

    var q1 = 'INSERT INTO sys.Places(id,City,Latitude,Longitude,Rating,ImageURL,Address,Category,Title,Time,Website,RankInCategory,PhoneNumber) VALUES ';

    //var parameters = ['city','lat','long','rating','image','address','categoryName'];
    for(var i = 0; i < sheets.length; i++)
    {
    const temp = reader.utils.sheet_to_json(file.Sheets[file.SheetNames[i]]);
    

    temp.forEach((res) => {
        if(res['review-score']== "NULL"){res['review-score']=2.5;}
        
        q1+='('+k+',"'+res['city']+'",'+res['lat']+','+res['long']+','+res['review-score']+',"'
        +res['image']+'","'+res['address']+'","'+res['category']+'","'+res['title']+'"';

        var t=res['duration'];
        var time=0;

        if(Object.prototype.toString.call(t) != "[object String]"){time=30;}
        else{
            var index = t.indexOf('m',0);
            if(index!=-1){time=30;}
            index = t.indexOf('h',0);
            if(index > 0){
                index=index-1;
                while(t[index]==' '){index=index-1;}
                if(index<0){;}
                else{time+=60*parseInt(t[index]);}
            }
        }

        q1+=','+time+',"'+res["website"]+'",'+ res["rank_in_category"]+',"'+res["phone_number"]+'"),';
        k=k+1;
         data.push(res)
    })

    }

    q1 = q1.slice(0, -1);
    q1=q1+';';
    return q1;
    // Printing data
    // console.log(data)
}

const db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
});

// Connect
db.connect((err) => {
    if(err){throw err;}
        console.log('MySql Connected...');
});
var files= ['./amsterdam.xlsx','./hong-kong.xlsx','./Bangkok.xlsx','./barcelona.xlsx','./dubai.xlsx','./Istanbul.xlsx','./London.xlsx','./los-angeles.xlsx','./milan.xlsx','./Mumbai.xlsx','./new-york-city.xlsx','./Paris.xlsx','./riyadh.xlsx',
'./rome.xlsx','./seoul.xlsx','./shanghai.xlsx','./taipei.xlsx','./tokyo.xlsx','./vienna.xlsx'];

for(var i=0;i<files.length;i++){
    db.query(f(files[i]),(err,res)=>{
        if(err) console.log(err);
        else console.log("success");
});
}
