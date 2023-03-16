

module.exports.log = async function(rating,lat,lon,timeRequired,time,db){
    
    const MINIMUM_FRACTION_OF_TIME_FOR_LAST_PLACE =0.5;
    var result = [];
    var temp = [0];
    var finalScore =0;
    var timeLeft =0;

function getAerialTime(lat1,lon1,lat2,lon2) {
    const SPEED_OF_VEHICLE = 10; // in km/h
    var R = 6371; // Radius of the earth in km
    var dLat = (Math.PI/180)*(lat2-lat1);  // (Math.PI/180)* below
    var dLon = (Math.PI/180)*(lon2-lon1); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos((Math.PI/180)*(lat1)) * Math.cos((Math.PI/180)*(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    return d/SPEED_OF_VEHICLE;
}

function Backtrack(start , time , visited , adjacencyTimeMatrix,score,rating){
    temp.push(start);
    visited[start]=1;
    score = score+rating[start];

    if(score>finalScore || (score==finalScore && time>timeLeft)){
        finalScore = score;
        result = temp.slice();
        timeLeft = time;
    }

    for(var i=1;i<visited.length;i++){
        if(visited[i] || time < adjacencyTimeMatrix[i][start]+MINIMUM_FRACTION_OF_TIME_FOR_LAST_PLACE*timeRequired[i]){continue;}
        Backtrack(i,time-adjacencyTimeMatrix[i][start]-timeRequired[i],visited,adjacencyTimeMatrix,score,rating);
    }
    temp.pop();
    visited[start]=0;
}

async function CalculatePath(rating,lat,lon,timeRequired,time,adjacencyTimeMatrix){
    // Create a fully connected graph----
    result=[];
    temp=[0];
    finalScore=0;
    timeLeft=0;
    var N = rating.length;

    // fill adjacency matrix---
    for(var i=0;i<N;i++){
        for(var j=0;j<N;j++){
            var t = await db.getTimeFromLatLong(lat[i],lon[i],lat[j],lon[j]);
            if(t==-1.0){t=100000;}
            adjacencyTimeMatrix[i][j] = t;
        }
    }

    // Make visited Matrix----
    var visited = new Array(N).fill(0);
    visited[0]=1;


    var start=0; 
    var score = 0; 
    for(var i=1;i<N;i++){
        if(visited[i] || time < adjacencyTimeMatrix[i][0]+MINIMUM_FRACTION_OF_TIME_FOR_LAST_PLACE*timeRequired[i]){continue;}
        Backtrack(i,time-adjacencyTimeMatrix[i][0]-timeRequired[i],visited,adjacencyTimeMatrix,score,rating);
    }

    return result;
}

function returnFormat(path,timeRequired,lat,lon,adjacencyTimeMatrix){
    time_actual = [];
    time_intermediate = [];
    for(var i=0;i<path.length-1;i++){
        time_actual.push(timeRequired[path[i]]);
        time_intermediate.push(adjacencyTimeMatrix[path[i]][path[i+1]]);
    }

    time_actual.push(timeRequired[path[path.length-1]]);

    for(var i=0;i<time_actual.length;i++){
        time_actual[i]=Math.round(time_actual[i]);
    }
    for(var i=0;i<time_intermediate.length;i++){
        time_intermediate[i] = Math.round(time_intermediate[i]);
    }

    return {path,time_actual,time_intermediate};
}

var N = rating.length;


// make Adjacency Matrix----
var adjacencyTimeMatrix = new Array(N);
for (var i = 0; i < N; i++) { adjacencyTimeMatrix[i] = new Array(N).fill(0);}

var path = await CalculatePath(rating,lat,lon,timeRequired,time,adjacencyTimeMatrix);
return returnFormat(path,timeRequired,lat,lon,adjacencyTimeMatrix);

}