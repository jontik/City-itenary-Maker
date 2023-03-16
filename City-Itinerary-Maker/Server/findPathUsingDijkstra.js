module.exports.log = async function(rating,lat,lon,timeRequired,time,db){
    
    const MINIMUM_FRACTION_OF_TIME_FOR_LAST_PLACE =0.5;
    var result = [];
    var temp = [0];
    var finalScore =0;
    var timeLeft =0;

async function FindPath(rating,lat,lon,timeRequired,time,adjacencyTimeMatrix){
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
    var timeForPriorityQueue = new Array(N).fill(100000);
    timeForPriorityQueue[0]=0;

    // Extract Element from priority_queue N times---
    for(var t=0;t<N;t++){
        var index = 0,timeChosen = 100001; 
        for(var i=0;i<N;i++){
            if(visited[i]== false && timeForPriorityQueue[i]<timeChosen){
                index=i;
                timeChosen = timeForPriorityQueue[i];
            }
        }
        // now relax from this index-----
        








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

var path = await FindPath(rating,lat,lon,timeRequired,time,adjacencyTimeMatrix);
return returnFormat(path,timeRequired,lat,lon,adjacencyTimeMatrix);

}