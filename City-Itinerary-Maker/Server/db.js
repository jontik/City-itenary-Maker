// Create connection

class Database {
    constructor() {
        const mysql = require('mysql-await');
        this.db = mysql.createConnection({
            host     : 'localhost',
            user     : 'root',
        });

        this.db.connect((err) => {
            if(err){throw err;}
                console.log('MySql Connected...');
        });
    }

    async getIDFromLatLong(lat,lon){
        
        var q1= `SELECT id FROM sys.Places WHERE Latitude = ${lat} AND Longitude = ${lon};`;
        try{
            return (await this.db.awaitQuery(q1))[0]['id'];
        }
        catch(e){
            console.log(e);
        }
        
    }

    async getTimeFromId(id1,id2){
        var q1 = `SELECT time FROM sys.time WHERE source_id = ${id1} AND destination_id = ${id2};`;
        try{
            return (await this.db.awaitQuery(q1))[0]['time'];
        }
        catch(e){
            console.log(e);
        }
    }
    
    async getTimeFromLatLong(lat1,lon1,lat2,lon2){
        const id1 = await this.getIDFromLatLong(lat1,lon1);
        const id2 = await this.getIDFromLatLong(lat2,lon2);
        return await this.getTimeFromId(id1,id2);
    }   

    async getAllLocationOfCity(city){
        var q1 = `SELECT * FROM sys.Places WHERE city ="${city}" ORDER BY Rating DESC LIMIT 50;`
        try{
            return (await this.db.awaitQuery(q1));
        }
        catch(e){
            console.log(e);
        }
    }
}
module.exports = Database;