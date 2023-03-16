// added time AND DESCRIPTION IN DATABASE USING THIS ---
const mysql = require('mysql');
const db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
});

// Connect
db.connect((err) => {
    if(err){throw err;}
        console.log('MySql Connected...');
});

function fun(filePath){
    const reader = require('xlsx');
    const file = reader.readFile(filePath);

    var data = [];
    const sheets = file.SheetNames

    for(var i = 0; i < sheets.length; i++)
    {
    const temp = reader.utils.sheet_to_json(file.Sheets[file.SheetNames[i]]);


    temp.forEach((res) => {
        var t= res['description'];
        for(var i=0;i<t.length;i++){
            if(t[i]=='"' || t[i]=="'"){t[i]=',';}
        }
        console.log(t);

        var q1= `UPDATE sys.Places
        SET 
            Description = "${t}"
        WHERE
            Title = "${res['title']}";`;

        db.query(q1,(err,res1)=>{});

})

}}
var files= ['./amsterdam.xlsx','./hong-kong.xlsx','./Bangkok.xlsx','./barcelona.xlsx','./dubai.xlsx','./Istanbul.xlsx','./London.xlsx','./los-angeles.xlsx','./milan.xlsx','./Mumbai.xlsx','./new-york-city.xlsx','./Paris.xlsx','./riyadh.xlsx',
'./rome.xlsx','./seoul.xlsx','./shanghai.xlsx','./taipei.xlsx','./tokyo.xlsx','./vienna.xlsx'];



for(var i=0;i<files.length;i++){
    fun(files[i]);
}

